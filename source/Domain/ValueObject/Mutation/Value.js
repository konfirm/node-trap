const AbstractMutation = require("../../Abstract/Mutation.js");

/**
 *  A single mutation record, indication a value change
 */
class ValueMutation extends AbstractMutation {
	/**
	 *  Apply the mutation to the target, changing the value for given key
	 */
	apply() {
		this.target[this.key] = this.value;
	}

	/**
	 *  Represent the mutation as a string
	 */
	toString() {
		const string = super.toString();
		const { value } = this;

		return `${string} = ${value}`;
	}

	/**
	 *  Represent the mutation as a JSONable object
	 */
	toJSON() {
		const json = super.toJSON();
		const { value } = this;

		return { ...json, value };
	}
}

module.exports = ValueMutation;
