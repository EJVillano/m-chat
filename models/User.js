const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	
	firstName: {
		type: String,
		required: [true, 'First Name is Required']
	},
	lastName: {
		type: String,
		required: [true, 'Last Name is Required']
	},
	email: {
		type: String,
		required: [true, 'Email is Required']
	},
	password: {
		type: String,
		required: [true, 'Password is Required'],
		minlength:6
	},
	username: {
		type: String,
		required: [true, 'User Name is Required']
	},
	avatar: {
		type: String,
		default: ""
	}
});


module.exports = mongoose.model('User', userSchema);