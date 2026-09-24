<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MSL Network Partnership Inquiry</title>
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
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #F2C21A;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #F2C21A;
            margin-bottom: 10px;
        }
        .title {
            color: #2c3e50;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .inquiry-box {
            background-color: #f8f9fa;
            border-left: 4px solid #F2C21A;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .inquiry-details {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #F2C21A;
            color: #000;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .highlight {
            color: #F2C21A;
            font-weight: bold;
        }
        .region-info {
            background-color: #e8f4fd;
            border: 1px solid #bee5eb;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">MSL Network</div>
            <div class="title">New Partnership Inquiry</div>
        </div>

        <div class="content">
            <p>Dear MSL Partnership Team,</p>

            <p>A new inquiry has been received through the MSL Network website.</p>

            <div class="inquiry-details">
                <h3>Inquiry Details:</h3>
                <p><strong>Subject:</strong> {{ $inquiryData['subject'] ?? 'MSL Network Partnership Inquiry' }}</p>
                <p><strong>Region:</strong> {{ $inquiryData['region'] ?? 'Not specified' }}</p>
                <p><strong>Primary Recipient:</strong> {{ $inquiryData['to_email'] ?? 'Not specified' }}</p>
                @if(!empty($inquiryData['cc_emails']))
                <p><strong>CC Recipients:</strong> {{ implode(', ', $inquiryData['cc_emails']) }}</p>
                @endif
                <p><strong>Received:</strong> {{ now()->format('F j, Y \a\t g:i A') }}</p>
            </div>

            <div class="inquiry-box">
                <h3>Message:</h3>
                <p>{{ $inquiryData['message'] ?? 'No message provided' }}</p>
            </div>

            @if(isset($inquiryData['region']) && $inquiryData['region'])
            <div class="region-info">
                <h4>Regional Information:</h4>
                <p><strong>Target Region:</strong> {{ $inquiryData['region'] }}</p>
                <p><strong>Regional Email:</strong> {{ $inquiryData['to_email'] ?? 'Not specified' }}</p>
            </div>
            @endif

            <div class="inquiry-box">
                <h3>Next Steps:</h3>
                <ul>
                    <li>Review the inquiry details above</li>
                    <li>Respond to the inquiry through your regional email system</li>
                    <li>Follow up according to MSL Network partnership procedures</li>
                    <li>Update the inquiry status in the admin panel</li>
                </ul>
            </div>

            <p><span class="highlight">Important:</span> Please respond to this inquiry within 48 hours to maintain our partnership standards.</p>

            <p>Best regards,<br>
            <strong>MSL Network System</strong></p>
        </div>

        <div class="footer">
            <p>This is an automated notification from the MSL Network inquiry system.</p>
            <p>&copy; {{ date('Y') }} MSL Philippines. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
