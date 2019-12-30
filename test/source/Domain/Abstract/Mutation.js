/* global source, describe, it, expect */

const AbstractMutation = source("Domain/Abstract/Mutation");

describe("Domain/Abstract/Mutation", () => {
	const target = {};
	const key = "key";
	const value = "value";
	const instance = new AbstractMutation(target, key, value);

	it("implements matches", next => {
		expect(instance.matches(new Map())).to.be.true();

		expect(instance.matches(new Map([["target", target]]))).to.be.true();
		expect(instance.matches(new Map([["target", {}]]))).to.be.false();

		expect(instance.matches(new Map([["key", key]]))).to.be.true();
		expect(instance.matches(new Map([["key", "key"]]))).to.be.true();
		expect(instance.matches(new Map([["key", "diff"]]))).to.be.false();

		expect(instance.matches(new Map([["value", value]]))).to.be.true();
		expect(instance.matches(new Map([["value", "value"]]))).to.be.true();
		expect(instance.matches(new Map([["value", "diff"]]))).to.be.false();

		next();
	});

	it("implements apply", next => {
		expect(() => instance.apply()).to.throw("Not implemented");

		next();
	});

	it("provides name", next => {
		expect(instance.name).to.equal("abstract-mutation");

		next();
	});

	it("provides target", next => {
		expect(instance.target).to.shallow.equal(target);

		next();
	});

	it("provides key", next => {
		expect(instance.key).to.shallow.equal(key);

		next();
	});

	it("provides value", next => {
		expect(instance.value).to.shallow.equal(value);

		next();
	});

	it("implements toString", next => {
		expect(instance.toString).to.be.function();
		expect(instance.toString()).to.equal("abstract-mutation: key");
		expect(String(instance)).to.equal("abstract-mutation: key");

		next();
	});

	it("implements toJSON", next => {
		expect(instance.toJSON).to.be.function();
		expect(instance.toJSON()).to.equal({
			name: "abstract-mutation",
			key
		});
		expect(JSON.stringify(instance)).to.equal(
			'{"name":"abstract-mutation","key":"key"}'
		);

		next();
	});
});
