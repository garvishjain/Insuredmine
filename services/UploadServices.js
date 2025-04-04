const { Worker } = require('worker_threads');

module.exports = class UploadCSVService {
    static async UploadCSV(objUser) {
        // try {
            const worker = new Worker('./worker.js', { workerData: objUser });
            worker.on('message', (msg) => res.json({ status: 'success', msg }));
            worker.on('error', (err) => res.status(500).json({ error: err.message }));
        // } catch (error) {
        //     console.log(error);
        //     throw error;
        // }
    }
}