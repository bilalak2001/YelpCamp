var mongoose = require("mongoose"),
    Campground=require("./models/campground"),
    Comment   =require("./models/comment")
    
var data = [
    {
              name:  "Tower star", 
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKPkl6-QTpNwNUzYKWgb3GqYUeQWyG8BgQPPYkGL8MFwnodqaM",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."  
    },
    {
              name:"Salmon Creek", 
              image: "https://res.cloudinary.com/simplotel/image/upload/x_0,y_260,w_5000,h_2813,r_0,c_crop,q_60,fl_progressive/w_400,f_auto,c_fit/youreka/Tirthan_Camp_Adventure_Camps_for_Kids_Summer_Camps_in_India_txetur",
              description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
    
]        


function seedDB(){
    //Remove all Campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        } 
        console.log("removed campgrounds!");
       //add a few campgrounds
        // data.forEach(function(seed){
        //     Campground.create(seed, function(err, campground){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             console.log("added a campground");
        //             //create a comments
        //             Comment.create(
        //                 {
        //                     text:"This place is great, but i need the interwebz",
        //                     author: "Homer"
        //                 },function(err, comment){
        //                     if(err){
        //                         console.log(err);
        //                     } else{
        //                         campground.comments.push(comment);
        //                         campground.save();      
        //                         console.log("Created a new comment")
        //                     }

        //                 });
        //         }
        //     }); 
        // });
    }); 
}

module.exports = seedDB;