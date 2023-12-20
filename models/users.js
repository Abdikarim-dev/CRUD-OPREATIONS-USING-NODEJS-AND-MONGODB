const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    // First Field
    name : {
        type:String,
        required:true,
    },
    // Second Field
    email : {
        type:String,
        required:true,
    },
    // Third Field
    phone : {
        type:String,
        required:true,
    },
    // Fourth Field
    image : {
        type:String,
        required:true,
    },
    // Fifth Field
    created : {
        type:Date,
        required:true,
        default:Date.now,
    }
});
module.exports = mongoose.model('User',userSchema);