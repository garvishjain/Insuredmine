// monitor.js
const pidusage = require('pidusage');
const { exec } = require('child_process');

const monitorCPU = (intervalMs = 5000, threshold = 70) => {
  setInterval(() => {
    pidusage(process.pid, (err, stats) => {
      if (err) return console.error('Error getting CPU stats:', err);

      console.log(`CPU: ${stats.cpu.toFixed(2)}%`);

      if (stats.cpu > threshold) {
        console.log(`CPU usage crossed ${threshold}%, restarting server...`);
        
        // Gracefully stop current process
        exec('pm2 restart all', (err, stdout, stderr) => {
          if (err) {
            console.error('Restart failed:', err);
            return;
          }
          console.log('Server restarted successfully.');
        });
      }
    });
  }, intervalMs);
};

module.exports = monitorCPU;
