import test from 'tape';
import { AbstractMutation } from '../../../../source/Domain/Abstract/Mutation';

class TestableAbstractMutation extends AbstractMutation { }

const target = {};
const key = "key";
const value = "value";
const instance = new TestableAbstractMutation(target, key, value);

test("Domain/Abstract/Mutation - implements matches", (t) => {
	t.ok(instance.matches(new Map()), 'matches new Map()');

	t.ok(instance.matches(new Map([["target", target]])), 'matches new Map([["target", target]])');
	t.notOk(instance.matches(new Map([["target", {}]])), 'does not match new Map([["target", {}]])');

	t.ok(instance.matches(new Map([["key", key]])), 'matches new Map([["key", key]])');
	t.ok(instance.matches(new Map([["key", "key"]])), 'matches new Map([["key", "key"]])');
	t.notOk(instance.matches(new Map([["key", "diff"]])), 'does not match new Map([["key", "diff"]])');

	t.ok(instance.matches(new Map([["value", value]])), 'matches new Map([["value", value]])');
	t.ok(instance.matches(new Map([["value", "value"]])), 'matches new Map([["value", "value"]])');
	t.notOk(instance.matches(new Map([["value", "diff"]])), 'does not match new Map([["value", "diff"]])');

	t.end();
});

test("Domain/Abstract/Mutation - apply throws", (t) => {
	t.throws(() => instance.apply(), /Not implemented/, 'apply is not implemented')

	t.end();
});

test("Domain/Abstract/Mutation - provides properties", (t) => {
	t.equal(instance.name, "testable-abstract-mutation", 'name is "testable-abstract-mutation');
	t.equal(instance.target, target, 'target is the exact target object');
	t.equal(instance.key, key, `key is ${key}`);
	t.equal(instance.value, value, `value is ${value}`);

	t.end();
});

test("Domain/Abstract/Mutation - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function', 'instance.toString is a function');
	t.equal(instance.toString(), "testable-abstract-mutation: key", 'instance.toString() returns "testable-abstract-mutation: key');
	t.equal(String(instance), "testable-abstract-mutation: key", 'String(instance) returns "testable-abstract-mutation: key');

	t.end();
});

test("Domain/Abstract/Mutation - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function', 'instance.toJSON is a function');
	t.deepEqual(instance.toJSON(), {
		name: "testable-abstract-mutation",
		key
	}, 'instance.toJSON() returns {name: "testable-abstract-mutation", key: "key"}');
	t.equal(JSON.stringify(instance), '{"name":"testable-abstract-mutation","key":"key"}', 'toJSON.stringify(instance) returns \'{"name":"testable-abstract-mutation","key":"key"}\'');

	t.end();
});
