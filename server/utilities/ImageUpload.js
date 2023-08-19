import multer from 'multer';
import path from 'path';
import { createError } from './error.js';

export const uploader = (
    maxFileSize,
    errorMessage
) => {
    const storage = multer.diskStorage({
        'filename': (req, file, cb)=>{
            const extName = path.extname(file.originalname);
            const fileName = file.originalname.replace(extName, "").toLocaleLowerCase().split(" ").join("_")+Date.now()+extName;
            cb(null, fileName)
        }
    })

    const upload = multer({
        'storage': storage,
        'limits': {
            'fileSize': maxFileSize,
        },
        'fileFilter': (req, file, cb)=>{
            if(file.mimetype.startsWith("image/")){
                cb(null, true);
            }else{
                cb(createError(501, errorMessage));
            }
        }
    })

    return upload;
}