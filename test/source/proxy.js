/* global source, describe, it, expect */

const Trap = source("Domain/ValueObject/Trap");

describe("Use with Proxy", () => {
	//  eslint-disable-next-line no-undefined
	[undefined, false, true].forEach(trackOnlyLastMutation => {
		const scope = trackOnlyLastMutation ? "last" : "all";

		describe(`trackOnlyLastMutation = ${JSON.stringify(
			trackOnlyLastMutation
		)}`, () => {
			const trap = new Trap(trackOnlyLastMutation);
			const proxy = new Proxy({ qux: true }, trap);
			let count = 0;

			it(`tracks ${scope} mutation${
				trackOnlyLastMutation ? "" : "s"
			}`, next => {
				expect("foo" in proxy).to.be.false();
				expect(proxy.foo).to.be.undefined();
				expect(trap.mutations).to.be.length(count);

				proxy.foo = "bar";
				count = 1;

				expect("foo" in proxy).to.be.true();
				expect(proxy.foo).to.equal("bar");
				expect(trap.mutations).to.be.length(count);

				proxy.foo = "baz";
				count += Number(!trackOnlyLastMutation);

				expect("foo" in proxy).to.be.true();
				expect(proxy.foo).to.equal("baz");
				expect(trap.mutations).to.be.length(count);

				next();
			});

			it(`tracks ${scope} deletion${
				trackOnlyLastMutation ? "" : "s"
			}`, next => {
				delete proxy.foo;
				count = trackOnlyLastMutation ? 0 : count + 1;

				expect("foo" in proxy).to.be.false();
				expect(proxy.foo).to.be.undefined();
				expect(trap.mutations).to.be.length(count);

				delete proxy.qux;
				count = trackOnlyLastMutation ? 1 : count + 1;

				expect("qux" in proxy).to.be.false();
				expect(proxy.qux).to.be.undefined();
				expect(trap.mutations).to.be.length(count);

				proxy.qux = true;
				count = trackOnlyLastMutation ? 0 : count + 1;

				next();
			});

			it(`tracks ${scope} property definition${
				trackOnlyLastMutation ? "" : "s"
			}`, next => {
				Object.defineProperty(proxy, "foo", { get: () => "getter" });
				count += 1;

				expect("foo" in proxy).to.be.true();
				expect(proxy.foo).to.equal("getter");
				expect(trap.mutations).to.be.length(count);

				Object.defineProperty(proxy, "qux", { value: "value" });
				count += 1;

				expect("qux" in proxy).to.be.true();
				expect(proxy.qux).to.equal("value");
				expect(trap.mutations).to.be.length(count);

				Object.defineProperty(proxy, "foo", {
					get: () => "done",
					enumerable: false
				});
				count += Number(!trackOnlyLastMutation);

				expect("foo" in proxy).to.be.true();
				expect(proxy.foo).to.equal("done");
				expect(trap.mutations).to.be.length(count);

				next();
			});

			it("allows restoration", next => {
				delete proxy.foo;
				proxy.qux = true;
				count = trackOnlyLastMutation ? 0 : count + 2;

				expect("foo" in proxy).to.be.false();
				expect("qux" in proxy).to.be.true();
				expect(proxy.foo).to.be.undefined();
				expect(proxy.qux).to.be.true();
				expect(trap.mutations).to.be.length(count);

				next();
			});
		});
	});
});
