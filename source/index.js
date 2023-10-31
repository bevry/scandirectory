/* eslint no-inner-declarations:0 */
'use strict'

// Import
const { relative, join } = require('path')
const { readFileSync } = require('fs')
const readdir = require('readdir-cluster')
const ignorefs = require('ignorefs')

// Scan a directory recursively
function scandirectory(...args) {
	// Prepare
	const list = {}
	const trees = {}
	const files = {}

	// Support the different argument formats
	const opts = {}
	args.forEach(function (arg) {
		switch (typeof arg) {
			case 'string':
				opts.path = arg
				break
			case 'function':
				opts.next = arg
				break
			case 'object':
				Object.keys(arg).forEach(function (key) {
					opts[key] = arg[key]
				})
				break
			default:
				throw new Error('scandirectory: unknown argument')
		}
	})

	// Prepare defaults
	if (opts.recurse == null) opts.recurse = true
	if (opts.readFiles == null) opts.readFiles = false
	if (opts.next == null)
		opts.next = function (err) {
			if (err) throw err
		}
	const next = opts.next

	// Action
	if (opts.action != null) {
		if (opts.fileAction == null) opts.fileAction = opts.action
		if (opts.dirAction == null) opts.dirAction = opts.action
	}

	// Check needed
	if (!opts.path) {
		if (opts.parentPath) {
			opts.path = opts.parentPath
		} else {
			const err = new Error('scandirectory: path is needed')
			return next(err)
		}
	}

	// Check
	if (opts.readFiles && next.length < 2) {
		const err = new Error(
			'scandirectory: readFiles is set but not enough completion callback arguments to receive the data',
		)
		return next(err)
	}

	// Iterator
	function iterator(fullPath, filename, stat) {
		// Prepare
		const relativePath = relative(opts.path, fullPath)
		if (next.length >= 2) {
			files[relativePath] = filename
		}

		// Check
		if (ignorefs.isIgnoredPath(fullPath, opts)) {
			return false
		}

		// Directory
		if (stat.directory) {
			// Skip?
			const skip =
				opts.dirAction === false ||
				(opts.dirAction &&
					opts.dirAction(fullPath, relativePath, filename, stat) === false)
			if (skip) return false

			// Append
			if (next.length >= 2) {
				list[relativePath] = 'dir'
				if (next.length === 3) {
					trees[relativePath] = {}
				}
			}

			// No Recurse
			if (!opts.recurse) return false
		}

		// File
		else {
			// Skip?
			const skip =
				opts.fileAction === false ||
				(opts.fileAction &&
					opts.fileAction(fullPath, relativePath, filename, stat) === false)
			if (skip) return false

			// Append
			if (opts.readFiles) {
				// Read file
				let data = readFileSync(fullPath)
				if (opts.readFiles !== 'binary') {
					data = data.toString()
				}
				list[relativePath] = data
				if (next.length === 3) {
					trees[relativePath] = data
				}
			} else if (next.length >= 2) {
				list[relativePath] = 'file'
				if (next.length === 3) {
					trees[relativePath] = true
				}
			}
		}
	}

	// Read
	readdir(opts.path, iterator, function (err) {
		if (err) {
			next(err)
		} else if (next.length <= 1) {
			next(null)
		} else if (next.length === 2) {
			next(null, list)
		} else {
			const tree = {}
			Object.keys(list)
				.sort()
				.forEach(function (relativePath) {
					const filename = files[relativePath]
					// root?
					if (relativePath === filename) {
						tree[relativePath] = trees[relativePath]
					} else {
						const parent = join(relativePath, '..')
						trees[parent][filename] = trees[relativePath]
					}
				})
			next(null, list, tree)
		}
	})
}

// Export
module.exports = scandirectory
