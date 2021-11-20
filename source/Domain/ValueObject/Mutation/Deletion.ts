import { AbstractMutation } from '../../Abstract/Mutation'

/**
 *  A single mutation record, indication a key deletion
 *
 *  @class    DeletionMutation
 *  @extends  {AbstractMutation}
 */
export class DeletionMutation extends AbstractMutation {
	/**
	 *  Apply the mutation to the target, removing the key from the target
	 *
	 *  @memberof  DeletionMutation
	 */
	apply() {
		delete this.target[this.key];
	}
}
