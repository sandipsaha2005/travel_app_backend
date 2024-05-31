export const sendToken = (user, stausCode,res,message)=>{
    const token=user.getJwtToken();
    const options={
        expires: new Date(
            Date.now()+ process.env.COOKIE_EXPIRE * 24 * 60 * 1000
        ),
        httpOnly:true
    }
    res.status(stausCode).cookie('token',token , options).json({
        success:true,
        user,
        message,
        token
    });
}