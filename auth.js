// [Dependencies and Modules]
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = `${process.env.REACT_APP_API_BASE_URL}`;

module.exports.createAccessToken = (user) =>{

  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin
  }

  return jwt.sign(data, secret, {});

}

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

module.exports.verifyAdmin  = (req, res, next) => {
  console.log("resilt from verifyadmin metohd:");
  console.log(req.user);

  if(req.user.isAdmin){
    next()
  }else{
    return res.status(403).send({
      "auth":"Failed",
			message:"Action Forbidden"
    })
  }
}

module.exports.isLoggedIn = (req,res,next) =>{

	if(req.user){
		next()
	}else{
		res.status(401).send()
	}

}