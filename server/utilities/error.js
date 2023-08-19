export const createError = (statusCode, message)=>{
    const error = new Error();
    error.message = message || "Something went wrong!";
    error.statusCode = statusCode || 404;
    return error;
}