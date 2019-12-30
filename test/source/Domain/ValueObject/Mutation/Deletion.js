/* global source, describe, it, expect */

const AbstractMutation = source("Domain/Abstract/Mutation");
const MutationDeletion = source("Domain/ValueObject/Mutation/Deletion");

describe("Domain", () => {
	describe("ValueObject", () => {
		describe("Mutation", () => {
			describe("Deletion", () => {
				it("creates instances", next => {
					const mutation = new MutationDeletion();

					expect(mutation).to.be.instanceOf(MutationDeletion);
					expect(mutation).to.be.instanceOf(AbstractMutation);
					expect(mutation.name).to.equal("deletion-mutation");
					expect(mutation.target).to.be.undefined();
					expect(mutation.key).to.be.undefined();
					expect(mutation.value).to.be.undefined();
					expect(mutation.matches(new Map())).to.be.true();

					next();
				});

				describe("instance", () => {
					const target = { hello: null };
					const key = "hello";
					const instance = new MutationDeletion(target, key);

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

						next();
					});

					it("implements apply", next => {
						expect(target.hello).to.be.null();
						expect("hello" in target).to.be.true();

						instance.apply();

						expect(target.hello).to.be.undefined();
						expect("hello" in target).to.be.false();

						//  multiple applications have no side-effects
						instance.apply();

						expect(target.hello).to.be.undefined();
						expect("hello" in target).to.be.false();

						next();
					});

					it("provides name", next => {
						expect(instance.name).to.equal("deletion-mutation");

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
						expect(instance.value).to.be.undefined();

						next();
					});

					it("implements toString", next => {
						expect(instance.toString).to.be.function();
						expect(instance.toString()).to.equal(
							"deletion-mutation: hello"
						);
						expect(String(instance)).to.equal(
							"deletion-mutation: hello"
						);

						next();
					});

					it("implements toJSON", next => {
						expect(instance.toJSON).to.be.function();
						expect(instance.toJSON()).to.equal({
							name: "deletion-mutation",
							key
						});
						expect(JSON.stringify(instance)).to.equal(
							'{"name":"deletion-mutation","key":"hello"}'
						);

						next();
					});
				});
			});
		});
	});
});
