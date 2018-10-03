var mongoose = require("mongoose")

var reviewSchema = new mongoose.Schema({
    rating: {
        //Type of rating
        type: Number,
        
        //Making star rating
        required: "Please provide a rating",
        //define min and max stars
        min: 0,
        max: 5,
        //Adding validations
        validate: {
            validator: Number.isInteger,
            message: " {VALUE} is not an integer value"
        }
    },
    // Text attached to rating
    text: {
        type: String
    },
    // connecting author to rating
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    //Connecting campground to review
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Campground"
    }
}, {
// if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
    timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);
