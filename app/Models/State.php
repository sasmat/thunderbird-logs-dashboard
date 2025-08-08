<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class State extends Model
{
    use HasFactory;

    protected $table = 'states';

    public $timestamps = false;

    protected $fillable = [
        'state_code',
        'state_name',
        'timezone',
    ];

    protected $casts = [
        'created_date' => 'datetime',
    ];
}
