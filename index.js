/* jshint node: true */
'use strict';

/*
 * The `index.js` file is the main entry point for all Ember CLI addons.  The
 * object we export from this file is turned into an Addon class
 * (https://github.com/ember-cli/ember-cli/blob/master/lib/models/addon.js) by
 * Ember CLI.
 *
 * This addon is relatively simple: it includes both `node-fetch` and
 * `whatwg-fetch` as npm dependencies, and swaps the correct version in
 * depending on whether the Ember app is being built for FastBoot or the
 * browser.
 *
 * At a high-level, the flow for this addon is:
 *
 * 1. When a build starts and the addon is included, tell Ember CLI to import
 *    `vendor/fetch.js` into the vendor.js file. `vendor/fetch.js` doesn't
 *    actually exist yet; we'll create it later.
 * 2. When Ember CLI asks for the addon's vendor tree, we'll return a Broccoli
 *    tree that contains the correct fetch() version.
 * 3. In the case of the browser polyfill, we wrap it in a shim that that makes
 *    it compatible with Ember's module system. (Normally the polyfill exports a
 *    global, but we can rely on the fact that Ember users are using modules.)
 */
module.exports = {
  name: 'ember-network',

  /*
   * The `included` hook is invoked at the very beginning of the build process.
   * It gets passed the `EmberApp` model
   * (https://github.com/ember-cli/ember-cli/blob/master/lib/broccoli/ember-app.js),
   * which allows us to use the `import()` method to tell it to include a file
   * from our `vendor` tree into the final built app.
   */
  included: function(app) {
    app.import('vendor/fetch.js', {
      exports: {
        default: [
          'default',
          'Headers',
          'Request',
          'Response'
        ]
      }
    });
  },

  /*
   * Returns a Broccoli tree for the addon's `vendor` directory. The `vendor`
   * directory is kind of a junk drawer; nothing we put in it is used unless we
   * explicitly `import()` a file (which we do in the `included` hook, above).
   *
   * To build our tree, we first detect whether we're in a FastBoot build or
   * not. Based on that, we return a tree that contains the correct version of
   * the polyfill at the `vendor/fetch.js` path.
   */
  treeForVendor: function() {
    if (isFastBoot()) {
      return treeForNodeFetch();
    } else {
      return treeForBrowserFetch();
    }
  }
};

var path = require('path');

// We use a few different Broccoli plugins to build our trees:
//
// broccoli-templater: renders the contents of a file inside a template.
// Used to wrap the browser polyfill in a shim that prevents it from exporting
// a global.
//
// broccoli-funnel: used to import a stub file that requires the node package
// when running in FastBoot.
//
// broccoli-stew: super useful library of Broccoli utilities. We use:
//
//   * rename - renames files in a tree
//   * find - finds files in a tree based on a glob pattern

var Template = require('broccoli-templater');
var funnel = require('broccoli-funnel');
var stew = require('broccoli-stew');
var rename = stew.rename;
var find = stew.find;

// Path to the template that contains the shim wrapper around the browser
// polyfill
var templatePath = path.resolve(__dirname + '/assets/module-template.js.t');

// Checks to see whether this build is targeting FastBoot. Note that we cannot
// check this at boot time--the environment variable is only set once the build
// has started, which happens after this file is evaluated.
function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}

// Returns a shim file from the assets directory and renames it to the
// normalized `fetch.js`. That shim file calls `FastBoot.require`, which allows
// you to require node modules (in this case `node-fetch`) in FastBoot mode.
function treeForNodeFetch() {
  return normalizeFileName(funnel(path.join(__dirname, './assets'), {
    files: ['fastboot-fetch.js'],
  }));
}

// Returns a tree containing the browser polyfill (from
// `node_modules/whatwg-fetch`), wrapped in a shim that stops it from exporting
// a global and instead turns it into a module that can be used by the Ember
// app.
function treeForBrowserFetch() {
  var fetchPath = require.resolve('whatwg-fetch');
  var expandedFetchPath = expand(fetchPath);

  var fetch = normalizeFileName(find(expandedFetchPath));

  return new Template(fetch, templatePath, function(content) {
    return {
      moduleBody: content
    };
  });
}

// Renames either `fastboot-fetch.js` or `whatwg-fetch/fetch.js` to just
// `fetch.js`. Note that this function will rename _every_ file in the tree;
// we just happen to know that the passed tree only contains a single file.
function normalizeFileName(tree) {
  return rename(tree, function() {
    return 'fetch.js';
  });
}

function expand(input) {
  var dirname = path.dirname(input);
  var file = path.basename(input);

  return dirname + '/{' + file + '}';
}

