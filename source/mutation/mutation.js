const storage = new WeakMap();

/**
 *  A single mutation record, indication a value change
 *
 *  @class  Mutation
 */
class Mutation {
	/**
	 *  Creates an instance of Mutation
	 *
	 *  @param     {Object}  target
	 *  @param     {String}  key
	 *  @param     {any}     value
	 *  @memberof  Mutation
	 */
	constructor(...args) {
		const order = [ 'target', 'key', 'value' ];

		storage.set(this, new Map(order.map((key, index) => [ key, args[index] ])));
	}

	/**
	 *  Apply the mutation to the target, changing the value for given key
	 *
	 *  @memberof  Mutation
	 */
	apply() {
		this.target[this.key] = this.value;
	}

	/**
	 *  Determine whether the seek map key/value pairs match the mutation
	 *  key/value pairs
	 *
	 *  @param     {Map}      seek
	 *  @return    {Boolean}  matches
	 *  @memberof  Mutation
	 */
	matches(seek) {
		const map = storage.get(this);

		for (const [ key, value ] of seek) {
			if (!(map.has(key) && map.get(key) === value)) {
				return false;
			}
		}

		return true;
	}

	/**
	 *  Obtain the (lower case) name of the Mutation instance
	 *
	 *  @readonly
	 *  @memberof  Mutation
	 */
	get name() {
		return this.constructor.name.toLowerCase();
	}

	/**
	 *  Obtain the configured target
	 *
	 *  @readonly
	 *  @memberof  Mutation
	 */
	get target() {
		const map = storage.get(this);

		return map.get('target');
	}

	/**
	 *  Obtain the configured key
	 *
	 *  @readonly
	 *  @memberof  Mutation
	 */
	get key() {
		const map = storage.get(this);

		return map.get('key');
	}

	/**
	 *  Obtain the configured value
	 *
	 *  @readonly
	 *  @memberof  Mutation
	 */
	get value() {
		const map = storage.get(this);

		return map.get('value');
	}

	/**
	 *  Represent the mutation as a string
	 *
	 *  @return    {String}  mutation info
	 *  @memberof  Mutation
	 */
	toString() {
		return `${ this.name }: ${ this.key } = ${ this.value }`;
	}

	/**
	 *  Represent the mutation as a JSONable object
	 *
	 *  @return    {Object}  JSONable mutation
	 *  @memberof  Mutation
	 */
	toJSON() {
		return { name: this.name, key: this.key, value: this.value };
	}
}

module.exports = Mutation;
