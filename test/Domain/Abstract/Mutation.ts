import test from 'tape';
import each from 'template-literal-each';
import * as Export from '../../../source/Domain/Abstract/Mutation';

test('Domain/Abstract/Mutation - exports', (t) => {
	const expect = ['AbstractMutation'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

class TestMutation extends Export.AbstractMutation { }
const target = {};
const key = 'myKey';
const value = 'myValue';
const mutation = new TestMutation({ target, key, value });

test('Domain/Abstract/Mutation - instance properties', (t) => {

	t.equal(mutation.name, 'test-mutation', 'TestMutation has name "test-mutation"');
	t.equal(mutation.target, target, 'target is the provided target');
	t.equal(mutation.key, key, `key is "${key}"`);
	t.equal(mutation.value, value, `value is "${value}"`);
	t.equal(mutation.descriptor, undefined, `descriptor is undefined`);

	t.end();
});

test('Domain/Abstract/Mutation - apply', (t) => {
	t.throws(() => mutation.apply(), /Not implemented/, 'apply is not implemented');
	t.notOk(key in target, `${target} does not contain ${key}`);

	t.end();
});

test('Domain/Abstract/Mutation - toString', (t) => {
	t.equal(mutation.toString(), 'test-mutation: myKey = myValue', 'toString() returns "test-mutation: myKey = myValue"');
	t.equal(String(mutation), 'test-mutation: myKey = myValue', 'String(mutation) returns "test-mutation: myKey = myValue"');

	t.end();
});

test('Domain/Abstract/Mutation - toString(template)', (t) => {
	each`
		template                | output
		------------------------|--------------------------------
		{name}: {key} = {value} | test-mutation: myKey = myValue
		{key}:{value}           | myKey:myValue
		{name}                  | test-mutation
		{key}                   | myKey
		{value}                 | myValue
		{descriptor}            | undefined
		{notAKey}               | undefined
	`(({ template, output }: any) => {
		t.equal(mutation.toString(template), output, `toString("${template}") returns "${output}"`);
	});

	t.end();
});

test('Domain/Abstract/Mutation - toJSON', (t) => {
	t.deepEqual(mutation.toJSON(), { name: 'test-mutation', key: 'myKey', value: 'myValue' }, `toJSON() returns {name: 'test-mutation', key: 'myKey', value: 'myValue'}`);
	t.equal(JSON.stringify(mutation), '{"name":"test-mutation","key":"myKey","value":"myValue"}', `JSON.stringify returns '{"name":"test-mutation","key":"myKey","value":"myValue"}'`);

	t.end();
});
