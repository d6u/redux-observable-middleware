const test = require('tape');
const getType = require('../src/util').getType;

test('getType returns type with suffix', function (t) {
  t.plan(1);

  const result = getType('TYPE', 'onNext', '_SUFFIX');

  t.equal(result, 'TYPE_SUFFIX');
});

test('getType returns defined type', function (t) {
  t.plan(1);

  const result = getType({ onNext: 'NEXT' }, 'onNext', '_SUFFIX');

  t.equal(result, 'NEXT');
});

test('getType returns nothing', function (t) {
  t.plan(1);

  const result = getType({ onNext: 'NEXT' }, 'onError', '_SUFFIX');

  t.equal(result, undefined);
});
