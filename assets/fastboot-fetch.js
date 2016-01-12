(function() {
  define('fetch/fastboot', [ 'exports' ], function(self) {
    if (typeof FastBoot === 'undefined') { return; }
    self['default'] = FastBoot.require('node-fetch');
  });
})();
