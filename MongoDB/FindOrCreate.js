let UserSchema = require('./Schema')
let bcrypt = require('bcrypt')

async function FindOrCreate(username, password, res)
{
    return new Promise((resolve, reject)=>
    {
        UserSchema.findOne({_id: username}, (err, result)=>
        {
            if(result == null)
            {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async function(err, hash) {
                        let newRecord = await UserSchema.create({_id: username, hash: hash, salt: salt})
                        await newRecord.save()
                        resolve({inserted: true})
                    });
                })
            }
            else
            {
                resolve({inserted: false})
            }
        })
    })
}

module.exports = FindOrCreate