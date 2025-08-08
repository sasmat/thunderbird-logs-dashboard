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
        Schema::create('channel_partners_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->longText('incoming_payload')->nullable();
            $table->string('contact_id')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('rid')->nullable();
            $table->enum('processing_status', ['started', 'success', 'error', 'failed'])->default('started');

            // HubSpot API interactions
            $table->longText('hubspot_get_contact_email_payload')->nullable();
            $table->longText('hubspot_get_contact_email_response')->nullable();
            $table->integer('hubspot_get_contact_email_http_code')->nullable();

            $table->longText('hubspot_get_contact_cid_payload')->nullable();
            $table->longText('hubspot_get_contact_cid_response')->nullable();
            $table->integer('hubspot_get_contact_cid_http_code')->nullable();

            $table->longText('hubspot_create_contact_payload')->nullable();
            $table->longText('hubspot_create_contact_response')->nullable();
            $table->integer('hubspot_create_contact_http_code')->nullable();

            $table->longText('hubspot_update_contact_payload')->nullable();
            $table->longText('hubspot_update_contact_response')->nullable();
            $table->integer('hubspot_update_contact_http_code')->nullable();

            // QuickBase API interactions
            $table->longText('quickbase_update_payload')->nullable();
            $table->longText('quickbase_update_response')->nullable();
            $table->integer('quickbase_update_http_code')->nullable();

            // Processing results and errors
            $table->longText('final_result')->nullable();
            $table->text('error_message')->nullable();
            $table->longText('error_details')->nullable();
            $table->decimal('execution_time_ms', 10, 3)->nullable();

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->index('session_id', 'idx_session_id');
            $table->index('contact_id', 'idx_contact_id');
            $table->index('email', 'idx_email');
            $table->index('processing_status', 'idx_processing_status');
            $table->index('created_at', 'idx_created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_partners_sync_logs');
    }
};
