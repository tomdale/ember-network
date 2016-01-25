# ember-network

Ember Network provides low-level networking primitives that work both in
the browser and in Node.js via [FastBoot][fastboot].

[fastboot]: https://github.com/tildeio/ember-cli-fastboot

## Installation

In your Ember app or addon, run:

* `ember install ember-network`

## Usage

Currently, Ember Network implements the [WHATWG Fetch][whatwg-fetch]
standard. Other standards may be implemented in the future.

[whatwg-fetch]: https://fetch.spec.whatwg.org

### Fetch

```js
import Route from "ember-route";
import fetch from "ember-network/fetch";

export default Route.extend({
  model() {
    return fetch('https://api.github.com/users/tomdale/events')
      .then(function(response) {
        return response.json();
      });
  }
});
```

For more information on using `fetch()`, see:

* [Jake Archibald's poppycock](https://jakearchibald.com/2015/thats-so-fetch/)
* [MDN Fetch guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* [WHATWG Fetch specification][whatwg-fetch]

To see a very simple example app using FastBoot and Ember Network, see:

* [github-fastboot-example](https://github.com/tomdale/github-fastboot-example)

## How It Works

At build time, Ember Network detects if the build target is FastBoot or
the browser. For FastBoot, it swaps in the [node-fetch][node-fetch]
library. For the browser, it swaps in [GitHub's fetch
polyfill][github-fetch]. (The browser polyfill will use the native
`window.fetch()` if available.) The appropriate version will appear in
your `vendor.js` file.

[node-fetch]: https://www.npmjs.com/package/node-fetch
[github-fetch]: https://github.com/github/fetch

If you'd like to write an Ember addon that does something similar,
[please see the annotated index.js file](index.js).
