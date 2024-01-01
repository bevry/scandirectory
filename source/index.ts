// builtin
import { join, resolve, basename as getBasename } from 'path'
import {
	Stats,
	readdir as readdirBuiltin,
	stat as statBuiltin,
	readFile as readFileBuiltin,
} from 'fs'

// external
import {
	isIgnoredPath,
	upgradeOptions,
	Options as IgnoreOptions,
} from 'ignorefs'

/** Encoding types that will return a string */
export type StringEncoding = Exclude<BufferEncoding, 'binary'>

/** Encoding that will return a string, a buffer, or not be used at all. */
export type ResultEncoding = BufferEncoding | undefined

/** A type of result, unknown is a WIP. */
export type ResultType = 'unknown' | 'file' | 'dir'

/** The result object */
export interface Result<
	Type extends ResultType,
	Encoding extends ResultEncoding = undefined,
> {
	absolutePath: string
	relativePath: string
	basename: string
	directory: Type extends 'unknown'
		? null
		: Type extends 'dir'
			? true
			: Type extends 'file'
				? false
				: never
	stats: Type extends 'unknown'
		? null
		: Type extends 'dir' | 'file'
			? Stats
			: never
	parent: null | Result<'dir', Encoding>
	children: Type extends 'unknown' | 'file'
		? null
		: Record<string, Result<ResultType, Encoding>>
	data: Type extends 'unknown' | 'dir'
		? null
		: Type extends 'file'
			? Encoding extends undefined
				? null
				: Encoding extends StringEncoding
					? string
					: Buffer
			: never
}

/**
 * A mapping of all relative paths to {@link Result}
 * If you want a tree, specify {@link Options.includeRoot} as true and use `results['.'].children`
 */
export interface Results<Encoding extends ResultEncoding = undefined> {
	[relativePath: string]: Result<'file' | 'dir', Encoding>
}

/**
 * Support old action callback format for {@link scanDirectoryCompatibility}
 * @deprecated use {@link ActionCallback} instead
 * @returns `false` if you wish to discard this result and not recurse into it
 */
export type CompatibilityActionCallback<
	Type extends 'file' | 'dir' = 'file' | 'dir',
> = (
	absolutePath: string,
	relativePath: string,
	basename?: string,
	stat?: Stats & {
		directory: Type extends 'file' ? false : Type extends 'dir' ? true : boolean
	}
) => boolean | void

/**
 * Action callback for {@link scanDirectory}
 * @returns `false` if you wish to discard this result and not recurse into it
 */
export type ActionCallback<
	Type extends 'file' | 'dir' = 'file' | 'dir',
	Encoding extends ResultEncoding = undefined,
> = (result: Result<Type, Encoding>) => boolean | void

/** Options to configure {@link scanDirectory} and its ignore handling. */
export interface BaseOptions<Encoding extends ResultEncoding = undefined>
	extends IgnoreOptions {
	/** Directory path to scan */
	directory: string

	/** Whether to traverse directories */
	recurse?: boolean

	/** The encoding to read files as */
	encoding?: Encoding

	/**
	 * Include the root {@link Options.directory} in the result listing?
	 * If you want pure tree results, set this to true, then use `results['.'].children` as your listing.
	 */
	includeRoot?: boolean
}

/** Options to configure {@link scanDirectory} and its ignore handling. */
export interface Options<Encoding extends ResultEncoding = undefined>
	extends BaseOptions<Encoding> {
	/** Callback invoked on files and directories */
	action?: ActionCallback<'file' | 'dir', Encoding>
	/** Callback invoked on files, set to false to ignore files */
	fileAction?: ActionCallback<'file', Encoding> | false
	/** Callback invoked on directories, set to false to ignore directories */
	dirAction?: ActionCallback<'dir', Encoding> | false
}

/** List-style result for  {@link scanDirectoryCompatibility} */
export type List<Encoding extends ResultEncoding = undefined> = {
	[relativePath: string]:
		| (Encoding extends undefined
				? 'file'
				: Encoding extends StringEncoding
					? string
					: Buffer)
		| 'dir'
}

/** Tree-style result for  {@link scanDirectoryCompatibility} */
export type Tree<Encoding extends ResultEncoding = undefined> = {
	[relativePath: string]:
		| (Encoding extends undefined
				? true
				: Encoding extends StringEncoding
					? string
					: Buffer)
		| Tree<Encoding>
}

/** Generate results for  {@link scanDirectoryCompatibility} */
export type CompatibilityNextCallback<
	Encoding extends ResultEncoding = undefined,
> = (error?: Error | null, list?: List<Encoding>, tree?: Tree<Encoding>) => void

/** Options to configure {@link scanDirectoryCompatibility} and its ignore handling. */
export interface CompatibilityOptions<
	Encoding extends ResultEncoding = undefined,
> extends Partial<BaseOptions<Encoding>> {
	/** @deprecated alias for {@link Options.directory} */
	path?: string

	/** @deprecated use {@link options.encoding} */
	readFiles?: never

	/** @deprecated use {@link scanDirectory} */
	next?: CompatibilityNextCallback<Encoding>

	/** Callback invoked on files and directories */
	action?:
		| ActionCallback<'file' | 'dir', Encoding>
		| CompatibilityActionCallback
	/** Callback invoked on files, set to false to ignore files */
	fileAction?:
		| ActionCallback<'file', Encoding>
		| CompatibilityActionCallback<'file'>
		| false
	/** Callback invoked on directories, set to false to ignore directories */
	dirAction?:
		| ActionCallback<'dir', Encoding>
		| CompatibilityActionCallback<'file'>
		| false
}

/** Get the string of a file */
async function readHelper(
	path: string,
	opts: { encoding: StringEncoding; signal?: AbortSignal }
): Promise<string>
/** Get the buffer of a file */
async function readHelper(
	path: string,
	opts: { encoding: 'binary'; signal?: AbortSignal }
): Promise<Buffer>
/** Get the string or buffer of a file */
async function readHelper(
	path: string,
	opts: { encoding: ResultEncoding; signal?: AbortSignal }
): Promise<string | Buffer> {
	return new Promise(function (resolve, reject) {
		readFileBuiltin(path, opts, function (err, data) {
			if (err) reject(err)
			else resolve(data)
		})
	})
}

/** Get the stat */
async function statsHelper(path: string): Promise<Stats> {
	return new Promise(function (resolve, reject) {
		statBuiltin(path, function (err, stats) {
			if (err) reject(err)
			else resolve(stats)
		})
	})
}

/** Get a list of files */
async function listHelper(directory: string): Promise<Array<string>> {
	return new Promise(function (resolve, reject) {
		readdirBuiltin(directory, function (err, files) {
			if (err) reject(err)
			else resolve(files)
		})
	})
}

/** Scan the contents of a directory */
export async function scanDirectory<Encoding extends ResultEncoding>(
	opts: Options<Encoding>
): Promise<Results<Encoding>> {
	// options
	opts = Object.assign({}, opts)
	if (opts.includeRoot == null) opts.includeRoot = false
	if (opts.recurse == null) opts.recurse = true
	if (opts.fileAction == null) opts.fileAction = opts.action
	if (opts.dirAction == null) opts.dirAction = opts.action

	// prepare
	const pendingLists: Array<Result<'file' | 'dir', Encoding>> = [
		{
			absolutePath: resolve(opts.directory),
			relativePath: '.',
			basename: getBasename(opts.directory),
			directory: true,
			stats: await statsHelper(opts.directory),
			parent: null,
			children: null,
			data: null,
		},
	]
	const pendingStats: Array<Result<'unknown', Encoding>> = []
	const pendingReads: Array<Result<'file', Encoding>> = []
	const results: Results<Encoding> = {}
	if (opts.includeRoot) results['.'] = pendingLists[0]

	// add subsequent
	const abort =
		typeof AbortController !== 'undefined' ? new AbortController() : null // v14.7+
	const signal = abort?.signal
	try {
		while (pendingLists.length || pendingStats.length || pendingReads.length) {
			await Promise.all([
				...pendingLists
					.splice(0, pendingLists.length)
					.map(async function (result) {
						const files = (await listHelper(result.absolutePath)).sort()
						result.children = {}
						for (const basename of files) {
							const child: Result<'unknown', Encoding> = {
								absolutePath: join(result.absolutePath, basename),
								relativePath: join(result.relativePath, basename),
								basename,
								directory: null,
								stats: null,
								parent: result,
								children: null,
								data: null,
							}
							result.children[child.basename] = child
							pendingStats.push(child)
						}
					}),
				...pendingStats
					.splice(0, pendingStats.length)
					.map(async function (wipResult) {
						const stats = await statsHelper(wipResult.absolutePath)
						const directory = stats.isDirectory()
						const result: Result<'file' | 'dir', Encoding> = Object.assign(
							wipResult,
							{
								directory,
								stats,
								parent: wipResult.parent,
								children: null,
								data: null,
							}
						)
						// skip by ignore options?
						if (isIgnoredPath(result, opts)) {
							if (result.parent) delete result.parent.children[result.basename]
							return
						}
						// dir or file
						if (result.directory) {
							// skip by dir action?
							const skip =
								opts.dirAction === false ||
								(opts.dirAction && opts.dirAction(result) === false)
							if (skip) {
								if (result.parent)
									delete result.parent.children[result.basename]
								return
							}
							// save
							results[result.relativePath] = result
							if (opts.recurse) pendingLists.push(result)
						} else {
							// skip by file action?
							const skip =
								opts.fileAction === false ||
								(opts.fileAction && opts.fileAction(result) === false)
							if (skip) {
								if (result.parent)
									delete result.parent.children[result.basename]
								return
							}
							// save
							results[result.relativePath] = result
							if (opts.encoding != null) pendingReads.push(result)
						}
					}),
				...pendingReads
					.splice(0, pendingReads.length)
					.map(async function (result) {
						if (opts.encoding === 'binary') {
							;(result as Result<'file', 'binary'>).data = await readHelper(
								result.absolutePath,
								{
									encoding: 'binary',
									signal,
								}
							)
						} else if (opts.encoding != null) {
							;(result as Result<'file', StringEncoding>).data =
								(await readHelper(result.absolutePath, {
									encoding: opts.encoding,
									signal,
								})) as string
						}
					}),
			])
		}
		// sort
		const sortedResults: Results<Encoding> = {}
		Object.keys(results)
			.sort()
			.forEach(function (key) {
				sortedResults[key] = results[key]
			})
		return sortedResults
	} catch (err) {
		abort?.abort()
		throw err
	}
}

/** Scan the contents of a directory, with compatibility for scandirectory < v8 */
export default async function scanDirectoryCompatibility<
	Encoding extends ResultEncoding = undefined,
>(
	...args: Array<
		| string
		| CompatibilityNextCallback<Encoding>
		| CompatibilityOptions<Encoding>
	>
): Promise<Results<Encoding>> {
	const opts: CompatibilityOptions<Encoding> = {}
	try {
		// parse arguments into options
		args.forEach(function (arg) {
			switch (typeof arg) {
				case 'string':
					opts.directory = arg
					break
				case 'function':
					opts.next = arg
					break
				case 'object':
					Object.assign(opts, arg)
					break
				default:
					throw new Error(
						'scandirectory: unknown argument: ' + JSON.stringify(arg)
					)
			}
		})

		// handle deprecations and verifications
		if (opts.next) opts.includeRoot = true
		if (opts.path != null) opts.directory = opts.path
		if (opts.readFiles) {
			throw new Error(
				'scandirectory: readFiles renamed to encoding: if you used readFiles = true, use encoding = "utf8", if you used readFiles = "binary", use encoding = "binary"'
			)
		}
		if (!opts.directory) {
			throw new Error('scandirectory: path is needed')
		}

		// action callback compatibility
		if (opts.action && opts.action.length >= 1) {
			const actionCallback = opts.action
			opts.action = function (result: Result<'file' | 'dir', Encoding>) {
				return (actionCallback as CompatibilityActionCallback)(
					result.absolutePath,
					result.relativePath,
					result.basename,
					Object.assign({ directory: result.directory }, result.stats)
				)
			}
		}
		if (opts.dirAction && opts.dirAction.length >= 1) {
			const dirActionCallback = opts.dirAction
			opts.dirAction = function (result: Result<'dir', Encoding>) {
				return (dirActionCallback as CompatibilityActionCallback)(
					result.absolutePath,
					result.relativePath,
					result.basename,
					Object.assign({ directory: result.directory }, result.stats)
				)
			}
		}
		if (opts.fileAction && opts.fileAction.length >= 1) {
			const fileActionCallback = opts.fileAction
			opts.fileAction = function (result: Result<'file', Encoding>) {
				return (fileActionCallback as CompatibilityActionCallback)(
					result.absolutePath,
					result.relativePath,
					result.basename,
					Object.assign({ directory: result.directory }, result.stats)
				)
			}
		}

		// upgrade options and fetch results from modern api
		const results = await scanDirectory(
			upgradeOptions(opts) as Options<Encoding>
		)
		if (opts.next) {
			if (opts.next.length === 1) {
				opts.next(null)
			} else {
				const list: List<Encoding> = toList(results)
				if (opts.next.length === 2) {
					opts.next(null, list)
				} else if (opts.next.length === 3) {
					const tree: Tree<Encoding> = toTree(results)
					opts.next(null, list, tree)
				} else
					throw new Error(
						'scandirectory: next function must accept 1, 2, or 3 arguments'
					)
			}
		}
		return results
	} catch (err: any) {
		if (opts.next) {
			opts.next(err)
			return {}
		} else {
			throw err
		}
	}
}

/** Compatibility helper for {@link scanDirectoryCompatibility} to generate results compatible with {@link CompatibilityNextCallback} */
function toList<Encoding extends ResultEncoding = undefined>(
	results: Results<Encoding>
): List<Encoding> {
	const list: List<Encoding> = {}
	// Object.entries requires Node.js >= 8
	for (const key of Object.keys(results)) {
		const value = results[key]
		list[key] = (value.directory ? 'dir' : value.data ?? 'file') as any
	}
	delete list['.']
	return list
}

/** Compatibility helper for {@link scanDirectoryCompatibility} to generate results compatible with {@link CompatibilityNextCallback} */
function toTree<Encoding extends ResultEncoding = undefined>(
	results: Results<Encoding> | null,
	descending: boolean = false
): Tree<Encoding> {
	if (!results) return {}
	const tree: Tree<Encoding> = {}
	if (!descending) {
		return toTree(results['.'].children, true)
	}
	// Object.entries requires Node.js >= 8
	for (const key of Object.keys(results)) {
		const value = results[key]
		tree[key] = (
			value.directory ? toTree(value.children, descending) : value.data ?? true
		) as any
	}
	return tree
}

/** Convert {@link Results} into a non-recursive JSON string */
export function stringify(any: any, indentation?: string) {
	return JSON.stringify(
		any,
		(key, value) => {
			if (key === 'parent') return value.relativePath
			return value
		},
		indentation
	)
}
