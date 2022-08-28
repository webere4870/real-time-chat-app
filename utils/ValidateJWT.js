let jwt = require('jsonwebtoken')
require('dotenv').config()

function ValidateJWT(req, res, next)
{
    if(req.cookies)
    {
        if(req.cookies["jwt"])
        {
            try{
               let valid = jwt.verify(req.cookies["jwt"], process.env.JWT_KEY)
               if(valid)
               {
                req.JWT = valid
                next()
               } 
               else{
                res.clearCookie("jwt")
                res.redirect("/login")
               }
            }
            catch(err)
            {
                res.clearCookie("jwt")
                res.redirect("/login")
            }
        }
        else
        {
            res.redirect("/login")
        }
    }
    else{
        res.redirect("/login")
    }
}

module.exports = ValidateJWT