import test from 'tape';
import each from 'template-literal-each';
import * as Export from '../../../source/Domain/ValueObject/DeletionMutation';

test('Domain/ValueObject/DeletionMutation - exports', (t) => {
	const expect = ['DeletionMutation'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { DeletionMutation } = Export;
const key = 'myKey';
const value = 'myValue';
const target = { [key]: value };
const mutation = new DeletionMutation({ target, key, value });

test('Domain/ValueObject/DeletionMutation - instance properties', (t) => {
	t.equal(mutation.name, 'deletion-mutation', 'DeletionMutation has name "deletion-mutation"');
	t.equal(mutation.target, target, 'target is the provided target');
	t.equal(mutation.key, key, `key is "${key}"`);
	t.equal(mutation.value, undefined, `value is undefined`);
	t.equal(mutation.descriptor, undefined, `descriptor is undefined`);

	t.end();
});

test('Domain/ValueObject/DeletionMutation - apply', (t) => {
	t.deepEqual(target, { [key]: value }, `target equals ${JSON.stringify(target)}`);

	mutation.apply();

	t.deepEqual(target, {}, `target equals ${JSON.stringify({})}`);

	t.end();
});

test('Domain/ValueObject/DeletionMutation - toString', (t) => {
	t.equal(mutation.toString(), 'deletion-mutation: myKey', 'toString() returns "deletion-mutation: myKey"');
	t.equal(String(mutation), 'deletion-mutation: myKey', 'String(mutation) returns "deletion-mutation: myKey"');

	t.end();
});

test('Domain/ValueObject/DeletionMutation - toString(template)', (t) => {
	each`
		template                | output
		------------------------|--------------------------------
		{name}: {key} = {value} | deletion-mutation: myKey = undefined
		{key}:{value}           | myKey:undefined
		{name}                  | deletion-mutation
		{key}                   | myKey
		{value}                 | undefined
		{descriptor}            | undefined
		{notAKey}               | undefined
	`(({ template, output }: any) => {
		t.equal(mutation.toString(template), output, `toString("${template}") returns "${output}"`);
	});

	t.end();
});

test('Domain/ValueObject/DeletionMutation - toJSON', (t) => {
	t.deepEqual(mutation.toJSON(), { name: 'deletion-mutation', key: 'myKey', value: undefined }, `toJSON() returns {name: 'deletion-mutation', key: 'myKey', value: undefined}`);
	t.equal(JSON.stringify(mutation), '{"name":"deletion-mutation","key":"myKey"}', `JSON.stringify returns '{"name":"deletion-mutation","key":"myKey"}'`);

	t.end();
});
