const nodemailer = require('nodemailer');

// Email sending function
module.exports.sendEmail = async (event) => {
  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { receiver_email, subject, body_text } = body;

    // Validate input - check if all required fields are present
    if (!receiver_email || !subject || !body_text) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields. Please provide receiver_email, subject, and body_text'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(receiver_email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Email service not configured properly'
        })
      };
    }

    // Create email transporter with explicit configuration
    const emailService = process.env.EMAIL_SERVICE || 'gmail';
    
    let transportConfig;
    
    if (emailService === 'gmail') {
      transportConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use STARTTLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    } else if (emailService === 'outlook') {
      transportConfig = {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // use STARTTLS
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    } else {
      // Fallback to service name
      transportConfig = {
        service: emailService,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      };
    }
    
    const transporter = nodemailer.createTransport(transportConfig);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiver_email,
      subject: subject,
      text: body_text
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return {
      statusCode: 200,
    //   success
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data: {
          receiver: receiver_email,
          subject: subject
        }
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);

    // Error response
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email',
        error: error.message
      })
    };
  }
};