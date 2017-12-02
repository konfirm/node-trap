const storage = new WeakMap();

//  eslint-disable-next-line no-undefined
const und = undefined;

/**
 *  Accessor class providing the basic requirements for Proxy handler and keeping
 *  track of mutations
 *
 * @class Accessor
 */
class Accessor {
	/**
	 *  Creates an instance of Accessor
	 *
	 *  @memberof Accessor
	 */
	constructor() {
		storage.set(this, { mutations: [] });
	}

	/**
	 *  Search for mutations based on an object seek parameter, matches every
	 *  mutation containing the exact key/value pairs provided
	 *
	 * @param    {Object}  seek
	 * @return   {Array}   mutations
	 * @memberof  Accessor
	 */
	search(seek) {
		const keys = Object.keys(seek);
		const { length } = keys;

		return this.mutations
			.filter((item) => keys.filter((key) => key in item && item[key] === seek[key]).length === length);
	}

	/**
	 *  Search for a single mutation based on an object seek parameter, matches
	 *  the first mutation containing the exact key/value pairs provided
	 *
	 * @param     {Object}  seek
	 * @return    {Object}  mutation
	 * @memberof  Accessor
	 */
	searchOne(seek) {
		return this.search(seek).shift();
	}

	/**
	 *  Obtain a function to handle `getOwnPropertyDescriptor` proxy calls, reflecting additions
	 *  to the proxied object
	 *
	 * @return    {Function}  getOwnPropertyDescriptor
	 * @memberof  Accessor
	 */
	descriptor() {
		return (target, key) => Object.getOwnPropertyDescriptor(target, key) || this.mutations
			.filter((mut) => mut.key === key)
			.reduce((carry, mut) => ({
				configurable: true,
				enumerable: true,
				value: mut.value,
			}), und);
	}

	/**
	 *  Obtain a function to handle the `ownKeys` proxy calls, reflecting additions to the proxied object
	 *
	 * @return    {Function}  ownKeys
	 * @memberof  Accessor
	 */
	keys() {
		return (target) => Object.keys(target)
			.concat(this.mutations.map((mut) => mut.key))
			.filter((key, index, all) => all.indexOf(key) === index);
	}

	/**
	 *  Obtain a function to handle the `has` proxy calls, reflecting additions to the proxied object
	 *
	 * @return    {Function}  has
	 * @memberof  Accessor
	 */
	contains() {
		return (target, key) => key in target || this.mutations.filter((mut) => mut.key === key).length > 0;
	}

	/**
	 *  Obtain a function to handle the `get` proxy calls, reflecting mutations to the proxied object
	 *
	 * @return    {Function}  get
	 * @memberof  Accessor
	 */
	getter() {
		return (target, key) => {
			const candidate = this.searchOne({ target, key });

			return candidate ? candidate.value : (target[key] || und);
		};
	}

	/**
	 *  Obtain a function to handle the `set` proxy calls, keeps track of changes without immediately
	 *  modifying the proxied object
	 *
	 * @return    {Function}  set
	 * @memberof  Accessor
	 */
	setter() {
		return (target, key, value) => {
			const candidate = this.searchOne({ target, key });

			if (candidate) {
				return (candidate.value = value);
			}

			return this.mutations.push({ target, key, value });
		};
	}

	/**
	 *  Obtain a handler object for use with a Proxy instance
	 *
	 * @readonly
	 * @memberof  Accessor
	 */
	get handler() {
		return {
			getOwnPropertyDescriptor: this.descriptor(),
			ownKeys: this.keys(),
			has: this.contains(),
			get: this.getter(),
			set: this.setter(),
		};
	}

	/**
	 *  Obtain all mutations
	 *
	 *  @readonly
	 *  @memberof  Accessor
	 */
	get mutations() {
		return storage.get(this).mutations;
	}

	/**
	 *  Commit all changes to the proxied object
	 *
	 *  @memberof  Accessor
	 */
	commit() {
		const { mutations } = this;

		mutations.forEach((mut) => (mut.target[mut.key] = mut.value));
		mutations.splice(0, mutations.length);
	}

	/**
	 *  Remove all mutations
	 *
	 *  @memberof  Accessor
	 */
	rollback() {
		const { mutations } = this;

		mutations.splice(0, mutations.length);
	}
}

module.exports = Accessor;
