import mongoose from "mongoose";
import { getConfig } from "../config/config.js";

async function connect(){
    const config = await getConfig();
    mongoose.connect(config.db.uri, config.db.options)
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })
}

export default connect