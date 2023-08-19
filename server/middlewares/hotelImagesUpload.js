import { uploader } from "../utilities/ImageUpload.js";
import { createError } from "../utilities/error.js";

export const hotelImageUpload = (req, res, next)=>{
    const upload = uploader(
        50000000,
        "Only images are allowed!",
    )

    upload.any()(req, res, (err)=>{
        if(err){
            next(createError(404, err))
        }else{
            next();
        }
    })
}