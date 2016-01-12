/* jshint node: true */
'use strict';

var path = require('path');
var templatePath = path.resolve(__dirname + '/assets/module-template.js.t');

var stew = require('broccoli-stew');
var rename = stew.rename;
var find = stew.find;
var Template = require('broccoli-templater');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-network',

  treeForAddon: function(tree) {
    var addonTree = this._super.treeForAddon.call(this, tree);
    var fetchTree;

    if (isFastBoot()) {
      fetchTree = treeForNodeFetch();
    } else {
      fetchTree = treeForBrowserFetch();
    }

    return mergeTrees([ addonTree, fetchTree ]);
  }
};

function expand(input) {
  var dirname = path.dirname(input);
  var file = path.basename(input);

  return dirname + '/{' + file + '}';
}

function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}

function treeForNodeFetch() {
  return new Funnel(path.join(__dirname, './assets'), {
    files: ['fastboot-fetch.js'],
    destDir: 'reexports'
  });
}

function treeForBrowserFetch() {
  var fetchPath = require.resolve('whatwg-fetch');
  var expandedFetchPath = expand(fetchPath);

  var fetch = rename(find(expandedFetchPath), function() {
    return 'reexports/fetch.js';
  });

  return new Template(fetch, templatePath, function(content) {
    return {
      moduleBody: content
    };
  });
}
