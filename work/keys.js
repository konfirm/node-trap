const subject = { aaa: 'aaa', bbb: 'bbb' };
const proof = [ 'a', 'b', 'c' ];
const proxy = new Proxy(subject, {
	getOwnPropertyDescriptor: (target, key) => {
		console.log(key);

		return proof
			.filter((name) => name === key)
			.reduce((carry, name) => {
				const out = carry || {
					configurable: true,
					enumerable: true,
					value: name,
				};

				return out;
			}, Object.getOwnPropertyDescriptor(target, key));
	},
	ownKeys: (target) => Object.keys(target).concat(proof),
});

console.log(Object.keys(proxy), proxy, subject);
