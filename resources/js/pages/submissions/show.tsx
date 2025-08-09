import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, DollarSign, Calendar, User, Building, FileText, TrendingUp } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
    business_state: string | null;
}

interface Collateral {
    collateral_id: number;
    type: string | null;
    address: string | null;
    state: string | null;
    borrower_disclosed_value: string | null;
    thunderbird_valuation: number | null;
}

interface SubmissionEvent {
    id: number;
    event_string: string | null;
    event_type: string | null;
    event_flag: number | null;
    creation: string | null;
}

interface Submission {
    id: number;
    contact_id: string;
    interest_rate: number | null;
    borrower_total_valuation: number | null;
    thunderbird_total_valuation: number | null;
    loan_amount: string | null;
    balloon_payment: string | null;
    monthly_payment: string | null;
    is_business_state_valid: 'valid' | 'invalid' | null;
    case_status: string | null;
    itp_fee: number | null;
    creation: string | null;
    contact?: Contact;
    collaterals?: Collateral[];
    submission_events?: SubmissionEvent[];
}

interface Props {
    submission: Submission;
}

const getBreadcrumbs = (submission: Submission): BreadcrumbItem[] => [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Submissions', href: route('submissions.index') },
    { title: 'Submission Details', href: route('submissions.show', submission.id) },
];

export default function ShowSubmission({ submission }: Props) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getValidationBadge = (status: string | null) => {
        switch (status) {
            case 'valid':
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Valid
                    </Badge>
                );
            case 'invalid':
                return (
                    <Badge variant="destructive">
                        Invalid
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={getBreadcrumbs(submission)}>
            <Head title={`Submission: ${submission.contact_id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('submissions.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Submissions
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Submission Details</h1>
                            <p className="text-muted-foreground">
                                Detailed information about this loan submission
                            </p>
                        </div>
                    </div>
                    <Link href={route('submissions.edit', submission.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Submission
                        </Button>
                    </Link>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Loan Amount</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-lg font-semibold">
                                    {submission.loan_amount || 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="text-lg font-semibold">
                                    {submission.interest_rate ? `${submission.interest_rate}%` : 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Case Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submission.case_status ? (
                                <Badge variant="outline">{submission.case_status}</Badge>
                            ) : (
                                <span className="text-muted-foreground">N/A</span>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">State Validation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getValidationBadge(submission.is_business_state_valid)}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                            <CardDescription>
                                Details about the contact associated with this submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Contact ID
                                </label>
                                <p className="text-lg font-mono">{submission.contact_id}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Address
                                </label>
                                <p className="text-lg">{submission.contact?.email || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Business State
                                </label>
                                <p className="text-lg">{submission.contact?.business_state || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Financial Details
                            </CardTitle>
                            <CardDescription>
                                Loan amounts, payments, and valuations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Borrower Total Valuation
                                </label>
                                <p className="text-lg">{formatCurrency(submission.borrower_total_valuation)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Thunderbird Total Valuation
                                </label>
                                <p className="text-lg">{formatCurrency(submission.thunderbird_total_valuation)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Monthly Payment
                                </label>
                                <p className="text-lg">{submission.monthly_payment || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Balloon Payment
                                </label>
                                <p className="text-lg">{submission.balloon_payment || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ITP Fee
                                </label>
                                <p className="text-lg">{formatCurrency(submission.itp_fee)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Submission Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Submission Timeline
                        </CardTitle>
                        <CardDescription>
                            Important dates and submission activity
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Submission Created
                            </label>
                            <p className="text-lg">{formatDate(submission.creation)}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Submission ID
                            </label>
                            <p className="text-lg font-mono">#{submission.id}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Collaterals */}
                {submission.collaterals && submission.collaterals.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Collaterals
                            </CardTitle>
                            <CardDescription>
                                Properties and assets associated with this submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {submission.collaterals.map((collateral) => (
                                    <div key={collateral.collateral_id} className="border rounded-lg p-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Type
                                                </label>
                                                <p>{collateral.type || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Address
                                                </label>
                                                <p>{collateral.address || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Borrower Disclosed Value
                                                </label>
                                                <p>{collateral.borrower_disclosed_value || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Thunderbird Valuation
                                                </label>
                                                <p>{formatCurrency(collateral.thunderbird_valuation)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submission Events */}
                {submission.submission_events && submission.submission_events.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Submission Events
                            </CardTitle>
                            <CardDescription>
                                Activity log and events for this submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {submission.submission_events.map((event) => (
                                    <div key={event.id} className="border-l-2 border-muted pl-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{event.event_type || 'Event'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {event.event_string || 'No description'}
                                                </p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(event.creation)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Submission Actions</CardTitle>
                        <CardDescription>
                            Manage this submission
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Link href={`/submissions/${submission.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Submission
                                </Button>
                            </Link>
                            {submission.contact && (
                                <Link href={`/contacts/${submission.contact.id}`}>
                                    <Button variant="outline">
                                        <User className="mr-2 h-4 w-4" />
                                        View Contact
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
