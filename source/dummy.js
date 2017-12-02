const crypto = require('crypto');
const Accessor = require('./accessor');

const storage = new WeakMap();

/**
 *  Crash Test Dummy
 *
 *  @class  Dummy
 */
class Dummy {
	/**
	 *  Create a Dummy target
	 *
	 *  @static
	 *  @param     {Object}  target
	 *  @return    {Proxy}   dummy
	 *  @memberof  Dummy
	 */
	static create(target) {
		const accessor = new Accessor();
		const { proxy, revoke } = Proxy.revocable(target, accessor.handler);

		storage.set(proxy, { target, revoke, accessor });

		return proxy;
	}

	static checksum(proxy) {
		return Object.keys(proxy)
			.sort((one, two) => one < two ? -1 : +(one > two))
			.reduce((checksum, key) => checksum.update(`${key}:${proxy[key]}`), crypto.createHash('sha256'))
			.digest('hex');
	}

	static finalize(proxy, commit=true) {
		if (!storage.has(proxy)) {
			throw new Error(`Unknown Dummy: ${proxy}`);
		}

		const { target, revoke, accessor } = storage.get(proxy);

		revoke();

		if (commit) {
			accessor.commit();
		}
		else {
			accessor.rollback();
		}

		storage.delete(proxy);

		return target;
	}

	static commit(proxy) {
		return this.finalize(proxy, true);
	}

	static rollback(proxy) {
		return this.finalize(proxy, false);
	}
}

module.exports = Dummy;
