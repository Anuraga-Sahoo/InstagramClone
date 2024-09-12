import sharp from "sharp" // in this file we use sharp to optimized post image
import cloudinary from "../utils/cloudinary"
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js"


// add new post
export const addNewPost = async (req, res) => {

  try {
    const {caption} = req.body
    const image = req.file
    const authorId = req.id

    if(!image){
      return res.status(400).json({message: 'Image required'})
    }

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer).resize({width:800, height:800, fit: 'inside'})
    .toFormat('jpeg',{quality: 80})
    .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
    const cloudResponse = await cloudinary.uploader.upload(fileUri)
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId
    })

    const user = await User.findById(authorId)
    if(user){
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({path:'author', select: '-password'})

    return res.status(201).json({
      message: "New post added",
      post,
      success:true,
    })


  } catch (error) {
    console.log(error)
  }
}


// get all post

export const getAllPost = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}