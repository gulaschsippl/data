import DS from 'ember-data';
import { module } from 'qunit';
import testInDebug from 'dummy/tests/helpers/test-in-debug';

let errors;

module('unit/model/errors', {
  beforeEach() {
    errors = DS.Errors.create();
  },
});

testInDebug('add error', function(assert) {
  errors.add('firstName', 'error');
  assert.ok(errors.has('firstName'), 'it has firstName errors');
  assert.equal(errors.get('length'), 1, 'it has 1 error');

  errors.add('firstName', ['error1', 'error2']);
  assert.equal(errors.get('length'), 3, 'it has 3 errors');
  assert.ok(!errors.get('isEmpty'), 'it is not empty');

  errors.add('lastName', 'error');
  errors.add('lastName', 'error'); // intentionally the same error
  assert.equal(errors.get('length'), 4, 'it has 4 errors');
});

testInDebug('get error', function(assert) {
  assert.ok(errors.get('firstObject') === undefined, 'returns undefined');

  errors.add('firstName', 'error');
  assert.ok(errors.get('firstName').length === 1, 'returns errors');
  assert.deepEqual(errors.get('firstObject'), { attribute: 'firstName', message: 'error' });

  errors.add('firstName', 'error2');
  assert.ok(errors.get('firstName').length === 2, 'returns errors');

  errors.add('lastName', 'error3');
  assert.deepEqual(errors.toArray(), [
    { attribute: 'firstName', message: 'error' },
    { attribute: 'firstName', message: 'error2' },
    { attribute: 'lastName', message: 'error3' },
  ]);
  assert.deepEqual(errors.get('firstName'), [
    { attribute: 'firstName', message: 'error' },
    { attribute: 'firstName', message: 'error2' },
  ]);
  assert.deepEqual(errors.get('messages'), ['error', 'error2', 'error3']);
});

testInDebug('remove error', function(assert) {
  errors.add('firstName', 'error');
  errors.remove('firstName');

  assert.ok(!errors.has('firstName'), 'it has no firstName errors');
  assert.equal(errors.get('length'), 0, 'it has 0 error');
  assert.ok(errors.get('isEmpty'), 'it is empty');
});

testInDebug('remove same errors fromm different attributes', function(assert) {
  errors.add('firstName', 'error');
  errors.add('lastName', 'error');
  assert.equal(errors.get('length'), 2, 'it has 2 error');

  errors.remove('firstName');
  assert.equal(errors.get('length'), 1, 'it has 1 error');

  errors.remove('lastName');
  assert.ok(errors.get('isEmpty'), 'it is empty');
});

testInDebug('clear errors', function(assert) {
  errors.add('firstName', ['error', 'error1']);
  assert.equal(errors.get('length'), 2, 'it has 2 errors');

  errors.clear();
  assert.ok(!errors.has('firstName'), 'it has no firstName errors');
  assert.equal(errors.get('length'), 0, 'it has 0 error');
});
