/**
 * Error indication an invalid type was provided
 *
 * @class InvalidTypeError
 * @extends {Error}
 */
export class InvalidTypeError extends Error {
	/**
	 * Creates an instance of InvalidTypeError
	 *
	 * @param {*} args
	 * @memberof InvalidTypeError
	 */
	constructor(...args) {
		super(...args);

		Error.captureStackTrace(InvalidTypeError);
	}
}
