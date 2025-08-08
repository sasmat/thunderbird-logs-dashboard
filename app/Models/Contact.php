<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    public $timestamps = false;

    protected $fillable = [
        'contact_id',
        'email',
        'post_approve_link',
        'business_state',
    ];

    public function collaterals()
    {
        return $this->hasMany(Collateral::class, 'contact_id', 'contact_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'contact_id', 'contact_id');
    }

    public function contactRequestLogs()
    {
        return $this->hasMany(ContactRequestLog::class, 'contact_id', 'contact_id');
    }

    public function submissionEvents()
    {
        return $this->hasMany(SubmissionEvent::class, 'contact_id', 'contact_id');
    }
}
