const twilio = require('twilio')
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN 
const client = twilio(accountSid,authToken)
const twilioPhoneNo = process.env.TWILIO_PHONE_NO
sendOTP = (req,res) => {

    const {phone} = req.body.data
    const OTP = Math.round(Math.random()*10000)

    /* OTP sending using twillio */

    client.messages.create({
        body:"your one time password for instawork mobile verification is "+OTP,
        from:twilioPhoneNo,
        to:"+91"+phone
    }).then(()=>{
        res.json({OTP,success:true})
    }).catch((err)=>{
        //console.log({err});
        res.json({err,success:false})
    })

    
}
module.exports = sendOTP