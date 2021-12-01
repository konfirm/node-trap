import { any, isFunction, isObject, isStrictStructure, isString, isSymbol } from "@konfirm/guard"

export type MutationOptions<T extends object = object> = {
	target: T;
	key: string | symbol;
	value?: unknown;
}

export const isMutationOptions = isStrictStructure<MutationOptions>(
	{
		target: any(isObject, isFunction),
		key: any(isString, isSymbol),
		value: (value: any) => true,
	},
	'value'
);
