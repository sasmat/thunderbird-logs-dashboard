<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collateral extends Model
{
    use HasFactory;

    protected $table = 'collaterals';

    public $timestamps = false;

    protected $primaryKey = 'collateral_id';

    protected $fillable = [
        'contact_id',
        'status',
        'type',
        'address',
        'zip_code',
        'existing_debt',
        'state',
        'borrower_disclosed_value',
        'thunderbird_valuation',
        'submission_id',
    ];

    protected $casts = [
        'thunderbird_valuation' => 'decimal:2',
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
