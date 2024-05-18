// [Dependencies and Moodules]
const bcrypt = require("bcrypt")
const User = require("../models/User.js");
const auth = require("../auth.js")

module.exports.registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, username, password, confirmPassword  } = req.body;
		const existingEmail = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });

		if (!email.includes("@")) {
			return res.status(400).send({ error: "Email invalid" });
		}

		if (password.length < 8) {
			return res.status(400).send({ error: "Password must be at least 8 characters" });
		}

		if (confirmPassword !== password ){
			return res.status(400).send({ error: "Passwords does not match" });
		}

		if (existingEmail) {
			return res.status(400).send({ error: "Email already exists" });
		}

		if (existingUsername) {
			return res.status(400).send({ error: `${username} username is already taken` });
		}


		const hashedPassword = bcrypt.hashSync(password, 10);

		const newUser = new User({
			firstName,
			lastName,
			username,
			email,
			password: hashedPassword,
			avatar: `https://api.dicebear.com/8.x/big-smile/svg?seed=${firstName}_${lastName}`
		});

		auth.createAccessToken(newUser._id, res);
		await newUser.save();

		return res.status(201).send({ message: "Registered Successfully" });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).send({ error: "Internal Server Error" });
	}
};

module.exports.loginUser = async (req, res) => {
	try {
	  const { email, username, password } = req.body;
	  
	  if (!email && !username) {
		return res.status(400).send({ error: "Invalid Email/Username" });
	  }
  
	  const criteria = email ? { email } : { username };
	  const user = await User.findOne(criteria);
	  
	  if (!user) {
		const errorField = email ? 'Email' : 'Username';
		return res.status(404).send({ error: `${errorField} does not exist` });
	  }
  
	  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
	  
	  if (!isPasswordCorrect) {
		const errorMessage = email ? "Email and password do not match" : "Username and password do not match";
		return res.status(401).send({ message: errorMessage });
	  }
  
	  auth.createAccessToken(user._id, res);
  
	  return res.status(200).send({
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		avatar: user.avatar
	  });
	  
	} catch (err) {
	  console.error("Error in loginUser: ", err);
	  return res.status(500).send({ error: "Internal Server Error" });
	}
};

module.exports.logoutUser = async(req, res) => {
	try{
		auth.removeCookie(req, res);
		res.status(200).send({message: "Logged out successfully"});
	}catch(err){
		console.error(err);
		res.status(500).send({error: "Internal Server Error"})
	}
	
}
