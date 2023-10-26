import nodemailer from 'nodemailer';

class SentMail {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'acelearnonline@gmail.com',
        pass: process.env.MAILPASS,
      },
    });
  }

  sendMail(name: string, email: string, verificationCode: string): void {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'acelearnonline@gmail.com',
      to: email,
      subject: 'LearnAce Email Verification',
      text: `${email}, your verification code is: ${verificationCode}. Do not share this code with anyone.`,
    };

    this.transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Verification code sent successfully');
      }
    });
  }
}

export default SentMail;
