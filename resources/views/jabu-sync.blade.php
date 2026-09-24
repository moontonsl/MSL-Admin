<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Jabu Sync Dashboard | MSL</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .neon-glow { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3); }
        .btn-glow:hover { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
    </style>
</head>
<body class="bg-[#0b0f1a] text-white min-h-screen flex items-center justify-center p-4">

    @if(!$is_authorized)
    <!-- Passcode Login -->
    <div class="max-w-md w-full glass p-8 rounded-3xl shadow-2xl border border-blue-500/20">
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4">
                <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h1 class="text-3xl font-bold tracking-tight neon-glow">Authorized Access</h1>
            <p class="text-gray-400 mt-2">Enter your secured passcode to continue</p>
        </div>

        <form action="{{ route('jabu.sync.verify') }}" method="POST" class="space-y-6">
            @csrf
            <div>
                <input type="password" name="passcode" maxlength="4" placeholder="••••" required autofocus
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-6 py-4 text-center text-3xl tracking-[1em] focus:outline-none focus:border-blue-500 transition-colors">
                @error('passcode')
                    <p class="text-red-400 text-sm mt-3 text-center">{{ $message }}</p>
                @enderror
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all btn-glow">
                Unlock Panel
            </button>
        </form>
    </div>

    @else
    <!-- Dashboard Panel -->
    <div class="max-w-2xl w-full glass p-8 rounded-3xl shadow-2xl border border-blue-500/20" x-data="syncDashboard()">
        <div class="flex items-center justify-between mb-10">
            <div>
                <h1 class="text-3xl font-bold tracking-tight neon-glow text-blue-400">Jabu Sync</h1>
                <p class="text-gray-400">Google Sheets Sync & Queue Control</p>
            </div>
            <form action="{{ route('jabu.sync.logout') }}" method="POST">
                @csrf
                <button type="submit" class="text-gray-500 hover:text-red-400 transition-colors text-sm font-medium">Logout</button>
            </form>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sync Card -->
            <div class="bg-gray-900/40 border border-gray-700/50 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
                <div class="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Bulk Sync</h3>
                <p class="text-sm text-gray-400 mb-6">Fully refresh and clear the Google Sheet with database users.</p>
                <button @click="triggerSync()" :disabled="processingSync"
                    class="w-full font-medium py-3 rounded-xl border border-blue-600 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition-all disabled:opacity-50">
                    <span x-show="!processingSync">Sync All Users</span>
                    <span x-show="processingSync" class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Syncing...
                    </span>
                </button>
            </div>

            <!-- Queue Card -->
            <div class="bg-gray-900/40 border border-gray-700/50 p-6 rounded-2xl hover:border-purple-500/30 transition-all">
                <div class="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Queue Worker</h3>
                <p class="text-sm text-gray-400 mb-6">Force process any pending jobs if real-time sync lags.</p>
                <button @click="triggerQueue()" :disabled="processingQueue"
                    class="w-full font-medium py-3 rounded-xl border border-purple-600 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white transition-all disabled:opacity-50">
                    <span x-show="!processingQueue">Process Jobs</span>
                    <span x-show="processingQueue" class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                    </span>
                </button>
            </div>
        </div>

        <!-- Output Console -->
        <div class="mt-8">
            <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Live Log</h4>
            <div class="bg-black/50 border border-gray-800 rounded-xl p-4 font-mono text-sm h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700" x-ref="log">
                <template x-for="line in logLines">
                    <div class="mb-1" :class="line.type === 'error' ? 'text-red-400' : 'text-green-400'">
                        <span class="text-gray-600">[@{{ line.time }}]</span>
                        <span x-text="line.text"></span>
                    </div>
                </template>
                <div x-show="logLines.length === 0" class="text-gray-700 italic">Waiting for actions...</div>
            </div>
        </div>

        <div class="mt-8 flex items-center justify-center text-gray-600 text-xs gap-4">
            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Database Connected</span>
            <span class="flex items-center"><span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Google API Secure</span>
        </div>
    </div>
    @endif

    <script>
        function syncDashboard() {
            return {
                processingSync: false,
                processingQueue: false,
                logLines: [],

                addLog(text, type = 'success') {
                    this.logLines.unshift({
                        time: new Date().toLocaleTimeString(),
                        text: text,
                        type: type
                    });
                },

                async triggerSync() {
                    this.processingSync = true;
                    this.addLog('Started Bulk Sync process...');
                    
                    try {
                        const response = await fetch('{{ route("jabu.sync.run") }}', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            }
                        });
                        const data = await response.json();
                        
                        if (data.success) {
                            this.addLog('Bulk Sync completed successfully.');
                        } else {
                            this.addLog(data.message, 'error');
                        }
                    } catch (error) {
                        this.addLog('Critical error during sync.', 'error');
                    } finally {
                        this.processingSync = false;
                    }
                },

                async triggerQueue() {
                    this.processingQueue = true;
                    this.addLog('Running Queue Worker...');

                    try {
                        const response = await fetch('{{ route("jabu.sync.queue") }}', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            }
                        });
                        const data = await response.json();

                        if (data.success) {
                            this.addLog('Queue processed (stopped when empty).');
                        } else {
                            this.addLog(data.message, 'error');
                        }
                    } catch (error) {
                        this.addLog('Error processing queue.', 'error');
                    } finally {
                        this.processingQueue = false;
                    }
                }
            }
        }
    </script>
</body>
</html>
