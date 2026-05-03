import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function connect(){
    mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser: true,
            useUnifiedTopology: true})
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })
}

export default connect