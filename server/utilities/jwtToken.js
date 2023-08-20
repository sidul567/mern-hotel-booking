import jwt from 'jsonwebtoken';

export const sendToken  = async (res, user)=>{
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })

    const {password, ...others} = user._doc;

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() +  process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: 'none'
    }).status(200).json({
        success: true,
        user: others, 
    })
}