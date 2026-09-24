<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faulty Username Management - MSL Admin</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/select/1.7.0/css/select.bootstrap5.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
        .stats-card {
            border-left: 4px solid;
            transition: transform 0.2s;
        }
        .stats-card:hover {
            transform: translateY(-2px);
        }
        .stats-card.empty { border-left-color: #6c757d; }
        .stats-card.short { border-left-color: #fd7e14; }
        .stats-card.spaces { border-left-color: #dc3545; }
        .stats-card.long { border-left-color: #ffc107; }
        .stats-card.total { border-left-color: #0d6efd; }
        
        .issue-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
        }
        .issue-empty { background-color: #6c757d; }
        .issue-short { background-color: #fd7e14; }
        .issue-spaces { background-color: #dc3545; }
        .issue-long { background-color: #ffc107; color: #000; }
        
        .action-buttons .btn {
            margin-right: 0.25rem;
            margin-bottom: 0.25rem;
        }
        
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .spinner-border {
            width: 3rem;
            height: 3rem;
        }
        
        .table-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1.5rem;
            margin-top: 1rem;
        }
        
        .filter-section {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        
        .username-cell {
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        .email-status {
            font-size: 0.75rem;
            margin-top: 0.3rem;
        }
        .email-sent-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.72rem;
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
            border-radius: 4px;
            padding: 2px 6px;
            white-space: nowrap;
        }
        .email-sent-badge i { font-size: 0.7rem; }
        
        .search-highlight {
            background-color: #fff3cd;
            padding: 0.1rem 0.2rem;
            border-radius: 3px;
        }
        
        #searchInput:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
    </style>
</head>
<body class="bg-light">
    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="text-center text-white">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2">Processing...</div>
        </div>
    </div>

    <div class="container-fluid py-4">
        <!-- Header -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="h3 mb-0">
                            <i class="fas fa-user-times text-danger me-2"></i>
                            Faulty Username Management
                        </h1>
                        <p class="text-muted mb-0">Identify and notify users with problematic usernames</p>
                    </div>
                    <div>
                        <button class="btn btn-outline-secondary" onclick="location.reload()">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Statistics Cards -->
        <div class="row mb-4">
            <div class="col-md-2">
                <div class="card stats-card empty h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-secondary">{{ $stats['empty_count'] }}</div>
                        <div class="small text-muted">Empty/NULL</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card stats-card short h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-warning">{{ $stats['short_count'] }}</div>
                        <div class="small text-muted">Too Short</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card stats-card spaces h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-danger">{{ $stats['spaces_count'] }}</div>
                        <div class="small text-muted">Has Spaces</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card stats-card long h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-warning">{{ $stats['long_count'] }}</div>
                        <div class="small text-muted">Too Long</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card stats-card total h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-primary">{{ $stats['total_faulty'] }}</div>
                        <div class="small text-muted">Total Faulty</div>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <div class="h4 mb-1 text-success">{{ $stats['total_users'] - $stats['total_faulty'] }}</div>
                        <div class="small text-muted">Valid Users</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filters and Actions -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="filter-section">
                    <div class="row align-items-center">
                        <div class="col-md-3">
                            <label for="searchInput" class="form-label small">Search Users:</label>
                            <div class="input-group input-group-sm">
                                <input type="text" class="form-control" id="searchInput" 
                                       placeholder="Name, email, username..." 
                                       value="{{ request('search') }}"
                                       onkeyup="handleSearchKeyup(event)">
                                <button class="btn btn-outline-secondary" type="button" onclick="performSearch()">
                                    <i class="fas fa-search"></i>
                                </button>
                                @if(request('search'))
                                    <button class="btn btn-outline-danger" type="button" onclick="clearSearch()" title="Clear search">
                                        <i class="fas fa-times"></i>
                                    </button>
                                @endif
                            </div>
                        </div>
                        <div class="col-md-2">
                            <label for="issueTypeFilter" class="form-label small">Filter by Issue:</label>
                            <select class="form-select form-select-sm" id="issueTypeFilter" onchange="filterByIssueType()">
                                <option value="all" {{ $issueType == 'all' ? 'selected' : '' }}>All Issues</option>
                                <option value="empty" {{ $issueType == 'empty' ? 'selected' : '' }}>Empty/NULL</option>
                                <option value="short" {{ $issueType == 'short' ? 'selected' : '' }}>Too Short</option>
                                <option value="spaces" {{ $issueType == 'spaces' ? 'selected' : '' }}>Has Spaces</option>
                                <option value="long" {{ $issueType == 'long' ? 'selected' : '' }}>Too Long</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label for="perPageSelect" class="form-label small">Per Page:</label>
                            <select class="form-select form-select-sm" id="perPageSelect" onchange="changePerPage()">
                                <option value="25" {{ request('per_page') == 25 ? 'selected' : '' }}>25</option>
                                <option value="50" {{ request('per_page') == 50 ? 'selected' : '' }}>50</option>
                                <option value="100" {{ request('per_page') == 100 ? 'selected' : '' }}>100</option>
                            </select>
                        </div>
                        <div class="col-md-5">
                            <label class="form-label small">Bulk Actions:</label>
                            <div class="action-buttons">
                                <button class="btn btn-primary btn-sm" onclick="sendEmailToSelected()">
                                    <i class="fas fa-envelope"></i> Email Selected
                                </button>
                                <button class="btn btn-warning btn-sm" onclick="sendEmailToAll('{{ $issueType }}')">
                                    <i class="fas fa-envelope-bulk"></i> Email All ({{ ucfirst($issueType) }})
                                </button>
                                <button class="btn btn-info btn-sm" onclick="selectAll()">
                                    <i class="fas fa-check-square"></i> Select All
                                </button>
                                <button class="btn btn-secondary btn-sm" onclick="clearSelection()">
                                    <i class="fas fa-square"></i> Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Table -->
        <div class="table-container">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">
                    <i class="fas fa-table text-primary me-2"></i>
                    Users with Faulty Usernames ({{ $faultyUsers->total() }} total)
                    @if($search)
                        <span class="badge bg-info ms-2">
                            <i class="fas fa-search me-1"></i>Filtered by: "{{ $search }}"
                        </span>
                    @endif
                </h5>
                <div class="text-muted small">
                    Showing {{ $faultyUsers->firstItem() ?? 0 }} to {{ $faultyUsers->lastItem() ?? 0 }} of {{ $faultyUsers->total() }} results
                    @if($search)
                        <br><small class="text-info">Search results for "{{ $search }}"</small>
                    @endif
                </div>
            </div>

            @if($faultyUsers->count() > 0)
                <div class="table-responsive">
                    <table class="table table-hover" id="faultyUsernameTable">
                        <thead class="table-dark">
                            <tr>
                                <th width="40">
                                    <input type="checkbox" id="selectAllCheckbox" onchange="toggleSelectAll()">
                                </th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Length</th>
                                <th>Issue Type</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($faultyUsers as $user)
                                <tr>
                                    <td>
                                        <input type="checkbox" class="user-checkbox" value="{{ $user->id }}">
                                    </td>
                                    <td>{{ $user->id }}</td>
                                    <td>
                                        <div class="fw-bold">{{ $user->name }}</div>
                                        @if($user->surname)
                                            <div class="small text-muted">{{ $user->surname }}</div>
                                        @endif
                                    </td>
                                    <td>
                                        <div>{{ $user->email }}</div>
                                        <div class="email-status" id="email-status-{{ $user->id }}">
                                            @if($user->email_sent_at)
                                                <span class="email-sent-badge">
                                                    <i class="fas fa-check-circle"></i>
                                                    Sent {{ $user->email_sent_at->format('M d, Y H:i') }}
                                                </span>
                                            @endif
                                        </div>
                                    </td>
                                    <td>
                                        <div class="username-cell">
                                            {{ $user->username ?: '[NULL]' }}
                                        </div>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary">{{ $user->username_length }}</span>
                                    </td>
                                    <td>
                                        @php
                                            $issueClass = match(true) {
                                                str_contains($user->issue_type, 'Empty') => 'issue-empty',
                                                str_contains($user->issue_type, 'short') => 'issue-short',
                                                str_contains($user->issue_type, 'spaces') => 'issue-spaces',
                                                str_contains($user->issue_type, 'long') => 'issue-long',
                                                default => 'bg-secondary'
                                            };
                                        @endphp
                                        <span class="badge {{ $issueClass }} issue-badge">
                                            {{ $user->issue_type }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="small">{{ $user->created_at->format('M d, Y') }}</div>
                                        <div class="small text-muted">{{ $user->created_at->format('H:i') }}</div>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary" 
                                                onclick="sendEmailToUser({{ $user->id }})"
                                                title="Send email to this user">
                                            <i class="fas fa-envelope"></i>
                                        </button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="text-muted small">
                        Showing {{ $faultyUsers->firstItem() ?? 0 }} to {{ $faultyUsers->lastItem() ?? 0 }} of {{ $faultyUsers->total() }} results
                    </div>
                    <div>
                        {{ $faultyUsers->appends(request()->query())->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            @else
                <div class="text-center py-5">
                    <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
                    <h4 class="mt-3 text-success">No Faulty Usernames Found!</h4>
                    <p class="text-muted">All users have valid usernames for the selected criteria.</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Toast Container -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="successToast" class="toast align-items-center text-white bg-success border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body" id="successToastBody"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
        <div id="errorToast" class="toast align-items-center text-white bg-danger border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body" id="errorToastBody"></div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdn.datatables.net/select/1.7.0/js/dataTables.select.min.js"></script>

    <script>
        // CSRF Token Setup
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        // Initialize DataTable (optional, for enhanced features)
        $(document).ready(function() {
            // You can uncomment this if you want DataTable features on top of Laravel pagination
            // $('#faultyUsernameTable').DataTable({
            //     "paging": false,
            //     "searching": true,
            //     "ordering": true,
            //     "info": false
            // });
        });

        // Filter Functions
        function filterByIssueType() {
            const issueType = document.getElementById('issueTypeFilter').value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('issue_type', issueType);
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        function changePerPage() {
            const perPage = document.getElementById('perPageSelect').value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', perPage);
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        // Search Functions
        function handleSearchKeyup(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        }

        function performSearch() {
            const searchTerm = document.getElementById('searchInput').value.trim();
            const currentUrl = new URL(window.location.href);
            
            if (searchTerm) {
                currentUrl.searchParams.set('search', searchTerm);
            } else {
                currentUrl.searchParams.delete('search');
            }
            
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        function clearSearch() {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete('search');
            currentUrl.searchParams.delete('page'); // Reset to first page
            window.location.href = currentUrl.toString();
        }

        // Selection Functions
        function toggleSelectAll() {
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            const userCheckboxes = document.querySelectorAll('.user-checkbox');
            
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        }

        function selectAll() {
            const userCheckboxes = document.querySelectorAll('.user-checkbox');
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            selectAllCheckbox.checked = true;
        }

        function clearSelection() {
            const userCheckboxes = document.querySelectorAll('.user-checkbox');
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            
            userCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            selectAllCheckbox.checked = false;
        }

        // Email Functions
        function sendEmailToUser(userId) {
            showLoading();
            
            // Debug log
            console.log('Sending email to user:', userId);
            console.log('CSRF Token:', $('meta[name="csrf-token"]').attr('content'));
            
            fetch(`/faulty-username/send-email/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                hideLoading();
                console.log('Response data:', data);
                
                if (data.success) {
                    showSuccessToast(data.message);
                    markEmailSent(userId, data.sent_at);
                } else {
                    showErrorToast(data.message || 'Unknown error occurred');
                    updateEmailStatus(userId, 'Failed to send email', 'error');
                }
            })
            .catch(error => {
                hideLoading();
                console.error('Fetch error:', error);
                showErrorToast('An error occurred while sending the email: ' + error.message);
                updateEmailStatus(userId, 'Error occurred', 'error');
            });
        }

        function sendEmailToSelected() {
            const selectedUsers = Array.from(document.querySelectorAll('.user-checkbox:checked'))
                .map(checkbox => checkbox.value);
            
            if (selectedUsers.length === 0) {
                showErrorToast('Please select at least one user');
                return;
            }
            
            if (!confirm(`Send emails to ${selectedUsers.length} selected users?`)) {
                return;
            }
            
            showLoading();
            
            fetch('/faulty-username/send-selected', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                body: JSON.stringify({
                    user_ids: selectedUsers
                })
            })
            .then(response => response.json())
            .then(data => {
                hideLoading();
                
                if (data.success) {
                    showSuccessToast(data.message);
                    const now = new Date().toISOString();
                    selectedUsers.forEach(userId => {
                        markEmailSent(userId, now);
                    });
                } else {
                    showErrorToast(data.message);
                }
            })
            .catch(error => {
                hideLoading();
                console.error('Error:', error);
                showErrorToast('An error occurred while queueing emails');
            });
        }

        function sendEmailToAll(issueType) {
            const message = issueType === 'all' 
                ? 'Send emails to ALL users with faulty usernames? This may take a while.'
                : `Send emails to all users with ${issueType} username issues?`;
            
            if (!confirm(message)) {
                return;
            }
            
            showLoading();
            
            fetch('/faulty-username/send-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                body: JSON.stringify({
                    issue_type: issueType
                })
            })
            .then(response => response.json())
            .then(data => {
                hideLoading();
                
                if (data.success) {
                    showSuccessToast(data.message);
                    const now = new Date().toISOString();
                    document.querySelectorAll('[id^="email-status-"]').forEach(element => {
                        const userId = element.id.replace('email-status-', '');
                        markEmailSent(userId, now);
                    });
                } else {
                    showErrorToast(data.message);
                }
            })
            .catch(error => {
                hideLoading();
                console.error('Error:', error);
                showErrorToast('An error occurred while queueing emails');
            });
        }

        // UI Helper Functions
        function showLoading() {
            document.getElementById('loadingOverlay').style.display = 'flex';
        }

        function hideLoading() {
            document.getElementById('loadingOverlay').style.display = 'none';
        }

        function showSuccessToast(message) {
            document.getElementById('successToastBody').textContent = message;
            const toast = new bootstrap.Toast(document.getElementById('successToast'));
            toast.show();
        }

        function showErrorToast(message) {
            document.getElementById('errorToastBody').textContent = message;
            const toast = new bootstrap.Toast(document.getElementById('errorToast'));
            toast.show();
        }

        function markEmailSent(userId, isoString) {
            const statusElement = document.getElementById(`email-status-${userId}`);
            if (statusElement) {
                const d = new Date(isoString);
                const formatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                statusElement.innerHTML = `<span class="email-sent-badge"><i class="fas fa-check-circle"></i> Sent ${formatted}</span>`;
            }
        }

        function updateEmailStatus(userId, message, type) {
            const statusElement = document.getElementById(`email-status-${userId}`);
            if (statusElement) {
                statusElement.textContent = message;
                statusElement.className = `email-status text-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'}`;
            }
        }
    </script>
</body>
</html>
 