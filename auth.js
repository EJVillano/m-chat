// [Dependencies and Modules]
const jwt = require("jsonwebtoken");
require('dotenv').config();

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

module.exports.isLoggedIn = (req,res,next) =>{

	if(req.user){
		next()
	}else{
		res.status(401).send()
	}

}