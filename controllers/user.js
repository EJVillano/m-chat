// [Dependencies and Moodules]
const bcrypt = require("bcrypt")
const User = require("../models/User.js");
const auth = require("../auth.js")

module.exports.registerUser = (req,res) => {
	// checks if the email is in the right format
	if (!req.body.email.includes("@")){
		return res.status(400).send({ error: "Email invalid" });
	}
	// checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({ error: "Mobile number invalid" });
	}
	// checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be atleast 8 characters" });
	}
	// if all needed formats are achieved
	else {
		// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
		// Uses the information from the request body to provide all the necessary information
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		})
		// Saves the created object to our database
		return newUser.save()
		.then((user) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(err => {
			console.error("Error in saving: ", err);
			return res.status(500).send({ error: "Error in save"});
		})
	}
};

module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		User.findOne({ email : req.body.email })
		.then(result => {
			if(result == null){
				return res.status(404).send({ error: "No Email Found" });
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if (isPasswordCorrect) {
					return res.status(200).send({ access : auth.createAccessToken(result)});
				} else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		})
		.catch(err => {
			console.error("Error in find: ", err)
			return res.status(500).send({ error: "Error in find"})
		})
		}
		else {
			return res.status(400).send({error: "Invalid Email"})
		}
};