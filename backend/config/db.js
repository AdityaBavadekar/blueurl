import mongoose from "mongoose";

function connectDB(){
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