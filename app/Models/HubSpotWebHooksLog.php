<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HubSpotWebHooksLog extends Model
{
    use HasFactory;

    protected $table = 'HubSpotWebHooksLogs';

    protected $fillable = [
        'event_id',
        'subscription_type',
        'property_name',
        'object_id',
        'incoming_payload',
        'contact_data',
        'quickbase_payload',
        'quickbase_response',
        'quickbase_http_code',
        'hubspot_update_payload',
        'hubspot_update_response',
        'hubspot_update_http_code',
        'processing_result',
        'error_message',
        'error_details',
        'processing_status',
        'execution_time_ms',
    ];

    protected $casts = [
        'incoming_payload' => 'array',
        'contact_data' => 'array',
        'quickbase_payload' => 'array',
        'quickbase_response' => 'array',
        'hubspot_update_payload' => 'array',
        'hubspot_update_response' => 'array',
        'error_details' => 'array',
        'quickbase_http_code' => 'integer',
        'hubspot_update_http_code' => 'integer',
        'execution_time_ms' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'processing_status' => 'success',
    ];
}
