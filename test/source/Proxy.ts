import test from "tape";
import { Trap } from "../../source/Domain/ValueObject/Trap";

[undefined, false, true].forEach(trackOnlyLastMutation => {
	const trap = new Trap(trackOnlyLastMutation);
	const proxy = new Proxy({ qux: true }, trap);
	let count = 0;

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last mutation" : "all mutations"}`, (t) => {
		t.notOk("foo" in proxy);
		t.equal(proxy.foo, undefined);
		t.equal(trap.mutations.length, count);

		proxy.foo = "bar";
		count = 1;

		t.ok("foo" in proxy);
		t.equal(proxy.foo, "bar");
		t.equal(trap.mutations.length, count);

		proxy.foo = "baz";
		count += Number(!trackOnlyLastMutation);

		t.ok("foo" in proxy);
		t.equal(proxy.foo, "baz");
		t.equal(trap.mutations.length, count);

		t.end();
	});

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last deletion" : "all deletions"}`, (t) => {
		delete proxy.foo;
		count = trackOnlyLastMutation ? 0 : count + 1;

		t.notOk("foo" in proxy);
		t.equal(proxy.foo, undefined);
		t.equal(trap.mutations.length, count);

		delete proxy.qux;
		count = trackOnlyLastMutation ? 1 : count + 1;

		t.notOk("qux" in proxy);
		t.equal(proxy.qux, undefined);
		t.equal(trap.mutations.length, count);

		proxy.qux = true;
		count = trackOnlyLastMutation ? 0 : count + 1;

		t.end();
	});

	test(`With Proxy - trackOnlyLastMutation ${trackOnlyLastMutation} tracks ${trackOnlyLastMutation ? "last property definition" : "all property definitions"}`, (t) => {
		Object.defineProperty(proxy, "foo", { get: () => "getter" });
		count += 1;

		t.ok("foo" in proxy);
		t.equal(proxy.foo, "getter");
		t.equal(trap.mutations.length, count);

		Object.defineProperty(proxy, "qux", { value: "value" });
		count += 1;

		t.ok("qux" in proxy);
		t.equal(proxy.qux, "value");
		t.equal(trap.mutations.length, count);

		Object.defineProperty(proxy, "foo", {
			get: () => "done",
			enumerable: false
		});
		count += Number(!trackOnlyLastMutation);

		t.ok("foo" in proxy);
		t.equal(proxy.foo, "done");
		t.equal(trap.mutations.length, count);

		t.end();
	});

	test("allows restoration", (t) => {
		delete proxy.foo;
		proxy.qux = true;
		count = trackOnlyLastMutation ? 0 : count + 2;

		t.notOk("foo" in proxy);
		t.ok("qux" in proxy);
		t.equal(proxy.foo, undefined);
		t.ok(proxy.qux);
		t.equal(trap.mutations.length, count);

		t.end();
	});
});
