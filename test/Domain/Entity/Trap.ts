import test from 'tape';
import * as Export from '../../../source/Domain/Entity/Trap';
import { Collection } from '../../../source/Domain/Entity/Collection';

test('Domain/Entity/Trap - exports', (t) => {
	const expect = ['Trap'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { Trap } = Export;
const target = { three: 3, four: 4 };
const keys = Object.keys(target);

/**
 * Create a runner for different Trap configurations, which should behave the same but have
 * different collected values
 *
 * @param {(trap: Export.Trap, description: string) => void} call
 * @return {*}  {Array<Collection<any>>}
 */
function runner(call: (trap: Export.Trap, description: string) => void): Array<Collection<any>> {
	const traps = [
		{ description: 'new Trap()', trap: new Trap() },
		{ description: 'new Trap(true)', trap: new Trap(true) },
	];

	return traps.map(({ trap, description }) => {
		call(trap, description);

		return Collection.for(trap);
	});
}

test('Domain/Entity/Trap - defineProperty', (t) => {
	const [all, one] = runner((trap, name) => {
		t.equal(trap.get(target, 'three'), 3, `${name}: three is 3`);
		t.equal(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);

		trap.defineProperty(target, 'sample', { value: 'defined' });
		t.equal(trap.get(target, 'sample'), 'defined', `${name}: sample is "defined"`);

		trap.defineProperty(target, 'sample', { value: 'defined twice' });
		t.equal(trap.get(target, 'sample'), 'defined twice', `${name}: sample is "defined twice"`);

		trap.defineProperty(target, 'three', { value: 333 });
		t.equal(trap.get(target, 'three'), 333, `${name}: three is 333`);
	});

	t.equal(all.findAll({ target }).length, 3, 'new Trap(): has 3 operations');
	t.equal(one.findAll({ target }).length, 2, 'new Trap(true): has 2 operations');

	t.end();
});

test('Domain/Entity/Trap - deleteProperty', (t) => {
	const [all, one] = runner((trap, name) => {
		t.equal(trap.get(target, 'three'), 3, `${name}: three is 3`);
		t.equal(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);

		trap.defineProperty(target, 'sample', { value: 'defined' });
		t.equal(trap.get(target, 'sample'), 'defined', `${name}: sample is "defined"`);

		trap.deleteProperty(target, 'sample');
		t.equal(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);

		trap.deleteProperty(target, 'three');
		t.equal(trap.get(target, 'three'), undefined, `${name}: three is undefined`);
	});

	t.equal(all.findAll({ target }).length, 3, 'new Trap(): has 3 operations');
	t.equal(one.findAll({ target }).length, 1, 'new Trap(true): has 1 operation');

	t.end();
});

test('Domain/Entity/Trap - get', (t) => {
	const [all, one] = runner((trap, name) => {
		t.equal(trap.get(target, 'three'), 3, `${name}: three is 3`);
		t.equal(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);

		trap.set(target, 'sample', 'set');
		t.equal(trap.get(target, 'sample'), 'set', `${name}: sample is "set"`);

		trap.defineProperty(target, 'sample', { value: 'defined' });
		t.equal(trap.get(target, 'sample'), 'defined', `${name}: sample is "defined"`);

		trap.deleteProperty(target, 'sample');
		t.equal(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);
	});

	t.equal(all.findAll({ target }).length, 3, 'new Trap(): has 3 operations');
	t.equal(one.findAll({ target }).length, 0, 'new Trap(true): has 0 operations');

	t.end();
});

test('Domain/Entity/Trap - getOwnPropertyDescriptor', (t) => {
	const get = () => 'get';
	const [all, one] = runner((trap, name) => {
		t.deepEqual(trap.getOwnPropertyDescriptor(target, 'three'), { value: 3, writable: true, enumerable: true, configurable: true }, `${name}: property descriptor for "three" is { value: 3, writable: true, enumerable: true, configurable: true }`);
		t.deepEqual(trap.getOwnPropertyDescriptor(target, 'sample'), undefined, `${name}: property descriptor is undefined`);

		trap.defineProperty(target, 'sample', undefined);
		console.log(trap.getOwnPropertyDescriptor(target, 'sample'));
		t.deepEqual(trap.getOwnPropertyDescriptor(target, 'sample'), undefined, `${name}: property descriptor is undefined`);

		trap.defineProperty(target, 'sample', { value: 'defined' });
		t.deepEqual(trap.getOwnPropertyDescriptor(target, 'sample'), { value: 'defined', enumerable: false }, `${name}: property descriptor is {value:"defined", enumerable: false}`);

		trap.defineProperty(target, 'sample', { get });
		t.deepEqual(trap.getOwnPropertyDescriptor(target, 'sample'), { get, enumerable: false }, `${name}: property descriptor is {get: () => "defined", enumerable: false}`);
	});

	t.equal(all.findAll({ target }).length, 3, 'new Trap(): has 3 operations');
	t.equal(one.findAll({ target }).length, 1, 'new Trap(true): has 1 operation');

	t.end();
});

test('Domain/Entity/Trap - has', (t) => {
	const [all, one] = runner((trap, name) => {
		t.equal(trap.has(target, 'three'), true, `${name}: has property three`);
		t.equal(trap.has(target, 'sample'), false, `${name}: does not have property sample`);

		trap.defineProperty(target, 'sample', { value: 'defined' });
		t.equal(trap.has(target, 'sample'), true, `${name}: has property sample after defineProperty`);

		trap.deleteProperty(target, 'sample');
		t.equal(trap.has(target, 'sample'), false, `${name}: does not have property sample after deleteProperty`);

		trap.deleteProperty(target, 'three');
		t.equal(trap.has(target, 'three'), false, `${name}: does not have property three after deleteProperty`);

		trap.set(target, 'sample', 'defined');
		t.equal(trap.has(target, 'sample'), true, `${name}: has property sample after set`);

	});

	t.equal(all.findAll({ target }).length, 4, 'new Trap(): has 4 operations');
	t.equal(one.findAll({ target }).length, 2, 'new Trap(true): has 2 operations');

	t.end();
});

test('Domain/Entity/Trap - ownKeys', (t) => {
	const [all, one] = runner((trap, name) => {
		t.deepEqual(trap.ownKeys(target), ['three', 'four'], `${name}: ownKeys is an empty array`);

		trap.defineProperty(target, 'zero', { get: () => 0 });
		t.deepEqual(trap.ownKeys(target), ['three', 'four'], `${name}: ownKeys is still an empty array`);

		trap.defineProperty(target, 'one', { value: 1, enumerable: true });
		t.deepEqual(trap.ownKeys(target), ['three', 'four', 'one'], `${name}: ownKeys is ["three", "four", "one"]`);

		trap.set(target, 'two', 2);
		t.deepEqual(trap.ownKeys(target), ['three', 'four', 'one', 'two'], `${name}: ownKeys is ["three", "four", "one", "two"]`);

		trap.deleteProperty(target, 'one');
		t.deepEqual(trap.ownKeys(target), ['three', 'four', 'two'], `${name}: ownKeys is ["three", "four", "two"]`);

		trap.deleteProperty(target, 'two');
		t.deepEqual(trap.ownKeys(target), ['three', 'four'], `${name}: ownKeys is ["three", "four"] after deleting "one"`);

		trap.deleteProperty(target, 'three');
		t.deepEqual(trap.ownKeys(target), ['four'], `${name}: ownKeys is ["four"] after deleting "three"`);
	});

	t.equal(all.findAll({ target }).length, 6, 'new Trap(): has 6 operations');
	t.equal(one.findAll({ target }).length, 2, 'new Trap(true): has 2 operations');

	t.end();
});

test('Domain/Entity/Trap - set', (t) => {
	const [all, one] = runner((trap, name) => {
		t.deepEqual(trap.get(target, 'three'), 3, `${name}: three is 3`);
		t.deepEqual(trap.get(target, 'sample'), undefined, `${name}: sample is undefined`);

		trap.set(target, 'sample', 'hello');
		t.deepEqual(trap.get(target, 'sample'), 'hello', `${name}: sample is "hello"`);

		trap.set(target, 'sample', 'hello');
		t.deepEqual(trap.get(target, 'sample'), 'hello', `${name}: sample is "hello"`);

		trap.set(target, 'sample', 'hello, world!');
		t.deepEqual(trap.get(target, 'sample'), 'hello, world!', `${name}: sample is "hello, world!"`);

		trap.set(target, 'sample', 'hello');
		t.deepEqual(trap.get(target, 'sample'), 'hello', `${name}: sample is "hello"`);

		trap.set(target, 'three', 333);
		t.deepEqual(trap.get(target, 'three'), 333, `${name}: three is 333`);
	});

	t.equal(all.findAll({ target }).length, 5, 'new Trap(): has 5 operations');
	t.equal(one.findAll({ target }).length, 2, 'new Trap(true): has 2 operations');

	t.end();
});

test('Domain/Entity/Trap - commit', (t) => {
	const [all, one] = runner((trap, name) => {
		const target: any = { three: 3, four: 4 };

		trap.defineProperty(target, 'one', { value: 1, enumerable: true });
		trap.defineProperty(target, 'two', { get: () => 2 });
		trap.set(target, 'five', 5);
		trap.deleteProperty(target, 'four');

		trap.commit();

		t.deepEqual(target, { one: 1, three: 3, five: 5 }, `${name}: target is { one: 1, two: 2, three: 3, five: 5 }`);
		t.equal(target.two, 2, `${name}: two is 2 (and hidden from deepEqual)`);
	});

	t.equal(all.findAll({}).length, 0, 'new Trap(): has 0 operations');
	t.equal(one.findAll({}).length, 0, 'new Trap(true): has 0 operations');

	t.end();
});

test('Domain/Entity/Trap - rollback', (t) => {
	const [all, one] = runner((trap, name) => {
		const target: any = { three: 3, four: 4 };

		trap.defineProperty(target, 'one', { value: 1, enumerable: true });
		trap.defineProperty(target, 'two', { get: () => 2 });
		trap.set(target, 'five', 5);
		trap.deleteProperty(target, 'four');

		trap.rollback();

		t.deepEqual(target, { three: 3, four: 4 }, `${name}: target is { three: 3, four: 4 }`);
		t.equal(target.one, undefined, `${name}: one is undefined`);
		t.equal(target.two, undefined, `${name}: two is undefined`);
		t.equal(target.five, undefined, `${name}: five is undefined`);
	});

	t.equal(all.findAll({}).length, 0, 'new Trap(): has 0 operations');
	t.equal(one.findAll({}).length, 0, 'new Trap(true): has 0 operations');

	t.end();
});
