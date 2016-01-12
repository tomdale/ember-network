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

  treeForVendor: function(tree) {
    return mergeTrees([
      treeForNodeFetch(tree),
      treeForBrowserFetch(tree)
    ]);
  },

  included: function(app) {
    app.import('vendor/node-fetch/fastboot-fetch.js', {
      exports: {
        default: [ 'default' ]
      }
    });

    app.import('vendor/whatwg-fetch/fetch.js', {
      exports: {
        default: [
          'default',
          'Headers',
          'Request',
          'Response'
        ]
      }
    });
  }
};

function expand(input) {
  var dirname = path.dirname(input);
  var file = path.basename(input);

  return dirname + '/{' + file + '}';
}

function treeForNodeFetch() {
  return new Funnel(path.join(__dirname, './assets'), {
    files: ['fastboot-fetch.js'],
    destDir: 'node-fetch'
  });
}

function treeForBrowserFetch() {
  var fetchPath = require.resolve('whatwg-fetch');
  var expandedFetchPath = expand(fetchPath);

  var fetch = rename(find(expandedFetchPath), function() {
    return 'whatwg-fetch/fetch.js';
  });

  return new Template(fetch, templatePath, function(content) {
    return {
      moduleBody: content
    };
  });
}
