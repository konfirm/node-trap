import test from "tape";
import { Trap } from "../../source/Domain/ValueObject/Trap";

[undefined, false, true].forEach(trackOnlyLastMutation => {
	const trap = new Trap(trackOnlyLastMutation);
	const proxy = new Proxy({ qux: true }, trap);
	let count = 0;

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last mutation" : "all mutations"}`, (t) => {
		t.notOk("foo" in proxy, 'proxy does not contain foo');
		t.equal(proxy.foo, undefined, 'proxy.foo is undefined');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		proxy.foo = "bar";
		count = 1;

		t.ok("foo" in proxy, 'proxy contains foo');
		t.equal(proxy.foo, "bar", 'proxy.foo is "bar"');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		proxy.foo = "baz";
		count += Number(!trackOnlyLastMutation);

		t.ok("foo" in proxy, 'proxy contains foo');
		t.equal(proxy.foo, "baz"), 'proxy.foo is "baz"';
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		t.end();
	});

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last deletion" : "all deletions"}`, (t) => {
		delete proxy.foo;
		count = trackOnlyLastMutation ? 0 : count + 1;

		t.notOk("foo" in proxy, 'proxy does not contain foo');
		t.equal(proxy.foo, undefined, 'proxy.foo is undefined');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		delete proxy.qux;
		count = trackOnlyLastMutation ? 1 : count + 1;

		t.notOk("qux" in proxy, 'proxy does not contain qux');
		t.equal(proxy.qux, undefined, 'proxy qux is undefined');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		proxy.qux = true;
		count = trackOnlyLastMutation ? 0 : count + 1;

		t.end();
	});

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last property definition" : "all property definitions"}`, (t) => {
		Object.defineProperty(proxy, "foo", { get: () => "getter" });
		count += 1;

		t.ok("foo" in proxy, 'proxy contains foo');
		t.equal(proxy.foo, "getter", 'proxy.foo is "getter"');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		Object.defineProperty(proxy, "qux", { value: "value" });
		count += 1;

		t.ok("qux" in proxy, 'proxy contains "qux"');
		t.equal(proxy.qux, "value", 'proxy.qux is "value"');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		Object.defineProperty(proxy, "foo", {
			get: () => "done",
			enumerable: false
		});
		count += Number(!trackOnlyLastMutation);

		t.ok("foo" in proxy, 'proxy contains foo');
		t.equal(proxy.foo, "done", 'proxy.foo is "done"');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		t.end();
	});

	test("allows restoration", (t) => {
		delete proxy.foo;
		proxy.qux = true;
		count = trackOnlyLastMutation ? 0 : count + 2;

		t.notOk("foo" in proxy, 'proxy does not contain foo');
		t.ok("qux" in proxy, 'proxy contains qux');
		t.equal(proxy.foo, undefined), 'proxy.foo is undefined';
		t.equal(proxy.qux, true, 'proxy.qux is true');
		t.equal(trap.mutations.length, count, `trap.mutations has length ${count}`);

		t.end();
	});
});
