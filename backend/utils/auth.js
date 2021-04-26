var jwt = require('jsonwebtoken');
const config = require('config');

exports.verifyToken = async (req,res,next) => {
    try {
        
        if(!req.headers.authorization){
            return res.status(200).json({message:"Unautorized Access..."});
        }

        const token = req.headers.authorization.split(" ")[1];
        
        if(!token){
           return res.status(200).json({message:"Unautorized Access..."});
        }

        jwt.verify(token, config.get('myprivatekey'), function(err, decoded) {
            
            if(err){
               return res.status(200).json({message:"Invalid Token..."});
            } else {
                req['userType'] = decoded['userType'];
                if(decoded['userId']){
                    req['userId'] = decoded['userId'];
                }else if(decoded['adminId']){
                    req['adminId'] = decoded['adminId'];
                }
                next();
            }            
        });
    } catch (error) {
       return res.status(200).json({message:"Internal Server error..."})
    }
}

exports.isMetaAdmin = async (req,res,next) => {
    try {
        
        if(req['userType'] == 'Meta'){
            console.log('req[userType]',req['userType'])
            next();
        } else {
            return res.status(200).json({message:"Only Meta admin can access..."})
        }

    } catch (error) {
        return res.status(200).json({message:"Internal Server error..."});
    }
}  