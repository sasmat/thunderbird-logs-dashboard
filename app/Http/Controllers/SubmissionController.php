<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    /**
     * Display a listing of submissions.
     */
    public function index(Request $request)
    {
        $query = Submission::with(['contact', 'collaterals']);

        // Apply filters
        if ($request->filled('contact_id')) {
            $query->where('contact_id', 'like', '%' . $request->contact_id . '%');
        }

        if ($request->filled('case_status')) {
            $query->where('case_status', $request->case_status);
        }

        if ($request->filled('is_business_state_valid')) {
            $query->where('is_business_state_valid', $request->is_business_state_valid);
        }

        if ($request->filled('loan_amount_min')) {
            $query->where('loan_amount', '>=', $request->loan_amount_min);
        }

        if ($request->filled('loan_amount_max')) {
            $query->where('loan_amount', '<=', $request->loan_amount_max);
        }

        $submissions = $query->orderBy('creation', 'desc')->paginate(15);

        return Inertia::render('submissions/index', [
            'submissions' => $submissions,
            'filters' => $request->only(['contact_id', 'case_status', 'is_business_state_valid', 'loan_amount_min', 'loan_amount_max']),
        ]);
    }

    /**
     * Show the form for creating a new submission.
     */
    public function create()
    {
        $contacts = Contact::select('id', 'contact_id', 'email')->get();

        return Inertia::render('submissions/create', [
            'contacts' => $contacts,
        ]);
    }

    /**
     * Store a newly created submission in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50|exists:contacts,contact_id',
            'interest_rate' => 'nullable|numeric|between:0,99.99',
            'borrower_total_valuation' => 'nullable|numeric|between:0,99999999.99',
            'thunderbird_total_valuation' => 'nullable|numeric|between:0,99999999.99',
            'loan_amount' => 'nullable|string|max:255',
            'balloon_payment' => 'nullable|string|max:255',
            'monthly_payment' => 'nullable|string|max:255',
            'is_business_state_valid' => 'nullable|in:valid,invalid',
            'case_status' => 'nullable|string|max:100',
            'itp_fee' => 'nullable|numeric|between:0,99999999.99',
        ]);

        Submission::create($request->all());

        return redirect()->route('submissions.index')->with('success', 'Submission created successfully.');
    }

    /**
     * Display the specified submission.
     */
    public function show(Submission $submission)
    {
        $submission->load([
            'contact',
            'collaterals',
            'submissionEvents'
        ]);

        return Inertia::render('submissions/show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show the form for editing the specified submission.
     */
    public function edit(Submission $submission)
    {
        $contacts = Contact::select('id', 'contact_id', 'email')->get();

        return Inertia::render('submissions/edit', [
            'submission' => $submission,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Update the specified submission in storage.
     */
    public function update(Request $request, Submission $submission)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50|exists:contacts,contact_id',
            'interest_rate' => 'nullable|numeric|between:0,99.99',
            'borrower_total_valuation' => 'nullable|numeric|between:0,99999999.99',
            'thunderbird_total_valuation' => 'nullable|numeric|between:0,99999999.99',
            'loan_amount' => 'nullable|string|max:255',
            'balloon_payment' => 'nullable|string|max:255',
            'monthly_payment' => 'nullable|string|max:255',
            'is_business_state_valid' => 'nullable|in:valid,invalid',
            'case_status' => 'nullable|string|max:100',
            'itp_fee' => 'nullable|numeric|between:0,99999999.99',
        ]);

        $submission->update($request->all());

        return redirect()->route('submissions.index')->with('success', 'Submission updated successfully.');
    }

    /**
     * Remove the specified submission from storage.
     */
    public function destroy(Submission $submission)
    {
        $submission->delete();

        return redirect()->route('submissions.index')->with('success', 'Submission deleted successfully.');
    }
}
