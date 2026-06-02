export function adminNotificationEmail(name: string, email: string, service: string, message: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background-color:#0B0B0B; font-family:Arial, sans-serif; }
      .container { max-width:600px; margin:20px auto; background-color:#1A1A1A; border:1px solid #B8860B; border-radius:12px; overflow:hidden; }
      .header { background-color:#B8860B; padding:20px; text-align:center; }
      .header h1 { color:#0B0B0B; margin:0; font-size:24px; }
      .header img { width:60px; margin-top:10px; display:block; margin-left:auto; margin-right:auto; }
      .content { padding:24px; color:#ffffff; }
      .field { margin-bottom:16px; }
      .label { color:#B8860B; font-weight:bold; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px; background-color:#B8860B; color:#0B0B0B; text-decoration:none; font-weight:bold; border-radius:6px; }
      .footer { padding:16px; text-align:center; color:#888888; font-size:12px; border-top:1px solid #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Annamalaiyar Software Centre</h1>
        <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Logo" />
      </div>
      <div class="content">
        <p>New lead received:</p>
        <div class="field"><span class="label">Name:</span> ${name}</div>
        <div class="field"><span class="label">Email:</span> ${email}</div>
        <div class="field"><span class="label">Service:</span> ${service || 'General Inquiry'}</div>
        <div class="field"><span class="label">Message:</span><br>${message}</div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads" class="button">View in Admin</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function autoReplyEmail(userName: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background-color:#0B0B0B; font-family:Arial, sans-serif; }
      .container { max-width:600px; margin:20px auto; background-color:#1A1A1A; border:1px solid #B8860B; border-radius:12px; overflow:hidden; }
      .header { background-color:#B8860B; padding:20px; text-align:center; }
      .header h1 { color:#0B0B0B; margin:0; font-size:24px; }
      .header img { width:60px; margin-top:10px; display:block; margin-left:auto; margin-right:auto; }
      .content { padding:24px; color:#ffffff; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px; background-color:#B8860B; color:#0B0B0B; text-decoration:none; font-weight:bold; border-radius:6px; }
      .footer { padding:16px; text-align:center; color:#888888; font-size:12px; border-top:1px solid #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Annamalaiyar Software Centre</h1>
        <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Logo" />
      </div>
      <div class="content">
        <p>Dear ${userName},</p>
        <p>Thank you for contacting us. We have received your inquiry and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to explore our services:</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/services" class="button">Our Services</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function otpEmail(otp: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background-color:#0B0B0B; font-family:Arial, sans-serif; }
      .container { max-width:600px; margin:20px auto; background-color:#1A1A1A; border:1px solid #B8860B; border-radius:12px; overflow:hidden; }
      .header { background-color:#B8860B; padding:20px; text-align:center; }
      .header h1 { color:#0B0B0B; margin:0; font-size:24px; }
      .header img { width:60px; margin-top:10px; display:block; margin-left:auto; margin-right:auto; }
      .content { padding:24px; color:#ffffff; text-align:center; }
      .otp { font-size:36px; font-weight:bold; color:#B8860B; letter-spacing:8px; }
      .footer { padding:16px; text-align:center; color:#888888; font-size:12px; border-top:1px solid #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Annamalaiyar Software Centre</h1>
        <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Logo" />
      </div>
      <div class="content">
        <p>Your one-time password is:</p>
        <div class="otp">${otp}</div>
        <p>This OTP expires in 5 minutes.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function quoteEmail(serviceName: string, price: number, description: string, deliveryTime: string, quoteId: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background-color:#0B0B0B; font-family:Arial, sans-serif; }
      .container { max-width:600px; margin:20px auto; background-color:#1A1A1A; border:1px solid #B8860B; border-radius:12px; overflow:hidden; }
      .header { background-color:#B8860B; padding:20px; text-align:center; }
      .header h1 { color:#0B0B0B; margin:0; font-size:24px; }
      .header img { width:60px; margin-top:10px; display:block; margin-left:auto; margin-right:auto; }
      .content { padding:24px; color:#ffffff; }
      .field { margin-bottom:12px; }
      .label { color:#B8860B; font-weight:bold; }
      .track-link { display:inline-block; margin-top:20px; padding:12px 24px; background-color:#B8860B; color:#0B0B0B; text-decoration:none; font-weight:bold; border-radius:6px; }
      .footer { padding:16px; text-align:center; color:#888888; font-size:12px; border-top:1px solid #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your Quote from Annamalaiyar Software Centre</h1>
        <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Logo" />
      </div>
      <div class="content">
        <div class="field"><span class="label">Service:</span> ${serviceName}</div>
        <div class="field"><span class="label">Price:</span> ₹${price}</div>
        <div class="field"><span class="label">Description:</span> ${description}</div>
        <div class="field"><span class="label">Estimated Delivery:</span> ${deliveryTime}</div>
        <p>Track your project using your Quote ID: <strong>${quoteId}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track?quoteId=${quoteId}" class="track-link">Track Progress</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

// New: admin notification for accepted/rejected quotes
export function quoteStatusEmail(quote: any, leadName: string, newStatus: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin:0; padding:0; background-color:#0B0B0B; font-family:Arial, sans-serif; }
      .container { max-width:600px; margin:20px auto; background-color:#1A1A1A; border:1px solid #B8860B; border-radius:12px; overflow:hidden; }
      .header { background-color:#B8860B; padding:20px; text-align:center; }
      .header h1 { color:#0B0B0B; margin:0; font-size:24px; }
      .content { padding:24px; color:#ffffff; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px; background-color:#B8860B; color:#0B0B0B; text-decoration:none; font-weight:bold; border-radius:6px; }
      .footer { padding:16px; text-align:center; color:#888888; font-size:12px; border-top:1px solid #333; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Quote Status Update</h1>
      </div>
      <div class="content">
        <p>Lead: <strong>${leadName}</strong></p>
        <p>Quote for <strong>${quote.serviceName}</strong> (₹${quote.price}) has been <strong>${newStatus}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/quotes" class="button">View Quotes</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Annamalaiyar Software Centre. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}