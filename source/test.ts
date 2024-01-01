// builtin
import { join, sep } from 'path'
import { statSync } from 'fs'

// external
import { deepEqual, equal } from 'assert-helpers'
import kava from 'kava'

// local
import scan, { Result, Results, stringify } from './index.js'
// paths
import filedirname from 'filedirname'
const [file, dir] = filedirname()
const path = join(dir, '..', 'test-fixtures')

// fixtures
function compare(actual: any, expected: any, name?: string) {
	equal(stringify(actual), stringify(expected), name)
}
const root: Result<'dir'> = {
	absolutePath: path,
	relativePath: '.',
	basename: 'test-fixtures',
	directory: true,
	stats: statSync(path),
	parent: null,
	children: {},
	data: null,
}
const aDirectory: Result<'dir'> = {
	absolutePath: join(path, 'a directory'),
	relativePath: 'a directory',
	basename: 'a directory',
	directory: true,
	stats: statSync(join(path, 'a directory')),
	parent: root,
	children: {},
	data: null,
}
const aSubFile: Result<'file'> = {
	absolutePath: join(path, 'a directory', 'a sub file.txt'),
	relativePath: join('a directory', 'a sub file.txt'),
	basename: 'a sub file.txt',
	directory: false,
	stats: statSync(join(path, 'a directory', 'a sub file.txt')),
	parent: aDirectory,
	children: null,
	data: null,
}
const aFile: Result<'file'> = {
	absolutePath: join(path, 'a file.txt'),
	relativePath: 'a file.txt',
	basename: 'a file.txt',
	directory: false,
	stats: statSync(join(path, 'a file.txt')),
	parent: root,
	children: null,
	data: null,
}
aDirectory.children[aSubFile.basename] = aSubFile
root.children[aDirectory.basename] = aDirectory
root.children[aFile.basename] = aFile
const expected: Results = {
	'a directory': aDirectory,
	[`a directory${sep}a sub file.txt`]: aSubFile,
	'a file.txt': aFile,
}
const expectedDirActionFalse: Results = {
	'a file.txt': aFile,
}
const expectedFileActionFalse: Results = {
	'a directory': Object.assign({}, aDirectory, { children: {} }),
}
const expectedNoRecurse: Results = {
	'a directory': Object.assign({}, aDirectory, { children: null }),
	'a file.txt': aFile,
}
const expectedReadFiles = {
	'a directory': Object.assign({}, aDirectory, {
		children: {
			'a sub file.txt': Object.assign({}, aSubFile, {
				data: 'contents of a sub file\n',
			}),
		},
	}),
	[`a directory${sep}a sub file.txt`]: Object.assign({}, aSubFile, {
		data: 'contents of a sub file\n',
	}),
	'a file.txt': Object.assign({}, aFile, { data: 'contents of a file\n' }),
}

// test
kava.suite('scan', function (suite, test) {
	suite('new-api', function (suite, test) {
		test('defaults', function (done) {
			scan(path)
				.then(function (results) {
					compare(results, expected, 'compare results')
					done()
				})
				.catch((err) => {
					done(err)
				})
		})
		test('recurse=false', function (done) {
			scan({ directory: path, recurse: false })
				.then(function (results) {
					compare(results, expectedNoRecurse, 'compare results')
					done()
				})
				.catch((err) => {
					done(err)
				})
		})
		test('dirAction=false', function (done) {
			scan({ directory: path, dirAction: false })
				.then(function (results) {
					compare(results, expectedDirActionFalse, 'compare results')
					done()
				})
				.catch((err) => {
					done(err)
				})
		})
		test('fileAction=false', function (done) {
			scan({ directory: path, fileAction: false })
				.then(function (results) {
					compare(results, expectedFileActionFalse, 'compare results')
					done()
				})
				.catch((err) => {
					done(err)
				})
		})
		test('encoding=utf8', function (done) {
			scan({ directory: path, encoding: 'utf8' })
				.then(function (results) {
					compare(results, expectedReadFiles, 'compare results')
					done()
				})
				.catch((err) => {
					done(err)
				})
		})
	})
	suite('old-api', function (suite, test) {
		test('default', function (done) {
			const expected = {
				list: {
					'a directory': 'dir',
					[`a directory${sep}a sub file.txt`]: 'file',
					'a file.txt': 'file',
				},
				tree: {
					'a directory': {
						'a sub file.txt': true,
					},
					'a file.txt': true,
				},
			}
			scan(path, function (err, list, tree) {
				if (err) return done(err)
				deepEqual(list, expected.list, 'compare list')
				deepEqual(tree, expected.tree, 'compare tree')
				done()
			})
		})

		test('false dirAction', function (done) {
			const expected = {
				list: {
					'a file.txt': 'file',
				},
				tree: {
					'a file.txt': true,
				},
			}
			scan(path, { dirAction: false }, function (err, list, tree) {
				if (err) return done(err)
				deepEqual(list, expected.list, 'compare list')
				deepEqual(tree, expected.tree, 'compare tree')
				done()
			})
		})

		test('false fileAction', function (done) {
			const expected = {
				list: {
					'a directory': 'dir',
				},
				tree: {
					'a directory': {},
				},
			}
			scan(path, { fileAction: false }, function (err, list, tree) {
				if (err) return done(err)
				deepEqual(list, expected.list, 'compare list')
				deepEqual(tree, expected.tree, 'compare tree')
				done()
			})
		})

		test('no recurse', function (done) {
			const expected = {
				list: {
					'a directory': 'dir',
					'a file.txt': 'file',
				},
				tree: {
					'a directory': {},
					'a file.txt': true,
				},
			}
			scan(path, { recurse: false }, function (err, list, tree) {
				if (err) return done(err)
				deepEqual(list, expected.list, 'compare list')
				deepEqual(tree, expected.tree, 'compare tree')
				done()
			})
		})

		test('readfiles', function (done) {
			const expected = {
				list: {
					'a directory': 'dir',
					[`a directory${sep}a sub file.txt`]: 'contents of a sub file\n',
					'a file.txt': 'contents of a file\n',
				},
				tree: {
					'a directory': {
						'a sub file.txt': 'contents of a sub file\n',
					},
					'a file.txt': 'contents of a file\n',
				},
			}
			scan(path, { encoding: 'utf8' }, function (err, list, tree) {
				if (err) return done(err)
				deepEqual(list, expected.list, 'compare list')
				deepEqual(tree, expected.tree, 'compare tree')
				done()
			})
		})
	})
})
