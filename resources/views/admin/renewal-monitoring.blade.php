<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Renewal Monitoring</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; background: #111827; color: #f9fafb; font-family: Arial, sans-serif; }
        .wrapper { width: min(1180px, calc(100% - 32px)); margin: 32px auto; }
        .card { padding: 28px; border: 1px solid #374151; border-radius: 16px; background: #1f2937; }
        h1 { margin: 0 0 8px; }
        .muted { color: #9ca3af; }
        .warning { margin: 20px 0; padding: 16px; border-radius: 10px; background: #3f2a0b; color: #fde68a; line-height: 1.5; }
        label { display: block; margin: 20px 0 8px; }
        input { width: 100%; max-width: 420px; padding: 12px; border: 1px solid #4b5563; border-radius: 8px; background: #111827; color: white; }
        button { padding: 11px 16px; border: 0; border-radius: 8px; background: #2563eb; color: white; font-weight: bold; cursor: pointer; }
        form button { margin-top: 16px; }
        .lock { float: right; background: #4b5563; }
        .error { margin-top: 12px; color: #fca5a5; }
        .summary { display: flex; gap: 16px; flex-wrap: wrap; margin: 22px 0; }
        .stat { padding: 14px 18px; border-radius: 10px; background: #374151; }
        .stat strong { display: block; font-size: 24px; color: #facc15; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 800px; }
        th, td { padding: 14px 12px; border-bottom: 1px solid #374151; text-align: left; }
        th { color: #9ca3af; font-size: 13px; text-transform: uppercase; }
        .days { color: #facc15; font-weight: bold; white-space: nowrap; }
        .empty { padding: 28px 0; color: #9ca3af; }
        .pagination { display: flex; gap: 8px; margin-top: 22px; flex-wrap: wrap; }
        .pagination a, .pagination span { padding: 8px 12px; border-radius: 6px; background: #374151; color: white; text-decoration: none; }
        .pagination .active { background: #2563eb; }
        @media (max-width: 700px) { .wrapper { width: calc(100% - 20px); margin: 10px auto; } .card { padding: 18px; } .lock { float: none; margin-top: 16px; } }
    </style>
</head>
<body>
    <main class="wrapper">
        <section class="card">
            <h1>Renewal Monitoring</h1>
            <p class="muted">Regular students who are within 30 days of reaching 6 months in Renew status.</p>

            @if (!$students)
                <div class="warning">
                    This page shows student renewal records nearing the 6-month deactivation threshold.<br>
                    Only Student accounts (<code>role = Student</code>) are included. Admin and blocked accounts are excluded.
                </div>
                <form method="POST" action="{{ route('manual.renewal-monitoring.unlock') }}">
                    @csrf
                    <label for="password">Password</label>
                    <input id="password" name="password" type="password" required autofocus>
                    <br>
                    <button type="submit">Open Monitoring</button>
                </form>
            @else
                <form method="POST" action="{{ route('manual.renewal-monitoring.lock') }}">
                    @csrf
                    <button class="lock" type="submit">Lock Page</button>
                </form>

                <div class="summary">
                    <div class="stat"><strong>{{ $students->total() }}</strong>students nearing 6 months</div>
                    <div class="stat"><strong>30</strong>days monitoring window</div>
                </div>

                @if ($students->count())
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>School / Institution</th>
                                    <th>Renew Date</th>
                                    <th>6-Month Deadline</th>
                                    <th>Days Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($students as $student)
                                    <tr>
                                        <td>{{ trim($student->name . ' ' . $student->surname) }}<br><span class="muted">{{ '@' . $student->username }}</span></td>
                                        <td>{{ $student->university ?: 'N/A' }}</td>
                                        <td>{{ $student->renew_date->format('M d, Y') }}</td>
                                        <td>{{ $student->renewal_deadline->format('M d, Y') }}</td>
                                        <td class="days">{{ $student->days_remaining }} day(s)</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    {{ $students->links() }}
                @else
                    <div class="empty">No regular students are within 30 days of the 6-month threshold.</div>
                @endif
            @endif

            @if ($errors->any())
                <div class="error">{{ $errors->first() }}</div>
            @endif
        </section>
    </main>
</body>
</html>
