import test from "tape";
import { MutationCollection } from "../../../../source/Domain/Entity/MutationCollection";
import { ValueMutation } from "../../../../source/Domain/ValueObject/Mutation/Value";
import { Trap } from '../../../../source/Domain/ValueObject/Trap';

test('Domain/ValueObject/Trap - instance', (t) => {
	const trap = new Trap();
	const implemented = [
		"defineProperty",
		"deleteProperty",
		"get",
		"getOwnPropertyDescriptor",
		"has",
		"ownKeys",
		"set"
	];
	const absent = [
		"apply",
		"construct",
		"getPrototypeOf",
		"isExtensible",
		"preventExtensions",
		"setPrototypeOf"
	];

	t.ok(trap instanceof Trap);

	implemented.forEach(method => {
		t.equal(typeof trap[method], 'function');
	});

	absent.forEach(method => {
		t.equal(typeof trap[method], 'undefined');
	});

	t.end();
});

test('Domain/ValueObject/Trap - Accesses actual values', (t) => {
	const trap = new Trap();
	const tests = [true, false, null, 0, 1, Infinity, -Infinity, ""];

	tests.forEach(test => {
		const target = { test };

		t.ok(trap.has(target, "test"));
		t.equal(trap.get(target, "test"), test);
	});

	t.end();
});

test('Domain/ValueObject/Trap - Simple state changes', (t) => {
	const trap = new Trap();
	const affect = { aaa: "aaa" };

	t.ok(trap.has(affect, "aaa"));
	t.equal(trap.get(affect, "aaa"), "aaa");
	t.ok("aaa" in affect);
	t.equal(affect.aaa, "aaa");

	t.notOk(trap.has(affect, "bbb"));
	t.equal(trap.get(affect, "bbb"), undefined);
	t.notOk("bbb" in affect);

	t.ok(trap.set(affect, "bbb", "added"));

	t.ok(trap.has(affect, "aaa"));
	t.equal(trap.get(affect, "aaa"), "aaa");
	t.ok(trap.has(affect, "bbb"));
	t.equal(trap.get(affect, "bbb"), "added");

	t.ok("aaa" in affect);
	t.equal(affect.aaa, "aaa");
	t.notOk("bbb" in affect);

	t.ok(trap.deleteProperty(affect, "aaa"));
	t.notOk(trap.has(affect, "aaa"));
	t.equal(trap.get(affect, "aaa"), undefined);
	t.ok(trap.has(affect, "bbb"));
	t.equal(trap.get(affect, "bbb"), "added");

	t.end();
});

test('Domain/ValueObject/Trap - add mutations (default)', (t) => {
	const trap = new Trap();
	const affect = { foo: "bar" };

	t.equal(affect.foo, "bar");
	t.equal(trap.mutations.length, 0);

	trap.set(affect, "foo", "baz");

	t.equal(trap.get(affect, "foo"), "baz");
	t.equal(trap.mutations.length, 1);

	trap.set(affect, "foo", "bar");

	t.equal(trap.get(affect, "foo"), "bar");
	t.equal(trap.mutations.length, 2);

	t.end();
});

test('Domain/ValueObject/Trap - add mutations (explicit)', (t) => {
	const trap = new Trap(false);
	const affect = { foo: "bar" };

	t.equal(affect.foo, "bar");
	t.equal(trap.mutations.length, 0);

	trap.set(affect, "foo", "baz");

	t.equal(trap.get(affect, "foo"), "baz");
	t.equal(trap.mutations.length, 1);

	trap.set(affect, "foo", "bar");

	t.equal(trap.get(affect, "foo"), "bar");
	t.equal(trap.mutations.length, 2);

	t.end();
});

test('Domain/ValueObject/Trap - only last mutations', (t) => {
	const trap = new Trap(true);
	const affect = { foo: "bar" };

	t.equal(affect.foo, "bar");
	t.equal(trap.mutations.length, 0);

	trap.set(affect, "foo", "baz");

	t.equal(trap.get(affect, "foo"), "baz");
	t.equal(trap.mutations.length, 1);

	trap.set(affect, "foo", "bar");

	t.equal(trap.get(affect, "foo"), "bar");
	t.equal(trap.mutations.length, 0);

	t.end();
});

test('Domain/ValueObject/Trap - mutations are reflected by the mutations property', (t) => {
	const trap = new Trap();
	const affect = {};

	t.ok(trap.mutations instanceof MutationCollection);
	t.equal(trap.mutations.length, 0);

	t.ok(trap.set(affect, "foo", "bar"));

	t.equal(trap.mutations.length, 1);

	const [mutation] = trap.mutations;

	t.equal(mutation.key, "foo");
	t.equal(mutation.value, "bar");
	t.equal(mutation.target, affect);
	t.ok(mutation instanceof ValueMutation);
	t.deepEqual(Object.keys(affect), []);

	t.end();
});

test('Domain/ValueObject/Trap - provides all available keys', (t) => {
	const trap = new Trap();
	const affect = { aaa: "AAA" };

	const initial = trap.ownKeys(affect);

	t.ok(Array.isArray(initial));
	t.equal(initial.length, 1);
	t.equal(initial[0], "aaa");

	t.ok(trap.mutations instanceof MutationCollection);
	t.equal(trap.mutations.length, 0);

	t.ok(trap.set(affect, "hello", "world"));

	const keys = trap.ownKeys(affect);

	t.ok(Array.isArray(keys));
	t.equal(keys.length, 2);
	t.equal(keys[0], "aaa");
	t.equal(keys[1], "hello");

	t.ok(trap.mutations instanceof MutationCollection);
	t.equal(trap.mutations.length, 1);
	t.equal(Object.keys(affect).length, 1);

	t.end();
});

test('Domain/ValueObject/Trap - obtains descriptions', (t) => {
	const trap = new Trap();
	const affect = { aaa: "AAA" };

	const own = Object.getOwnPropertyDescriptor(affect, "aaa");
	t.deepEqual(own, {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "AAA"
	});

	const trapped = trap.getOwnPropertyDescriptor(affect, "aaa");
	t.deepEqual(trapped, {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "AAA"
	});

	const before = trap.getOwnPropertyDescriptor(affect, "hello");
	t.equal(before, undefined);

	t.ok(trap.set(affect, "hello", "world"));

	const after = trap.getOwnPropertyDescriptor(affect, "hello");
	t.deepEqual(after, {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "world"
	});

	t.end();
});

test('Domain/ValueObject/Trap - it searches for mutations', (t) => {
	const trap = new Trap();
	const affect = {};

	t.equal(typeof trap.search, 'function');

	const initial = trap.search({ key: "foo" });
	t.ok(Array.isArray(initial));
	t.equal(initial.length, 0);

	t.ok(trap.set(affect, "foo", "bar"));

	const list = trap.search({ key: "foo" });

	t.ok(Array.isArray(list));
	t.equal(list.length, 1);

	const none = trap.search({ none: "bar" });

	t.ok(Array.isArray(none));
	t.equal(none.length, 0);

	t.end();
});

test('Domain/ValueObject/Trap - rolls back mutations', (t) => {
	const trap = new Trap();
	const affect = { aaa: "AAA" };

	t.equal(trap.mutations.length, 0);
	t.ok(trap.has(affect, "aaa"));
	t.notOk(trap.has(affect, "bbb"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.set(affect, "bbb", "BBB");

	t.equal(trap.mutations.length, 1);
	t.ok(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.set(affect, "ccc", "BBB");

	t.equal(trap.mutations.length, 2);
	t.ok(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.ok(trap.has(affect, "ccc"));
	t.deepEqual(affect, { aaa: "AAA" });

	t.ok(trap.deleteProperty(affect, "aaa"));

	t.equal(trap.mutations.length, 3);
	t.notOk(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.ok(trap.has(affect, "ccc"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.rollback();

	t.equal(trap.mutations.length, 0);
	t.deepEqual(affect, { aaa: "AAA" });

	trap.commit();

	t.equal(trap.mutations.length, 0);
	t.deepEqual(affect, { aaa: "AAA" });

	t.end();
});

test('Domain/ValueObject/Trap - commits mutations', (t) => {
	const trap = new Trap();
	const affect = { aaa: "AAA" };

	t.equal(trap.mutations.length, 0);
	t.ok(trap.has(affect, "aaa"));
	t.notOk(trap.has(affect, "bbb"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.set(affect, "bbb", "BBB");

	t.equal(trap.mutations.length, 1);
	t.ok(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.set(affect, "ccc", "CCC");

	t.equal(trap.mutations.length, 2);
	t.ok(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.ok(trap.has(affect, "ccc"));
	t.deepEqual(affect, { aaa: "AAA" });

	t.ok(trap.deleteProperty(affect, "aaa"));

	t.equal(trap.mutations.length, 3);
	t.notOk(trap.has(affect, "aaa"));
	t.ok(trap.has(affect, "bbb"));
	t.ok(trap.has(affect, "ccc"));
	t.deepEqual(affect, { aaa: "AAA" });

	trap.commit();

	t.equal(trap.mutations.length, 0);
	t.deepEqual(affect, { bbb: "BBB", ccc: "CCC" });

	trap.rollback();

	t.equal(trap.mutations.length, 0);
	t.deepEqual(affect, { bbb: "BBB", ccc: "CCC" });

	t.end();
});

test('Domain/ValueObject/Trap - redefines properties', (t) => {
	const trap = new Trap();
	const affect = { aaa: "AAA" };

	t.ok(trap.defineProperty(affect, "bbb", { value: "BBB" }));

	t.equal(trap.mutations.length, 1);

	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "bbb"), {
		configurable: false,
		enumerable: false,
		writable: false,
		value: "BBB"
	});
	t.equal(Object.getOwnPropertyDescriptor(affect, "bbb"), undefined);

	trap.commit();

	t.deepEqual(Object.getOwnPropertyDescriptor(affect, "bbb"), {
		configurable: false,
		enumerable: false,
		writable: false,
		value: "BBB"
	});
	t.equal((affect as any).bbb, "BBB");

	t.ok(trap.set(affect, "ccc", "CCC"));

	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ccc"), {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "CCC"
	});
	t.equal(Object.getOwnPropertyDescriptor(affect, "ccc"), undefined);

	trap.commit();

	t.deepEqual(Object.getOwnPropertyDescriptor(affect, "ccc"), {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "CCC"
	});
	t.equal((affect as any).ccc, "CCC");


	t.ok(trap.set(affect, "ddd", "set"));

	t.ok(trap.ownKeys(affect).includes("ddd"));
	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ddd"), {
		configurable: true,
		enumerable: true,
		writable: true,
		value: "set"
	});

	trap.defineProperty(affect, "ddd", { value: "defined" });

	t.ok(trap.ownKeys(affect).includes("ddd"));
	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ddd"), {
		configurable: false,
		enumerable: true,
		writable: false,
		value: "defined"
	});

	t.ok(trap.deleteProperty(affect, "ddd"));
	t.notOk("ddd" in trap.ownKeys(affect));

	trap.defineProperty(affect, "ddd", { value: "restored" })
	t.notOk(trap.ownKeys(affect).includes("ddd"));

	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ddd"), {
		configurable: false,
		enumerable: false,
		writable: false,
		value: "restored"
	});

	trap.defineProperty(affect, "ddd", {
		value: "restored-enumerable",
		enumerable: true
	});

	t.ok(trap.ownKeys(affect).includes("ddd"));
	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ddd"), {
		configurable: false,
		enumerable: true,
		writable: false,
		value: "restored-enumerable"
	});

	t.ok(trap.set(affect, "ddd", "set"));
	t.ok(trap.ownKeys(affect).includes("ddd"));

	t.deepEqual(trap.getOwnPropertyDescriptor(affect, "ddd"), {
		configurable: false,
		enumerable: true,
		writable: false,
		value: "set"
	});

	t.end();
});
