<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequestLog extends Model
{
    use HasFactory;

    protected $table = 'contact_request_log';

    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'contact_id',
        'inbound_request',
        'result',
        'error_status',
    ];

    protected $casts = [
        'inbound_request' => 'array',
        'result' => 'array',
        'error_status' => 'boolean',
        'creation_datetime' => 'datetime',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id', 'contact_id');
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id', 'id');
    }
}
