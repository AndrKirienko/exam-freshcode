const nodemailer = require('nodemailer');

module.exports.sendMail = async data => {
  const {
    moderatorStatus,
    text,
    user: { firstName, lastName, email },
    contest: { title },
  } = data;

  const getTransporterOptions = async () => {
    const NODE_ENV = process.env.NODE_ENV ?? 'development';

    if (NODE_ENV === 'development') {
      const account = await nodemailer.createTestAccount();
      if (!account || !account.smtp) {
        throw new Error('Failed to create a test email account');
      }

      return {
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      };
    }
    if (NODE_ENV === 'test') {
      return {};
    }
    if (NODE_ENV === 'production') {
      if (!process.env.MAILING_EMAIL || !process.env.MAILING_PASS) {
        throw new Error(
          'Missing MAILING_EMAIL or MAILING_PASS in environment variables'
        );
      }

      return {
        service: 'gmail',
        auth: {
          user: process.env.MAILING_EMAIL,
          pass: process.env.MAILING_PASS,
        },
      };
    }
    throw new Error(`Unknown NODE_ENV: ${NODE_ENV}`);
  };

  (async () => {
    const NODE_ENV = process.env.NODE_ENV ?? 'development';
    try {
      const transporterOptions = await getTransporterOptions();

      const transporter = nodemailer.createTransport(transporterOptions);

      const message = {
        from: 'SquadHelp <no-reply@offerstatus.gmail.com>',
        to: email,
        subject: `Update on Your Offer Status: "${text}"`,
        text: `Dear ${firstName} ${lastName}, 
				
A moderator on the SquadHelp platform has assigned your offer with the text: "${text}" the status of "${moderatorStatus}" for the contest: "${title}". Best regards, SquadHelp Team`,
        html: `<p>Dear ${firstName} ${lastName},</p>  
         <p>A moderator on the SquadHelp platform has assigned your offer with the text: "<strong>${text}</strong>"  
         the status of "<strong>${moderatorStatus}</strong>" for the contest: "<strong>${title}</strong>".</p>  
         <p>Best regards,<br>SquadHelp Team</p>`,
      };

      const info = await transporter.sendMail(message);

      if (NODE_ENV === 'development') {
        console.log('Message sent: ', info.messageId);
        console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
      }
    } catch (err) {
      console.error(err);
    }
  })();
};
