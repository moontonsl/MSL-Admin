<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Username - MSL Philippines</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: #0a0a0a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            color: #ffffff;
        }

        .logo-wrapper {
            margin-bottom: 28px;
            text-align: center;
        }

        .logo-wrapper img {
            height: 64px;
            width: auto;
        }

        .card-wrapper {
            width: 100%;
            max-width: 480px;
            padding: 0 16px;
        }

        .card {
            background-color: #1a1a1a;
            border: 1px solid #2e2e2e;
            border-radius: 12px;
            overflow: hidden;
        }

        .card-header {
            background-color: #1a1a1a;
            padding: 20px 28px;
            text-align: center;
            border-bottom: 1px solid #2e2e2e;
        }

        .card-header h4 {
            color: #ffffff;
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 0;
        }

        .card-body {
            padding: 28px;
        }

        .current-username-notice {
            background-color: #111;
            border: 1px solid #2e2e2e;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 24px;
            text-align: center;
            font-size: 0.9rem;
            color: #aaa;
            line-height: 1.6;
        }

        .current-username-notice strong {
            color: #ffffff;
        }

        .current-username-notice code {
            color: #f0b429;
            background: rgba(240, 180, 41, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.875rem;
        }

        .alert-danger {
            background-color: rgba(220, 53, 69, 0.15);
            border: 1px solid rgba(220, 53, 69, 0.4);
            color: #ff8087;
            border-radius: 8px;
            font-size: 0.875rem;
            margin-bottom: 20px;
        }

        .form-label {
            color: #cccccc;
            font-size: 0.875rem;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .form-control {
            background-color: #111111;
            border: 1px solid #333;
            color: #ffffff;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 0.95rem;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            background-color: #111111;
            border-color: #f0b429;
            color: #ffffff;
            box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.15);
            outline: none;
        }

        .form-control.is-invalid {
            border-color: #dc3545;
        }

        .form-control::placeholder {
            color: #555;
        }

        .requirements-list {
            list-style: none;
            padding: 0;
            margin: 10px 0 0;
        }

        .requirements-list li {
            font-size: 0.8rem;
            color: #666;
            padding: 2px 0 2px 14px;
            position: relative;
        }

        .requirements-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #444;
        }

        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, #f0b429, #d4960f);
            border: none;
            color: #0a0a0a;
            font-weight: 700;
            font-size: 0.95rem;
            padding: 12px;
            border-radius: 8px;
            letter-spacing: 0.5px;
            margin-top: 20px;
            transition: opacity 0.2s, transform 0.1s;
            cursor: pointer;
        }

        .btn-submit:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .btn-submit:active {
            transform: translateY(0);
        }

        .footer-note {
            margin-top: 24px;
            text-align: center;
            font-size: 0.78rem;
            color: #444;
        }
    </style>
</head>
<body>

    <div class="logo-wrapper">
        <img src="/msl-logo.png" alt="MSL Philippines">
    </div>

    <div class="card-wrapper">
        <div class="card">
            <div class="card-header">
                <h4>Update Your Username</h4>
            </div>
            <div class="card-body">

                <div class="current-username-notice">
                    Hello <strong>{{ $user->name }}</strong>,<br>
                    Your current username <code>{{ $user->username }}</code> does not meet our requirements.
                    Please choose a new username to continue using your account.
                </div>

                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0 ps-3">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('username.update.submit', $user->id) }}">
                    @csrf

                    <div class="mb-1">
                        <label for="username" class="form-label">New Username</label>
                        <input type="text"
                               class="form-control @error('username') is-invalid @enderror"
                               id="username"
                               name="username"
                               value="{{ old('username') }}"
                               placeholder="e.g. player123"
                               maxlength="15"
                               required
                               autofocus>
                        <ul class="requirements-list">
                            <li>Must be between 5 and 15 characters</li>
                            <li>Must start with a letter (a–z, A–Z) or digit 1–9 (not 0)</li>
                            <li>Must end with a letter or digit</li>
                            <li>Only letters, numbers, dot (.), underscore (_), or dash (–) allowed</li>
                            <li>At most one special character (. _ –) total</li>
                            <li>Must be unique</li>
                        </ul>
                    </div>

                    <button type="submit" class="btn-submit">
                        Update Username
                    </button>
                </form>

            </div>
        </div>

        <div class="footer-note">
            This link expires in 30 days. &copy; {{ date('Y') }} MSL Philippines
        </div>
    </div>

</body>
</html>
