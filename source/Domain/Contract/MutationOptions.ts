import { any, assertion, isArray, isFunction, isObject, isString, isStructure, isSymbol } from "@konfirm/guard"

export type MutationOptions<T extends object = object> = {
	target: T;
	key: string | symbol;
	value?: unknown;
}

export const isMutationOptions = isStructure<MutationOptions>(
	{
		target: any(isObject, isFunction, isArray),
		key: any(isString, isSymbol),
		value: () => true,
	},
	'value'
);
export const assertMutationOptions = assertion<MutationOptions>('Invalid MutationOptions', isMutationOptions);
