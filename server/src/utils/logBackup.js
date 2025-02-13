const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const { logError } = require('./logger');

const errorFilePath = path.join(__dirname, '..', 'logs', 'errors.log');
const backupDir = path.join(__dirname, '..', 'logs', 'backup');

function transformAndBackupFile () {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  fs.readFile(errorFilePath, 'utf8', (err, data) => {
    if (err) {
      logError(err);
      return;
    }

    const transformedData = data
      .split('\n')
      .map(line => {
        if (!line.trim()) return null;

        try {
          const parsedLine = JSON.parse(line);
          return {
            message: parsedLine.message,
            code: parsedLine.code,
            time: new Date(parsedLine.time).getTime(),
          };
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    const timestamp = new Date().toISOString().split('T')[0];
    const backupFileName = `${timestamp}-errors.log`;
    const backupFilePath = path.join(backupDir, backupFileName);

    fs.writeFile(
      backupFilePath,
      JSON.stringify(transformedData, null, 2),
      'utf8',
      writeErr => {
        if (writeErr) {
          logError(writeErr);
          return;
        }

        console.log(`Бэкап файла создан: ${backupFilePath}`);

        fs.truncate(errorFilePath, 0, truncateErr => {
          if (truncateErr) {
            logError(truncateErr);
            return;
          }
        });
      }
    );
  });
}

schedule.scheduleJob('0 6 * * *', () => {
  transformAndBackupFile();
});

module.exports = transformAndBackupFile;
