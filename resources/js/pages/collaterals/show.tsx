import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, DollarSign, MapPin, User, FileText, Building, Home } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
    business_state: string | null;
    post_approve_link: string | null;
}

interface Submission {
    id: number;
    contact_id: string;
    interest_rate: number | null;
    loan_amount: string | null;
    case_status: string | null;
    creation: string | null;
}

interface Collateral {
    collateral_id: number;
    contact_id: string;
    status: 'YES' | 'NO';
    type: string | null;
    address: string | null;
    zip_code: string | null;
    existing_debt: string | null;
    state: string | null;
    borrower_disclosed_value: string | null;
    thunderbird_valuation: number | null;
    submission_id: number | null;
    contact?: Contact;
    submission?: Submission;
}

interface Props {
    collateral: Collateral;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard')},
    { title: 'Collaterals', href: route('collaterals.index') },
    { title: 'Collateral Details', href: '#' },
];

export default function ShowCollateral({ collateral }: Props) {
    const formatCurrency = (amount: number | string | null) => {
        if (!amount) return 'N/A';
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numericAmount)) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(numericAmount);
    };


    const getStatusBadge = (status: 'YES' | 'NO') => {
        return (
            <Badge variant={status === 'YES' ? "default" : "secondary"}>
                {status}
            </Badge>
        );
    };

    const getTypeBadge = (type: string | null) => {
        if (!type) return <Badge variant="outline">N/A</Badge>;

        const colorMap: Record<string, string> = {
            'Residential': 'bg-blue-100 text-blue-800',
            'Commercial': 'bg-green-100 text-green-800',
            'Other': 'bg-gray-100 text-gray-800',
        };

        return (
            <Badge variant="outline" className={colorMap[type] || 'bg-gray-100 text-gray-800'}>
                {type}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Collateral: #${collateral.collateral_id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/collaterals">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Collaterals
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Collateral #{collateral.collateral_id}
                            </h1>
                            <p className="text-muted-foreground">
                                {collateral.type || 'Property'} • Contact: {collateral.contact_id}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/collaterals/${collateral.collateral_id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Collateral
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Core details about this collateral property
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Collateral ID
                                </label>
                                <p className="text-lg font-mono">#{collateral.collateral_id}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Contact ID
                                </label>
                                <p className="text-lg font-mono">{collateral.contact_id}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Status
                                </label>
                                <div>{getStatusBadge(collateral.status)}</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Type
                                </label>
                                <div>{getTypeBadge(collateral.type)}</div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    State
                                </label>
                                <div className="flex items-center gap-2">
                                    {collateral.state ? (
                                        <>
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <Badge variant="outline">{collateral.state}</Badge>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    ZIP Code
                                </label>
                                <p className="text-lg">{collateral.zip_code || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            Property Details
                        </CardTitle>
                        <CardDescription>
                            Address and location information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Address
                                </label>
                                <p className="text-lg">{collateral.address || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Financial Information
                        </CardTitle>
                        <CardDescription>
                            Valuation and debt information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Borrower Disclosed Value
                                </label>
                                <p className="text-lg font-semibold">
                                    {formatCurrency(collateral.borrower_disclosed_value)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Thunderbird Valuation
                                </label>
                                <p className="text-lg font-semibold text-blue-600">
                                    {formatCurrency(collateral.thunderbird_valuation)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Existing Debt
                                </label>
                                <p className="text-lg">
                                    {formatCurrency(collateral.existing_debt)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Related Contact */}
                {collateral.contact && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Related Contact
                            </CardTitle>
                            <CardDescription>
                                Contact information associated with this collateral
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Contact ID
                                    </label>
                                    <p className="text-lg font-mono">{collateral.contact.contact_id}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </label>
                                    <p className="text-lg">{collateral.contact.email || 'N/A'}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Business State
                                    </label>
                                    <p className="text-lg">{collateral.contact.business_state || 'N/A'}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <Badge variant={collateral.contact.post_approve_link ? "default" : "secondary"}>
                                        {collateral.contact.post_approve_link ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Related Submission */}
                {collateral.submission && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Related Submission
                            </CardTitle>
                            <CardDescription>
                                Submission information associated with this collateral
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Submission ID
                                    </label>
                                    <p className="text-lg font-mono">#{collateral.submission.id}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Loan Amount
                                    </label>
                                    <p className="text-lg">{formatCurrency(collateral.submission.loan_amount)}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Interest Rate
                                    </label>
                                    <p className="text-lg">
                                        {collateral.submission.interest_rate ? `${collateral.submission.interest_rate}%` : 'N/A'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Case Status
                                    </label>
                                    <p className="text-lg">{collateral.submission.case_status || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Collateral Actions</CardTitle>
                        <CardDescription>
                            Manage this collateral and view related information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <Link href={`/collaterals/${collateral.collateral_id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Collateral
                                </Button>
                            </Link>
                            {collateral.contact && (
                                <Link href={`/contacts/${collateral.contact.id}`}>
                                    <Button variant="outline">
                                        <User className="mr-2 h-4 w-4" />
                                        View Contact
                                    </Button>
                                </Link>
                            )}
                            {collateral.submission && (
                                <Link href={`/submissions/${collateral.submission.id}`}>
                                    <Button variant="outline">
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Submission
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
