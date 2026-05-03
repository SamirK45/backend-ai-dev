export const verificationTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account</title>
    <style>
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background-color: #0f1015; 
            margin: 0; 
            padding: 0; 
            color: #e2e4e9;
        }
        .wrapper {
            padding: 40px 20px;
            background-color: #0f1015;
            display: flex;
            justify-content: center;
        }
        .container { 
            max-width: 500px; 
            margin: 0 auto; 
            background-color: #1a1c23; 
            padding: 40px; 
            border-radius: 16px; 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); 
            border: 1px solid #2a2c35;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.5px;
        }
        .logo span {
            color: #67e8f9;
        }
        h1 { 
            color: #ffffff; 
            text-align: center; 
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        p { 
            color: #a0a3b1; 
            line-height: 1.6; 
            font-size: 15px;
            text-align: center;
            margin-bottom: 25px;
        }
        .code-container {
            background-color: #0f1015;
            border: 1px solid #2a2c35;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
        }
        .code { 
            font-size: 32px; 
            font-weight: 700; 
            color: #67e8f9; 
            letter-spacing: 8px;
            margin: 0;
        }
        .footer { 
            text-align: center; 
            font-size: 13px; 
            color: #6b6c85; 
            margin-top: 30px; 
            padding-top: 20px;
            border-top: 1px solid #2a2c35;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="logo">AI<span>dev</span></div>
            </div>
            <h1>Verify Your Email</h1>
            <p>Hi there,</p>
            <p>We received a request to verify your email address. Please use the verification code below to complete your registration:</p>
            
            <div class="code-container">
                <div class="code">[Verification Code]</div>
            </div>
            
            <p style="font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            
            <div class="footer">
                &copy; 2026 AI Developer. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;