<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Secure Access - User Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at top left, #1a103d 0%, #050505 100%);
            overflow: hidden;
        }
        .glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
        .input-glow:focus {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
            border-color: rgba(139, 92, 246, 0.8);
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .bg-dots {
            background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 30px 30px;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center relative bg-dots">
    
    <!-- Decorative Elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="w-full max-w-md px-6 relative z-10">
        <div class="glass p-8 rounded-3xl animate-float">
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-2xl mb-4 border border-purple-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Restricted Access</h1>
                <p class="text-gray-400 mt-2 text-sm">Please enter the security code to proceed</p>
            </div>

            <form action="{{ route('user-management.verify') }}" method="POST" class="space-y-6">
                @csrf
                <div>
                    <input 
                        type="password" 
                        name="code" 
                        required
                        autofocus
                        placeholder="••••••••••••"
                        class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 outline-none transition-all input-glow text-center text-lg tracking-widest"
                    >
                    @error('code')
                        <p class="text-red-400 text-xs mt-2 text-center">{{ $message }}</p>
                    @enderror
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all active:scale-[0.98] border border-white/10"
                >
                    Authorize Access
                </button>
            </form>

            <div class="mt-8 text-center">
                <p class="text-gray-500 text-xs">
                    MSL Philippines • Security Gateway
                </p>
            </div>
        </div>
    </div>

    <!-- Background Subtle Text -->
    <div class="absolute bottom-10 left-10 opacity-5 pointer-events-none">
        <p class="text-8xl font-black text-white select-none">MANAGEMENT</p>
    </div>
</body>
</html>
