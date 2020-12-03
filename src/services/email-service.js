"use strict";

const config = require("../config/config");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(config.sendgridKey);

exports.send = async (to, subject, body) => {
  const msg = {
    to: to,
    from: "autosocorro18@gmail.com",
    subject: subject,
    html: body,
  };

  sgMail.send(msg);
};
