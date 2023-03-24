import test from 'tape';
import { each } from 'template-literal-each';
import * as Export from '../../../source/Domain/ValueObject/PropertyMutation';

test('Domain/ValueObject/PropertyMutation - exports', (t) => {
	const expect = ['PropertyMutation'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

test('Domain/ValueObject/PropertyMutation - property descriptor', (t) => {
	t.ok(new PropertyMutation({ target, key, value: {} }), 'allows no settings');
	t.ok(new PropertyMutation({ target, key, value: { value: 'foo' } }), 'allows value');
	t.ok(new PropertyMutation({ target, key, value: { value: 'foo', writable: true } }), 'allows value and writable');
	t.ok(new PropertyMutation({ target, key, value: { get: () => { } } }), 'allows get');
	t.ok(new PropertyMutation({ target, key, value: { get: () => { }, set: () => { } } }), 'allows get and set');

	t.throws(() => new PropertyMutation({ target, key, value: { value: 'foo', get: () => { } } }), 'does not allow value and get');
	t.throws(() => new PropertyMutation({ target, key, value: { value: 'foo', set: () => { } } }), 'does not allow value and set');
	t.throws(() => new PropertyMutation({ target, key, value: { writable: false, get: () => { } } }), 'does not allow writable and get');
	t.throws(() => new PropertyMutation({ target, key, value: { set: () => { } } }), 'does not allow set without get');

	t.end();
});

const { PropertyMutation } = Export;
const key = 'myKey';
const value = 'myValue';
const target = { [key]: 'originalValue' };
const mutation = new PropertyMutation({ target, key, value: { value } });

test('Domain/ValueObject/PropertyMutation - instance properties', (t) => {
	t.equal(mutation.name, 'property-mutation', 'PropertyMutation has name "property-mutation"');
	t.equal(mutation.target, target, 'target is the provided target');
	t.equal(mutation.key, key, `key is "${key}"`);
	t.equal(mutation.value, value, `value is '${value}'`);
	t.deepEqual(mutation.descriptor, { configurable: true, enumerable: true, writable: true, value }, `descriptor is { configurable: true, enumerable: true, writable: true, value: 'myValue' }`);

	t.end();
});

test('Domain/ValueObject/PropertyMutation - clean up descriptor', (t) => {
	const target = {};
	Object.defineProperty(target, 'value', { value: 'value', writable: true });
	Object.defineProperty(target, 'getter', { get: () => 'getter' });

	const get = () => 'getter';

	const value = new PropertyMutation({ target, key: 'value', value: { value: 'value' } });
	const getter = new PropertyMutation({ target, key: 'value', value: { get, enumerable: true } });
	const unknown = new PropertyMutation({ target, key: 'unknown', value: { value: 'unknown' } });

	t.deepEqual(value.descriptor, { value: 'value', writable: true, configurable: false, enumerable: false }, 'value.descriptor has get removed');
	t.equal(value.value, 'value', 'value.value is "value"');

	t.deepEqual(getter.descriptor, { configurable: false, enumerable: true, get }, 'getter.descriptor has value and writable removed');
	t.equal(getter.value, 'getter', 'getter.value is "getter"');

	t.deepEqual(unknown.descriptor, { value: 'unknown' }, 'unknown.descriptor is newly created');
	t.equal(unknown.value, 'unknown', 'unknown.value is "unknown"');

	t.end();
});

test('Domain/ValueObject/PropertyMutation - apply', (t) => {
	t.deepEqual(target, { [key]: 'originalValue' }, `target equals ${JSON.stringify({ [key]: 'originalValue' })}`);

	mutation.apply();

	t.deepEqual(target, { [key]: value }, `target equals ${JSON.stringify({ [key]: value })}`);

	t.end();
});

test('Domain/ValueObject/PropertyMutation - toString', (t) => {
	t.equal(mutation.toString(), 'property-mutation: myKey = myValue', 'toString() returns "property-mutation: myKey = myValue"');
	t.equal(String(mutation), 'property-mutation: myKey = myValue', 'String(mutation) returns "property-mutation: myKey = myValue"');

	t.end();
});

test('Domain/ValueObject/PropertyMutation - toString(template)', (t) => {
	each`
		template                | output
		------------------------|--------------------------------
		{name}: {key} = {value} | property-mutation: myKey = myValue
		{key}:{value}           | myKey:myValue
		{name}                  | property-mutation
		{key}                   | myKey
		{value}                 | myValue
		{descriptor}            | [object Object]
		{notAKey}               | undefined
	`(({ template, output }: any) => {
		t.equal(mutation.toString(template), output, `toString("${template}") returns "${output}"`);
	});

	t.end();
});

test('Domain/ValueObject/PropertyMutation - toJSON', (t) => {
	t.deepEqual(mutation.toJSON(), { name: 'property-mutation', key: 'myKey', value: 'myValue' }, `toJSON() returns {name: 'property-mutation', key: 'myKey', value: 'myValue'}`);
	t.equal(JSON.stringify(mutation), '{"name":"property-mutation","key":"myKey","value":"myValue"}', `JSON.stringify returns '{"name":"property-mutation","key":"myKey","value":"myValue"}'`);

	t.end();
});
