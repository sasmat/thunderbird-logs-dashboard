<?php

namespace App\Http\Controllers;

use App\Models\ChannelPartnersSyncLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChannelPartnersSyncLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ChannelPartnersSyncLog::query();

        // Apply filters
        if ($request->filled('session_id')) {
            $query->where('session_id', 'like', '%' . $request->session_id . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('processing_status')) {
            $query->where('processing_status', $request->processing_status);
        }

        if ($request->filled('contact_id')) {
            $query->where('contact_id', 'like', '%' . $request->contact_id . '%');
        }

        // Apply date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')
                     ->paginate(20)
                     ->withQueryString();

        return Inertia::render('ChannelPartnersSyncLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['session_id', 'email', 'processing_status', 'contact_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(ChannelPartnersSyncLog $log)
    {
        return Inertia::render('ChannelPartnersSyncLogs/Show', [
            'log' => $log,
        ]);
    }
}
