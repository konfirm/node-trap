import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { DeletionMutation } from '../../../../../source/Domain/ValueObject/Mutation/Deletion';

test("Domain/ValueObject/Mutation/Deletion - creates instances", (t) => {
	const mutation = new DeletionMutation();

	t.ok(mutation instanceof DeletionMutation);
	t.ok(mutation instanceof AbstractMutation);
	t.equal(mutation.name, "deletion-mutation");
	t.equal(typeof mutation.target, 'undefined');
	t.equal(typeof mutation.key, 'undefined');
	t.equal(typeof mutation.value, 'undefined');
	t.ok(mutation.matches(new Map()));

	t.end();
});

const target = { hello: null };
const key = "hello";
const instance = new DeletionMutation(target, key);

test("Domain/ValueObject/Mutation/Deletion - implements matches", (t) => {
	t.ok(instance.matches(new Map()));

	t.ok(instance.matches(new Map([["target", target]])));
	t.notOk(instance.matches(new Map([["target", {}]])));

	t.ok(instance.matches(new Map([["key", key]])));
	t.ok(instance.matches(new Map([["key", "hello"]])));
	t.notOk(instance.matches(new Map([["key", "diff"]])));

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements apply", (t) => {
	t.equal(target.hello, null);
	t.ok("hello" in target);

	instance.apply();

	t.equal(target.hello, undefined);
	t.notOk("hello" in target);

	//  multiple applications have no side-effects
	instance.apply();

	t.equal(target.hello, undefined);
	t.notOk("hello" in target);

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - provides name", (t) => {
	t.equal(instance.name, "deletion-mutation");

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - provides target", (t) => {
	t.equal(instance.target, target);

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - provides key", (t) => {
	t.equal(instance.key, key);

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - provides value", (t) => {
	t.equal(instance.value, undefined);

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function');
	t.equal(instance.toString(), "deletion-mutation: hello");
	t.equal(String(instance), "deletion-mutation: hello");

	t.end();
});

test("Domain/ValueObject/Mutation/Deletion - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function');
	t.deepEqual(instance.toJSON(), {
		name: "deletion-mutation",
		key
	});
	t.equal(JSON.stringify(instance), '{"name":"deletion-mutation","key":"hello"}');

	t.end();
});
