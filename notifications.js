// notifications.js

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
  