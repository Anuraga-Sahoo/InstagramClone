import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";


// User Register
export const register = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    if(!username || !email || !password){
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      })
    }
    const user = await User.findOne({email});
    if(user){
      return res.status(401).json({
        message: "Try different email",
        success: false,
      })
    };
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
      username,
      email,
      password: hashedPassword
    })

    return res.status(201).json({
      message: "Account created Successfully",
      success: true,
    })

  } catch (error) {
    console.log(error)
  }
}

// User Login
export const login = async (req, res) => {
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      })
    }

    let user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
          message: "incorrect email or password",
          success: false,
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
      return res.status(401).json({
        message: "incorrect email or password",
        success: false,
      })
   }
    user = {
       _id: user._id,
       username: user.username, 
       email: user.email,
       profilePicture: user.profilePicture,
       bio: user.bio,
       followers: user.followers,
       following: user.following,
       posts: user.posts,
    }
    const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY, {expiresIn:'1d'})

    return res.cookie('token', token, {httpOnly:true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
      message: `Welcome! back ${user.username}`,
      success: true,
      user
    })

  }catch(error){
    console.log(error)
  }
}

//Account Logout
export const logout = async (_, res) => {
  try {
    return res.cookie('token', "", {maxAge:0}).json({
      message: 'Logged out Successfully.',
      success: true,
    })
  } catch (error) {
    console.log(
      error
    )
  }
} 

// get profiles
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id
    let user = await User.findById(userId);
    return res.status(200).json({
      user,
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}

// edit profile

export const editProfile = async (req, res) => {
  try{
    const userId = req.id;
    const {bio, gender} = req.body;
    const profilePicture = req.file;
    let cloudResponse ;

    if(profilePicture){
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri)
    }
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({
        message: "User not Found.",
        success: false
      })
    }
    if(bio) user.bio = bio
    if(gender) user.gender = gender;
    if(profilePicture) user.profilePicture = cloudResponse.secure_url

    await user.save();

    return res.status(200).json({
      message: 'Profile Updated.',
      success: true,
      user
    })
  }catch(error){
    console.log(error)
  }
}