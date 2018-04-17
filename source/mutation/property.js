const Mutation = require('./mutation');

/**
  *  A single mutation record, indication a property (re)definition
 *
 * @class    Property
 * @extends  {Mutation}
 */
class Property extends Mutation {
	/**
	 *  Apply the mutation to the target, (re)defining the key on the target
	 *
	 *  @memberof  Mutation
	 */
	apply() {
		Object.defineProperty(this.target, this.key, this.descriptor);
	}

	/**
	 *  Create the full descriptor with defaults for the provided descriptor
	 *
	 *  @readonly
	 *  @memberof  Property
	 */
	get descriptor() {
		return Object.assign(
			this.constructor.DEFAULT_DESCRIPTOR,
			super.value
		);
	}

	get value() {
		const descriptor = super.value;
		const { value, get } = descriptor || {};

		return get ? get() : value;
	}

	/**
	 *  Obtain the default descriptor settings, reflecting the default values
	 *  used by defineProperty (which are different to the ones used by basic
	 *  object properties)
	 *
	 *  @readonly
	 *  @memberof  Property
	 */
	static get DEFAULT_DESCRIPTOR() {
		return {
			configurable: false,
			enumerable: false,
			writable: false,
		};
	}

	/**
	 *  Represent the mutation as a string
	 *
	 *  @return    {String}  mutation info
	 *  @memberof  Mutation
	 */
	toString() {
		return `${ this.name }: ${ this.key }`;
	}

	/**
	 *  Represent the mutation as a JSONable object
	 *
	 *  @return    {Object}  JSONable mutation
	 *  @memberof  Mutation
	 */
	toJSON() {
		return { name: this.name, key: this.key };
	}
}

module.exports = Property;
