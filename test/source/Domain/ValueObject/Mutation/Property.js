/* global source, describe, it, expect */

const AbstractMutation = source("Domain/Abstract/Mutation");
const PropertyMutation = source("Domain/ValueObject/Mutation/Property");

describe("Domain", () => {
	describe("ValueObject", () => {
		describe("Mutation", () => {
			describe("Deletion", () => {
				it("creates instances", next => {
					const mutation = new PropertyMutation();

					expect(mutation).to.be.instanceOf(PropertyMutation);
					expect(mutation).to.be.instanceOf(AbstractMutation);
					expect(mutation.name).to.equal("property-mutation");
					expect(mutation.target).to.be.undefined();
					expect(mutation.key).to.be.undefined();
					expect(mutation.value).to.be.undefined();
					expect(mutation.matches(new Map())).to.be.true();

					next();
				});

				describe("instance", () => {
					const target = {};
					const key = "hello";
					const value = { get: () => "applied" };
					const instance = new PropertyMutation(target, key, value);

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
							instance.matches(new Map([["value", "diff"]]))
						).to.be.false();

						next();
					});

					it("implements apply", next => {
						expect(target.hello).to.be.undefined();
						expect("hello" in target).to.be.false();

						instance.apply();

						expect(target.hello).to.be.string();
						expect(target.hello).to.equal("applied");
						expect("hello" in target).to.be.true();
						expect(Object.keys(target)).not.to.contain("hello");

						//  multiple applications have no side-effects
						instance.apply();

						expect(target.hello).to.be.string();
						expect(target.hello).to.equal("applied");
						expect("hello" in target).to.be.true();
						expect(Object.keys(target)).not.to.contain("hello");

						next();
					});

					it("provides name", next => {
						expect(instance.name).to.equal("property-mutation");

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
						expect(instance.value).to.shallow.equal("applied");

						next();
					});

					it("implements toString", next => {
						expect(instance.toString).to.be.function();
						expect(instance.toString()).to.equal(
							"property-mutation: hello"
						);
						expect(String(instance)).to.equal(
							"property-mutation: hello"
						);

						next();
					});

					it("implements toJSON", next => {
						expect(instance.toJSON).to.be.function();
						expect(instance.toJSON()).to.equal({
							name: "property-mutation",
							key
						});
						expect(JSON.stringify(instance)).to.equal(
							'{"name":"property-mutation","key":"hello"}'
						);

						next();
					});
				});

				describe("Various configurations", () => {
					it("value", next => {
						const target = { key: "unmodified" };
						const key = "key";
						const instance = new PropertyMutation(target, key, {
							value: "modified"
						});

						expect(target[key]).to.shallow.equal("unmodified");

						instance.apply();

						const descriptor = Object.getOwnPropertyDescriptor(
							target,
							key
						);

						expect(target[key]).to.shallow.equal("modified");
						expect(descriptor.value).to.equal("modified");
						expect(descriptor.enumerable).to.be.true();
						expect(descriptor.configurable).to.be.true();
						expect(descriptor.writable).to.be.true();

						next();
					});

					it("enumerable", next => {
						const target = { key: "unmodified" };
						const key = "key";
						const instance = new PropertyMutation(target, key, {
							enumerable: false
						});

						expect(Object.keys(target)).to.contain(key);

						instance.apply();

						expect(Object.keys(target)).not.to.contain(key);

						next();
					});

					it("writable", next => {
						const target = { key: "unmodified" };
						const key = "key";
						const instance = new PropertyMutation(target, key, {
							writable: false
						});

						expect(target[key]).to.equal("unmodified");
						target[key] = "modified";
						expect(target[key]).to.equal("modified");

						instance.apply();

						expect(target[key]).to.equal("modified");
						target[key] = "not modified again";
						expect(target[key]).to.equal("modified");

						next();
					});
				});
			});
		});
	});
});
