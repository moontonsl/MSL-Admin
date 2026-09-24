<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
		// Rename only if legacy columns exist (older databases may not have them)
		if (Schema::hasColumn('users', 'email_change_token')) {
			Schema::table('users', function (Blueprint $table) {
				$table->renameColumn('email_change_token', 'email_verification_code');
			});
		}

		if (Schema::hasColumn('users', 'email_change_token_expires_at')) {
			Schema::table('users', function (Blueprint $table) {
				$table->renameColumn('email_change_token_expires_at', 'email_verification_code_expires_at');
			});
		}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
		// Revert only if the verification columns exist
		if (Schema::hasColumn('users', 'email_verification_code')) {
			Schema::table('users', function (Blueprint $table) {
				$table->renameColumn('email_verification_code', 'email_change_token');
			});
		}

		if (Schema::hasColumn('users', 'email_verification_code_expires_at')) {
			Schema::table('users', function (Blueprint $table) {
				$table->renameColumn('email_verification_code_expires_at', 'email_change_token_expires_at');
			});
		}
    }
};
