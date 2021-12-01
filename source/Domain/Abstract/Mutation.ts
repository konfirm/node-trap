import type { MutationOptions } from '../Contract/MutationOptions';
import type { MutationInterface } from '../Contract/MutationInterface';

const store: WeakMap<AbstractMutation, MutationOptions> = new WeakMap();

/**
 * Abstract Mutation
 *
 * @export
 * @abstract
 * @class AbstractMutation
 * @implements {MutationInterface<T>}
 * @template T
 */
export abstract class AbstractMutation<T extends MutationOptions = MutationOptions> implements MutationInterface<T> {
	/**
	 * Creates an instance of AbstractMutation
	 *
	 * @param {T} options
	 * @memberof AbstractMutation
	 */
	constructor(options: T) {
		store.set(this, options);
	}

	/**
	 * the name
	 *
	 * @readonly
	 * @type {string}
	 * @memberof AbstractMutation
	 */
	get name(): string {
		const { constructor: { name } } = Object.getPrototypeOf(this);

		return name.replace(/([^A-Z]+)([A-Z]+)/g, "$1-$2").toLowerCase();
	}

	/**
	 * the target
	 *
	 * @readonly
	 * @type {T['target']}
	 * @memberof AbstractMutation
	 */
	get target(): T['target'] {
		const { target } = store.get(this);

		return target;
	}

	/**
	 * the key
	 *
	 * @readonly
	 * @type {T['key']}
	 * @memberof AbstractMutation
	 */
	get key(): T['key'] {
		const { key } = store.get(this);

		return key;
	}

	/**
	 * the value
	 *
	 * @readonly
	 * @type {T['value']}
	 * @memberof AbstractMutation
	 */
	get value(): T['value'] {
		const { value } = store.get(this);

		return value;
	}

	/**
	 * The (property) descriptor
	 *
	 * @readonly
	 * @type {(PropertyDescriptor | undefined)}
	 * @memberof AbstractMutation
	 */
	get descriptor(): PropertyDescriptor | undefined {
		return undefined;
	}

	/**
	 * Apply the mutation on its target
	 *
	 * @memberof AbstractMutation
	 */
	apply(): void {
		throw new Error('Not implemented');
	}

	/**
	 * toString implementation
	 *
	 * @param {string} [template='{name}: {key} = {value}']
	 * @return {*}  {string}
	 * @memberof AbstractMutation
	 */
	toString(template: string = '{name}: {key} = {value}'): string {
		return template.replace(/\{([^\}]+)\}/g, (_, key) => this[key]);
	}

	/**
	 * toJSON implementation
	 *
	 * @return {*}  {{ [key: string]: unknown }}
	 * @memberof AbstractMutation
	 */
	toJSON(): { [key: string]: unknown } {
		const { name, key, value } = this;

		return { name, key, value };
	}
}
