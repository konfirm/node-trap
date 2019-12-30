const AbstractMutation = require("../../Abstract/Mutation.js");

/**
 *  A single mutation record, indication a key deletion
 *
 *  @class    DeletionMutation
 *  @extends  {AbstractMutation}
 */
class DeletionMutation extends AbstractMutation {
	/**
	 *  Apply the mutation to the target, removing the key from the target
	 *
	 *  @memberof  DeletionMutation
	 */
	apply() {
		delete this.target[this.key];
	}
}

module.exports = DeletionMutation;
