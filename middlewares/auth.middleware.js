import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const result = {};
result.checkAuth = async (req, res,next) => {  
  
  try {
   
    var token = req.headers.authorization.split(' ')[1];
  
    if (!token) return res.status(400).send("Access Denied!, no token entered");
    try {
      var tok = jwt.sign({ website: 'droppa' }, 'droppa');
     const verified = jwt.verify(token,process.env.jwtSecret);
     //console.log('ver',verified);
     //console.log('tok',tok);
    
      if(verified.website != process.env.jwtSecret){
        return res.status(400).send({ error: "auth failed, check auth-token" });

      }
     // console.log('token',tok);
     
    req.basepath = '/var/www/html/uploadfiles/'+verified.website;
    req.ref = verified.website;
     //req.user = verified;
      next();
    } catch (err) {
     
      return res.status(200).send({ error: "auth failed, check auth-token" });
    }
    //const token = req.headers.authorization.split(' ')[1];
  //  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
   
    /*const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }*/
  } catch(error){
    let base = {}
    
    base.message = `service checkAuth error : ${error}`;
    base.success = false;
    base.responseCode = 401;
    base.data = undefined;
    return res.status( base.responseCode).json(base);
   
  }
};


export default result;