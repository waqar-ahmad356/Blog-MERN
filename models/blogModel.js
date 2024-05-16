const mongoose = require("mongoose");
const userModel = require("./userModel");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [10, "Title must be contain 8 characters"],
    maxLength: [40, "Title cannot exceed 40 characters"],
  },
  mainImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  intro: {
    type: String,
    required: true,
    minLength: [250, "Intro must be contain 250 characters"],
  },
  introImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true }
  },
    subTitlOne: {
      type: String,
      minLength: [50, "sub title must be contain 50 characters"],
    },

    subContenOne: {
      type: String,
      minLength: [250, "sub content must be contain 8 characters"],
      
    },
  
  subImageOne: {
    public_id: { type: String },
    url: { type: String },
  },
  subTitleTwo: {
    type: String,
    minLength: [10, "sub title two must be contain 8 characters"],
   
  },
  subContenTwo: {},
  subImageTwo: {
     public_id: { type: String },
      url: { type: String }
 },
  subTitleThree: {
    type: String,
    minLength: [10, "sub title three must be contain 10 characters"],
  },
  subContenThree: {
    type: String,
    minLength: [250, "sub content must be contain 8 characters"],
    
  },
  subImageThree: {
     public_id: { type: String }, 
     url: { type: String }
 },
  category: { 
    type: String,
    required: true 
},
  createdBy: { 
    type: mongoose.Schema.ObjectId,
    ref: userModel,
    required: true
 },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
});

const blogModel = mongoose.model.blog || mongoose.model("blog", blogSchema);

module.exports = blogModel;
