import mongoose from "mongoose";

function connectDB(){
    console.log("Connecting to Mongo db");
    
    try {
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Mongo db connected");
        })
        .catch((e)=>{
            console.error("Error connecting to Mongo db!", e);
        })
    } catch (error) {
        console.log("Error connecting to Mongo db!", error);
    }
}

export { connectDB }