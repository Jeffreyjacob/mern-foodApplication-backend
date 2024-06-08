import mongoose from "mongoose";


const ConnectDB = (url:any)=>{
 mongoose.connect(url)
}

export default ConnectDB