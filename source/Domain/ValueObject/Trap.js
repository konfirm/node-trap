const MutationCollection = require('../Entity/MutationCollection.js');
const Value = require("../ValueObject/Mutation/Value.js");
const Deletion = require("../ValueObject/Mutation/Deletion.js");
const Property = require("../ValueObject/Mutation/Property.js");

const storage = new WeakMap();
//  eslint-disable-next-line no-undefined
const und = undefined;

class Trap {
	constructor(trackOnlyLastMutation = false) {
		storage.set(this, { purge: trackOnlyLastMutation, mutations: new MutationCollection() });
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

		this.purge({ target, key });

		return Boolean(
			this.mutations.push(
				new Property(
					target,
					key,
					Object.assign({ enumerable }, descriptor)
				)
			)
		);
	}

	/**
	 *  Trap key deletions
	 *
	 *  @param     {Object}   target
	 *  @param     {String}   key
	 *  @param     {Object}   descriptor
	 *  @return    {Boolean}  success
	 *  @memberof  Trap
	 */
	deleteProperty(target, key) {
		const { purge } = storage.get(this);

		if (purge) {
			this.purge({ target, key });

			if (!Object.getOwnPropertyDescriptor(target, key)) {
				return true;
			}
		}

		return Boolean(this.mutations.push(new Deletion(target, key)));
	}

	/**
	 *  Trap key value getting, provides mutated values
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @return    {any}     value
	 *  @memberof  Trap
	 */
	get(target, key) {
		return this.search({ target, key }).reduce(
			(carry, mutation) => mutation.value,
			key in target ? target[key] : und
		);
	}

	/**
	 *  Trap getOwnPropertyDescriptor calls, provides mutated values
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @return    {Object}  descriptor
	 *  @memberof  Trap
	 */
	getOwnPropertyDescriptor(target, key) {
		const descriptor = {
			configurable: true,
			enumerable: true,
			writable: true
		};

		return this.search({ target, key }).reduce((carry, mutation) => {
			if (mutation instanceof Deletion) {
				return und;
			}

			return Object.assign(
				carry || descriptor,
				mutation instanceof Property
					? mutation.descriptor
					: { value: mutation.value }
			);
		}, Object.getOwnPropertyDescriptor(target, key));
	}

	/**
	 *  Trap `in` operations, considers mutations
	 *
	 *  @param     {Object}   target
	 *  @param     {String}   key
	 *  @param     {Boolean}  has
	 *  @memberof  Trap
	 */
	has(target, key) {
		return this.search({ target, key }).reduce(
			(carry, mutation) => !(mutation instanceof Deletion),
			key in target
		);
	}

	/**
	 *  Trap keys obtaining calls, considers mutations
	 *
	 *  @param     {Object}  target
	 *  @return    {Array}   keys
	 *  @memberof  Trap
	 */
	ownKeys(target) {
		return this.mutations
			.search({ target })
			.reduce((carry, mutation) => {
				if (
					mutation instanceof Deletion ||
					(mutation instanceof Property &&
						!mutation.descriptor.enumerable)
				) {
					return carry.filter(key => key !== mutation.key);
				}

				return carry.concat(mutation.key);
			}, Object.keys(target))
			.filter((key, index, all) => all.indexOf(key) === index);
	}

	/**
	 *  Trap key value setting, registers value mutations
	 *
	 *  @param     {Object}   target
	 *  @param     {String}   key
	 *  @param     {any}      value
	 *  @return    {Boolean}  success
	 *  @memberof  Trap
	 */
	set(target, key, value) {
		const { purge } = storage.get(this);

		if (purge) {
			this.purge({ target, key });

			if (key in target && target[key] === value) {
				return true;
			}
		}

		return Boolean(this.mutations.push(new Value(target, key, value)));
	}

	/**
	 *  Search for mutations based on an object seek parameter, matches every
	 *  mutation containing the exact key/value pairs provided
	 *
	 *  @param     {Object}  seek
	 *  @return    {Array}   mutations
	 *  @memberof  Trap
	 */
	search(seek) {
		return this.mutations.search(seek);
	}

	/**
	 *  Purge all mutation matching the given seek parameter
	 *
	 *  @param {Object} seek
	 *  @return   int number of purged items
	 *  @memberof Trap
	 */
	purge(seek) {
		const { purge, mutations } = storage.get(this);

		return purge ? mutations.purge(seek) : 0;
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
		this.mutations.flush((mutation) => mutation.apply());
	}

	/**
	 *  Discard all mutations
	 *
	 *  @memberof Trap
	 */
	rollback() {
		this.mutations.flush();
	}
}

module.exports = Trap;
