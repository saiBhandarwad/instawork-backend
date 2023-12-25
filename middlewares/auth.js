const User = require('../model/User')
const jwt = require('jsonwebtoken')
const SEC_KEY =process.env.JWT_SEC

const auth = async (req, res, next) => {
    try {
        console.log({headers:req.body.headers});
        let authTokenFromHeader;
    for (let key in req.body.headers) {
        if (key === 'token') {
            authTokenFromHeader = req.body.headers[key]
        }
    }
    if(authTokenFromHeader){
        const {email} = jwt.verify(authTokenFromHeader,SEC_KEY)
        const user = await User.find({email}).select('-password')
        // console.log({user});
        if(user.length === 0){
            res.send('please login using valid token')
            return;
        }
        req.userId = user[0]._id
        // console.log({id1:req.userId, id2:user[0]._id});
        next()
        return;
    }else{
            res.send('please provide token!')
            return;
    }
    } catch (error) {
        console.log({error:error.message})
    }
    
}
module.exports = auth