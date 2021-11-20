import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { PropertyMutation } from '../../../../../source/Domain/ValueObject/Mutation/Property';

test("Domain/ValueObject/Mutation/Property - creates instances", (t) => {
	const mutation = new PropertyMutation();

	t.ok(mutation instanceof PropertyMutation);
	t.ok(mutation instanceof AbstractMutation);
	t.equal(mutation.name, "property-mutation");
	t.equal(mutation.target, undefined);
	t.equal(mutation.key, undefined);
	t.equal(mutation.value, undefined);
	t.ok(mutation.matches(new Map()));

	t.end();
});

const target = {};
const key = "hello";
const value = { get: () => "applied" };
const instance = new PropertyMutation(target, key, value);

test("Domain/ValueObject/Mutation/Property - implements matches", (t) => {
	t.ok(instance.matches(new Map()));

	t.ok(instance.matches(new Map([["target", target]])));
	t.notOk(instance.matches(new Map([["target", {}]])));

	t.ok(instance.matches(new Map([["key", key]])));
	t.ok(instance.matches(new Map([["key", "hello"]])));
	t.notOk(instance.matches(new Map([["key", "diff"]])));

	t.ok(instance.matches(new Map([["value", value]])));
	t.notOk(instance.matches(new Map([["value", "diff"]])));

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements apply", (t) => {
	t.equal((target as any).hello, undefined);
	t.notOk("hello" in target);

	instance.apply();

	t.equal(typeof (target as any).hello, 'string');
	t.equal((target as any).hello, "applied");
	t.ok("hello" in target);
	t.notOk(Object.keys(target).includes("hello"));

	//  multiple applications have no side-effects
	instance.apply();

	t.equal(typeof (target as any).hello, 'string');
	t.equal((target as any).hello, "applied");
	t.ok("hello" in target);
	t.notOk(Object.keys(target).includes("hello"));

	t.end();
});

test("Domain/ValueObject/Mutation/Property - provides name", (t) => {
	t.equal(instance.name, "property-mutation");

	t.end();
});

test("Domain/ValueObject/Mutation/Property - provides target", (t) => {
	t.equal(instance.target, target);

	t.end();
});

test("Domain/ValueObject/Mutation/Property - provides key", (t) => {
	t.equal(instance.key, key);

	t.end();
});

test("Domain/ValueObject/Mutation/Property - provides value", (t) => {
	t.equal(instance.value, "applied");

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function');
	t.equal(instance.toString(), "property-mutation: hello");
	t.equal(String(instance), "property-mutation: hello");

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function');
	t.deepEqual(instance.toJSON(), {
		name: "property-mutation",
		key
	});
	t.equal(JSON.stringify(instance), '{"name":"property-mutation","key":"hello"}');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - value", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		value: "modified"
	});

	t.equal(target[key], "unmodified");

	instance.apply();

	const descriptor = Object.getOwnPropertyDescriptor(
		target,
		key
	);

	t.equal(target[key], "modified");
	t.equal(descriptor.value, "modified");
	t.ok(descriptor.enumerable);
	t.ok(descriptor.configurable);
	t.ok(descriptor.writable);

	t.end();
});

test("Domain/ValueObject/Mutation/Property - enumerable", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		enumerable: false
	});

	t.ok(Object.keys(target).includes(key));

	instance.apply();

	t.notOk(Object.keys(target).includes(key));

	t.end();
});

test("Domain/ValueObject/Mutation/Property - writable", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		writable: false
	});

	t.equal(target[key], "unmodified");
	target[key] = "modified";
	t.equal(target[key], "modified");

	instance.apply();

	t.equal(target[key], "modified");
	try {
		target[key] = "not modified again";
	}
	catch (error) { }

	t.equal(target[key], "modified");

	t.end();
});
