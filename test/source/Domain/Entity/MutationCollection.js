/* global source, describe, it, each, expect */

const AbstractMutation = source('Domain/Abstract/Mutation');
const Value = source('Domain/ValueObject/Mutation/Value');
const Deletion = source('Domain/ValueObject/Mutation/Deletion');
const Property = source('Domain/ValueObject/Mutation/Property');
const MutationCollection = source('Domain/Entity/MutationCollection');
const InvalidTypeError = source('Domain/Error/InvalidType');

class Custom extends AbstractMutation { }

describe('MutationCollection', () => {
	it('is an Array', (next) => {
		expect(MutationCollection.prototype).to.be.instanceOf(Array);
		expect(new MutationCollection()).to.be.instanceOf(Array);

		next();
	});

	describe('validation', () => {
		const instance = new MutationCollection();

		each`
			type              | value                   | validity
			------------------|-------------------------|----------
			AbstractMutation  | ${new AbstractMutation} | valid
			ValueMutation     | ${new Value()}          | valid
			DeletionMutation  | ${new Deletion()}       | valid
			PropertyMutation  | ${new Property()}       | valid
			CustomMutation    | ${new Custom()}         | valid
			Boolean (true)    | ${true}                 | invalid
			Boolean (false)   | ${false}                | invalid
			Number (0)        | ${0}                    | invalid
			Number (7)        | ${7}                    | invalid
			Number (Math.PI)  | ${Math.PI}              | invalid
			Number (Infinity) | ${Infinity}             | invalid
			String ('foo')    | ${'foo'}                | invalid
			NULL              | ${null}                 | invalid

		`('$type $value is $validity', ({ value, validity }, next) => {
			const valid = (validity === 'valid');

			expect(MutationCollection.valid(value)).to.equal(valid);
			expect(instance.validate(value)).to.equal(valid);

			next();
		});
	});

	describe('instance', () => {
		it('cannot be seeded with values', (next) => {
			expect(new MutationCollection(0, 1, 2, 3)).to.be.length(0);

			next();
		});


		it('implements push', (next) => {
			const instance = new MutationCollection();
			instance.push(new Value());
			instance.push(new Property(), new Deletion());

			expect(() => instance.push('nope')).to.throw(InvalidTypeError);
			expect(() => instance.push('nope', new Value())).to.throw(InvalidTypeError);
			expect(instance).to.have.length(3);

			next();
		});

		it('implements unshift', (next) => {
			const instance = new MutationCollection();
			instance.unshift(new Value());
			instance.unshift(new Property(), new Deletion());

			expect(() => instance.unshift('nope')).to.throw(InvalidTypeError);
			expect(() => instance.unshift('nope', new Value())).to.throw(InvalidTypeError);
			expect(instance).to.have.length(3);

			next();
		});

		it('implements splice', (next) => {
			const instance = new MutationCollection();
			instance.splice(0, 0, new Value());
			instance.splice(1, 0, new Property(), new Deletion());

			expect(() => instance.splice(0, 0, 'nope')).to.throw(InvalidTypeError);
			expect(() => instance.splice(0, 0, 'nope', new Value())).to.throw(InvalidTypeError);
			expect(instance).to.have.length(3);

			next();
		});

		it('implements search', (next) => {
			const instance = new MutationCollection();
			const one = {};
			const two = {};

			instance.push(
				new Value(one, 'a', 'X'),
				new Value(two, 'a', 'X'),
				new Value(one, 'b', 'X')
			);

			expect(instance).to.have.length(3);

			expect(instance.search({ target: one })).to.have.length(2);
			expect(instance.search({ target: two })).to.have.length(1);

			expect(instance.search({ key: 'a' })).to.have.length(2);
			expect(instance.search({ key: 'b' })).to.have.length(1);

			expect(instance.search({ value: 'X' })).to.have.length(3);
			expect(instance.search({ value: 'Y' })).to.have.length(0);

			expect(instance.search({ target: one, key: 'a' })).to.have.length(1);
			expect(instance.search({ target: one, key: 'b' })).to.have.length(1);
			expect(instance.search({ target: two, key: 'a' })).to.have.length(1);
			expect(instance.search({ target: two, key: 'b' })).to.have.length(0);

			expect(instance.search({ key: 'a', value: 'X' })).to.have.length(2);
			expect(instance.search({ key: 'b', value: 'X' })).to.have.length(1);

			next();
		});

		it('implements purge', (next) => {
			const instance = new MutationCollection();
			const one = {};
			const two = {};

			instance.push(
				new Deletion(one, 'a'),
				new Deletion(one, 'b'),
				new Deletion(two, 'a'),
			);

			expect(instance).to.have.length(3);
			expect(instance.purge({ target: one, key: 'b' })).to.equal(1);
			expect(instance).to.have.length(2);

			next();
		});

		it('implements flush', (next) => {
			const instance = new MutationCollection();

			instance.push(
				new Value(),
				new Deletion(),
				new Property()
			);

			expect(instance).to.have.length(3);
			expect(instance.flush()).to.be.undefined();
			expect(instance).to.have.length(0);

			instance.push(
				new Value(),
				new Deletion(),
				new Property()
			);

			expect(instance).to.have.length(3);
			let count = 0;
			expect(instance.flush((mutation) => {
				count += Number(mutation instanceof AbstractMutation);
			})).to.be.undefined();
			expect(instance).to.have.length(0);
			expect(count).to.equal(3);

			next();
		});
	})
});
