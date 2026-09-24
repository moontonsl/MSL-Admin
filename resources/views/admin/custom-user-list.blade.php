<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom User List - MSL Admin</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="fas fa-users-cog me-2"></i>Custom User List Management</h3>
            <div>
                <button class="btn btn-primary me-2" onclick="sendSelectedEmails()">
                    <i class="fas fa-envelope me-1"></i> Email Selected
                </button>
                <button class="btn btn-danger" onclick="deleteSelectedUsers()">
                    <i class="fas fa-trash me-1"></i> Delete Selected
                </button>
            </div>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th width="40"><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($users as $user)
                                <tr>
                                    <td><input type="checkbox" class="user-checkbox" value="{{ $user->id }}"></td>
                                    <td>{{ $user->id }}</td>
                                    <td>{{ $user->name }} {{ $user->surname }}</td>
                                    <td><code>{{ $user->username }}</code></td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->created_at->format('M d, Y') }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="6" class="text-center py-4 text-muted">
                                        No users found matching the list. <br>
                                        <small>Edit <code>CustomUserListController.php</code> to add usernames.</small>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    {{ $users->links() }}
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function toggleSelectAll() {
            const checked = document.getElementById('selectAll').checked;
            document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = checked);
        }

        function getSelectedIds() {
            return Array.from(document.querySelectorAll('.user-checkbox:checked')).map(cb => cb.value);
        }

        function sendSelectedEmails() {
            const ids = getSelectedIds();
            if (ids.length === 0) return alert('Please select users first.');
            
            if (!confirm(`Send emails to ${ids.length} users?`)) return;

            fetch('/admin/custom-user-list/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ user_ids: ids })
            })
            .then(res => res.json())
            .then(data => alert(data.message));
        }

        function deleteSelectedUsers() {
            const ids = getSelectedIds();
            if (ids.length === 0) return alert('Please select users first.');
            
            if (!confirm(`Are you sure you want to DELETE ${ids.length} users? This cannot be undone.`)) return;

            fetch('/admin/custom-user-list/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ user_ids: ids })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.success) location.reload();
            });
        }
    </script>
</body>
</html>
