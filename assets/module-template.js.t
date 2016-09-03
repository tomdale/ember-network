(function (global) {
  define('ember-network/fetch', [ 'ember', 'exports' ], function(Ember, self) {
    'use strict';

    var Promise = Ember['default'].RSVP.Promise;
    if (global.FormData) {
      self.FormData = global.FormData;
    }
    if (global.FileReader) {
      self.FileReader = global.FileReader;
    }
    if (global.Blob) {
      self.Blob = global.Blob;
    }

    <%= moduleBody %>

    self['default'] = self.fetch;
    self['Headers'] = self.Headers;
    self['Request'] = self.Request;
    self['Response'] = self.Response;
  });
}(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this));
