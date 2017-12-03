const Mutation = require('./mutation');

/**
 *  A single mutation record, indication a key deletion
 *
 *  @class    Deletion
 *  @extends  {Mutation}
 */
class Deletion extends Mutation {
	/**
	 *  Apply the mutation to the target, removing the key from the target
	 *
	 *  @memberof  Deletion
	 */
	apply() {
		delete this.target[this.key];
	}
}

module.exports = Deletion;
