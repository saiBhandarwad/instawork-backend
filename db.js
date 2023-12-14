const mongoose = require('mongoose')
connectToMongo=(url)=>{
    mongoose.connect(url).then(()=>console.log('database connected'))
}

module.exports = connectToMongo