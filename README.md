# jasmine-pit

Writing "asynchronous" tests in jasmine is kind of a pain in the ass.
jasmine-pit makes doing such things a tiny bit easier by providing an augmented
version of it() that allows you to simply return a promise that may eventually
assert expect()s.

## Example
```js

jasminePit.install(window);

describe('MyTestSuite', functtion() {
  pit('Spec 1', function() {
    return funcThatReturnsPromise().then(function(stuff) {
      expect(stuff).toBe(stuff_i_expect_it_to_be);
    });
  });
});
```

This will execute the promise chain and, if any errors occur along the way, they
will be propogated up to jasmine and reported as normal.

Feel free to take a look at the source, the definition for `pit()` really is
just stupid simple.
