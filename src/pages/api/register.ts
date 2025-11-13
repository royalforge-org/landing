// src/pages/api/register.ts
import type { APIRoute } from 'astro';
import sgMail from '@sendgrid/mail';


const apiKey = import.meta.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
}

sgMail.setApiKey(apiKey || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { fullName, email, company, role, referralSource } = data;

    
    if (!fullName || !email || !role || !referralSource) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }),
        { status: 400 }
      );
    }

    const fromEmail = import.meta.env.SENDGRID_FROM_EMAIL;
    const fromName = 'Royal Forge';

    if (!fromEmail) {
      console.error('❌ Missing email configuration');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Server configuration error' 
        }),
        { status: 500 }
      );
    }

    console.log('📤 Attempting to send emails...');
    console.log('From:', `${fromName} <${fromEmail}>`);

   
    const userMsg = {
      to: email,
      from: { email: fromEmail, name: fromName },
      subject: 'Welcome to RoyalForge - The Free Cuban Economy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              line-height: 1.6; 
              color: #0f1724; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
            }
            .header { 
              background: linear-gradient(135deg, #002A8F, #CF142B); 
              color: white; 
              padding: 40px 30px; 
              border-radius: 12px 12px 0 0; 
              text-align: center;
            }
            .content { 
              background: white; 
              padding: 40px 30px; 
              border: 1px solid #e2e8f0; 
              border-top: none;
            }
            .button { 
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    background: linear-gradient(135deg, var(--royal-blue), var(--royal-red));
    color: white;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 600;
    padding: 0.55rem 1.2rem;
    border-radius: 999px;
    box-shadow: 0 10px 24px rgba(0, 42, 143, 0.18);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .footer { 
              text-align: center; 
              color: #64748b; 
              font-size: 14px; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e2e8f0;
            }
            .highlight { 
              background: rgba(0, 42, 143, 0.08); 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Welcome to RoyalForge! 🚀</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px;"><strong>Hi ${fullName},</strong></p>
            
            <p>Thank you for joining RoyalForge - the decentralized marketplace empowering Cuban professionals to connect with the global economy.</p>
            
            <div class="highlight">
              <h3 style="margin-top: 0; color: #002A8F;">Your Registration Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${fullName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              ${company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Role:</strong> ${role}</p>
              <p style="margin: 5px 0;"><strong>How you found us:</strong> ${referralSource}</p>
            </div>

            <h3 style="color: #002A8F;">What's Next?</h3>
            <ul style="line-height: 1.8;">
              <li>🔗 Join our Telegram community to connect with other members</li>
              <li>💼 Explore job opportunities and open bounties</li>
              <li>🎯 Participate in hackathons and collaborative projects</li>
              <li>🏛️ Help shape the platform through RoyalDAO governance</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://t.me/royalforge" class="button">Join Telegram Community</a>
            </div>

            <p>If you have any questions, feel free to reach out to us at <a href="mailto:info@royalforge.org" style="color: #002A8F;">info@royalforge.org</a></p>

            <p style="margin-top: 30px;"><strong>Let's forge the free economy together! 🔥</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 RoyalForge DAO - Built on Base</p>
            <p>
              <a href="https://www.facebook.com/profile.php?id=61582604207021" style="color: #64748b; margin: 0 10px;">Facebook</a>
              <a href="https://x.com/RoyalForge_cu" style="color: #64748b; margin: 0 10px;">Twitter</a>
              <a href="https://www.instagram.com/royal_forge_official/" style="color: #64748b; margin: 0 10px;">Instagram</a>
              <a href="https://www.linkedin.com/company/royal-forge/" style="color: #64748b; margin: 0 10px;">LinkedIn</a>
            </p>
          </div>
        </body>
        </html>
      `,
    };
    
    await sgMail.send(userMsg);
    

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Registration successful and emails sent' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ SendGrid Error:', error);
    
    
    if (error.response) {
      console.error('Response body:', error.response.body);
      console.error('Response status:', error.code);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send email',
        error: error.message,
        details: error.response?.body?.errors || []
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
