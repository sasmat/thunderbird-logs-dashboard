<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';

    public $timestamps = false;

    protected $fillable = [
        'contact_id',
        'interest_rate',
        'borrower_total_valuation',
        'thunderbird_total_valuation',
        'loan_amount',
        'balloon_payment',
        'monthly_payment',
        'is_business_state_valid',
        'case_status',
        'itp_fee',
    ];

    protected $casts = [
        'interest_rate' => 'decimal:2',
        'borrower_total_valuation' => 'decimal:2',
        'thunderbird_total_valuation' => 'decimal:2',
        'itp_fee' => 'decimal:2',
        'creation' => 'datetime',
    ];

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id', 'contact_id');
    }

    public function collaterals()
    {
        return $this->hasMany(Collateral::class, 'submission_id', 'id');
    }

    public function submissionEvents()
    {
        return $this->hasMany(SubmissionEvent::class, 'submission_id', 'id');
    }
}
