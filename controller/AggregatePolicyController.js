'use strict'

const policy = require('../routes/schemas/policySchema');

module.exports = class AggregatePolicyController{
    static async AggregatePolicy(req,res){
        try {
            const result = await policy.aggregate([
                { $group: { _id: '$userId', totalPolicies: { $sum: 1 } } }
            ]);
            if(!result) return res.status(404).json({ error: 'Not found' });
            res.json(result);    
        } catch (error) {
            console.log(error);
            throw error;            
        }
    }    
}