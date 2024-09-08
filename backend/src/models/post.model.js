import mongoose, { Schema, Types } from "mongoose";

const postSchema = new mongoose.Schema({
  caption:{
    type:String,
    default: ''
  },
  image:{
    type:String,
    required: true
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  like:[
    {type:mongoose.Schema.ObjectId,
      ref: 'User',
    }
  ],
  comments:[
    {
      type: mongoose.Schema.ObjectId,
      ref:'Comment'
    }
  ]
})

export const Post = mongoose.model('Post', postSchema)