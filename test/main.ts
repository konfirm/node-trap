import test from 'tape';
import * as Export from '../source/main';

test('Domain/Entity/Trap - exports', (t) => {
	const expect = [
		'Trap',
		'isMutationInterface',
		'isMutationOptions',
		'DeletionMutation',
		'PropertyMutation',
		'ValueMutation',
		'AbstractMutation',
	];
	const actual = Object.keys(Export);

	t.deepEqual(actual, expect, `exports ${expect.join(', ')}`)
	actual.forEach((key) => {
		t.equal(typeof Export[key], 'function', `${key} is a function`);
	});

	t.end();
});
