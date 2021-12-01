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

	defineProperty(target: T, key: string | symbol, descriptor: PropertyDescriptor): boolean {
		const { enumerable = Array.from(this.ownKeys(target)).indexOf(key) >= 0 } = descriptor || {};
		const value = descriptor && Object.assign({ enumerable }, descriptor);

		return this.insert(new PropertyMutation<O>(<O>{ target, key, value }));
	}

	deleteProperty(target: T, key: string | symbol): boolean {
		const mutation = new DeletionMutation<O>(<O>{ target, key });

		return (this.onlyLastKeyMutation && this.purge(mutation) >= 0 && !Object.getOwnPropertyDescriptor(target, key)) || this.insert(mutation);
	}

	get(target: T, key: string | symbol): unknown {
		const { [key as keyof T]: initial } = target;

		return this.mutations.findAll({ target, key })
			.reduce((_, { value }: any) => value, initial);
	}

	getOwnPropertyDescriptor(target: T, key: string | symbol): PropertyDescriptor | undefined {
		const initial = Object.assign({}, Object.getOwnPropertyDescriptor(target, key));
		const combined = this.mutations.findAll({ target, key })
			.reduce(
				(carry = {}, { descriptor }) => DescriptorMapper.merge(carry, descriptor),
				initial
			);

		return combined && Object.keys(combined).length ? combined : undefined;
	}

	has(target: T, key: string | symbol): boolean {
		return this.mutations.findAll({ target, key })
			.reduce((_, mutation) => !(mutation instanceof DeletionMutation), key in target);
	}

	ownKeys(target: T): ArrayLike<string | symbol> {
		return this.mutations.findAll({ target })
			.reduce(
				(carry: Array<string | symbol>, mutation) => mutation.visible
					? carry.concat(mutation.key)
					: carry.filter((key) => key !== mutation.key),
				Object.keys(target)
			);
	}

	set(target: T, key: string | symbol, value: unknown): boolean {
		const mutation = new ValueMutation<O>(<O>{ target, key, value });

		return (this.onlyLastKeyMutation && this.purge(mutation) >= 0 && target[key] === value) || this.insert(mutation);
	}

	commit(seek: Partial<O> = {}): void {
		this.eject(seek)
			.forEach((mutation) => mutation.apply());
	}

	rollback(seek: Partial<O> = {}): void {
		this.eject(seek);
	}

	private insert(mutation: DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>): boolean {
		this.purge(mutation);

		return Boolean(this.mutations.push(mutation));
	}

	private eject(seek: Partial<O>): Array<MutationInterface<O>> {
		return this.mutations.pull(...this.mutations.findAll(seek));
	}

	private purge({ target, key }: DeletionMutation<O> | PropertyMutation<O> | ValueMutation<O>): number {
		return this.onlyLastKeyMutation
			? this.eject(<O>{ target, key }).length
			: 0;
	}
}
