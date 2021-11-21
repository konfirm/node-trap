import test from 'tape';
import { Trap } from '../../source/Domain/ValueObject/Trap';

test("README.md - traps all", (t) => {
	//  include the Trap module
	// import { Trap } from '@konfirm/trap';
	//  create a trap instance
	const trap = new Trap();
	//  create the affected object
	const affect = { foo: "bar", bar: "baz" };
	//  create the proxy
	const proxy = new Proxy(affect, trap);

	proxy.foo = "hello world";

	// console.log(proxy.foo);       //  'hello world'
	t.equal(proxy.foo, 'hello world', 'proxy.foo is "hello world"');
	// console.log(affect.foo);      //  'bar'
	t.equal(affect.foo, 'bar', 'affect.foo is "bar"');
	t.ok('bar' in proxy, 'proxy contains bar');

	delete proxy.bar;

	// console.log('bar' in proxy);   //  false
	t.notOk('bar' in proxy, 'proxy no longer contains bar');
	// console.log('bar' in affect);  //  true
	t.ok('bar' in affect, 'affect contains bar');

	//  commit all trapped changes
	trap.commit();

	// console.log(affect.foo);  //  'hello world'
	t.equal(affect.foo, 'hello world', 'affect.foo is "hello world"');
	// console.log('bar' in affect);  //  false
	t.notOk('bar' in affect, 'affect no longer contains bar');

	t.end();
});
