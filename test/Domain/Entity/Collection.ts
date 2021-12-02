import test from 'tape';
import each from 'template-literal-each';
import * as Export from '../../../source/Domain/Entity/Collection';

test('Domain/Entity/Collection - exports', (t) => {
	const expect = ['Collection'];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});

const { Collection } = Export;

test('Domain/Entity/Collection - push', (t) => {
	const collection = new Collection<any>();
	const one = { one: 1 };

	t.equal(collection.push(one), 1, 'adding 1 item returns 1');
	t.equal(collection.push(one), 0, 'adding existing item returns 0');
	t.equal(collection.push({ two: 2 }), 1, 'adding 1 item returns 1');
	t.equal(collection.push({ three: 3 }, { four: 4 }), 2, 'adding 2 items returns 2');
	t.equal(collection.push({ five: 5 }, one, { seven: 7 }), 2, 'adding 3 items of which one exists returns 2');
	t.equal(collection.push(), 0, 'adding 0 items returns 0');

	t.end();
});

test('Domain/Entity/Collection - pull', (t) => {
	const collection = new Collection<any>();
	const one = { one: 1 };

	collection.push(one);

	const pulled = collection.pull(one);
	t.equal(pulled.length, 1, 'pulled 1 item');
	t.equal(pulled[0], one, 'pulled the exact item');

	const empty = collection.pull(one);
	t.equal(empty.length, 0, 'pulled 0 items');

	t.end();
});

const items = [
	{ a: 0, b: 0, c: 0 },
	{ a: 1, b: 0, c: 0 },
	{ a: 0, b: 1, c: 0 },
	{ a: 0, b: 0, c: 1 },
	{ a: 1, b: 1, c: 0 },
	{ a: 0, b: 1, c: 1 },
	{ a: 1, b: 0, c: 1 },
	{ a: 1, b: 1, c: 1 },
];
const collection = new Collection<any>(...items);
const a1 = [1, 4, 6, 7].map((i) => items[i]);
const b1 = [2, 4, 5, 7].map((i) => items[i]);
const c1 = [3, 5, 6, 7].map((i) => items[i]);

test('Domain/Entity/Collection - count', (t) => {
	const foundA1 = collection.count({ a: 1 });
	const foundB1 = collection.count({ b: 1 });
	const foundC1 = collection.count({ c: 1 });

	t.equal(collection.count(), items.length, `counts ${items.length} items in total`);
	t.equal(foundA1, a1.length, 'counts 4 items for {a: 1}');
	t.equal(foundB1, b1.length, 'counts 4 items for {b: 1}');
	t.equal(foundC1, b1.length, 'counts 4 items for {c: 1}');

	t.end();
});

test('Domain/Entity/Collection - find', (t) => {
	const foundA1 = collection.find({ a: 1 });
	const foundB1 = collection.find({ b: 1 });
	const foundC1 = collection.find({ c: 1 });

	t.equal(foundA1, a1[0], 'finds the first {a: 1} match');
	t.equal(foundB1, b1[0], 'finds the first {b: 1} match');
	t.equal(foundC1, c1[0], 'finds the first {c: 1} match');

	t.end();
});

test('Domain/Entity/Collection - findAll', (t) => {
	const foundA1 = collection.findAll({ a: 1 });
	const foundB1 = collection.findAll({ b: 1 });
	const foundC1 = collection.findAll({ c: 1 });

	t.equal(foundA1.length, a1.length, 'finds 4 items for {a: 1}');
	t.ok(foundA1.every((item, index) => a1[index] === item), 'finds all exact items for {a: 1}')
	t.equal(foundB1.length, b1.length, 'finds 4 items for {b: 1}');
	t.ok(foundB1.every((item, index) => b1[index] === item), 'finds all exact items for {b: 1}')
	t.equal(foundC1.length, b1.length, 'finds 4 items for {c: 1}');
	t.ok(foundC1.every((item, index) => c1[index] === item), 'finds all exact items for {c: 1}')

	t.end();
});

test('Domain/Entity/Collection - static for', (t) => {
	const refA = { ref: 'a' };
	const refB = { ref: 'b' };

	const collectionA = Collection.for(refA);
	const collectionB = Collection.for(refB);

	t.ok(collectionA === Collection.for(refA), 'returns the exact same instance for refA');
	t.ok(collectionB === Collection.for(refB), 'returns the exact same instance for refB');
	t.ok(Collection.for(refA) !== Collection.for(refB), 'returns a different instance for refA and refB');

	t.end();
});
