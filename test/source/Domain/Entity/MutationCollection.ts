import test from 'tape';
import each from 'template-literal-each';
import { AbstractMutation } from '../../../../source/Domain/Abstract/Mutation';
import { MutationCollection } from '../../../../source/Domain/Entity/MutationCollection';
import { InvalidTypeError } from '../../../../source/Domain/Error/InvalidType';
import { DeletionMutation } from '../../../../source/Domain/ValueObject/Mutation/Deletion';
import { PropertyMutation } from '../../../../source/Domain/ValueObject/Mutation/Property';
import { ValueMutation } from '../../../../source/Domain/ValueObject/Mutation/Value';

class Custom extends AbstractMutation { }

test('Domain/Entity/MutationCollection - is an Array', (t) => {
	t.ok(MutationCollection.prototype instanceof Array);
	t.ok(new MutationCollection() instanceof Array);

	t.end();
});

test('Domain/Entity/MutationCollection - validation', (t) => {
	const instance = new MutationCollection();

	each`
		type              | value                     | validity
		------------------|---------------------------|----------
		ValueMutation     | ${new ValueMutation()}    | valid
		DeletionMutation  | ${new DeletionMutation()} | valid
		PropertyMutation  | ${new PropertyMutation()} | valid
		CustomMutation    | ${new Custom()}           | valid
		Boolean (true)    | ${true}                   | invalid
		Boolean (false)   | ${false}                  | invalid
		Number (0)        | ${0}                      | invalid
		Number (7)        | ${7}                      | invalid
		Number (Math.PI)  | ${Math.PI}                | invalid
		Number (Infinity) | ${Infinity}               | invalid
		String ('foo')    | ${'foo'}                  | invalid
		NULL              | ${null}                   | invalid
	`(({ type, value, validity }) => {
		const valid = (validity === 'valid');

		t.equal(MutationCollection.valid(value), valid, `MutationCollection.valid ${type} ${value} is ${validity}`);
		t.equal(instance.validate(value), valid, `instance.validate ${type} ${value} is ${validity}`);
	});

	t.end();
});

test('Domain/Entity/MutationCollection - cannot be seeded with values', (t) => {
	t.equal(new (MutationCollection as any)(0, 1, 2, 3).length, 0);

	t.end();
});


test('Domain/Entity/MutationCollection - implements push', (t) => {
	const instance = new MutationCollection();
	instance.push(new ValueMutation());
	instance.push(new PropertyMutation(), new DeletionMutation());

	t.throws(() => instance.push('nope'), InvalidTypeError);
	t.throws(() => instance.push('nope', new ValueMutation()), InvalidTypeError);
	t.equal(instance.length, 3);

	t.end();
});

test('Domain/Entity/MutationCollection - implements unshift', (t) => {
	const instance = new MutationCollection();
	instance.unshift(new ValueMutation());
	instance.unshift(new PropertyMutation(), new DeletionMutation());

	t.throws(() => instance.unshift('nope'), InvalidTypeError);
	t.throws(() => instance.unshift('nope', new ValueMutation()), InvalidTypeError);
	t.equal(instance.length, 3);

	t.end();
});

test('Domain/Entity/MutationCollection - implements splice', (t) => {
	const instance = new MutationCollection();
	instance.splice(0, 0, new ValueMutation());
	instance.splice(1, 0, new PropertyMutation(), new DeletionMutation());

	t.throws(() => instance.splice(0, 0, 'nope'), InvalidTypeError);
	t.throws(() => instance.splice(0, 0, 'nope', new ValueMutation()), InvalidTypeError);
	t.equal(instance.length, 3);

	t.end();
});

test('Domain/Entity/MutationCollection - implements search', (t) => {
	const instance = new MutationCollection();
	const one = {};
	const two = {};

	instance.push(
		new ValueMutation(one, 'a', 'X'),
		new ValueMutation(two, 'a', 'X'),
		new ValueMutation(one, 'b', 'X')
	);

	t.equal(instance.length, 3);

	t.equal(instance.search({ target: one }).length, 2);
	t.equal(instance.search({ target: two }).length, 1);

	t.equal(instance.search({ key: 'a' }).length, 2);
	t.equal(instance.search({ key: 'b' }).length, 1);

	t.equal(instance.search({ value: 'X' }).length, 3);
	t.equal(instance.search({ value: 'Y' }).length, 0);

	t.equal(instance.search({ target: one, key: 'a' }).length, 1);
	t.equal(instance.search({ target: one, key: 'b' }).length, 1);
	t.equal(instance.search({ target: two, key: 'a' }).length, 1);
	t.equal(instance.search({ target: two, key: 'b' }).length, 0);

	t.equal(instance.search({ key: 'a', value: 'X' }).length, 2);
	t.equal(instance.search({ key: 'b', value: 'X' }).length, 1);

	t.end();
});

test('Domain/Entity/MutationCollection - implements purge', (t) => {
	const instance = new MutationCollection();
	const one = {};
	const two = {};

	instance.push(
		new DeletionMutation(one, 'a'),
		new DeletionMutation(one, 'b'),
		new DeletionMutation(two, 'a'),
	);

	t.equal(instance.length, 3);
	t.equal(instance.purge({ target: one, key: 'b' }), 1);
	t.equal(instance.length, 2);

	t.end();
});

test('Domain/Entity/MutationCollection - implements flush', (t) => {
	const instance = new MutationCollection();

	instance.push(
		new ValueMutation(),
		new DeletionMutation(),
		new PropertyMutation()
	);

	t.equal(instance.length, 3);
	t.equal(typeof instance.flush(undefined), 'undefined');
	t.equal(instance.length, 0);
	instance.push(
		new ValueMutation(),
		new DeletionMutation(),
		new PropertyMutation()
	);

	t.equal(instance.length, 3);
	let count = 0;
	t.equal(typeof instance.flush((mutation) => {
		count += Number(mutation instanceof AbstractMutation);
	}), 'undefined');
	t.equal(instance.length, 0);
	t.equal(count, 3);

	t.end();
});
