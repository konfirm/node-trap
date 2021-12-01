import test from 'tape';
import { Collection } from '../source/Domain/Entity/Collection';
import { Trap } from '../source/main';

test('Proxy - Trap (all mutations)', (t) => {
	const target: any = { three: 3, four: 4 };
	const trap = new Trap();
	const proxy: any = new Proxy(target, trap);

	t.notOk('one' in proxy, 'proxy does not have property "one"');
	t.notOk('two' in proxy, 'proxy does not have property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.ok('four' in proxy, 'proxy has property "four"');

	t.notOk('one' in target, 'target does not have property "one"');
	t.notOk('two' in target, 'target does not have property "two"');
	t.ok('three' in target, 'target has property "three"');
	t.ok('four' in target, 'target has property "four"');

	proxy.one = 1.1;
	Object.defineProperty(proxy, 'two', { value: 2.2, configurable: true });

	proxy.one = 1;
	Object.defineProperty(proxy, 'two', { value: 2, configurable: true });
	delete proxy.four;

	t.ok('one' in proxy, 'proxy has property "one"');
	t.ok('two' in proxy, 'proxy has property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.notOk('four' in proxy, 'proxy does not have property "four"');

	t.notOk('one' in target, 'target does not have property "one", remaining unchanged');
	t.notOk('two' in target, 'target does not have property "two", remaining unchanged');
	t.ok('three' in target, 'target has property "three", remaining unchanged');
	t.ok('four' in target, 'target has property "four", remaining unchanged');

	const collection = Collection.for(trap);
	t.equal(collection.findAll({ target }).length, 5, 'trapped 5 mutations');

	trap.commit();

	t.ok('one' in proxy, 'proxy has property "one"');
	t.ok('two' in proxy, 'proxy has property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.notOk('four' in proxy, 'proxy does not have property "four"');

	t.ok('one' in target, 'target has property "one" after commit');
	t.equal(target.one, 1, 'target.one is 1');
	t.ok('two' in target, 'target has property "two" after commit');
	t.equal(target.two, 2, 'target.two is 2');
	t.ok('three' in target, 'target has property "three" after commit');
	t.notOk('four' in target, 'target does not have property "four" after commit');

	t.end();
});

test('Proxy - Trap (single key mutation)', (t) => {
	const target: any = { three: 3, four: 4 };
	const trap = new Trap(true);
	const proxy: any = new Proxy(target, trap);

	t.notOk('one' in proxy, 'proxy does not have property "one"');
	t.notOk('two' in proxy, 'proxy does not have property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.ok('four' in proxy, 'proxy has property "four"');

	t.notOk('one' in target, 'target does not have property "one"');
	t.notOk('two' in target, 'target does not have property "two"');
	t.ok('three' in target, 'target has property "three"');
	t.ok('four' in target, 'target has property "four"');

	proxy.one = 1.1;
	Object.defineProperty(proxy, 'two', { value: 2.2, configurable: true });

	proxy.one = 1;
	Object.defineProperty(proxy, 'two', { value: 2, configurable: true });
	delete proxy.four;

	t.ok('one' in proxy, 'proxy has property "one"');
	t.ok('two' in proxy, 'proxy has property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.notOk('four' in proxy, 'proxy does not have property "four"');

	t.notOk('one' in target, 'target does not have property "one", remaining unchanged');
	t.notOk('two' in target, 'target does not have property "two", remaining unchanged');
	t.ok('three' in target, 'target has property "three", remaining unchanged');
	t.ok('four' in target, 'target has property "four", remaining unchanged');

	const collection = Collection.for(trap);
	t.equal(collection.findAll({ target }).length, 3, 'trapped 3 mutations');

	trap.commit();

	t.ok('one' in proxy, 'proxy has property "one"');
	t.ok('two' in proxy, 'proxy has property "two"');
	t.ok('three' in proxy, 'proxy has property "three"');
	t.notOk('four' in proxy, 'proxy does not have property "four"');

	t.ok('one' in target, 'target has property "one" after commit');
	t.equal(target.one, 1, 'target.one is 1');
	t.ok('two' in target, 'target has property "two" after commit');
	t.equal(target.two, 2, 'target.two is 2');
	t.ok('three' in target, 'target has property "three" after commit');
	t.notOk('four' in target, 'target does not have property "four" after commit');

	t.end();
});