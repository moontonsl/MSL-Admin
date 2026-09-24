<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Renewal Required</title>
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
                                                    <h2 style="font-size: 15px; color: #333333; margin: 0; font-weight: normal; font-family: Arial, sans-serif;">Account Renewal Required</h2>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Content -->
                                        <div style="font-size: 14px; color: #333333; text-align: left; font-family: Arial, sans-serif;">
                                            <p style="margin: 0 0 20px 0;">Dear {{ $user->name }} {{ $user->surname }},</p>
                                            
                                            <p style="margin: 0 0 20px 0;">Your MSL Account requires renewal. To maintain your active status, you need to resubmit your current proof of enrollment for verification.</p>
                                            
                                            <!-- Account Details -->
                                            <div style="font-size: 14px; font-weight: bold; color: #000000; margin: 25px 0 10px 0;">Account Details:</div>
                                            <ul style="margin: 0 0 25px 0; padding-left: 20px;">
                                                <li style="margin-bottom: 8px;"><strong>Username:</strong> {{ $user->username }}</li>
                                                <li style="margin-bottom: 8px;"><strong>Email:</strong> {{ $user->email }}</li>
                                                <li style="margin-bottom: 8px;"><strong>Current Status:</strong> Renewal Status (Resubmit Proof of Enrolment)</li>
                                            </ul>
                                            
                                            <!-- What you need to do -->
                                            <div style="font-size: 14px; font-weight: bold; color: #000000; margin: 25px 0 10px 0;">What you need to do:</div>
                                            <ul style="margin: 0 0 25px 0; padding-left: 20px;">
                                                <li style="margin-bottom: 8px;">Log in using your credentials at www.moontonslph.org.</li>
                                                <li style="margin-bottom: 8px;">Upload your current Certificate of Enrollment or Approved Registration Form. Screenshots from your online school portal are acceptable. The document must clearly show your Name, Course, School, Year Level, and the current Semester.</li>
                                                <li style="margin-bottom: 8px;">If you choose to upload a School ID instead, ensure your Name, School, and validation sticker for the current semester are clearly visible.</li>
                                                <li style="margin-bottom: 8px;">Wait for your Student Leader or Regional Admin to review and verify your submission.</li>
                                            </ul>
                                            
                                            <!-- Disclaimers -->
                                            <p style="margin: 20px 0; color: #333333;">
                                                <strong style="color: #ff3b30;">Important:</strong> Your account is currently in a restricted renewal status. You must complete this verification process to regain full access to all platform features.
                                            </p>
                                            
                                            <p style="margin: 20px 0;">
                                                If you no longer wish to maintain your MSL Account, you can log in and select "Delete Account" in your profile settings.
                                            </p>
                                            
                                            <p style="margin: 20px 0 35px 0;">
                                                Thank you for your attention to this matter.
                                            </p>
                                            
                                            <!-- Sign-off -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
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