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
        Schema::table('observations', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('creator_id');
        });
    }

    public function down(): void
    {
        Schema::table('observations', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['creator_id']);
        });
    }
};
