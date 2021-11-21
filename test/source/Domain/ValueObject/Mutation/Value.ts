import test from 'tape';
import { AbstractMutation } from '../../../../../source/Domain/Abstract/Mutation';
import { ValueMutation } from '../../../../../source/Domain/ValueObject/Mutation/Value';

test("Domain/ValueObject/Mutation/Value - creates instances", (t) => {
	const mutation = new ValueMutation();

	t.ok(mutation instanceof ValueMutation, 'is an instance of ValueMutation');
	t.ok(mutation instanceof AbstractMutation, 'is an instance of AbstractMutation');
	t.equal(mutation.name, "value-mutation", 'has name "value-mutation"');
	t.equal(typeof mutation.target, 'undefined', 'target is undefined');
	t.equal(typeof mutation.key, 'undefined', 'key is undefined');
	t.equal(typeof mutation.value, 'undefined', 'value is undefined');
	t.ok(mutation.matches(new Map()), 'matches new Map()');

	t.end();
});

const target = { hello: null };
const key = "hello";
const value = "world";
const instance = new ValueMutation(target, key, value);

test("Domain/ValueObject/Mutation/Value - implements matches", (t) => {
	t.ok(instance.matches(new Map()), 'matches new Map()');

	t.ok(instance.matches(new Map([["target", target]])), 'matches new Map([["target", target]])');
	t.notOk(instance.matches(new Map([["target", {}]])), 'matches new Map([["target", {}]])');

	t.ok(instance.matches(new Map([["key", key]])), 'matches new Map([["key", key]])');
	t.ok(instance.matches(new Map([["key", "hello"]])), 'matches new Map([["key", "hello"]])');
	t.notOk(instance.matches(new Map([["key", "diff"]])), 'matches new Map([["key", "diff"]])');

	t.ok(instance.matches(new Map([["value", value]])), 'matches new Map([["value", value]])');
	t.ok(instance.matches(new Map([["value", "world"]])), 'matches new Map([["value", "world"]])');
	t.notOk(instance.matches(new Map([["value", "diff"]])), 'matches new Map([["value", "diff"]])');

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements apply", (t) => {
	t.equal(target.hello, null, 'target.hello is null');
	instance.apply();
	t.equal(target.hello, value, `target.hello is ${value}`);

	//  multiple applications have no side effects
	instance.apply();
	t.equal(target.hello, value, `target.hello remains ${value}`);

	t.end();
});

test("Domain/ValueObject/Mutation/Value - provides properties", (t) => {
	t.equal(instance.name, "value-mutation", 'instance.name is "value-mutation"');
	t.equal(instance.target, target, 'instance.target is the target');
	t.equal(instance.key, key, 'instance.key is "key"');
	t.equal(instance.value, value, 'instance.value is "value"');

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements toString", (t) => {
	t.equal(typeof instance.toString, 'function', 'has toString function');
	t.equal(instance.toString(), "value-mutation: hello = world", 'instance.toString() returns "value-mutation: hello = world"');
	t.equal(String(instance), "value-mutation: hello = world", 'String(instance) is "value-mutation: hello = world"');

	t.end();
});

test("Domain/ValueObject/Mutation/Value - implements toJSON", (t) => {
	t.equal(typeof instance.toJSON, 'function', 'has toJSON function');
	t.deepEqual(instance.toJSON(), {
		name: "value-mutation",
		key,
		value
	}, 'instance.toJSON() returns {name:"value-mutation",key:"hello",value:"world"}');
	t.equal(JSON.stringify(instance), '{"name":"value-mutation","key":"hello","value":"world"}', 'JSON.stringify(instance) is \'{"name":"value-mutation","key":"hello","value":"world"}\'');

	t.end();
});
