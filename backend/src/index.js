import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { json } from 'express'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from './routes/message.route.js'


dotenv.config({})

const app = express()
const PORT = process.env.PORT || 5000
//midlewares
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended: true}))

const corsOptions = {
   origin: 'http://localhost:5173',
   credentials: true
}
app.use(cors(corsOptions))

app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)



app.get('/', (req, res) => {
   return res.status(200).json({message: "i am comming from backend",
    success: true
  })
})

app.listen(PORT, ()=>{
  connectDB()
  console.log(`Server running on http://localhost:${PORT}`)
})