import {v2 as cloudinary} from 'cloudinary'

const cloudinaryConfig = cloudinary.config({

})

const upload = async(localpath)=>{
   let image = await cloudinary.uploader.upload()
    return image
}
export default upload