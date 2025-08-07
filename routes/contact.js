const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email configuration not complete. Contact form features will be disabled.');
    return null;
  }
  
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email, message, phone, subject = 'Contact Form Submission' } = req.body;

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>This message was sent from the FitGenius Hub contact form.</em></p>
    `;

    // Send email to admin
    const transporter = createTransporter();
    
    if (!transporter) {
      return res.status(503).json({
        success: false,
        message: 'Contact form is currently unavailable. Please configure email settings in the environment variables.'
      });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: `FitGenius Hub - ${subject}`,
      html: emailContent,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting FitGenius Hub',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>The FitGenius Hub Team</p>
        <p><em>This is an automated response. Please do not reply to this email.</em></p>
      `
    };

    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again later.'
    });
  }
});

// @desc    Send membership inquiry
// @route   POST /api/contact/membership
// @access  Public
router.post('/membership', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message must be less than 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, email, phone, message = '' } = req.body;

    // Create email content
    const emailContent = `
      <h2>New Membership Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      ${message ? `<p><strong>Additional Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><em>This inquiry was submitted through the FitGenius Hub membership form.</em></p>
    `;

    // Send email to admin
    const transporter = createTransporter();
    
    if (!transporter) {
      return res.status(503).json({
        success: false,
        message: 'Membership inquiry is currently unavailable. Please configure email settings in the environment variables.'
      });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Admin email
      subject: 'FitGenius Hub - New Membership Inquiry',
      html: emailContent,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your membership inquiry - FitGenius Hub',
      html: `
        <h2>Thank you for your interest in FitGenius Hub!</h2>
        <p>Dear ${name},</p>
        <p>We have received your membership inquiry and our team will contact you within 24 hours to discuss our membership options and answer any questions you may have.</p>
        <p>In the meantime, here's what you can expect:</p>
        <ul>
          <li>Personal consultation call</li>
          <li>Membership plan options</li>
          <li>Facility tour (if applicable)</li>
          <li>Special introductory offers</li>
        </ul>
        <p>We look forward to helping you achieve your fitness goals!</p>
        <hr>
        <p>Best regards,<br>The FitGenius Hub Team</p>
        <p><em>This is an automated response. Please do not reply to this email.</em></p>
      `
    };

    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: 'Membership inquiry submitted successfully! We will contact you within 24 hours.'
    });

  } catch (error) {
    console.error('Membership inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting inquiry. Please try again later.'
    });
  }
});

module.exports = router; 