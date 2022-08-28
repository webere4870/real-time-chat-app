let UserSchema = require('./Schema')
let bcrypt = require('bcrypt')

async function VerifyUser(username, password)
{
    let profile = await UserSchema.findById(username)

    return new Promise((resolve, reject)=>
    {
        if(profile)
        {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, profile.salt, (err, hash) => {
                    if(hash == profile.hash)
                    {
                        resolve(true)
                    }
                    else
                    {
                        resolve(false)
                    }
                });
            });
        }
        else
        {
            resolve(false)
        }
        
    })
    

}

module.exports = VerifyUser