/* global source, describe, it, expect */

const Trap = source('trap');
const { Mutation } = source('mutation');

describe('Trap', () => {
	describe('new Trap instance', () => {
		const trap = new Trap();
		const implemented = [
			'defineProperty',
			'deleteProperty',
			'get',
			'getOwnPropertyDescriptor',
			'has',
			'ownKeys',
			'set',
		];
		const absent = [
			'apply',
			'construct',
			'getPrototypeOf',
			'isExtensible',
			'preventExtensions',
			'setPrototypeOf',
		];


		it('is an instance of Trap', (next) => {
			expect(trap).to.be.instanceOf(Trap);

			next();
		});

		implemented.forEach((method) => {
			it(`has a method ${ method }`, (next) => {
				expect(trap[method]).to.be.a.function();

				next();
			});
		});

		absent.forEach((method) => {
			it(`does not have a method ${ method }`, (next) => {
				expect(trap[method]).to.be.a.undefined();

				next();
			});
		});
	});

	describe('Simple state changes', () => {
		it('tracks changes', (next) => {
			const trap = new Trap();
			const affect = { aaa: 'aaa' };

			expect(trap.has(affect, 'aaa')).to.be.true();
			expect(trap.get(affect, 'aaa')).to.equal('aaa');
			expect(affect).to.contain('aaa');
			expect(affect.aaa).to.equal('aaa');

			expect(trap.has(affect, 'bbb')).to.be.false();
			expect(trap.get(affect, 'bbb')).to.be.undefined();
			expect(affect).not.to.contain('bbb');

			trap.set(affect, 'bbb', 'added');

			expect(trap.has(affect, 'aaa')).to.be.true();
			expect(trap.get(affect, 'aaa')).to.equal('aaa');
			expect(trap.has(affect, 'bbb')).to.be.true();
			expect(trap.get(affect, 'bbb')).to.equal('added');

			expect(affect).to.contain('aaa');
			expect(affect.aaa).to.equal('aaa');
			expect(affect).not.to.contain('bbb');

			trap.deleteProperty(affect, 'aaa');
			expect(trap.has(affect, 'aaa')).to.be.false();
			expect(trap.get(affect, 'aaa')).to.be.undefined();
			expect(trap.has(affect, 'bbb')).to.be.true();
			expect(trap.get(affect, 'bbb')).to.equal('added');
			next();
		});

		it('mutations are reflected by the mutations property', (next) => {
			const trap = new Trap();
			const affect = {};

			expect(trap.mutations).to.be.an.array();
			expect(trap.mutations).to.be.length(0);

			trap.set(affect, 'foo', 'bar');

			expect(trap.mutations).to.be.length(1);

			const [ mutation ] = trap.mutations;

			expect(mutation.key).to.equal('foo');
			expect(mutation.value).to.equal('bar');
			expect(mutation.target).to.shallow.equal(affect);
			expect(mutation).to.be.instanceOf(Mutation);
			expect(Object.keys(affect)).to.equal([]);

			next();
		});

		it('provides all available keys', (next) => {
			const trap = new Trap();
			const affect = { aaa: 'AAA' };

			const initial = trap.ownKeys(affect);

			expect(initial).to.be.an.array();
			expect(initial).to.be.length(1);
			expect(initial[0]).to.equal('aaa');

			expect(trap.mutations).to.be.an.array();
			expect(trap.mutations).to.be.length(0);

			trap.set(affect, 'hello', 'world');

			const keys = trap.ownKeys(affect);

			expect(keys).to.be.an.array();
			expect(keys).to.be.length(2);
			expect(keys[0]).to.equal('aaa');
			expect(keys[1]).to.equal('hello');

			expect(trap.mutations).to.be.an.array();
			expect(trap.mutations).to.be.length(1);
			expect(Object.keys(affect)).to.be.length(1);

			next();
		});

		it('obtains descriptions', (next) => {
			const trap = new Trap();
			const affect = { aaa: 'AAA' };

			const own = Object.getOwnPropertyDescriptor(affect, 'aaa');
			expect(own).to.equal({ configurable: true, enumerable: true, writable: true, value: 'AAA' });

			const trapped = trap.getOwnPropertyDescriptor(affect, 'aaa');
			expect(trapped).to.equal({ configurable: true, enumerable: true, writable: true, value: 'AAA' });

			const before = trap.getOwnPropertyDescriptor(affect, 'hello');
			expect(before).to.be.undefined();

			trap.set(affect, 'hello', 'world');

			const after = trap.getOwnPropertyDescriptor(affect, 'hello');
			expect(after).to.equal({ configurable: true, enumerable: true, writable: true, value: 'world' });

			next();
		});

		it('searches for mutations', (next) => {
			const trap = new Trap();
			const affect = {};

			expect(trap.search).to.be.a.function();

			const initial = trap.search({ key: 'foo' });
			expect(initial).to.be.an.array();
			expect(initial).to.be.length(0);

			trap.set(affect, 'foo', 'bar');

			const list = trap.search({ key: 'foo' });

			expect(list).to.be.an.array();
			expect(list).to.be.length(1);

			const none = trap.search({ none: 'bar' });

			expect(none).to.be.an.array();
			expect(none).to.be.length(0);

			next();
		});
	});

	it('rolls back any prepared mutation', (next) => {
		const trap = new Trap();
		const affect = { aaa: 'AAA' };

		expect(trap.mutations).to.be.length(0);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.false();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.set(affect, 'bbb', 'BBB');

		expect(trap.mutations).to.be.length(1);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.set(affect, 'ccc', 'BBB');

		expect(trap.mutations).to.be.length(2);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(trap.has(affect, 'ccc')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.deleteProperty(affect, 'aaa');

		expect(trap.mutations).to.be.length(3);
		expect(trap.has(affect, 'aaa')).to.be.false();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(trap.has(affect, 'ccc')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.rollback();

		expect(trap.mutations).to.be.length(0);
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.commit();

		expect(trap.mutations).to.be.length(0);
		expect(affect).to.equal({ aaa: 'AAA' });

		next();
	});

	it('commits any prepared mutation', (next) => {
		const trap = new Trap();
		const affect = { aaa: 'AAA' };

		expect(trap.mutations).to.be.length(0);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.false();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.set(affect, 'bbb', 'BBB');

		expect(trap.mutations).to.be.length(1);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.set(affect, 'ccc', 'CCC');

		expect(trap.mutations).to.be.length(2);
		expect(trap.has(affect, 'aaa')).to.be.true();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(trap.has(affect, 'ccc')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.deleteProperty(affect, 'aaa');

		expect(trap.mutations).to.be.length(3);
		expect(trap.has(affect, 'aaa')).to.be.false();
		expect(trap.has(affect, 'bbb')).to.be.true();
		expect(trap.has(affect, 'ccc')).to.be.true();
		expect(affect).to.equal({ aaa: 'AAA' });

		trap.commit();

		expect(trap.mutations).to.be.length(0);
		expect(affect).to.equal({ bbb: 'BBB', ccc: 'CCC' });

		trap.rollback();

		expect(trap.mutations).to.be.length(0);
		expect(affect).to.equal({ bbb: 'BBB', ccc: 'CCC' });

		next();
	});

	describe('Redefine properties', () => {
		const trap = new Trap();
		const affect = { aaa: 'AAA' };

		it('define properties', (next) => {
			trap.defineProperty(affect, 'bbb', { value: 'BBB' });

			expect(trap.mutations).to.be.length(1);

			expect(trap.getOwnPropertyDescriptor(affect, 'bbb')).to.equal({
				configurable: false,
				enumerable: false,
				writable: false,
				value: 'BBB',
			});
			expect(Object.getOwnPropertyDescriptor(affect, 'bbb')).to.be.undefined();

			trap.commit();

			expect(Object.getOwnPropertyDescriptor(affect, 'bbb')).to.equal({
				configurable: false,
				enumerable: false,
				writable: false,
				value: 'BBB',
			});
			expect(affect.bbb).to.equal('BBB');

			next();
		});

		it('added keys reflect different descriptors', (next) => {
			trap.set(affect, 'ccc', 'CCC');

			expect(trap.getOwnPropertyDescriptor(affect, 'ccc')).to.equal({
				configurable: true,
				enumerable: true,
				writable: true,
				value: 'CCC',
			});
			expect(Object.getOwnPropertyDescriptor(affect, 'ccc')).to.be.undefined();

			trap.commit();

			expect(Object.getOwnPropertyDescriptor(affect, 'ccc')).to.equal({
				configurable: true,
				enumerable: true,
				writable: true,
				value: 'CCC',
			});
			expect(affect.ccc).to.equal('CCC');

			next();
		});

		it('handles complicated define, set, delete sequence', (next) => {
			trap.set(affect, 'ddd', 'set');

			expect(trap.ownKeys(affect)).to.contain('ddd');
			expect(trap.getOwnPropertyDescriptor(affect, 'ddd')).to.equal({
				configurable: true,
				enumerable: true,
				writable: true,
				value: 'set',
			});

			trap.defineProperty(affect, 'ddd', {
				value: 'defined',
			});

			expect(trap.ownKeys(affect)).to.contain('ddd');
			expect(trap.getOwnPropertyDescriptor(affect, 'ddd')).to.equal({
				configurable: false,
				enumerable: true,
				writable: false,
				value: 'defined',
			});

			trap.deleteProperty(affect, 'ddd');
			expect(trap.ownKeys(affect)).not.to.contain('ddd');

			trap.defineProperty(affect, 'ddd', { value: 'restored' });
			expect(trap.ownKeys(affect)).not.to.contain('ddd');
			expect(trap.getOwnPropertyDescriptor(affect, 'ddd')).to.equal({
				configurable: false,
				enumerable: false,
				writable: false,
				value: 'restored',
			});

			trap.defineProperty(affect, 'ddd', { value: 'restored-enumerable', enumerable: true });
			expect(trap.ownKeys(affect)).to.contain('ddd');
			expect(trap.getOwnPropertyDescriptor(affect, 'ddd')).to.equal({
				configurable: false,
				enumerable: true,
				writable: false,
				value: 'restored-enumerable',
			});

			trap.set(affect, 'ddd', 'set');

			expect(trap.ownKeys(affect)).to.contain('ddd');
			expect(trap.getOwnPropertyDescriptor(affect, 'ddd')).to.equal({
				configurable: false,
				enumerable: true,
				writable: false,
				value: 'set',
			});

			next();
		});
	});
});
