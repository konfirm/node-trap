import { any, isFunction, isObject, isString, isStructure, isSymbol } from "@konfirm/guard"

export type MutationOptions<T extends object = object> = {
	target: T;
	key: string | symbol;
	value?: unknown;
}

export const isMutationOptions = isStructure<MutationOptions>({
	target: any(isObject, isFunction),
	key: any(isString, isSymbol),
});
