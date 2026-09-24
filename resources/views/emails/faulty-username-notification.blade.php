<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Action Required: Update Your MSL Username</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .content {
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background-color: #f0b429;
            color: #0a0a0a;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .deadline-alert {
            background-color: #dc3545;
            border: 2px solid #b02a37;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            color: #ffffff;
            text-align: center;
        }
        .deadline-alert .deadline-date {
            display: block;
            font-size: 22px;
            font-weight: bold;
            margin: 10px 0;
            letter-spacing: 0.5px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            color: #856404;
        }
        .rules {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <p><strong>Subject: Action Required: Update Your MSL Username</strong></p>
            
            <p>Hi <strong>{{ $user->name }}@if($user->surname) {{ $user->surname }}@endif</strong>,</p>

            <p>We have identified that your current MSL username does not meet our username requirements. To continue using your account, please update your username to comply with the following rules:</p>

            <div class="rules">
                <ul>
                    <li>Must be between 5 and 15 characters</li>
                    <li>Must start with a letter (a–z, A–Z) or a digit 1–9 (not 0)</li>
                    <li>Must end with a letter or digit</li>
                    <li>Only letters, numbers, and at most one dot (.), underscore (_), or dash (-) are allowed</li>
                    <li>No spaces allowed</li>
                    <li>Must be unique</li>
                </ul>
            </div>

            <p>To update your username, please click the link below:</p>
            
            <div class="deadline-alert">
                <p><strong>⏰ URGENT — ACTION REQUIRED</strong></p>
                <p>Your MSL account will be <strong>permanently deleted</strong> if you do not update your username by:</p>
                <span class="deadline-date">July 31, 2026</span>
                <p style="margin-bottom: 0;">Please update your username as soon as possible to avoid losing access to your account.</p>
            </div>

            <p style="text-align: center;">
                <a href="{{ \Illuminate\Support\Facades\URL::temporarySignedRoute('username.update.form', now()->addDays(30), ['user' => $user->id]) }}" class="button">Update Username</a>
            </p>

            <div class="warning">
                <p><strong>⚠️ Please note:</strong> Accounts with non-compliant usernames that are not updated by <strong>July 31, 2026</strong> will be permanently deleted.</p>
                <p>If you have already updated your username and completed verification, kindly disregard this message.</p>
            </div>

            <p>Thank you for your prompt attention.</p>

            <p>Best regards,</p>
            <p><strong>MSL Website Team</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} MSL Website Team. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 