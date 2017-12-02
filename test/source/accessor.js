/* global source, describe, it, expect */

const Accessor = source('accessor');

describe('Accessor', () => {
	describe('new Accessor instance', () => {
		const accessor = new Accessor();
		const affect = {};

		it('is an instance of Accessor', (next) => {
			expect(accessor).to.be.instanceOf(Accessor);

			next();
		});

		[
			'descriptor',
			'keys',
			'contains',
			'getter',
			'setter',
		].forEach((method) => {
			it(`has a method ${ method }, which returns a function`, (next) => {
				expect(accessor[method]).to.be.a.function();
				expect(accessor[method]()).to.be.a.function();

				next();
			});
		});

		it('provides a unique handler', (next) => {
			const access = new Accessor();
			const one = access.handler;
			const two = access.handler;
			const subject = { aaa: 'AAA' };

			expect(one).to.not.shallow.equal(two);

			[
				'get',
				'set',
				'has',
				'ownKeys',
				'getOwnPropertyDescriptor',
			].forEach((key) => {
				expect(one).to.contain(key);
				expect(two).to.contain(key);

				expect(one[key]).to.be.a.function();
				expect(two[key]).to.be.a.function();
			});

			expect(one.get(subject, 'aaa')).to.be.string();
			expect(one.get(subject, 'aaa')).to.equal('AAA');
			expect(one.has(subject, 'aaa')).to.be.true();

			expect(one.get(subject, 'bbb')).to.be.undefined();
			expect(one.has(subject, 'bbb')).to.be.false();

			one.set(subject, 'bbb', 'BBB');

			expect(one.get(subject, 'bbb')).to.be.string();
			expect(one.get(subject, 'bbb')).to.equal('BBB');
			expect(one.has(subject, 'bbb')).to.be.true();

			next();
		});

		it('mutations are reflected by the mutations property', (next) => {
			expect(accessor.mutations).to.be.an.array();
			expect(accessor.mutations).to.be.length(0);

			const setter = accessor.setter();
			setter(affect, 'foo', 'bar');

			expect(accessor.mutations).to.be.length(1);

			const [ mutation ] = accessor.mutations;

			expect(mutation).to.contain('key');
			expect(mutation).to.contain('value');
			expect(mutation).to.contain('target');

			expect(mutation.key).to.equal('foo');
			expect(mutation.value).to.equal('bar');
			expect(mutation.target).to.shallow.equal(affect);
			expect(Object.keys(affect)).to.equal([]);

			next();
		});

		it('searches for mutations', (next) => {
			expect(accessor.search).to.be.a.function();
			expect(accessor.searchOne).to.be.a.function();

			const one = accessor.searchOne({ key: 'foo' });
			const listOne = accessor.search({ key: 'foo' });

			expect(one).to.be.an.object();
			expect(listOne).to.be.an.array();
			expect(listOne).to.be.length(1);
			expect(listOne[0]).to.shallow.equal(one);
			expect(one).to.contain('key');
			expect(one.key).to.equal('foo');

			const none = accessor.searchOne({ none: 'bar' });
			const listNone = accessor.search({ none: 'bar' });

			expect(none).to.be.undefined();
			expect(listNone).to.be.an.array();
			expect(listNone).to.be.length(0);

			next();
		});

		it('rolls back any prepared mutation', (next) => {
			expect(accessor.mutations).to.be.length(1);
			expect(affect).to.equal({});

			accessor.rollback();

			expect(accessor.mutations).to.be.length(0);
			expect(affect).to.equal({});

			accessor.commit();

			expect(accessor.mutations).to.be.length(0);
			expect(affect).to.equal({});

			next();
		});

		it('commits any prepared mutation', (next) => {
			expect(accessor.mutations).to.be.length(0);
			expect(affect).to.equal({});

			const setter = accessor.setter();
			setter(affect, 'hello', 'world');

			expect(accessor.mutations).to.be.length(1);
			expect(affect).to.equal({});

			accessor.commit();

			expect(accessor.mutations).to.be.length(0);
			expect(affect).to.equal({ hello: 'world' });

			accessor.rollback();

			expect(accessor.mutations).to.be.length(0);
			expect(affect).to.equal({ hello: 'world' });

			next();
		});
	});
});
