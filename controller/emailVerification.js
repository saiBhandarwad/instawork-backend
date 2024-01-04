const nodemailer = require('nodemailer')


const emailVerification = async(req,res) =>{
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: 'instaworker.com@gmail.com',
                pass: 'orwkgrhfdskcyoww'
            }
        });
        const OTP = Math.round(Math.random()*10000)
        //console.log({OTP,body:req.body});
        const info = await transporter.sendMail({
            from: "instaworker.com@gmail.com" , // sender address
            to: req.body.data.email, // list of receivers
            subject: "instawork verification", // Subject line
            text:`Hi user your verification code for instawork is ${OTP}`,
            html: `<b>Your verification code for instawork is ${OTP}</b>`, // html body
          });
        
          res.json({OTP,success:true})
    } catch (error) {
        res.json({error,success:false})
    }
}
module.exports = emailVerification