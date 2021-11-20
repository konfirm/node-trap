import test from 'tape';
import { AbstractMutation } from '../../../../source/Domain/Abstract/Mutation';

class TestableAbstractMutation extends AbstractMutation { }

const target = {};
const key = "key";
const value = "value";
const instance = new TestableAbstractMutation(target, key, value);

test("Domain/Abstract/Mutation - implements matches", (t) => {
	t.ok(instance.matches(new Map()));

	t.ok(instance.matches(new Map([["target", target]])));
	t.notOk(instance.matches(new Map([["target", {}]])));

	t.ok(instance.matches(new Map([["key", key]])));
	t.ok(instance.matches(new Map([["key", "key"]])));
	t.notOk(instance.matches(new Map([["key", "diff"]])));

	t.ok(instance.matches(new Map([["value", value]])));
	t.ok(instance.matches(new Map([["value", "value"]])));
	t.notOk(instance.matches(new Map([["value", "diff"]])));

	t.end();
});

test("Domain/Abstract/Mutation - implements apply", (t) => {
	t.throws(() => instance.apply(), /Not implemented/)

	t.end();
});

test("Domain/Abstract/Mutation - provides name", (t) => {
	t.equal(instance.name, "testable-abstract-mutation");

	t.end();
});

test("Domain/Abstract/Mutation - provides target", (t) => {
	t.equal(instance.target, target);

	t.end();
});

test("Domain/Abstract/Mutation - provides key", (t) => {
	t.equal(instance.key, key);

	t.end();
});

test("Domain/Abstract/Mutation - provides value", (t) => {
	t.equal(instance.value, value);

	t.end();
});

test("Domain/Abstract/Mutation - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function');
	t.equal(instance.toString(), "testable-abstract-mutation: key");
	t.equal(String(instance), "testable-abstract-mutation: key");

	t.end();
});

test("Domain/Abstract/Mutation - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function');
	t.deepEqual(instance.toJSON(), {
		name: "testable-abstract-mutation",
		key
	});
	t.equal(JSON.stringify(instance), '{"name":"testable-abstract-mutation","key":"key"}');

	t.end();
});
