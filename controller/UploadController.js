'use strict'

const { Worker } = require('worker_threads');

module.exports = class UploadCSVController{
    static async uploadCSV(req,res){
        try {
            let obj = req.file.path;
            const worker = new Worker('./worker.js', { workerData: obj });
            worker.on('message', (msg) => res.json({ status: 'success', msg }));
            worker.on('error', (err) => res.status(500).json({ error: err.message }));     
        } catch (error) {
            console.log(error);
            throw error;            
        }
    }    
}