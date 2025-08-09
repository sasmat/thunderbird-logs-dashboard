import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
}

interface Props {
    contacts: Contact[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Submissions', href: route('submissions.index') },
    { title: 'Create Submission', href: route('submissions.create') },
];

export default function CreateSubmission({ contacts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        contact_id: '',
        interest_rate: '',
        borrower_total_valuation: '',
        thunderbird_total_valuation: '',
        loan_amount: '',
        balloon_payment: '',
        monthly_payment: '',
        is_business_state_valid: 'none',
        case_status: '',
        itp_fee: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('submissions.store'), {
            transform: (data) => ({
                ...data,
                is_business_state_valid: data.is_business_state_valid === 'none' ? '' : data.is_business_state_valid,
            }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Submission" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('submissions.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Submissions
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Submission</h1>
                        <p className="text-muted-foreground">
                            Add a new loan submission to the system
                        </p>
                    </div>
                </div>

                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle>Submission Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new loan submission.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Contact Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="contact_id">Contact</Label>
                                <Select
                                    value={data.contact_id}
                                    onValueChange={(value) => setData('contact_id', value)}
                                >
                                    <SelectTrigger className={errors.contact_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a contact" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contacts.map((contact) => (
                                            <SelectItem key={contact.contact_id} value={contact.contact_id}>
                                                {contact.contact_id} {contact.email && `(${contact.email})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.contact_id && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.contact_id}</AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Financial Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Financial Information</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="loan_amount">Loan Amount</Label>
                                        <Input
                                            id="loan_amount"
                                            type="text"
                                            value={data.loan_amount}
                                            onChange={(e) => setData('loan_amount', e.target.value)}
                                            placeholder="Enter loan amount"
                                            className={errors.loan_amount ? 'border-red-500' : ''}
                                        />
                                        {errors.loan_amount && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.loan_amount}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                                        <Input
                                            id="interest_rate"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="99.99"
                                            value={data.interest_rate}
                                            onChange={(e) => setData('interest_rate', e.target.value)}
                                            placeholder="Enter interest rate"
                                            className={errors.interest_rate ? 'border-red-500' : ''}
                                        />
                                        {errors.interest_rate && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.interest_rate}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="monthly_payment">Monthly Payment</Label>
                                        <Input
                                            id="monthly_payment"
                                            type="text"
                                            value={data.monthly_payment}
                                            onChange={(e) => setData('monthly_payment', e.target.value)}
                                            placeholder="Enter monthly payment"
                                            className={errors.monthly_payment ? 'border-red-500' : ''}
                                        />
                                        {errors.monthly_payment && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.monthly_payment}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="balloon_payment">Balloon Payment</Label>
                                        <Input
                                            id="balloon_payment"
                                            type="text"
                                            value={data.balloon_payment}
                                            onChange={(e) => setData('balloon_payment', e.target.value)}
                                            placeholder="Enter balloon payment"
                                            className={errors.balloon_payment ? 'border-red-500' : ''}
                                        />
                                        {errors.balloon_payment && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.balloon_payment}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="itp_fee">ITP Fee</Label>
                                        <Input
                                            id="itp_fee"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.itp_fee}
                                            onChange={(e) => setData('itp_fee', e.target.value)}
                                            placeholder="Enter ITP fee"
                                            className={errors.itp_fee ? 'border-red-500' : ''}
                                        />
                                        {errors.itp_fee && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.itp_fee}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* Valuation Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Valuation Information</h3>

                                    <div className="space-y-2">
                                        <Label htmlFor="borrower_total_valuation">Borrower Total Valuation</Label>
                                        <Input
                                            id="borrower_total_valuation"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.borrower_total_valuation}
                                            onChange={(e) => setData('borrower_total_valuation', e.target.value)}
                                            placeholder="Enter borrower total valuation"
                                            className={errors.borrower_total_valuation ? 'border-red-500' : ''}
                                        />
                                        {errors.borrower_total_valuation && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.borrower_total_valuation}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thunderbird_total_valuation">Thunderbird Total Valuation</Label>
                                        <Input
                                            id="thunderbird_total_valuation"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.thunderbird_total_valuation}
                                            onChange={(e) => setData('thunderbird_total_valuation', e.target.value)}
                                            placeholder="Enter Thunderbird total valuation"
                                            className={errors.thunderbird_total_valuation ? 'border-red-500' : ''}
                                        />
                                        {errors.thunderbird_total_valuation && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.thunderbird_total_valuation}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="case_status">Case Status</Label>
                                        <Input
                                            id="case_status"
                                            type="text"
                                            value={data.case_status}
                                            onChange={(e) => setData('case_status', e.target.value)}
                                            placeholder="Enter case status"
                                            className={errors.case_status ? 'border-red-500' : ''}
                                        />
                                        {errors.case_status && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.case_status}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="is_business_state_valid">Business State Validation</Label>
                                        <Select
                                            value={data.is_business_state_valid}
                                            onValueChange={(value) => setData('is_business_state_valid', value)}
                                        >
                                            <SelectTrigger className={errors.is_business_state_valid ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select validation status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Not specified</SelectItem>
                                                <SelectItem value="valid">Valid</SelectItem>
                                                <SelectItem value="invalid">Invalid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.is_business_state_valid && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.is_business_state_valid}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create Submission'}
                                </Button>
                                <Link href={route('submissions.index')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
