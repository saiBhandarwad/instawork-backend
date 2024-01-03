const {Schema, default: mongoose} = require('mongoose')

const savedJobs = new Schema({
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
    email:{
        type : String,
        required : true
    },
    postedDate:{
        type : Number,
        required : true
    },
    id:{
        type : String,
        required : true
    }

})
const SavedJobs = mongoose.model("savedJobs",savedJobs)
module.exports = SavedJobs