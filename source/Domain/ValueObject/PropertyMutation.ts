import { DescriptorMapper, isDescriptor } from "@konfirm/descriptor";
import { isUndefined } from "@konfirm/guard";
import { AbstractMutation } from "../Abstract/Mutation";
import { MutationOptions } from "../Contract/MutationOptions";

/**
 * Property Mutation
 *
 * @export
 * @class PropertyMutation
 * @extends {AbstractMutation<T>}
 * @template T
 */
export class PropertyMutation<T extends MutationOptions = MutationOptions> extends AbstractMutation<T> {
	/**
	 * Creates an instance of PropertyMutation
	 *
	 * @param {T} options
	 * @memberof PropertyMutation
	 */
	constructor(options: T) {
		if (!(isUndefined(options.value) || isDescriptor(options.value))) {
			throw new Error('Not a valid PropertyDescriptor');
		}

		super(options);
	}

	/**
	 * get name
	 *
	 * @readonly
	 * @type {string}
	 * @memberof PropertyMutation
	 */
	get name(): string {
		return 'property-mutation';
	}

	/**
	 * get descriptor
	 *
	 * @readonly
	 * @type {PropertyDescriptor}
	 * @memberof PropertyMutation
	 */
	get descriptor(): PropertyDescriptor {
		const { target, key } = this;

		return DescriptorMapper.merge(Object.getOwnPropertyDescriptor(target, key), super.value)
	}

	/**
	 * get value
	 *
	 * @readonly
	 * @type {T['value']}
	 * @memberof PropertyMutation
	 */
	get value(): T['value'] {
		const { value, get } = super.value as PropertyDescriptor;

		return get ? get() : value;
	}

	/**
	 * The (property) visibility
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof AbstractMutation
	 */
	get visible(): boolean {
		const { descriptor: { enumerable = false } = {} } = this;

		return enumerable;
	}

	/**
	 * apply the property mutation to the target
	 *
	 * @memberof PropertyMutation
	 */
	apply(): void {
		const { target, key, descriptor } = this;

		Object.defineProperty(target, key, descriptor);
	}
}

