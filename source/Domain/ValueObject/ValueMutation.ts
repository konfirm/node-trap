import { DescriptorMapper } from "@konfirm/descriptor";
import { AbstractMutation } from "../Abstract/Mutation";
import { MutationOptions } from "../Contract/MutationOptions";

/**
 * Value Mutation
 *
 * @export
 * @class ValueMutation
 * @extends {AbstractMutation<T>}
 * @template T
 */
export class ValueMutation<T extends MutationOptions = MutationOptions> extends AbstractMutation<T> {
	/**
	 * get name
	 *
	 * @readonly
	 * @type {string}
	 * @memberof ValueMutation
	 */
	get name(): string {
		return 'value-mutation';
	}

	/**
	 * get descriptor
	 *
	 * @readonly
	 * @type {PropertyDescriptor}
	 * @memberof ValueMutation
	 */
	get descriptor(): PropertyDescriptor {
		const { target, key, value } = this;

		return DescriptorMapper.merge(
			Object.getOwnPropertyDescriptor(target, key) || { configurable: true, enumerable: true, writable: true },
			{ value }
		);

		return { configurable: true, enumerable: true, value, writable: true };
	}

	/**
	 * apply the property mutation to the target
	 *
	 * @memberof ValueMutation
	 */
	apply(): void {
		const { target, key, value } = this;

		(<unknown>target)[key] = value;
	}
}
