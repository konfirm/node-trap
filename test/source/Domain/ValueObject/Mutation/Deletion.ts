import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { DeletionMutation } from '../../../../../source/Domain/ValueObject/Mutation/Deletion';

test("Domain/ValueObject/Mutation/Deletion - creates instances", (t) => {
	const mutation = new DeletionMutation();

	t.ok(mutation instanceof DeletionMutation, 'is an instance of DeletionMutation');
	t.ok(mutation instanceof AbstractMutation, 'is an instance of AbstractMutation');
	t.equal(mutation.name, "deletion-mutation", 'has name "deletion-mutation"');
	t.equal(typeof mutation.target, 'undefined', 'target is undefined');
	t.equal(typeof mutation.key, 'undefined', 'key is undefined');
	t.equal(typeof mutation.value, 'undefined', 'value is undefined');
	t.ok(mutation.matches(new Map()), 'matches new Map()');

	t.end();
});

const target = { hello: null };
const key = "hello";
const instance = new DeletionMutation(target, key);

test("Domain/ValueObject/Mutation/Deletion - implements matches", (t) => {
	t.ok(instance.matches(new Map()), 'matches new Map()');

	t.ok(instance.matches(new Map([["target", target]])), 'matches new Map([["target", target]])');
	t.notOk(instance.matches(new Map([["target", {}]])), 'matches new Map([["target", {}]])');

	t.ok(instance.matches(new Map([["key", key]])), 'matches new Map([["key", key]])');
	t.ok(instance.matches(new Map([["key", "hello"]])), 'matches new Map([["key", "hello"]])');
	t.notOk(instance.matches(new Map([["key", "diff"]])), 'matches new Map([["key", "diff"]])');

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements apply", (t) => {
	t.equal(target.hello, null, 'target.hello is null');
	t.ok("hello" in target, 'target contains hello');

	instance.apply();

	t.equal(target.hello, undefined, 'target.hello is undefined');
	t.notOk("hello" in target, 'target does not contain hello');

	//  multiple applications have no side-effects
	instance.apply();

	t.equal(target.hello, undefined, 'target.hello remains undefined');
	t.notOk("hello" in target, 'target still has hello');

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - provides properties", (t) => {
	t.equal(instance.name, "deletion-mutation", 'instance.name is "deletion-mutation"');
	t.equal(instance.target, target, 'instance.target is target');
	t.equal(instance.key, key, 'instance.key is "hello"');
	t.equal(instance.value, undefined, 'instance.value is undefined');

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function', 'has toString function');
	t.equal(instance.toString(), "deletion-mutation: hello", 'instance.toString() return "deletion-mutation: hello"');
	t.equal(String(instance), "deletion-mutation: hello", 'String(instance) is "deletion-mutation: hello"');

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function', 'has toJSON function');
	t.deepEqual(instance.toJSON(), {
		name: "deletion-mutation",
		key
	}, 'instance.toJSON() returns {name:"deletion-mutation",key:"hello"}');
	t.equal(JSON.stringify(instance), '{"name":"deletion-mutation","key":"hello"}', 'JSON.stringify(instance) returns \'{"name":"deletion-mutation","key":"hello"}\'');

	t.end();
});
