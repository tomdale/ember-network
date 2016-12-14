(function() {
  define('ember-network/fetch', [ 'exports' ], function(self) {
    var Fetch = FastBoot.require('node-fetch');
    self['default'] = Fetch;
    self['Headers'] = Fetch.Headers;
    self['Request'] = Fetch.Request;
    self['Response'] = Fetch.Response;
  });
})();
