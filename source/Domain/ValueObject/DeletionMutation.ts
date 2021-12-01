import { AbstractMutation } from "../Abstract/Mutation";
import { MutationOptions } from "../Contract/MutationOptions";

/**
 * Deletion Mutation
 *
 * @export
 * @class DeletionMutation
 * @extends {AbstractMutation<T>}
 * @template T
 */
export class DeletionMutation<T extends MutationOptions = MutationOptions> extends AbstractMutation<T> {
	/**
	 * get name
	 *
	 * @readonly
	 * @type {string}
	 * @memberof DeletionMutation
	 */
	get name(): string {
		return 'deletion-mutation';
	}

	/**
	 * get value (always undefined)
	 *
	 * @readonly
	 * @type {T['value']}
	 * @memberof DeletionMutation
	 */
	get value(): T['value'] {
		return undefined;
	}

	/**
	 * The (property) visibility
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof AbstractMutation
	 */
	get visible(): boolean {
		return false;
	}

	/**
	 * apply the property mutation to the target
	 *
	 * @memberof DeletionMutation
	 */
	apply(): void {
		const { target, key } = this;

		delete (<unknown>target)[key];
	}

	/**
	 * return the string representation of the deletion mutation
	 *
	 * @param {string} [template='{name}: {key}']
	 * @return {*}  {string}
	 * @memberof DeletionMutation
	 */
	toString(template: string = '{name}: {key}'): string {
		return super.toString(template);
	}
}
