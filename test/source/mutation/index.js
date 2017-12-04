/* global source, describe, it, expect */

const types = source('mutation');
const { Mutation, Deletion, Property } = types;

describe('Mutations', () => {
	it('exports types', (next) => {
		expect(types).to.contain('Mutation');
		expect(types).to.contain('Deletion');
		expect(types).to.contain('Property');

		next();
	});

	describe('Mutation', () => {
		it('creates instances', (next) => {
			const mutation = new Mutation();

			expect(mutation).to.be.instanceOf(Mutation);
			expect(mutation.name).to.equal('mutation');
			expect(mutation.target).to.be.undefined();
			expect(mutation.key).to.be.undefined();
			expect(mutation.value).to.be.undefined();
			expect(mutation.matches(new Map())).to.be.true();

			next();
		});

		it('represents instances as string and JSON', (next) => {
			const mutation = new Mutation({}, 'hello', 'world');

			expect(String(mutation)).to.equal('mutation: hello = world');
			expect(String(mutation)).to.equal(mutation.toString());

			expect(JSON.stringify(mutation)).to.equal('{"name":"mutation","key":"hello","value":"world"}');
			expect(mutation.toJSON()).to.equal({ name: 'mutation', key: 'hello', value: 'world' });

			next();
		});
	});

	describe('Deletion', () => {
		it('creates instances', (next) => {
			const deletion = new Deletion();

			expect(deletion).to.be.instanceOf(Deletion);
			expect(deletion).to.be.instanceOf(Mutation);
			expect(deletion.name).to.equal('deletion');
			expect(deletion.target).to.be.undefined();
			expect(deletion.key).to.be.undefined();
			expect(deletion.value).to.be.undefined();
			expect(deletion.matches(new Map())).to.be.true();

			next();
		});

		it('represents instances as string and JSON', (next) => {
			const deletion = new Deletion({}, 'hello');

			expect(String(deletion)).to.equal('deletion: hello');
			expect(String(deletion)).to.equal(deletion.toString());

			expect(JSON.stringify(deletion)).to.equal('{"name":"deletion","key":"hello"}');
			expect(deletion.toJSON()).to.equal({ name: 'deletion', key: 'hello' });

			next();
		});
	});

	describe('Property', () => {
		it('creates instances', (next) => {
			const deletion = new Property();

			expect(deletion).to.be.instanceOf(Property);
			expect(deletion).to.be.instanceOf(Mutation);
			expect(deletion.name).to.equal('property');
			expect(deletion.target).to.be.undefined();
			expect(deletion.key).to.be.undefined();
			expect(deletion.value).to.be.undefined();
			expect(deletion.matches(new Map())).to.be.true();

			next();
		});

		it('represents instances as string and JSON', (next) => {
			const property = new Property({}, 'hello', { value: 'world' });

			expect(String(property)).to.equal('property: hello');
			expect(String(property)).to.equal(property.toString());

			expect(JSON.stringify(property)).to.equal('{"name":"property","key":"hello"}');
			expect(property.toJSON()).to.equal({ name: 'property', key: 'hello' });

			next();
		});
	});
});
