import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { ValueMutation } from '../../../../../source/Domain/ValueObject/Mutation/Value';

test("Domain/ValueObject/Mutation/Value - creates instances", (t) => {
	const mutation = new ValueMutation();

	t.ok(mutation instanceof ValueMutation);
	t.ok(mutation instanceof AbstractMutation);
	t.equal(mutation.name, "value-mutation");
	t.equal(mutation.target, undefined);
	t.equal(mutation.key, undefined);
	t.equal(mutation.value, undefined);
	t.ok(mutation.matches(new Map()));

	t.end();
});

const target = { hello: null };
const key = "hello";
const value = "world";
const instance = new ValueMutation(target, key, value);

test("Domain/ValueObject/Mutation/Value - implements matches", (t) => {
	t.ok(instance.matches(new Map()));

	t.ok(instance.matches(new Map([["target", target]])));
	t.notOk(instance.matches(new Map([["target", {}]])));

	t.ok(instance.matches(new Map([["key", key]])));
	t.ok(instance.matches(new Map([["key", "hello"]])));
	t.notOk(instance.matches(new Map([["key", "diff"]])));

	t.ok(instance.matches(new Map([["value", value]])));
	t.ok(instance.matches(new Map([["value", "world"]])));
	t.notOk(instance.matches(new Map([["value", "diff"]])));

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements apply", (t) => {
	t.equal(target.hello, null);
	instance.apply();
	t.equal(target.hello, value);

	//  multiple applications have no side effects
	instance.apply();
	t.equal(target.hello, value);

	t.end();
});

test("Domain/ValueObject/Mutation/Value - provides name", (t) => {
	t.equal(instance.name, "value-mutation");

	t.end();
});

test("Domain/ValueObject/Mutation/Value - provides target", (t) => {
	t.equal(instance.target, target);

	t.end();
});

test("Domain/ValueObject/Mutation/Value - provides key", (t) => {
	t.equal(instance.key, key);

	t.end();
});

test("Domain/ValueObject/Mutation/Value - provides value", (t) => {
	t.equal(instance.value, value);

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function');
	t.equal(instance.toString(), "value-mutation: hello = world");
	t.equal(String(instance), "value-mutation: hello = world");

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function');
	t.deepEqual(instance.toJSON(), {
		name: "value-mutation",
		key,
		value
	});
	t.equal(JSON.stringify(instance), '{"name":"value-mutation","key":"hello","value":"world"}');

	t.end();
});
