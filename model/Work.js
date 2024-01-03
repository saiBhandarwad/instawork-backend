const {Schema, default: mongoose} = require('mongoose')

const work = new Schema({
    type:{
        type : String,
        required : true
    },
    detail:{
        type : String,
        required : true
    },
    address:{
        type : String,
        required : true
    },
    city:{
        type : String,
        required : true
    },
    duration:{
        type : Number,
        required : true
    },
    startDate:{
        type : Date,
        required : true,
    },
    endDate:{
        type : Date,
        required : true
    },
    salaryPeriod:{
        type : String,
        required : true
    },
    salary:{
        type : Number,
        required : true
    },
    user:{
        type : Object,
        required : true
    },
    owner:{
        type : String,
        required : true
    },
    postedDate:{
        type : Number,
        required : true
    }

})
const Work = mongoose.model("work",work)
module.exports = Work