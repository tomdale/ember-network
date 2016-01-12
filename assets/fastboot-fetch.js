(function() {
  define('ember-network/fetch', [ 'exports' ], function(self) {
    self['default'] = FastBoot.require('node-fetch');
  });
})();
