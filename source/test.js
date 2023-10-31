'use strict'

// Import
const { join, sep } = require('path')
const { deepEqual } = require('assert-helpers')
const kava = require('kava')
const scandirectory = require('./index.js')

// Prepare
const path = join(__dirname, '..', 'test-fixtures')

// Test
kava.suite('scandirectory', function (suite, test) {
	test('default', function (done) {
		const expected = {
			list: {
				'a file.txt': 'file',
				'a directory': 'dir',
				[`a directory${sep}a sub file.txt`]: 'file',
			},
			tree: {
				'a file.txt': true,
				'a directory': {
					'a sub file.txt': true,
				},
			},
		}
		scandirectory(path, function (err, list, tree) {
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
		scandirectory(path, { dirAction: false }, function (err, list, tree) {
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
		scandirectory(path, { fileAction: false }, function (err, list, tree) {
			if (err) return done(err)
			deepEqual(list, expected.list, 'compare list')
			deepEqual(tree, expected.tree, 'compare tree')
			done()
		})
	})

	test('no recurse', function (done) {
		const expected = {
			list: {
				'a file.txt': 'file',
				'a directory': 'dir',
			},
			tree: {
				'a file.txt': true,
				'a directory': {},
			},
		}
		scandirectory(path, { recurse: false }, function (err, list, tree) {
			if (err) return done(err)
			deepEqual(list, expected.list, 'compare list')
			deepEqual(tree, expected.tree, 'compare tree')
			done()
		})
	})

	test('readfiles', function (done) {
		const expected = {
			list: {
				'a file.txt': 'contents of a file\n',
				'a directory': 'dir',
				[`a directory${sep}a sub file.txt`]: 'contents of a sub file\n',
			},
			tree: {
				'a file.txt': 'contents of a file\n',
				'a directory': {
					'a sub file.txt': 'contents of a sub file\n',
				},
			},
		}
		scandirectory(path, { readFiles: true }, function (err, list, tree) {
			if (err) return done(err)
			deepEqual(list, expected.list, 'compare list')
			deepEqual(tree, expected.tree, 'compare tree')
			done()
		})
	})
})
