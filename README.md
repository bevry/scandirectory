<!-- TITLE/ -->

<h1>scandirectory</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry/scandirectory" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry/scandirectory/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/scandirectory" title="View this project on NPM"><img src="https://img.shields.io/npm/v/scandirectory.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/scandirectory" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/scandirectory.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/scandirectory" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/scandirectory.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/scandirectory#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/scandirectory.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-slackin"><a href="https://slack.bevry.me" title="Join this project's slack community"><img src="https://slack.bevry.me/badge.svg" alt="Slack community badge" /></a></span>
<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Scan a directory recursively with a lot of control and power

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --save scandirectory</code></li>
<li>Module: <code>require('scandirectory')</code></li></ul>

<h3><a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>scandirectory</code> aliases <code>scandirectory/index.js</code> which uses <a href="https://github.com/bevry/editions" title="Editions are the best way to produce and consume packages you care about.">Editions</a> to automatically select the correct edition for the consumers environment</li>
<li><code>scandirectory/source/index.js</code> is Source + <a href="https://babeljs.io/docs/learn-es2015/" title="ECMAScript Next">ESNext</a> + <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a></li>
<li><code>scandirectory/es2015/index.js</code> is <a href="https://babeljs.io" title="The compiler for writing next generation JavaScript">Babel</a> Compiled + <a href="http://babeljs.io/docs/plugins/preset-es2015/" title="ECMAScript 2015">ES2015</a> + <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a></li></ul>

<p>Older environments may need <a href="https://babeljs.io/docs/usage/polyfill/" title="A polyfill that emulates missing ECMAScript environment features">Babel's Polyfill</a> or something similar.</p>

<!-- /INSTALL -->


## Usage

``` javascript
var scandir = require('scandirectory')
var path = process.cwd()
var options = {}
function completionCallback (err, list, tree) {
	console.log({
		error: err,
		list: list,
		tree: tree
	})
	/*
	{
		error: null,
		list: {
			'a file.txt': 'file',
			'a directory': 'dir',
			'a directory/a sub file.txt': 'file'
		},
		tree: {
			'a file.txt': true,
			'a directory': {
				'a sub file.txt': 'true
			}
		}
	}
	*/
}
scandir(path, options, completionCallback)
```

Scan directory options:

- `action` - (default null) can be `null` or a function to use for both the fileAction and dirAction
- `fileAction` - (default null) can be `null`, `false`, or a function to be the action callback
- `dirAction` - (default null) can be `null`, `false`, or a function to the action callback
- `recurse` - (default true) can be `null` or a boolean for whether or not to scan subdirectories too
- `readFiles` - (default false) can be `null` or a boolean for whether or not we should read the file contents

The options object is also sent to [ignorepatterns](https://github.com/bevry/ignorepatterns) so you can use its options too

The completion callback accepts the following arguments:

- `err` - `null` or an error that has occured
- `list` - a collection of all the child nodes in a list/object format:
	- `{fileRelativePath: 'dir|file'}`
- `tree` - a collection of all the child nodes in a tree format:
	- `{dir: {dir:{}, file1:true} }`
	- if the readFiles option is true, then files will be returned with their contents instead

The results for a specific argument is only generated if the argument is requested.

The action callbacks accept the following arguments:

- `fullPath` - the full/absolute path of the current file/directory
- `relativePath` - the relative path of the current file/directory with respect to the original scanning path
- `filename` - the basename of the current file/directory
- `stat` - a simple stat object provided by [readdir-cluster](https://github.com/bevry/readdir-cluster)

The action callbacks can return `false` to skip the path from being processed further.


<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/scandirectory/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/scandirectory/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/scandirectory/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/scandirectory">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="http://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/scandirectory/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/scandirectory">view contributions</a></li>
<li><a href="http://seanfridman.com">Sean Fridman</a> — <a href="https://github.com/bevry/scandirectory/commits?author=sfrdmn" title="View the GitHub contributions of Sean Fridman on repository bevry/scandirectory">view contributions</a></li></ul>

<a href="https://github.com/bevry/scandirectory/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2011+ <a href="http://balupton.com">Benjamin Lupton</a></li>
<li>Copyright &copy; 2014+ <a href="http://bevry.me">Bevry Pty Ltd</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
