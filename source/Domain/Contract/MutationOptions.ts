import { any, isObject, isString, isStructure, isSymbol } from "@konfirm/guard"

export type MutationOptions<T extends object = object> = {
	target: T;
	key: string | symbol;
	value?: unknown;
}

export const isMutationOptions = isStructure<MutationOptions>({
	target: isObject,
	key: any(isString, isSymbol),
});
