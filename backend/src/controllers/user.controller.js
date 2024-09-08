import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        
    }
    const token =await jwt.sign({userId:user._id},process.env.SECRET_KEY, {expiresIn:'1d'})

    return res.cookie('token', token, {httpOnly:true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
      message: `Welcome! back ${user.username}`,
      success: true,
    })

  }catch(error){
    console.log(error)
  }
}