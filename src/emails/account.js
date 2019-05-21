const sgMail = require("@sendgrid/mail");
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "cherry199662@gmail.com",
    subject: "Thanks for joining in!",
    html: `<h1>Welcome to the app, ${name}. Let me know how you get along with the app.</h1>`
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "cherry199662@gmail.com",
    text: `Goodbye, Sir ${name}. Let me know if you wish come back.`,
    subject: `Goodbye Sir. ${name}`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail
};
