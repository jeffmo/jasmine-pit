function install(globalObject) {
  if (!globalObject.jasmine) {
    throw new Error(
      'It looks like you\'re trying to install jasmine-pit before installing ' +
      'jasmine! Make sure there is a `jasmine` property on the global object ' +
      '(window/global/etc) before calling install().'
    );
  }

  var jasmine = globalObject.jasmine;

  globalObject.pit = function pit(specName, promiseBuilder) {
    return jasmine.getEnv().it(specName, runPitTest.bind(null, promiseBuilder));
  };

  globalObject.pit.only = function pitOnly(specName, promiseBuilder) {
    return jasmine.getEnv().it.only(specName, runPitTest.bind(null, promiseBuilder));
  };

  globalObject.xpit = function xpit(specName, promiseBuilder) {
    return jasmine.getEnv().xit(specName, runPitTest.bind(null, promiseBuilder));
  };

  function runPitTest(promiseBuilder) {
    var jasmineEnv = jasmine.getEnv();
    var spec = this;
    var isFinished = false;
    var error = null;

    jasmineEnv.currentSpec.runs(function() {
      try {
        var promise = promiseBuilder.call(spec);
        if (promise && promise.then) {
          promise.then(function() {
            isFinished = true;
          })['catch'](function(err) {
            error = err; isFinished = true;
          });
        } else {
          isFinished = true;
        }
      } catch (e) {
        error = e;
        isFinished = true;
      }
    });

    jasmineEnv.currentSpec.waitsFor(function() { return isFinished; });
    jasmineEnv.currentSpec.runs(function() { if (error) throw error; });
  };
}

exports.install = install;
