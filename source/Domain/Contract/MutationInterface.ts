import { Descriptor, isDescriptor } from "@konfirm/descriptor";
import { any, isBoolean, isFunction, isObject, isString, isStructure, isSymbol, isUndefined } from "@konfirm/guard";
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
	readonly visible: boolean;

	apply(): void;
}

export const isMutationInterface = isStructure<MutationInterface>(
	{
		name: isString,
		target: any(isObject, isFunction),
		key: any(isString, isSymbol),
		value: () => true,
		descriptor: any(isUndefined, isDescriptor),
		apply: isFunction,
		visible: isBoolean,
	},
	['value']
);
