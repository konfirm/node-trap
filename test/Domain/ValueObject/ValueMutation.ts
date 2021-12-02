import test from 'tape';
import each from 'template-literal-each';
import * as Export from '../../../source/Domain/ValueObject/ValueMutation';

test('Domain/ValueObject/ValueMutation - exports', (t) => {
	const expect = ['ValueMutation'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { ValueMutation } = Export;
const key = 'myKey';
const value = 'myValue';
const target = { [key]: 'originalValue' };
const mutation = new ValueMutation({ target, key, value });

test('Domain/ValueObject/ValueMutation - instance properties', (t) => {
	t.equal(mutation.name, 'value-mutation', 'ValueMutation has name "value-mutation"');
	t.equal(mutation.target, target, 'target is the provided target');
	t.equal(mutation.key, key, `key is "${key}"`);
	t.equal(mutation.value, value, `value is '${value}'`);
	t.deepEqual(mutation.descriptor, { configurable: true, enumerable: true, value, writable: true }, `descriptor is { configurable: true, enumerable: true, value: "myValue", writable: true }`);

	t.end();
});

test('Domain/ValueObject/ValueMutation - apply', (t) => {
	t.deepEqual(target, { [key]: 'originalValue' }, `target equals ${JSON.stringify({ [key]: 'originalValue' })}`);

	mutation.apply();

	t.deepEqual(target, { [key]: value }, `target equals ${JSON.stringify({ [key]: value })}`);

	t.end();
});

test('Domain/ValueObject/ValueMutation - toString', (t) => {
	t.equal(mutation.toString(), 'value-mutation: myKey = myValue', 'toString() returns "value-mutation: myKey = myValue"');
	t.equal(String(mutation), 'value-mutation: myKey = myValue', 'String(mutation) returns "value-mutation: myKey = myValue"');

	t.end();
});

test('Domain/ValueObject/ValueMutation - toString(template)', (t) => {
	each`
		template                | output
		------------------------|--------------------------------
		{name}: {key} = {value} | value-mutation: myKey = myValue
		{key}:{value}           | myKey:myValue
		{name}                  | value-mutation
		{key}                   | myKey
		{value}                 | myValue
		{descriptor}            | [object Object]
		{notAKey}               | undefined
	`(({ template, output }: any) => {
		t.equal(mutation.toString(template), output, `toString("${template}") returns "${output}"`);
	});

	t.end();
});

test('Domain/ValueObject/ValueMutation - toJSON', (t) => {
	t.deepEqual(mutation.toJSON(), { name: 'value-mutation', key: 'myKey', value: 'myValue' }, `toJSON() returns {name: 'value-mutation', key: 'myKey', value: 'myValue'}`);
	t.equal(JSON.stringify(mutation), '{"name":"value-mutation","key":"myKey","value":"myValue"}', `JSON.stringify returns '{"name":"value-mutation","key":"myKey","value":"myValue"}'`);

	t.end();
});
