// notifications.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const AUDIT_DB_PATH = path.join(__dirname, 'audit_log.db');

function openAuditLogDb() {
  let db = new sqlite3.Database(AUDIT_DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error('Error opening audit log database', err.message);
    } else {
      console.log('Connected to the audit log database.');
      db.run(`CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        confirmationCode TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        event TEXT NOT NULL
      )`, [], (err) => {
        if (err) {
          console.error('Error creating audit_log table', err.message);
        }
      });
    }
  });
  return db;
}
function doctorNotification(data) {
    // logic to send notification to the doctor
    console.log(`Doctor notified about cancellation: ${data.confirmationCode}`);
    // Replace console.log with real notification code
  }
  
  function secretaryNotification(data) {
    // logic to send notification to the secretary
    console.log(`Secretary notified about cancellation: ${data.confirmationCode}`);
    // Replace console.log with real notification code
  }
  
  function auditLogger(data) {
    // logic to log the cancellation for audit purposes
    console.log(`Audit log entry for cancellation: ${data.confirmationCode}`);
    // Replace console.log with actual logging code
  }
  
  module.exports = {
    doctorNotification,
    secretaryNotification,
    auditLogger
  };
  
