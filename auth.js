// [Dependencies and Modules]
const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("./models/User");


const secret = `${process.env.AUTH_SECRET}`;

module.exports.createAccessToken = (userId, res) =>{


  const token = jwt.sign({userId}, secret, {expiresIn: "2d"})

  res.cookie("jwt", token, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development" 
  });

};

module.exports.verify = (req,res, next) => {
  let token = req.headers.authorization;

  if(typeof token === "undefined"){
    return res.error({auth: "Failed. No Token"})
  }else{
    token = token.slice(7, token.length);
    jwt.verify(token, secret, function(err,decodedToken){
      if(err){
        return res.error({
          auth: "Failed",
          message: err.message
        })
      }else{
        console.log(`Result from verify method:`)
        console.log(decodedToken);
        req.user = decodedToken;
        next();
      }
    })
  }
}
module.exports.removeCookie = async (req,res) =>{
	res.cookie("jwt", "", { maxAge: 0 });
}

module.exports.protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(403).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      return res.status(403).json({ error: "Unauthorized - Invalid token" });
    }

    console.log("Decoded token:", decoded); // Add logging to verify token content
    console.log("User model:", User); // Add logging to check if User model is loaded correctly

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log(`protectRoute:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.isLoggedIn = (req,res,next) =>{

	if(req.user){
		next()
	}else{
		res.status(401).send()
	}

}