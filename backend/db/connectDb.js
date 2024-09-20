import mongoose from "mongoose";

const connectedDb = async()=>{
    try {
        const db = await mongoose.connect(`mongodb://localhost:27017/chatapp`);
        console.log(`database conneted successfully 😉`)
    } catch (error) {
        console.log(error)
    }
}
export default connectedDb