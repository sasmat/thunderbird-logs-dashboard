<?php

namespace App\Http\Controllers;

use App\Models\HubSpotWebHooksLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HubSpotWebHooksLogController extends Controller
{
    /**
     * Display a listing of HubSpot webhook logs.
     */
    public function index(Request $request)
    {
        $query = HubSpotWebHooksLog::query();

        // Apply filters
        if ($request->filled('event_id')) {
            $query->where('event_id', 'like', '%' . $request->event_id . '%');
        }

        if ($request->filled('subscription_type')) {
            $query->where('subscription_type', $request->subscription_type);
        }

        if ($request->filled('processing_status')) {
            $query->where('processing_status', $request->processing_status);
        }

        if ($request->filled('object_id')) {
            $query->where('object_id', 'like', '%' . $request->object_id . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('hubspot-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['event_id', 'subscription_type', 'processing_status', 'object_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified HubSpot webhook log.
     */
    public function show(HubSpotWebHooksLog $hubspotLog)
    {
        return Inertia::render('hubspot-logs/show', [
            'log' => $hubspotLog,
        ]);
    }

    /**
     * Remove the specified HubSpot webhook log from storage.
     */
    public function destroy(HubSpotWebHooksLog $hubspotLog)
    {
        $hubspotLog->delete();

        return redirect()->route('hubspot-logs.index')->with('success', 'HubSpot webhook log deleted successfully.');
    }

    /**
     * Export HubSpot webhook logs to CSV.
     */
    public function export(Request $request)
    {
        $query = HubSpotWebHooksLog::query();

        // Apply same filters as index
        if ($request->filled('event_id')) {
            $query->where('event_id', 'like', '%' . $request->event_id . '%');
        }

        if ($request->filled('subscription_type')) {
            $query->where('subscription_type', $request->subscription_type);
        }

        if ($request->filled('processing_status')) {
            $query->where('processing_status', $request->processing_status);
        }

        if ($request->filled('object_id')) {
            $query->where('object_id', 'like', '%' . $request->object_id . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->get();

        $filename = 'hubspot_webhook_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($logs) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'ID', 'Event ID', 'Subscription Type', 'Property Name', 'Object ID',
                'Processing Status', 'Processing Result', 'Error Message',
                'Execution Time (ms)', 'Created At', 'Updated At'
            ]);

            foreach ($logs as $log) {
                fputcsv($file, [
                    $log->id,
                    $log->event_id,
                    $log->subscription_type,
                    $log->property_name,
                    $log->object_id,
                    $log->processing_status,
                    $log->processing_result,
                    $log->error_message,
                    $log->execution_time_ms,
                    $log->created_at,
                    $log->updated_at,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
