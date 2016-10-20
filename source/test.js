# Import
{expect,assert} = require('chai')
joe = require('joe')
{scandir} = require('../../')


# =====================================
# Configuration

# Test Data
path = __dirname+'/..'
scanlistExpected = {
	'lib': 'dir'
	'test': 'dir'
	'lib/scandirectory.js': 'file'
	'test/scandirectory-test.js': 'file'
}
scantreeExpected = {
	'lib':
		'scandirectory.js': true
	'test':
		'scandirectory-test.js': true
}


# =====================================
# Tests

joe.describe 'scandirectory', (describe,it) ->

	it 'scandir should work', (done) ->
		scandir path, (err, list, tree) ->
			expect(list).to.deep.equal(scanlistExpected)
			expect(tree).to.deep.equal(scantreeExpected)
			done()
