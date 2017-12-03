const Mutation = require('./mutation');

class Deletion extends Mutation {
	apply() {
		delete this.target[this.key];
	}
}

module.exports = Deletion;
