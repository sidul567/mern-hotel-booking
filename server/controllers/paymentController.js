import Razorpay from 'razorpay';
import crypto from 'crypto';

export const getRazorKey = async (req, res, next)=>{
    try{
        res.status(200).json({key: process.env.RAZORPAY_API_KEY});
    }catch(err){
        next(err);
    }
}

export const checkout = async(req, res, next)=>{
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_APT_SECRET,
      });
    try{
        var options = {
            amount: Number(req.body.total*100), 
            currency: "INR",
          };
          const order = await instance.orders.create(options);
          res.json({
            success: true,
            order,
          }) 
    }catch(err){
        next(err);
    }
}

export const paymentVerification = async(req, res, next)=>{
    try{
      const {razor_payment_id, razorpay_order_id, razorpay_signature} = req.body;
      const body = razorpay_order_id+"|"+razor_payment_id;
      const expected_signature = crypto.createHmac("sha256",process.env.RAZORPAY_APT_SECRET).update(body.toString()).digest("hex");

      if(expected_signature === razorpay_signature){
        res.json({success: true});
      }else{
        res.json({success: false});
      }
    }catch(err){
        next(err)
    }
}