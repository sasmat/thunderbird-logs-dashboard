<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of contacts.
     */
    public function index(Request $request)
    {
        $query = Contact::with(['collaterals', 'submissions']);

        // Apply filters
        if ($request->filled('contact_id')) {
            $query->where('contact_id', 'like', '%' . $request->contact_id . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('business_state')) {
            $query->where('business_state', $request->business_state);
        }

        $contacts = $query->orderBy('id', 'desc')->paginate(15);

        return Inertia::render('contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['contact_id', 'email', 'business_state']),
        ]);
    }

    /**
     * Show the form for creating a new contact.
     */
    public function create()
    {
        return Inertia::render('contacts/create');
    }

    /**
     * Store a newly created contact in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50|unique:contacts',
            'email' => 'nullable|email|max:255',
            'post_approve_link' => 'nullable|url|max:255',
            'business_state' => 'nullable|string|size:2',
        ]);

        Contact::create($request->all());

        return redirect()->route('contacts.index')->with('success', 'Contact created successfully.');
    }

    /**
     * Display the specified contact.
     */
    public function show(Contact $contact)
    {
        $contact->load([
            'collaterals',
            'submissions',
            'contactRequestLogs',
            'submissionEvents'
        ]);

        return Inertia::render('contacts/show', [
            'contact' => $contact,
        ]);
    }

    /**
     * Show the form for editing the specified contact.
     */
    public function edit(Contact $contact)
    {
        return Inertia::render('contacts/edit', [
            'contact' => $contact,
        ]);
    }

    /**
     * Update the specified contact in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $request->validate([
            'contact_id' => 'required|string|max:50|unique:contacts,contact_id,' . $contact->id,
            'email' => 'nullable|email|max:255',
            'post_approve_link' => 'nullable|url|max:255',
            'business_state' => 'nullable|string|size:2',
        ]);

        $contact->update($request->all());

        return redirect()->route('contacts.index')->with('success', 'Contact updated successfully.');
    }

    /**
     * Remove the specified contact from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('contacts.index')->with('success', 'Contact deleted successfully.');
    }
}
