const nodemailer = require('nodemailer');

const gmail = {
  user: process.env.EMAIL || 'noveo50@gmail.com',
  password: process.env.EMAIL_PASSWORD || 'tester1!',
  name: 'Sci Permute Support',
};

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail.user,
    pass: gmail.password
  }
});

module.exports = function mail({ from = `"${gmail.name}" <${gmail.user}>`, to, subject, mailbody }) {
  return new Promise((resolve, reject) => {
    const mailOptions = { from, to, subject, html: mailbody };
    console.log('Sending mail in test env');
    console.log(`${JSON.stringify(mailOptions)}`);

    if (process.env.NODE_ENV === 'production') {
      return smtpTransport.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(`Mail was sended sucessfully: ${JSON.stringify(response)}`);
        smtpTransport.close(); // shut down the connection pool, no more messages
        return resolve();
      });
    }

    return resolve();
  });
};

