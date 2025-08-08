<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChannelPartnersSyncLog extends Model
{
    protected $table = 'channel_partners_sync_logs';

    protected $fillable = [
        'session_id',
        'incoming_payload',
        'contact_id',
        'email',
        'phone',
        'rid',
        'processing_status',
        'hubspot_get_contact_email_payload',
        'hubspot_get_contact_email_response',
        'hubspot_get_contact_email_http_code',
        'hubspot_get_contact_cid_payload',
        'hubspot_get_contact_cid_response',
        'hubspot_get_contact_cid_http_code',
        'hubspot_create_contact_payload',
        'hubspot_create_contact_response',
        'hubspot_create_contact_http_code',
        'hubspot_update_contact_payload',
        'hubspot_update_contact_response',
        'hubspot_update_contact_http_code',
        'quickbase_update_payload',
        'quickbase_update_response',
        'quickbase_update_http_code',
        'final_result',
        'error_message',
        'error_details',
        'execution_time_ms',
    ];

    protected $casts = [
        'incoming_payload' => 'array',
        'hubspot_get_contact_email_payload' => 'array',
        'hubspot_get_contact_email_response' => 'array',
        'hubspot_get_contact_cid_payload' => 'array',
        'hubspot_get_contact_cid_response' => 'array',
        'hubspot_create_contact_payload' => 'array',
        'hubspot_create_contact_response' => 'array',
        'hubspot_update_contact_payload' => 'array',
        'hubspot_update_contact_response' => 'array',
        'quickbase_update_payload' => 'array',
        'quickbase_update_response' => 'array',
        'final_result' => 'array',
        'error_details' => 'array',
        'execution_time_ms' => 'decimal:3',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
