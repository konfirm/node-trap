/**
 * Error indication an invalid type was provided
 *
 * @class InvalidTypeError
 * @extends {Error}
 */
class InvalidTypeError extends Error {
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

module.exports = InvalidTypeError;
