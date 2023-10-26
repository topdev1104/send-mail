const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Parse incoming request bodies in a middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST route for sending emails

app.post('/send-email', (req, res) => {
    var data = (req.body)
    const userInfo = {
        fullName: data['userInfo[fullName]'],
        phone: data['userInfo[phone]'],
        personalId: data['userInfo[personalId]'],
        email: data['userInfo[email]'],
      };
      const dateInfo = [];    
      for (let i = 0; i < 9; i++) {
        const date = data[`dateInfo[${i}][date]`];
        const time1 = data[`dateInfo[${i}][time1]`];
        const time2 = data[`dateInfo[${i}][time2]`];
        const diff = data[`dateInfo[${i}][diff]`];
        dateInfo.push({ date, time1, time2, diff });
      }
    
  // Extract information from the request body
  const { email:to, subject, text } = userInfo;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure your email provider settings here
    service: 'Gmail',
    auth: {
      user: 'strongman20021104@gmail.com',
      pass: '123qweQWE!@#',
    },
  });

  // Create the email message
  const mailOptions = {
    from: 'strongman20021104@gmail.com',
    to,
    subject,
    text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent');
    }
  });
});

// Start the server
app.listen(4000, () => {
  console.log('Mail server running on port 3000');
});