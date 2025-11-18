const validateAuthUsers =(req,res,next)=>{
    const {name,email,password,phone,address,role} = req.body
    if(!name || !password || !role || !email || !phone || !address){
        return res.status(400).json({error:'All fields are required'})
    }
    next();
}

module.exports=validateAuthUsers;