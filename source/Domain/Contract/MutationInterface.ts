import type { MutationOptions } from "./MutationOptions";
import { any, isBoolean, isFunction, isObject, isString, isStructure, isSymbol, isUndefined } from "@konfirm/guard";
import { isPropertyDescriptor } from '../Guard/PropertyDescriptor';

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
	readonly descriptor: PropertyDescriptor | undefined;
	readonly visible: boolean;

	apply(): void;
}

export const isMutationInterface = isStructure<MutationInterface>({
	name: isString,
	target: any(isObject, isFunction),
	key: any(isString, isSymbol),
	value: () => true,
	descriptor: any(isUndefined, isPropertyDescriptor),
	apply: isFunction,
	visible: isBoolean,
}, ['value']);
