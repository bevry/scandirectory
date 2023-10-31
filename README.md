<!-- TITLE/ -->

<h1>scandirectory</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/scandirectory/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/scandirectory/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/scandirectory" title="View this project on NPM"><img src="https://img.shields.io/npm/v/scandirectory.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/scandirectory" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/scandirectory.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/balupton" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Scan a directory recursively with a lot of control and power

<!-- /DESCRIPTION -->


## Usage

```javascript
var scandir = require('scandirectory')
var path = process.cwd()
var options = {}
function completionCallback(err, list, tree) {
    console.log({
        error: err,
        list: list,
        tree: tree,
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

-   `action` - (default `null`) can be `null` or a function to use for both the fileAction and dirAction
-   `fileAction` - (default `null`) can be `null`, `false`, or a function to be the action callback
-   `dirAction` - (default `null`) can be `null`, `false`, or a function to the action callback
-   `recurse` - (default `true`) can be `null` or a boolean for whether or not to scan subdirectories too
-   `readFiles` - (default `false`) can be `null` or a boolean for whether or not we should read the file contents

The options object is also sent to [ignorefs](https://github.com/bevry/ignorefs) so you can use its options too

The completion callback accepts the following arguments:

-   `err` - `null` or an error that has occured
-   `list` - a collection of all the child nodes in a list/object format: - `{fileRelativePath: 'dir|file'}`
-   `tree` - a collection of all the child nodes in a tree format: - `{dir: {dir:{}, file1:true} }` - if the readFiles option is true, then files will be returned with their contents instead

The results for a specific argument is only generated if the argument is requested.

The action callbacks accept the following arguments:

-   `fullPath` - the full/absolute path of the current file/directory
-   `relativePath` - the relative path of the current file/directory with respect to the original scanning path
-   `filename` - the basename of the current file/directory
-   `stat` - a simple stat object provided by [readdir-cluster](https://github.com/bevry/readdir-cluster)

The action callbacks can return `false` to skip the path from being processed further.

<!-- CONTRIBUTE/ -->

<h2>Contribute</h2>

<a href="https://github.com/bevry/scandirectory/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /CONTRIBUTE -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<ul>
<li>Install: <code>npm install --save scandirectory</code></li>
<li>Import: <code>import * as pkg from ('scandirectory')</code></li>
<li>Require: <code>const pkg = require('scandirectory')</code></li>
</ul>

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>scandirectory</code> aliases <code>scandirectory/source/index.js</code></li>
<li><code>scandirectory/source/index.js</code> is <a href="https://en.wikipedia.org/wiki/ECMAScript#ES.Next" title="ECMAScript Next">ESNext</a> source code for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 10 || 12 || 14 || 16 || 18 || 20 || 21 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li></ul>

<!-- /INSTALL -->


<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/scandirectory/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/scandirectory/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/scandirectory">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/balupton" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/scandirectory/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/scandirectory">view contributions</a></li>
<li><a href="https://github.com/lysenkobv">Bohdan Lysenko</a> — <a href="https://github.com/bevry/scandirectory/commits?author=lysenkobv" title="View the GitHub contributions of Bohdan Lysenko on repository bevry/scandirectory">view contributions</a></li>
<li><a href="https://github.com/sfrdmn">Sean Fridman</a> — <a href="https://github.com/bevry/scandirectory/commits?author=sfrdmn" title="View the GitHub contributions of Sean Fridman on repository bevry/scandirectory">view contributions</a></li></ul>

<a href="https://github.com/bevry/scandirectory/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2011+ <a href="https://balupton.com">Benjamin Lupton</a></li>
<li>Copyright &copy; 2014+ <a href="http://bevry.me">Bevry Pty Ltd</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/Artistic-2.0.html">Artistic License 2.0</a></li></ul>

<!-- /LICENSE -->
