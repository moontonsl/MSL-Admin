<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual Renewal Deactivation</title>
    <style>
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #111827; color: #f9fafb; font-family: Arial, sans-serif; }
        .card { width: min(680px, calc(100% - 32px)); padding: 32px; border: 1px solid #374151; border-radius: 16px; background: #1f2937; box-sizing: border-box; }
        h1 { margin-top: 0; }
        .warning { padding: 16px; border-radius: 10px; background: #3f2a0b; color: #fde68a; line-height: 1.5; }
        label { display: block; margin: 22px 0 8px; }
        input { width: 100%; padding: 12px; border: 1px solid #4b5563; border-radius: 8px; box-sizing: border-box; background: #111827; color: white; }
        button { margin-top: 16px; padding: 12px 18px; border: 0; border-radius: 8px; background: #2563eb; color: white; font-weight: bold; cursor: pointer; }
        .error { margin-top: 12px; color: #fca5a5; }
        .result { margin-top: 24px; padding: 16px; border-radius: 10px; background: #064e3b; line-height: 1.7; }
        pre { white-space: pre-wrap; color: #d1fae5; }
    </style>
</head>
<body>
    <main class="card">
        <h1>Manual Renewal Deactivation</h1>
        <div class="warning">
            This will run <code>users:deactivate-expired-renewals</code>.<br>
            It will deactivate only Student accounts (<code>role = Student</code>) in Renew status for more than 6 months.<br>
            Blocked and administrator accounts will not be changed.
        </div>

        <form method="POST" action="{{ route('manual.deactivate-expired-renewals.run') }}">
            @csrf
            <label for="password">Password</label>
            <input id="password" name="password" type="password" required autofocus>
            <button type="submit">Run Deactivation</button>
        </form>

        @if ($errors->any())
            <div class="error">{{ $errors->first() }}</div>
        @endif

        @if (session('result'))
            @php($result = session('result'))
            <section class="result">
                <strong>Completed</strong><br>
                Deactivated: {{ $result['deactivated'] }} student(s)<br>
                Eligible before run: {{ $result['eligible_before_run'] }}<br>
                Blocked skipped: {{ $result['blocked_skipped'] }}<br>
                Admin accounts skipped: {{ $result['admin_skipped'] }}
                <pre>{{ $result['output'] }}</pre>
            </section>
        @endif
    </main>
</body>
</html>
