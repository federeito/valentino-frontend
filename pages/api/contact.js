import nodemailer from 'nodemailer';

// Configuración de Nodemailer con SMTP de MailerSend (misma configuración que checkout)
const transporter = nodemailer.createTransport({
    host: process.env.MAILERSEND_SMTP_HOST || 'smtp.mailersend.net',
    port: parseInt(process.env.MAILERSEND_SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.MAILERSEND_SMTP_USER,
        pass: process.env.MAILERSEND_SMTP_PASS,
    },
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    const { name, email, phone, message } = req.body;

    // Validación básica
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Por favor complete todos los campos requeridos' });
    }

    // HTML content for the email
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #dc2626; padding-bottom: 20px; }
                .logo { max-width: 200px; margin: 20px 0; }
                .section { margin-bottom: 20px; background-color: #f9fafb; padding: 20px; border-radius: 8px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #dc2626; }
                .field-value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #dc2626; }
                .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: #dc2626; margin: 0;">Nuevo Mensaje de Contacto</h1>
                    <img src="https://res.cloudinary.com/djuk4a84p/image/upload/v1778687241/soledadlogoaccs_cpclqs.png" alt="Soledad Accesorios Logo" class="logo"/>
                </div>
                
                <div class="section">
                    <div class="field">
                        <div class="field-label">👤 Nombre:</div>
                        <div class="field-value">${name}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">📧 Email:</div>
                        <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    
                    ${phone ? `
                    <div class="field">
                        <div class="field-label">📱 Teléfono:</div>
                        <div class="field-value">${phone}</div>
                    </div>
                    ` : ''}
                    
                    <div class="field">
                        <div class="field-label">💬 Mensaje:</div>
                        <div class="field-value" style="white-space: pre-wrap;">${message}</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Este mensaje fue enviado desde el formulario de contacto de Soledad Accesorios</p>
                    <p>Fecha: ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: `"${process.env.MAILERSEND_FROM_CONTACT_NAME || 'Soledad Accesorios'}" <${process.env.MAILERSEND_FROM_EMAIL_CONTACT}>`,
        to: process.env.CONTACT_CONFIRMATION_EMAIL || process.env.MAILERSEND_FROM_EMAIL_CONTACT,
        replyTo: email,
        subject: `Nuevo mensaje de contacto - ${name}`,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje. Por favor intente nuevamente.' });
    }
}
