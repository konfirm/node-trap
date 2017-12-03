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

	get descriptor() {
		return Object.assign(
			this.constructor.DEFAULT_DESCRIPTOR,
			this.value
		);
	}

	static get DEFAULT_DESCRIPTOR() {
		return {
			configurable: false,
			enumerable: false,
			writable: false,
		};
	}
}

module.exports = Property;
