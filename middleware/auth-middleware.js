const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next) => {

  console.log('auth middleware is called');

  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)

  if(!token) {
    res.status(401).json({
      success : false,
      message : 'Access denied. No token provided. Please login to continue 401 '
    })
  }

  console.log(authHeader);


  //decode this token
  try{

    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRECT_KEY);

    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;

    next()

  }catch(err) {
    return res.status(500).json({
      success : false,
       message : 'Access denied. No token provided. Please login to continue'
    })
  }



  // next();
}

module.exports = authMiddleware;

