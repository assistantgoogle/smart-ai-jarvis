require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

const app = express();
app.use(bodyParser.json());

// Configure your email transporter securely
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USER_EMAIL, // Load from environment variable
    pass: process.env.USER_PASS   // App-specific password (never hardcode passwords!)
  }
});

/**
 * POST /api/reminders
 * Expects:
 * - email: Recipient's email
 * - task: Reminder message
 * - reminderTime: ISO timestamp (UTC)
 */
app.post('/api/reminders', (req, res) => {
  const { email, task, reminderTime } = req.body;

  if (!email || !task || !reminderTime) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const scheduledTime = new Date(reminderTime);
  if (scheduledTime < new Date()) {
    return res.status(400).json({ success: false, message: "Scheduled time is in the past." });
  }

  // Schedule email using node-schedule
  schedule.scheduleJob(scheduledTime, () => {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: "Mythbusthub13@gmail.com",
      subject: "Your Scheduled Reminder",
      text: `Reminder: ${task}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending reminder email:", error);
      } else {
        console.log("Reminder email sent:", info.response);
      }
    });
  });

  console.log(`Reminder scheduled for ${email} at ${scheduledTime}`);
  res.json({ success: true, message: `Reminder scheduled for ${email} at ${scheduledTime}` });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
