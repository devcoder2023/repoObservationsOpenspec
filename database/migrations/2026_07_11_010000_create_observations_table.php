<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('observations', function (Blueprint $table) {
            $table->id();
            $table->string('image_before');
            $table->text('comment_before')->nullable();
            $table->string('image_after')->nullable();
            $table->text('comment_after')->nullable();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_id')->nullable()->constrained()->nullOnDelete();
            $table->string('custom_site')->nullable();
            $table->tinyInteger('shift');
            $table->foreignId('observation_category_id')->nullable()->constrained()->nullOnDelete();
            $table->tinyInteger('risk_degree');
            $table->tinyInteger('status')->default(1);
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('observations');
    }
};
