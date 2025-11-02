export const forgotPasswordTemplate_tr = `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Şifre Sıfırlama</title>
    <style>
      body {
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        background-color: #f4f6f8;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, #ef4444, #f97316);
        color: #fff;
        text-align: center;
        padding: 24px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 24px;
      }
      .btn {
        display: inline-block;
        background: #ef4444;
        color: #fff !important;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-weight: 600;
        transition: background 0.3s ease;
      }
      .btn:hover {
        background: #dc2626;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777;
        padding: 20px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Şifre Sıfırlama</h1>
      </div>
      <div class="content">
        <p>Merhaba <strong>{{name}}</strong>,</p>
        <p>Şifreni sıfırlamak için bir istek aldık. Yeni bir şifre belirlemek için aşağıdaki butona tıkla:</p>
        <a href="{{resetUrl}}" class="btn">Şifremi Sıfırla</a>
        <p style="margin-top: 30px; font-size: 14px; color: #555;">
          Eğer bu isteği sen göndermediysen, bu e-postayı yok sayabilirsin.
        </p>
      </div>
      <div class="footer">
        © {{year}} {{appName}} • Tüm hakları saklıdır.
      </div>
    </div>
  </body>
  </html>
`;