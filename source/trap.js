const { Mutation, Deletion, Property } = require('./mutation');

const storage = new WeakMap();
//  eslint-disable-next-line no-undefined
const und = undefined;

class Trap {
	constructor() {
		storage.set(this, { mutations: [] });
	}

	/**
	 *  Trap `defineProperty` calls
	 *
	 *  @param     {Object}   target
	 *  @param     {String}   key
	 *  @param     {Object}   descriptor
	 *  @return    {Boolean}  success
	 *  @memberof  Trap
	 */
	defineProperty(target, key, descriptor) {
		const enumerable = this.ownKeys(target).indexOf(key) >= 0;

		this.mutations.push(new Property(target, key, Object.assign({ enumerable }, descriptor)));

		return true;
	}
	/**
	 *  Trap key deletions
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @param     {Object}  descriptor
	 *  @memberof  Trap
	 */
	deleteProperty(target, key) {
		this.mutations.push(new Deletion(target, key));
	}

	/**
	 *  Trap key value getting, provides mutated values
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @param     {Object}  descriptor
	 *  @memberof  Trap
	 */
	get(target, key) {
		return this.search({ target, key })
			.reduce((carry, mutation) => mutation.value, target[key] || und);
	}

	/**
	 *  Trap getOwnPropertyDescriptor calls, provides mutated values
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @memberof  Trap
	 */
	getOwnPropertyDescriptor(target, key) {
		const descriptor = { configurable: true, enumerable: true, writable: true };

		return this.search({ target, key })
			.reduce((carry, mutation) => {
				if (mutation instanceof Deletion) {
					return und;
				}

				return Object.assign(
					carry || descriptor,
					mutation instanceof Property ? mutation.descriptor : { value: mutation.value }
				);
			}, Object.getOwnPropertyDescriptor(target, key));
	}

	/**
	 *  Trap `in` operations, considers mutations
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @memberof  Trap
	 */
	has(target, key) {
		return this.search({ target, key })
			.reduce((carry, mutation) => !(mutation instanceof Deletion), key in target);
	}

	/**
	 *  Trap keys obtaining calls, considers mutations
	 *
	 *  @param     {Object}  target
	 *  @memberof  Trap
	 */
	ownKeys(target) {
		return this.mutations
			.reduce((carry, mutation) => {
				if (mutation instanceof Deletion || (mutation instanceof Property && !mutation.value.enumerable)) {
					return carry.filter((key) => key !== mutation.key);
				}

				return carry.concat(mutation.key);
			}, Object.keys(target))
			.filter((key, index, all) => all.indexOf(key) === index);
	}

	/**
	 *  Trap key value setting, registers value mutations
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @param     {any}     value
	 *  @memberof  Trap
	 */
	set(target, key, value) {
		this.mutations.push(new Mutation(target, key, value));
	}


	/**
	 *  Search for mutations based on an object seek parameter, matches every
	 *  mutation containing the exact key/value pairs provided
	 *
	 * @param     {Object}  seek
	 * @return    {Array}   mutations
	 * @memberof  Accessor
	 */
	search(seek) {
		const map = new Map(Object.keys(seek).map((key) => [ key, seek[key] ]));

		return this.mutations
			.filter((mutation) => mutation.matches(map));
	}

	/**
	 *  Obtain all mutations
	 *
	 *  @readonly
	 *  @memberof  Trap
	 */
	get mutations() {
		return storage.get(this).mutations;
	}

	/**
	 *  Apply all mutations and truncate them
	 *
	 *  @memberof Trap
	 */
	commit() {
		const { mutations } = this;

		mutations.forEach((mutation) => mutation.apply());
		mutations.length = 0;
	}

	/**
	 *  Discard all mutations
	 *
	 *  @memberof Trap
	 */
	rollback() {
		this.mutations.length = 0;
	}
}

module.exports = Trap;
