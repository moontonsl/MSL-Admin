<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Final Notice: Update Your MSL Username Before September 18, 2025</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="content">
        <p>Hi {{ $user->name }},</p>
        
        <p>This is a reminder that you are required to update your MSL username.</p>
        
        <p>If you do not update your username by Thursday, September 18, 2025, your MSL account will be permanently deleted.</p>
        
        <p>Please click the link below to update it now:</p>
        
        <div style="text-align: center;">
            <a href="{{ $changeUsernameUrl }}" class="button">Change Username</a>
        </div>
        
        <p>We urge you to act immediately to avoid losing access to your account.</p>
        
        <p>Best regards,<br>MSL Website Team</p>
    </div>
</body>
</html> 