<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionEvent extends Model
{
    use HasFactory;

    protected $table = 'submissions_events';

    public $timestamps = false;

    protected $fillable = [
        'submission_id',
        'contact_id',
        'event_string',
        'event_flag',
        'event_type',
    ];

    protected $casts = [
        'event_flag' => 'integer',
        'creation' => 'datetime',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class, 'submission_id', 'id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id', 'contact_id');
    }
}
