/* global source, describe, it, expect */

const Trap = source("Domain/ValueObject/Trap");

describe("Example - README.md", () => {
	it("traps all", next => {
		//  include the Trap module
		// const Trap = require('@konfirm/trap');
		//  create a trap instance
		const trap = new Trap();
		//  create the affected object
		const affect = { foo: "bar", bar: "baz" };
		//  create the proxy
		const proxy = new Proxy(affect, trap);

		proxy.foo = "hello world";

		// console.log(proxy.foo);       //  'hello world'
		expect(proxy.foo).to.equal("hello world");
		// console.log(affect.foo);      //  'bar'
		expect(affect.foo).to.equal("bar");

		expect("bar" in proxy).to.be.true();

		delete proxy.bar;

		// console.log('bar' in proxy);   //  false
		expect("bar" in proxy).to.be.false();
		// console.log('bar' in affect);  //  true
		expect("bar" in affect).to.be.true();

		//  commit all trapped changes
		trap.commit();

		// console.log(affect.foo);  //  'hello world'
		expect(affect.foo).to.equal("hello world");
		// console.log('bar' in affect);  //  false
		expect("bar" in affect).to.be.false();

		next();
	});
});
