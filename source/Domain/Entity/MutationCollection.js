const AbstractMutation = require('../Abstract/Mutation.js');
const InvalidTypeError = require('../Error/InvalidType.js');

/**
 * @typedef Seek
 * @property {object=} target The mutation target
 * @property {string=} key    The mutation key (property)
 * @property {*=}      value  The mutation value
 */

/**
 * Collection to contain only AbstractMutation instances
 *
 * @class MutationCollection
 * @extends {Array}
 */
class MutationCollection extends Array {
	/**
	 * Creates an instance of MutationCollection
	 * @memberof MutationCollection
	 */
	constructor() {
		//  prevent construction with an initial length or any mutations
		super();
	}

	/**
	 * Search for matching AbstractMutation instances within the collection
	 *
	 * @param {Seek} seek
	 * @returns {MutationCollection} matches
	 * @memberof MutationCollection
	 */
	search(seek) {
		const map = new Map(Object.keys(seek).map(key => [key, seek[key]]));

		return this.filter((mutation) => mutation.matches(map));
	}

	/**
	 * Remove matching AbstractMutation instances from the collection
	 *
	 * @param {Seek} seek
	 * @returns {number} removal count
	 * @memberof MutationCollection
	 */
	purge(seek) {
		return this.search(seek)
			.reduce((carry, mutation) => carry.concat(this.indexOf(mutation), carry), [])
			.reduce((carry, index) => carry.concat(this.splice(index, 1)), [])
			.length;
	}

	/**
	 * Append one or more AbstractMutation instances to the collection
	 *
	 * @param {...AbstractMutation} args
	 * @throws {InvalidTypeError} error
	 * @returns {number} length
	 * @memberof MutationCollection
	 */
	push(...args) {
		if (!this.validate(...args)) {
			throw new InvalidTypeError('Trying to add a non AbstractMutation');
		}

		return super.push(...args);
	}

	/**
	 * Prepend one or more AbstractMutation instances to the collection
	 *
	 * @param {...AbstractMutation} args
	 * @throws {InvalidTypeError} error
	 * @returns {number} length
	 * @memberof MutationCollection
	 */
	unshift(...args) {
		if (!this.validate(...args)) {
			throw new InvalidTypeError('Trying to add a non AbstractMutation');
		}

		return super.unshift(...args);
	}

	/**
	 * Add and/or remove AbstractMutation instances to/from the collection
	 *
	 * @param {number} start
	 * @param {number} count
	 * @param {...AbstractMutation} inject
	 * @throws {InvalidTypeError} error
	 * @returns {number} next index
	 * @memberof MutationCollection
	 */
	splice(start, count, ...inject) {
		if (!this.validate(...inject)) {
			throw new InvalidTypeError('Trying to add a non AbstractMutation');
		}

		return super.splice(start, count, ...inject);
	}

	/**
	 * Flush all AbstractMutation instances from the collection, optionally with a 
	 * callback for each instance
	 *
	 * @param {function=} cleanup
	 * @memberof MutationCollection
	 */
	flush(cleanup) {
		if (cleanup) {
			this.forEach(cleanup);
		}

		this.length = 0;
	}

	/**
	 * Validate one or more values to be AbstractMutation instances and valid to add
	 * to the collection
	 *
	 * @param {...*} args
	 * @returns {boolean} valid
	 * @memberof MutationCollection
	 */
	validate(...args) {
		const { constructor } = this;

		return constructor.valid(...args);
	}

	/**
	 * Validate one or more values to be AbstractMutation instances and valid to add
	 * to the collection
	 *
	 * @static
	 * @param {...*} args
	 * @returns {boolean} valid
	 * @memberof MutationCollection
	 */
	static valid(...args) {
		return !args.length || args.every((item) => item instanceof AbstractMutation);
	}
}

module.exports = MutationCollection;
