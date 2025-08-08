<?php

namespace App\Http\Controllers;

use App\Models\Collateral;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollateralController extends Controller
{
    /**
     * Display a listing of collaterals.
     */
    public function index(Request $request)
    {
        $query = Collateral::with(['contact', 'submission']);

        // Apply filters
        if ($request->filled('contact_id')) {
            $query->where('contact_id', 'like', '%' . $request->contact_id . '%');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('state')) {
            $query->where('state', $request->state);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $collaterals = $query->orderBy('collateral_id', 'desc')->paginate(15);

        return Inertia::render('collaterals/index', [
            'collaterals' => $collaterals,
            'filters' => $request->only(['contact_id', 'type', 'state', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new collateral.
     */
    public function create()
    {
        return Inertia::render('collaterals/create');
    }

    /**
     * Store a newly created collateral in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50',
            'status' => 'required|in:YES,NO',
            'type' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'existing_debt' => 'nullable|string|max:255',
            'state' => 'nullable|string|size:2',
            'borrower_disclosed_value' => 'nullable|string|max:255',
            'thunderbird_valuation' => 'nullable|numeric',
            'submission_id' => 'nullable|integer',
        ]);

        Collateral::create($request->all());

        return redirect()->route('collaterals.index')->with('success', 'Collateral created successfully.');
    }

    /**
     * Display the specified collateral.
     */
    public function show(Collateral $collateral)
    {
        $collateral->load([
            'contact',
            'submission'
        ]);

        return Inertia::render('collaterals/show', [
            'collateral' => $collateral,
        ]);
    }

    /**
     * Show the form for editing the specified collateral.
     */
    public function edit(Collateral $collateral)
    {
        $collateral->load(['contact', 'submission']);

        return Inertia::render('collaterals/edit', [
            'collateral' => $collateral,
        ]);
    }

    /**
     * Update the specified collateral in storage.
     */
    public function update(Request $request, Collateral $collateral)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50',
            'status' => 'required|in:YES,NO',
            'type' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:10',
            'existing_debt' => 'nullable|string|max:255',
            'state' => 'nullable|string|size:2',
            'borrower_disclosed_value' => 'nullable|string|max:255',
            'thunderbird_valuation' => 'nullable|numeric',
            'submission_id' => 'nullable|integer',
        ]);

        $collateral->update($request->all());

        return redirect()->route('collaterals.index')->with('success', 'Collateral updated successfully.');
    }

    /**
     * Remove the specified collateral from storage.
     */
    public function destroy(Collateral $collateral)
    {
        $collateral->delete();

        return redirect()->route('collaterals.index')->with('success', 'Collateral deleted successfully.');
    }
}
