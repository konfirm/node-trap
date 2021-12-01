const storage: WeakMap<object, Collection<any>> = new WeakMap();

/**
 * Collection for objects
 *
 * @export
 * @class Collection
 * @template T
 */
export class Collection<T extends object> {
	private readonly items: Array<T> = [];

	/**
	 * Creates an instance of Collection
	 *
	 * @param {...Array<T>} items
	 * @memberof Collection
	 */
	constructor(...items: Array<T>) {
		this.push(...items);
	}

	/**
	 * Push items into the Collection
	 *
	 * @param {...Array<T>} items
	 * @return {*}  {number}
	 * @memberof Collection
	 */
	push(...items: Array<T>): number {
		const { length } = this.items;

		this.items.push(...items.filter((item) => !this.items.includes(item)));

		return this.items.length - length;
	}

	/**
	 * Pull items from the Collection
	 *
	 * @param {...Array<T>} items
	 * @return {*}  {Array<T>}
	 * @memberof Collection
	 */
	pull(...items: Array<T>): Array<T> {
		return items
			.reduce((carry, item) => carry.concat(this.items.splice(this.items.indexOf(item), 1)), []);
	}

	/**
	 * Find the first item in the collection based on a (partial) structure
	 *
	 * @param {Partial<T>} seek
	 * @return {*}  {(T | undefined)}
	 * @memberof Collection
	 */
	find(seek: Partial<T>): T | undefined {
		return this.items.find(this.seeker(seek));
	}

	/**
	 * Find all items in the collection matching a (partial) structure
	 *
	 * @param {Partial<T>} seek
	 * @return {*}  {Array<T>}
	 * @memberof Collection
	 */
	findAll(seek: Partial<T>): Array<T> {
		return this.items.filter(this.seeker(seek));
	}

	/**
	 * Create a filter function for matching the given structure
	 *
	 * @private
	 * @param {Partial<T>} seek
	 * @return {*}  {(item: T) => boolean}
	 * @memberof Collection
	 */
	private seeker(seek: Partial<T>): (item: T) => boolean {
		const keys = Object.keys(seek);

		return (item: T): boolean => keys.every((key) => item[key] === seek[key]);
	}

	/**
	 * Factory a Collection for given reference
	 *
	 * @static
	 * @template T
	 * @param {object} ref
	 * @return {*}  {Collection<T>}
	 * @memberof Collection
	 */
	static for<T extends object>(ref: object): Collection<T> {
		if (!storage.has(ref)) {
			storage.set(ref, new Collection<T>());
		}
		return storage.get(ref);
	}
}

