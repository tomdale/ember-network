/* jshint node: true */
'use strict';

var path = require('path');
var templatePath = path.resolve(__dirname + '/assets/module-template.js.t');

var stew = require('broccoli-stew');
var rename = stew.rename;
var find = stew.find;
var Template = require('broccoli-templater');
var funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-network',

  included: function(app) {
    app.import('vendor/fetch.js');
  },

  treeForVendor: function() {
    if (isFastBoot()) {
      return treeForNodeFetch();
    } else {
      return treeForBrowserFetch();
    }
  }
};

function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}

function treeForNodeFetch() {
  return normalizeFileName(funnel(path.join(__dirname, './assets'), {
    files: ['fastboot-fetch.js'],
  }));
}

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

