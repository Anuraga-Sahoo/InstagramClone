import mongoose from 'mongoose'

const connectDB = async ( )=> {
  try {
     mongoose.connect(process.env.MONGODB_URI);
     console.log('mongodb connected successfully....')
  } catch (error) {
     console.log(error)
  }
}

export default connectDB