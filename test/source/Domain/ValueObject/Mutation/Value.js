/* global source, describe, it, expect */

const AbstractMutation = source("Domain/Abstract/Mutation");
const MutationValue = source("Domain/ValueObject/Mutation/Value");

describe("Domain", () => {
	describe("ValueObject", () => {
		describe("Mutation", () => {
			describe("Value", () => {
				it("creates instances", next => {
					const mutation = new MutationValue();

					expect(mutation).to.be.instanceOf(MutationValue);
					expect(mutation).to.be.instanceOf(AbstractMutation);
					expect(mutation.name).to.equal("value-mutation");
					expect(mutation.target).to.be.undefined();
					expect(mutation.key).to.be.undefined();
					expect(mutation.value).to.be.undefined();
					expect(mutation.matches(new Map())).to.be.true();

					next();
				});

				describe("instance", () => {
					const target = { hello: null };
					const key = "hello";
					const value = "world";
					const instance = new MutationValue(target, key, value);

					it("implements matches", next => {
						expect(instance.matches(new Map())).to.be.true();

						expect(
							instance.matches(new Map([["target", target]]))
						).to.be.true();
						expect(
							instance.matches(new Map([["target", {}]]))
						).to.be.false();

						expect(
							instance.matches(new Map([["key", key]]))
						).to.be.true();
						expect(
							instance.matches(new Map([["key", "hello"]]))
						).to.be.true();
						expect(
							instance.matches(new Map([["key", "diff"]]))
						).to.be.false();

						expect(
							instance.matches(new Map([["value", value]]))
						).to.be.true();
						expect(
							instance.matches(new Map([["value", "world"]]))
						).to.be.true();
						expect(
							instance.matches(new Map([["value", "diff"]]))
						).to.be.false();

						next();
					});

					it("implements apply", next => {
						expect(target.hello).to.be.null();
						instance.apply();
						expect(target.hello).to.equal(value);

						//  multiple applications have no side effects
						instance.apply();
						expect(target.hello).to.equal(value);

						next();
					});

					it("provides name", next => {
						expect(instance.name).to.equal("value-mutation");

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
						expect(instance.toString()).to.equal(
							"value-mutation: hello = world"
						);
						expect(String(instance)).to.equal(
							"value-mutation: hello = world"
						);

						next();
					});

					it("implements toJSON", next => {
						expect(instance.toJSON).to.be.function();
						expect(instance.toJSON()).to.equal({
							name: "value-mutation",
							key,
							value
						});
						expect(JSON.stringify(instance)).to.equal(
							'{"name":"value-mutation","key":"hello","value":"world"}'
						);

						next();
					});
				});
			});
		});
	});
});
