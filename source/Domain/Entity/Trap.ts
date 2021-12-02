import { DescriptorMapper } from "@konfirm/descriptor";
import type { MutationInterface } from "../Contract/MutationInterface";
import type { MutationOptions } from "../Contract/MutationOptions";
import { DeletionMutation } from "../ValueObject/DeletionMutation";
import { PropertyMutation } from "../ValueObject/PropertyMutation";
import { ValueMutation } from "../ValueObject/ValueMutation";
import { Collection } from "./Collection";

/**
 * ProxyHandler implementation
 *
 * @export
 * @class Trap
 * @template T
 * @template O
 */
export class Trap<T extends object = object, O extends MutationOptions<T> = MutationOptions<T>> {
	private readonly mutations: Collection<MutationInterface<O>>;

	/**
	 * Creates an instance of Trap
	 *
	 * @param {boolean} [onlyLastKeyMutation=false]
	 * @memberof Trap
	 */
	constructor(private readonly onlyLastKeyMutation: boolean = false) {
		this.mutations = Collection.for<MutationInterface<O>>(this);
	}

	/**
	 * trap for property definition
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @param {PropertyDescriptor} descriptor
	 * @return {*}  {boolean}
	 * @memberof Trap
	 */
	defineProperty(target: T, key: string | symbol, descriptor: PropertyDescriptor): boolean {
		const { enumerable = Array.from(this.ownKeys(target)).indexOf(key) >= 0 } = descriptor || {};
		const value = descriptor && Object.assign({ enumerable }, descriptor);

		return this.insert(new PropertyMutation<O>(<O>{ target, key, value }));
	}

	/**
	 * trap for property deletion
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @return {*}  {boolean}
	 * @memberof Trap
	 */
	deleteProperty(target: T, key: string | symbol): boolean {
		const mutation = new DeletionMutation<O>(<O>{ target, key });

		return (this.onlyLastKeyMutation && this.purge(mutation) >= 0 && !Object.getOwnPropertyDescriptor(target, key)) || this.insert(mutation);
	}

	/**
	 * trap for property reading
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @return {*}  {unknown}
	 * @memberof Trap
	 */
	get(target: T, key: string | symbol): unknown {
		const { [key as keyof T]: initial } = target;

		return this.mutations.findAll({ target, key })
			.reduce((_, { value }: any) => value, initial);
	}

	/**
	 * trap for reading property definition
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @return {*}  {(PropertyDescriptor | undefined)}
	 * @memberof Trap
	 */
	getOwnPropertyDescriptor(target: T, key: string | symbol): PropertyDescriptor | undefined {
		const initial = Object.assign({}, Object.getOwnPropertyDescriptor(target, key));
		const combined = this.mutations.findAll({ target, key })
			.reduce(
				(carry = {}, { descriptor }) => DescriptorMapper.merge(carry, descriptor),
				initial
			);

		return combined && Object.keys(combined).length ? combined : undefined;
	}

	/**
	 * trap for testing whether a property exists
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @return {*}  {boolean}
	 * @memberof Trap
	 */
	has(target: T, key: string | symbol): boolean {
		return this.mutations.findAll({ target, key })
			.reduce((_, mutation) => !(mutation instanceof DeletionMutation), key in target);
	}

	/**
	 * trap for reading all (enumerable) properties
	 *
	 * @param {T} target
	 * @return {*}  {(ArrayLike<string | symbol>)}
	 * @memberof Trap
	 */
	ownKeys(target: T): ArrayLike<string | symbol> {
		return this.mutations.findAll({ target })
			.reduce(
				(carry: Array<string | symbol>, mutation) =>
					mutation instanceof DeletionMutation || (mutation instanceof PropertyMutation && !mutation.descriptor?.enumerable)
						? carry.filter((key) => key !== mutation.key)
						: carry.concat(mutation.key),
				Object.keys(target)
			)
			.filter((v, i, a) => a.indexOf(v) === i);
	}

	/**
	 * trap for writing property values
	 *
	 * @param {T} target
	 * @param {(string | symbol)} key
	 * @param {unknown} value
	 * @return {*}  {boolean}
	 * @memberof Trap
	 */
	set(target: T, key: string | symbol, value: unknown): boolean {
		const mutation = new ValueMutation<O>(<O>{ target, key, value });

		return (this.onlyLastKeyMutation && this.purge(mutation) >= 0 && target[key] === value) || this.insert(mutation);
	}

	/**
	 * Determine the number of mutations, optionally reduced to mutations matching the provided structure
	 *
	 * @param {Partial<O>} [seek]
	 * @return {*}  {number}
	 * @memberof Trap
	 */
	count(seek?: Partial<O>): number {
		return this.mutations.count(seek);
	}

	/**
	 * commit all or a subset of collected mutations
	 *
	 * @param {Partial<O>} [seek={}]
	 * @memberof Trap
	 */
	commit(seek: Partial<O> = {}): void {
		this.eject(seek)
			.forEach((mutation) => mutation.apply());
	}

	/**
	 * rolls back all or a subset of collected mutations
	 *
	 * @param {Partial<O>} [seek={}]
	 * @memberof Trap
	 */
	rollback(seek: Partial<O> = {}): void {
		this.eject(seek);
	}

	/**
	 * insert a mutation, cleaning up any mutation that is no longer needed
	 *
	 * @private
	 * @param {(DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>)} mutation
	 * @return {*}  {boolean}
	 * @memberof Trap
	 */
	private insert(mutation: DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>): boolean {
		this.purge(mutation);

		return Boolean(this.mutations.push(mutation));
	}

	/**
	 * remove all mutations matching the search argument
	 *
	 * @private
	 * @param {Partial<O>} seek
	 * @return {*}  {Array<MutationInterface<O>>}
	 * @memberof Trap
	 */
	private eject(seek: Partial<O>): Array<MutationInterface<O>> {
		return this.mutations.pull(...this.mutations.findAll(seek));
	}

	/**
	 * remove mutations with the same target and key if only the last mutation shoudl be tracked
	 *
	 * @private
	 * @param {(DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>)} { target, key }
	 * @return {*}  {number}
	 * @memberof Trap
	 */
	private purge({ target, key }: DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>): number {
		return this.onlyLastKeyMutation
			? this.eject(<O>{ target, key }).length
			: 0;
	}
}
