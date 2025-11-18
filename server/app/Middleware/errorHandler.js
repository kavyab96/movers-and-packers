const errorHandler =(error,req,res,next)=>{
    const statusCode = reportError.statusCode ||500; //set a default status code or use what's provided
    const message = error.message ||"Internal Server Error"; //set a default error msg or use what's provide
    //send a JSON response with error details
    res.status(statusCode).json({
        success:false,
        message:message
    })
}
module.exports=errorHandler;