import { AbstractMutation } from "../../Abstract/Mutation";

/**
 *  A single mutation record, indication a property (re)definition
 *
 * @class    PropertyMutation
 * @extends  {AbstractMutation}
 */
export class PropertyMutation extends AbstractMutation {
	/**
	 *  Apply the mutation to the target, (re)defining the key on the target
	 *
	 *  @memberof  PropertyMutation
	 */
	apply() {
		Object.defineProperty(this.target, this.key, this.descriptor);
	}

	/**
	 *  Create the full descriptor with defaults for the provided descriptor
	 *
	 *  @readonly
	 *  @memberof  PropertyMutation
	 */
	get descriptor() {
		const combined = Object.assign(
			{
				configurable: false,
				enumerable: false,
				writable: false
			},
			Object.getOwnPropertyDescriptor(this.target, this.key) || {},
			super.value
		);
		const exclude = [].concat(combined.get ? ["writable", "value"] : []);

		return exclude.reduce((carry, key) => {
			const { [key]: omit, ...rest } = carry;

			return rest;
		}, combined);
	}

	/**
	 * Obtain the configured value
	 *
	 * @readonly
	 * @memberof PropertyMutation
	 */
	get value() {
		const descriptor = super.value;
		const { value, get } = descriptor || {};

		return get ? get() : value;
	}
}
