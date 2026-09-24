<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
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
        .btn-table {
            margin: 30px 0;
            width: 100%;
        }
        .btn-link {
            display: inline-block;
            background-color: #0f172a;
            color: #ffffff !important;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 6px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* Mobile overrides */
        @media only screen and (max-width: 600px) {
            .email-container {
                padding: 20px 10px !important;
            }
            .card-body {
                padding: 30px 20px !important;
            }
        }
    </style>
</head>
<body>

    @php
        $name = $user->name ?? $user->username;
    @endphp

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
                                                    <h2 style="font-size: 15px; color: #333333; margin: 0; font-weight: normal; font-family: Arial, sans-serif;">Password Reset</h2>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Content -->
                                        <div style="font-size: 14px; color: #333333; text-align: left; font-family: Arial, sans-serif;">
                                            <p style="margin: 0 0 20px 0;">Hello {{ $name }},</p>
                                            
                                            <p style="margin: 0 0 20px 0;">You are receiving this email because we received a request to reset the password for your MSL account. To choose a new password, please click the button or link below:</p>
                                            
                                            <!-- Reset Button block -->
                                            <table class="btn-table" border="0" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center">
                                                        <a href="{{ $url }}" class="btn-link" target="_blank">Reset Password</a>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Troubleshooting -->
                                            <p style="margin: 20px 0; font-size: 13px; color: #555555; word-break: break-all;">
                                                <strong>Troubleshooting:</strong> If you are having trouble clicking the "Reset Password" button, copy and paste the following URL into your web browser: <a href="{{ $url }}" target="_blank" style="color: #0284c7; text-decoration: none;">{{ $url }}</a>
                                            </p>
                                            
                                            <!-- Important Notice -->
                                            <p style="margin: 20px 0;">
                                                <strong>Important Notice:</strong> For security purposes, this password reset link will expire in 60 minutes.
                                            </p>
                                            
                                            <!-- Didn't request this change? -->
                                            <p style="margin: 20px 0;">
                                                <strong>Didn't request this change?</strong> If you did not request a password reset, no further action is required. Your current password will remain the same, and your account is secure.
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
