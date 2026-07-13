const nodemailer = require('nodemailer');

let mailer = null;
if (process.env.SMTP_HOST) {
  mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendAccessEmail(to, name, link) {
  if (!mailer) {
    console.log(`[EMAIL NAO ENVIADO - SMTP nao configurado] Link para ${to}: ${link}`);
    return;
  }
  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Seu acesso à aula está liberado 🎉',
    html: `<p>Olá${name ? ' ' + name : ''}!</p>
           <p>Sua compra foi aprovada. Acesse sua aula pelo link abaixo:</p>
           <p><a href="${link}">${link}</a></p>
           <p>Este link é pessoal e intransferível.</p>`,
  });
}

module.exports = { sendAccessEmail };
