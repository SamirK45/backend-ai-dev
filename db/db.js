import mongoose, { Mongoose } from "mongoose";
import config from "../config/config.js";

function connect(){
    mongoose.connect(config.db.uri, config.db.options)
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })
}

export default connect