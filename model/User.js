const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    address: {
        type: String,
    },
    city:{
        type: String,
    },
    skills: {
        type: String,
        default: "fresher",
        required: true,
    },
    experiance: {
        type: String,
        default:"fresher",
        required: true,
    },
    rating: {
        type: String,
        default: "fresher",
        required: true,
    },
    reviews: {
        type: Object,
        default: "fresher",
        required: true,
    },
})
const User = mongoose.model("user",userSchema)
module.exports = User