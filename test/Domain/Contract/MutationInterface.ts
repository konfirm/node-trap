import test from 'tape';
import * as Export from '../../../source/Domain/Contract/MutationInterface';

test('Domain/Contract/MutationInterface - exports', (t) => {
	const expect = [
		'isMutationInterface',
	];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { isMutationInterface } = Export;

test('Domain/Contract/MutationInterface - isMutationInterface', (t) => {
	const invalid = [
		{},
		{ target: {}, key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', apply: () => { } },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined },
		{ name: 123, target: {}, key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', target: [], key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: 123, descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', descriptor: 123, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: null },
	];
	invalid.forEach((value) => {
		t.notOk(isMutationInterface(value), `${JSON.stringify(value)} is not a MutationInterface`);
	});

	const valid = [
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', target: () => { }, key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: Symbol('key'), descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', descriptor: { value: 'foo' }, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', value: null, descriptor: undefined, apply: () => { } },
		{ name: 'name', target: () => { }, key: 'key', value: null, descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: Symbol('key'), value: null, descriptor: undefined, apply: () => { } },
		{ name: 'name', target: {}, key: 'key', value: null, descriptor: { value: 'foo' }, apply: () => { } },
	];
	valid.forEach((value) => {
		t.ok(isMutationInterface(value), `${JSON.stringify(value)} is a MutationInterface`);
	})

	t.end();
});
