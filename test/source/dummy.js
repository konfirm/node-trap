/* global source, describe, it, expect */

const Dummy = source('dummy');

describe('Dummy', () => {
	const Named = require('../subject/named');

	it('creates a dummy', (next) => {
		const subject = { foo: 'bar' };
		const dummy = Dummy.create(subject);

		//  we're one
		expect(JSON.stringify(dummy)).to.equal(JSON.stringify(subject));
		expect(dummy.constructor).to.equal(subject.constructor);
		expect(dummy.constructor.name).to.equal(subject.constructor.name);
		expect(dummy).to.equal(subject);

		//  but we're not the same
		expect(dummy).not.to.shallow.equal(subject);

		next();
	});

	it('reflects changes on the dummy', (next) => {
		const subject = { foo: 'bar' };
		const dummy = Dummy.create(subject);

		dummy.foo = 'changed';
		expect(dummy.foo).to.equal('changed');
		expect(subject.foo).to.equal('bar');

		expect(JSON.stringify(dummy)).to.equal('{"foo":"changed"}');
		expect(JSON.stringify(subject)).to.equal('{"foo":"bar"}');

		next();
	});

	it('calculates consistent checksums', (next) => {
		const one = Dummy.create({ zzz: 'aaa', rrr: 'sss', aaa: 'zzz' });
		const two = Dummy.create({ rrr: 'sss', aaa: 'zzz', zzz: 'aaa' });

		expect(JSON.stringify(one)).not.to.equal(JSON.stringify(two));
		expect(Dummy.checksum(one)).to.equal(Dummy.checksum(two));

		one.aaa = 'bbb';
		expect(one.aaa).to.equal('bbb');
		expect(one.aaa).not.to.equal(two.aaa);
		expect(Dummy.checksum(one)).not.to.equal(Dummy.checksum(two));

		two.aaa = 'bbb';
		expect(two.aaa).to.equal('bbb');
		expect(two.aaa).to.equal(one.aaa);
		expect(Dummy.checksum(one)).to.equal(Dummy.checksum(two));

		one.qqq = 'added';
		expect(one.qqq).to.equal('added');
		expect(one.qqq).not.to.equal(two.qqq);
		expect(Dummy.checksum(one)).not.to.equal(Dummy.checksum(two));

		two.qqq = 'different';
		expect(two.qqq).to.equal('different');
		expect(two.qqq).not.to.equal(one.qqq);
		expect(Dummy.checksum(one)).not.to.equal(Dummy.checksum(two));

		two.qqq = 'added';
		expect(two.qqq).to.equal('added');
		expect(two.qqq).to.equal(one.qqq);
		expect(Dummy.checksum(one)).to.equal(Dummy.checksum(two));

		next();
	});
});
