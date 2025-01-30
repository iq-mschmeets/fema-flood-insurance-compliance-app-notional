const sgMail = require('@sendgrid/mail');
const { logger } = require('../utils/logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailTemplates = {
  CLAIM_SUBMITTED: {
    subject: 'New Claim Submitted',
    text: (data) => `
      A new claim has been submitted for your policy.
      Claim Number: ${data.claim.claimNumber}
      Amount: $${data.claim.claimAmount}
      Status: ${data.claim.status}
      
      We will review your claim and update you on its status.
    `
  },
  CLAIM_STATUS_UPDATED: {
    subject: 'Claim Status Update',
    text: (data) => `
      Your claim status has been updated.
      Claim Number: ${data.claim.claimNumber}
      New Status: ${data.status}
      ${data.claim.adjustorNotes ? `Adjustor Notes: ${data.claim.adjustorNotes}` : ''}
      ${data.claim.approvedAmount ? `Approved Amount: $${data.claim.approvedAmount}` : ''}
    `
  },
  POLICY_EXPIRING: {
    subject: 'Policy Expiration Notice',
    text: (data) => `
      Your flood insurance policy is expiring soon.
      Policy Number: ${data.policy.policyNumber}
      Expiration Date: ${new Date(data.policy.endDate).toLocaleDateString()}
      
      Please renew your policy to maintain continuous coverage.
    `
  }
};

exports.sendClaimNotification = async (data) => {
  const template = emailTemplates[data.type];
  
  if (!template) {
    logger.error(`Email template not found for type: ${data.type}`);
    return;
  }

  const msg = {
    to: data.recipient,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: template.subject,
    text: template.text(data),
  };

  try {
    await sgMail.send(msg);
    logger.info(`Email sent successfully: ${data.type} to ${data.recipient}`);
  } catch (err) {
    logger.error('Error sending email:', err);
    throw err;
  }
};

exports.sendPolicyNotification = async (data) => {
  const template = emailTemplates[data.type];
  
  if (!template) {
    logger.error(`Email template not found for type: ${data.type}`);
    return;
  }

  const msg = {
    to: data.recipient,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: template.subject,
    text: template.text(data),
  };

  try {
    await sgMail.send(msg);
    logger.info(`Email sent successfully: ${data.type} to ${data.recipient}`);
  } catch (err) {
    logger.error('Error sending email:', err);
    throw err;
  }
};
