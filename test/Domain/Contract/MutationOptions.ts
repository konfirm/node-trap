import test from 'tape';
import * as Export from '../../../source/Domain/Contract/MutationOptions';

test('Domain/Contract/MutationOptions - exports', (t) => {
	const expect = [
		'isMutationOptions',
	];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { isMutationOptions } = Export;

test('Domain/Contract/MutationOptions - isMutationOptions', (t) => {
	const invalid = [
		{},
		{ key: 'key' },
		{ target: {} },
		{ target: {}, key: 123 },
		{ target: [], key: 'key' },
		{ target: [], key: 'key', extra: false },
	];
	invalid.forEach((value) => {
		t.notOk(isMutationOptions(value), `${JSON.stringify(value)} is not MutationOptions`);
	});

	const valid = [
		{ target: {}, key: 'key' },
		{ target: () => { }, key: 'key' },
		{ target: {}, key: Symbol('key') },
		{ target: () => { }, key: Symbol('key') },
		{ target: {}, key: 'key', value: null },
		{ target: () => { }, key: 'key', value: null },
		{ target: {}, key: Symbol('key'), value: null },
		{ target: () => { }, key: Symbol('key'), value: null },
	];
	valid.forEach((value) => {
		t.ok(isMutationOptions(value), `${JSON.stringify(value)} is MutationOptions`);
	})

	t.end();
});
