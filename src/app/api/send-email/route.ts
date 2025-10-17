import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('Variáveis de ambiente SMTP não configuradas');
      return NextResponse.json(
        { error: 'Servidor de email não configurado corretamente' },
        { status: 500 }
      );
    }

    // Configurar o transportador de email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Formulário BRCLOG" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Novo contato de ${name} - BRCLOG`,
      html: `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Contato - BRCLOG</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
        }
        .header {
          background: linear-gradient(90deg, #22c55e, #3b82f6);
          color: #ffffff;
          text-align: center;
          padding: 24px 16px;
        }
        .header h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: 0.5px;
        }
        .content {
          padding: 28px 24px;
        }
        .field {
          margin-bottom: 18px;
        }
        .label {
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 6px;
          font-size: 14px;
          text-transform: uppercase;
        }
        .value {
          background-color: #f3f4f6;
          border-left: 4px solid #22c55e;
          padding: 12px 14px;
          border-radius: 6px;
          color: #111827;
          word-wrap: break-word;
        }
        a {
          color: #3b82f6;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .footer {
          background-color: #f9fafb;
          text-align: center;
          padding: 16px;
          font-size: 13px;
          color: #6b7280;
          border-top: 2px solid #f3f4f6;
        }
        .footer span {
          color: #fbbf24;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📨 Novo Contato - BRCLOG</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">👤 Nome</div>
            <div class="value">${name}</div>
          </div>

          <div class="field">
            <div class="label">📧 E-mail</div>
            <div class="value">
              <a href="mailto:${email}">${email}</a>
            </div>
          </div>

          <div class="field">
            <div class="label">📱 Telefone</div>
            <div class="value">
              <a href="tel:${phone.replace(/\D/g, '')}">${phone}</a>
            </div>
          </div>

          <div class="field">
            <div class="label">💬 Mensagem</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>

        <div class="footer">
          <p>📅 ${new Date().toLocaleString('pt-BR')}</p>
          <p>Este email foi enviado através do <span>formulário de contato</span> do site <strong>BRCLOG</strong>.</p>
        </div>
      </div>
    </body>
  </html>
  `,
      text: `
Novo Contato - BRCLOG

Nome: ${name}
E-mail: ${email}
Telefone: ${phone}

Mensagem:
${message}

---
Data: ${new Date().toLocaleString('pt-BR')}
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso para:', process.env.SMTP_USER);

    return NextResponse.json(
      { message: 'Email enviado com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro detalhado ao enviar email:', error);
    return NextResponse.json(
      {
        error: 'Erro ao enviar email. Tente novamente.',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
