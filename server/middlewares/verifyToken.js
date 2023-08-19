import jwt from "jsonwebtoken";
import { createError } from "../utilities/error.js";

export const verifyToken = (req, res, next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(createError(404, "You are not authorized!"));
    }
    try{
        const decoded_data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded_data;
        next();
    }catch(err){
        return next(createError(404, "Token is not valid!"));
    }
}

export const verifyUser = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user || (req.user.id === req.params.id || req.user.isAdmin)){
            next();
        }else{
            return next(createError(404, "You are not authorized!"));
        }
    });
}

export const verifyAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user && req.user.isAdmin){
            next();
        }else{
            return next(createError(404, "You are not an admin!"));
        }
    })
}