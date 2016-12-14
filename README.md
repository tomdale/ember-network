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

## Testing

Testing requires a new approach because existing tools like Pretender and Mirage rely on `ajax` and `XMLHttpRequest`. Newer browsers have the `fetch` command built in, therefore mocking it is a bit different.

Firstly remove local reference from your `fetch` import statement:
```js
import 'ember-network/fetch';
```

Because we will be mocking the global `fetch`, having a local reference will miss out on the mocked version. Now we are ready for mocking:

```
npm install fetch-mock
ember install ember-browserify
```

Now, inside of any acceptance tests, you can mock any network traffic with ease:

```js
// ...
import fetchMock from 'npm:fetch-mock';

// ...

test('visiting /', function(assert) {
  fetchMock.get('/users/1', {
    'data': {
      'type': 'user',
      'id': '1',
      'attributes': {
        // ...
      }
    }
  });

  visit('/');
  
  // ...
});
```

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
