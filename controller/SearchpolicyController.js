'use strict'
const user = require('../routes/schemas/userSchema');
const policy = require('../routes/schemas/policySchema');

module.exports = class SearchpolicyController{
    static async searchPolicy(req,res){
        try {
            let obj = req.query.username;
            const users = await user.findOne({ firstname: obj });
            if (!users) return res.status(404).json({ error: 'User not found' });
            const policies = await policy.find({ userId: users._id });
            if(!policies) return res.status(404).json({ error: 'Policies not found' });
            res.status(200).json(policies);   
        } catch (error) {
            console.log(error);
            throw error;            
        }
    }    
}