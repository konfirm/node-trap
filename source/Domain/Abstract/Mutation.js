const storage = new WeakMap();

/**
 * Mutation abstraction
 *
 * @class AbstractMutation
 */
class AbstractMutation {
	/**
	 * Creates an instance of AbstractMutation
	 *
	 * @param {*} args
	 * @memberof AbstractMutation
	 */
	constructor(...args) {
		const order = ["target", "key", "value"];

		// storage.set(this, order.reduce((carry, key, index) => Object.assign(carry, { [key]: args[index] }), {}));
		storage.set(
			this,
			new Map(order.map((key, index) => [key, args[index]]))
		);
	}

	/**
	 * Determine whether the seek map key/value pairs match the mutation
	 * key/value pairs
	 *
	 * @param {Map} seek
	 * @returns {Boolean} matches
	 * @memberof AbstractMutation
	 */
	matches(seek) {
		const map = storage.get(this);

		// return Object.keys(seek).every((key) => seek[key] === map[seek]);
		for (const [key, value] of seek) {
			if (!(map.has(key) && map.get(key) === value)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Apply the mutation to the target, changing the value for given key
	 *
	 * @memberof AbstractMutation
	 */
	apply() {
		throw new Error("Not implemented");
	}

	/**
	 * Obtain the name of the Mutation
	 *
	 * @readonly
	 * @memberof AbstractMutation
	 */
	get name() {
		const {
			constructor: { name }
		} = this;

		return name.replace(/([^A-Z]+)([A-Z]+)/g, "$1-$2").toLowerCase();
	}

	/**
	 * Obtain the configured target
	 *
	 * @readonly
	 * @memberof AbstractMutation
	 */
	get target() {
		const map = storage.get(this);

		return map.get("target");
	}

	/**
	 * Obtain the configured key
	 *
	 * @readonly
	 * @memberof AbstractMutation
	 */
	get key() {
		const map = storage.get(this);

		return map.get("key");
	}

	/**
	 * Obtain the configured value
	 *
	 * @readonly
	 * @memberof AbstractMutation
	 */
	get value() {
		const map = storage.get(this);

		return map.get("value");
	}

	/**
	 * Create the string representation of the Mutation
	 *
	 * @returns {String} mutation
	 * @memberof AbstractMutation
	 */
	toString() {
		const { name, key } = this;

		return `${name}: ${key}`;
	}

	/**
	 * Create the JSON(able) representation of the Mutation
	 *
	 * @returns {Object} mutation
	 * @memberof AbstractMutation
	 */
	toJSON() {
		const { name, key } = this;

		return { name, key };
	}
}

module.exports = AbstractMutation;
