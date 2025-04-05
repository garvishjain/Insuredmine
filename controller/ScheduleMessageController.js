'use strict'
const Message = require('../routes/schemas/messageSchema');

module.exports = class ScheduleMessageController{
    static async ScheduleMessage(req,res){
        try {
            const { message, day, time } = req.body;
        
            // Combine day and time into a Date
            const scheduleDate = new Date(`${day}T${time}:00`);
        
            if (scheduleDate < new Date()) {
                return res.status(400).json({ message: "Date must be in the future." });
            }
        
            // Save the message in DB with scheduled time
            const saved = await Message.create({ message, scheduledAt: scheduleDate });
        
            // Schedule the insert job
            schedule.scheduleJob(scheduleDate, async () => {
                await Message.updateOne({ _id: saved._id }, { $set: { inserted: true } });
                console.log(`Message inserted: ${saved.message}`);
            });
        
            res.json({ message: "Message scheduled successfully!" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error scheduling message." });
        }
    }    
}