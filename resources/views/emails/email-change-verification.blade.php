<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Change Verification Code</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f8fafc;
            color: #333333;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }
        table {
            border-collapse: collapse;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            padding-top: 30px;
            line-height: 1.8;
        }
        
        /* Mobile overrides */
        @media only screen and (max-width: 600px) {
            .email-container {
                padding: 20px 10px !important;
            }
            .card-body {
                padding: 30px 20px !important;
            }
            .code-text {
                font-size: 32px !important;
                letter-spacing: 4px !important;
            }
        }
    </style>
</head>
<body>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; min-height: 100vh;">
        <tr>
            <td align="center" valign="top">
                
                <table class="email-container" width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            
                            <!-- Main Content Card Box -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                                <tr>
                                    <td class="card-body" style="padding: 40px 35px;">
                                        
                                        <!-- Header -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 30px; text-align: center;">
                                            <tr>
                                                <td>
                                                    <h1 style="font-size: 18px; font-weight: bold; color: #000000; margin: 0 0 5px 0; text-transform: uppercase; font-family: Arial, sans-serif;">Moonton Student Leaders Philippines</h1>
                                                    <h2 style="font-size: 15px; color: #333333; margin: 0; font-weight: normal; font-family: Arial, sans-serif;">New Email Address Verification</h2>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Content -->
                                        <div style="font-size: 14px; color: #333333; text-align: left; font-family: Arial, sans-serif;">
                                            <p style="margin: 0 0 20px 0;">Hi {{ $user->name ?? $user->username }}</p>
                                            
                                            <p style="margin: 0 0 20px 0;">We received a request to change the email address associated with your MSL Account to {{ $newEmail }}</p>
                                            
                                            <!-- Verification Code block -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 35px 0; text-align: center;">
                                                <tr>
                                                    <td>
                                                        <div class="code-text" style="font-size: 38px; font-weight: bold; color: #000000; letter-spacing: 6px; margin: 0 0 8px 0; font-family: Arial, sans-serif;">{{ $verificationCode }}</div>
                                                        <p style="font-size: 13px; color: #666666; margin: 0; font-family: Arial, sans-serif;">Don't share this code with anyone.</p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- How to verify -->
                                            <div style="font-size: 14px; font-weight: bold; color: #000000; margin: 30px 0 12px 0;">How to verify your new email:</div>
                                            <ol style="margin: 0 0 25px 0; padding-left: 20px;">
                                                <li style="margin-bottom: 8px;">Navigate to your MSL profile settings.</li>
                                                <li style="margin-bottom: 8px;">Enter the verification code provided above.</li>
                                                <li style="margin-bottom: 8px;">Click "Verify Email."</li>
                                                <li style="margin-bottom: 8px;">Your account email will be updated immediately.</li>
                                            </ol>
                                            
                                            <!-- Important Notice -->
                                            <p style="margin: 20px 0;">
                                                <strong>Important Notice:</strong> This verification code will expire in 10 minutes. If you do not verify your new email address within this timeframe, you will need to initiate a new request to generate a new code.
                                            </p>
                                            
                                            <!-- Didn't request this change? -->
                                            <p style="margin: 20px 0;">
                                                <strong>Didn't request this change?</strong> If you did not request to change your email address, please ignore this message. Your current email address will remain unchanged, and your account is secure.
                                            </p>
                                            
                                            <!-- Sign-off -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 35px;">
                                                <tr>
                                                    <td>
                                                        <p style="margin: 0 0 15px 0;">Regards,</p>
                                                        <p style="margin: 0; font-weight: bold; color: #000000;">The Web Team</p>
                                                        <p style="margin: 0;">MSL Philippines</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                    </td>
                                </tr>
                            </table> <!-- End Card -->
                            
                        </td>
                    </tr>
                    
                    <!-- Footer outside the Card -->
                    <tr>
                        <td class="footer">
                            <p style="margin: 0 0 5px 0; font-family: Arial, sans-serif;">This is an automated message. Please do not reply to this email.</p>
                            <p style="margin: 0; font-family: Arial, sans-serif;">&copy; {{ date('Y') }} MSL Philippines. All rights reserved.</p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>

</body>
</html>
