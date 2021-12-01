import { Descriptor, isDescriptor } from "@konfirm/descriptor";
import { any, isBoolean, isFunction, isObject, isStrictStructure, isString, isSymbol, isUndefined } from "@konfirm/guard";
import type { MutationOptions } from "./MutationOptions";

/**
 * Interface describing a Mutation
 *
 * @export
 * @interface MutationInterface
 * @template T
 */
export interface MutationInterface<T extends MutationOptions = MutationOptions> {
	readonly name: string;
	readonly target: T['target'];
	readonly key: T['key'];
	readonly value: T['value'];
	readonly descriptor: Descriptor | undefined;

	apply(): void;
}

export const isMutationInterface = isStrictStructure<MutationInterface>(
	{
		name: isString,
		target: any(isObject, isFunction),
		key: any(isString, isSymbol),
		value: () => true,
		descriptor: any(isUndefined, isDescriptor),
		apply: isFunction,
	},
	['value']
);
