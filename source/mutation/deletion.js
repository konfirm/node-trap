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

module.exports = Deletion;
