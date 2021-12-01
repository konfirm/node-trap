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
		{ target: {}, key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: () => { } },
		{ name: 123, target: {}, key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: [], key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 123, descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: 123, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: null, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: () => { }, visible: null },
	];
	invalid.forEach((value) => {
		t.notOk(isMutationInterface(value), `${JSON.stringify(value)} is not a MutationInterface`);
	});

	const valid = [
		{ name: 'name', target: {}, key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: () => { }, key: 'key', descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: Symbol('key'), descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', descriptor: { value: 'foo' }, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', value: null, descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: () => { }, key: 'key', value: null, descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: Symbol('key'), value: null, descriptor: undefined, apply: () => { }, visible: true },
		{ name: 'name', target: {}, key: 'key', value: null, descriptor: { value: 'foo' }, apply: () => { }, visible: true },
	];
	valid.forEach((value) => {
		t.ok(isMutationInterface(value), `${JSON.stringify(value)} is a MutationInterface`);
	})

	t.end();
});
