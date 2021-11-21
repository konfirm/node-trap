import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { PropertyMutation } from '../../../../../source/Domain/ValueObject/Mutation/Property';

test("Domain/ValueObject/Mutation/Property - creates instances", (t) => {
	const mutation = new PropertyMutation();

	t.ok(mutation instanceof PropertyMutation, 'is an instance of PropertyMutation');
	t.ok(mutation instanceof AbstractMutation, 'is an instance of AbstractMutation');
	t.equal(mutation.name, "property-mutation", 'has name "property-mutation"');
	t.equal(typeof mutation.target, 'undefined', 'target is undefined');
	t.equal(typeof mutation.key, 'undefined', 'key is undefined');
	t.equal(typeof mutation.value, 'undefined', 'value is undefined');
	t.ok(mutation.matches(new Map()), 'matches new Map()');

	t.end();
});

const target = {};
const key = "hello";
const value = { get: () => "applied" };
const instance = new PropertyMutation(target, key, value);

test("Domain/ValueObject/Mutation/Property - implements matches", (t) => {
	t.ok(instance.matches(new Map()), 'matches new Map()');

	t.ok(instance.matches(new Map([["target", target]])), 'matches new Map([["target", target]])');
	t.notOk(instance.matches(new Map([["target", {}]])), 'matches new Map([["target", {}]])');

	t.ok(instance.matches(new Map([["key", key]])), 'matches new Map([["key", key]])');
	t.ok(instance.matches(new Map([["key", "hello"]])), 'matches new Map([["key", "hello"]])');
	t.notOk(instance.matches(new Map([["key", "diff"]])), 'matches new Map([["key", "diff"]])');

	t.ok(instance.matches(new Map([["value", value]])), 'matches new Map([["value", value]])');
	t.notOk(instance.matches(new Map([["value", "diff"]])), 'matches new Map([["value", "diff"]])');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements apply", (t) => {
	t.equal((target as any).hello, undefined, 'target.hello is undefined');
	t.notOk("hello" in target, 'target does not contain hello');

	instance.apply();

	t.equal((target as any).hello, "applied", 'target.hello is "applied"');
	t.ok("hello" in target, 'target contains hello');
	t.notOk(Object.keys(target).includes("hello"), 'target keys includes "hello"');

	//  multiple applications have no side-effects
	instance.apply();

	t.equal((target as any).hello, "applied", 'target.hello is still "applied"');
	t.ok("hello" in target, 'target still contains hello');
	t.notOk(Object.keys(target).includes("hello"), 'target keys still includes "hello"');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - provides properties", (t) => {
	t.equal(instance.name, "property-mutation", 'instance.name is "property-mutation"');
	t.equal(instance.target, target, 'instance.target is target');
	t.equal(instance.key, key, 'instance.key is "hello"');
	t.equal(instance.value, "applied", 'instance.value is "applied"');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function', 'has toString function');
	t.equal(instance.toString(), "property-mutation: hello", 'instance.toString() returns "property-mutation: hello"');
	t.equal(String(instance), "property-mutation: hello", 'String(instance) is "property-mutation: hello"');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function', 'has toJSON function');
	t.deepEqual(instance.toJSON(), {
		name: "property-mutation",
		key
	}, 'instance.toJSON() returns {name:"property-mutation",key:"hello"}');
	t.equal(JSON.stringify(instance), '{"name":"property-mutation","key":"hello"}', 'JSON.stringify(instance) returns \'{"name":"property-mutation","key":"hello"}\'');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - value", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		value: "modified"
	});

	t.equal(target[key], "unmodified", 'target.key is "unmodified"');

	instance.apply();

	const descriptor = Object.getOwnPropertyDescriptor(
		target,
		key
	);

	t.equal(target[key], "modified", 'target.key now is "modified"');
	t.equal(descriptor.value, "modified", 'descriptor.value is "modified"');
	t.ok(descriptor.enumerable, 'descriptor.enumerable is true');
	t.ok(descriptor.configurable, 'descriptor.configurable is true');
	t.ok(descriptor.writable, 'descriptor.writable is true');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - enumerable", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		enumerable: false
	});

	t.ok(Object.keys(target).includes(key), 'target keys include "key"');

	instance.apply();

	t.notOk(Object.keys(target).includes(key), 'target keys no longer includes "key"');

	t.end();
});

test("Domain/ValueObject/Mutation/Property - writable", (t) => {
	const target = { key: "unmodified" };
	const key = "key";
	const instance = new PropertyMutation(target, key, {
		writable: false
	});

	t.equal(target[key], "unmodified", 'target.key is "unmodified"');
	target[key] = "modified";
	t.equal(target[key], "modified", 'target.key is "modified"');

	instance.apply();

	t.equal(target[key], "modified", 'target.key is "modified"');
	try {
		target[key] = "not modified again";
	}
	catch (error) { }

	t.equal(target[key], "modified", 'target.key is still "modified"');

	t.end();
});
