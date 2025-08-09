import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, DollarSign, Calendar } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
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
    collaterals_count?: number;
}

interface PaginatedSubmissions {
    data: Submission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    submissions: PaginatedSubmissions;
    filters: {
        contact_id?: string;
        case_status?: string;
        is_business_state_valid?: string;
        loan_amount_min?: string;
        loan_amount_max?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Submissions', href: route('submissions.index') },
];

export default function SubmissionsIndex({ submissions, filters }: Props) {
    const [searchFilters, setSearchFilters] = useState({
        contact_id: filters.contact_id || '',
        case_status: filters.case_status || '',
        is_business_state_valid: filters.is_business_state_valid || 'all',
        loan_amount_min: filters.loan_amount_min || '',
        loan_amount_max: filters.loan_amount_max || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredParams = {
            ...searchFilters,
            is_business_state_valid: searchFilters.is_business_state_valid === 'all' ? '' : searchFilters.is_business_state_valid,
        };
        router.get(route('submissions.index'), filteredParams, { preserveState: true });
    };

    const handleDelete = (submission: Submission) => {
        if (confirm(`Are you sure you want to delete submission for contact ${submission.contact_id}?`)) {
            router.delete(route('submissions.destroy', submission.id));
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };


    const getValidationBadge = (status: string | null) => {
        switch (status) {
            case 'valid':
                return <Badge variant="default" className="bg-green-100 text-green-800">Valid</Badge>;
            case 'invalid':
                return <Badge variant="destructive">Invalid</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Submissions" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
                        <p className="text-muted-foreground">
                            Manage loan submissions and their details
                        </p>
                    </div>
                    <Link href={route('submissions.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Submission
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search & Filter
                        </CardTitle>
                        <CardDescription>
                            Search submissions by contact ID, case status, or validation status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact ID</label>
                                    <Input
                                        placeholder="Search by contact ID..."
                                        value={searchFilters.contact_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, contact_id: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Case Status</label>
                                    <Input
                                        placeholder="Search by case status..."
                                        value={searchFilters.case_status}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, case_status: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business State Validation</label>
                                    <Select
                                        value={searchFilters.is_business_state_valid}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, is_business_state_valid: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All validations" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All validations</SelectItem>
                                            <SelectItem value="valid">Valid</SelectItem>
                                            <SelectItem value="invalid">Invalid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Min Loan Amount</label>
                                    <Input
                                        type="number"
                                        placeholder="Minimum amount..."
                                        value={searchFilters.loan_amount_min}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, loan_amount_min: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Max Loan Amount</label>
                                    <Input
                                        type="number"
                                        placeholder="Maximum amount..."
                                        value={searchFilters.loan_amount_max}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, loan_amount_max: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit">
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchFilters({
                                            contact_id: '',
                                            case_status: '',
                                            is_business_state_valid: 'all',
                                            loan_amount_min: '',
                                            loan_amount_max: '',
                                        });
                                        router.get(route('submissions.index'));
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Submission Management</CardTitle>
                        <CardDescription>
                            A list of all loan submissions with their details and status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Submissions Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact ID</TableHead>
                                            <TableHead>Contact Email</TableHead>
                                            <TableHead>Loan Amount</TableHead>
                                            <TableHead>Interest Rate</TableHead>
                                            <TableHead>Case Status</TableHead>
                                            <TableHead>State Valid</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-8">
                                                    No submissions found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            submissions.data.map((submission) => (
                                                <TableRow key={submission.id}>
                                                    <TableCell className="font-mono font-medium">
                                                        {submission.contact_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.contact?.email || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            {submission.loan_amount || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.interest_rate ? `${submission.interest_rate}%` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {submission.case_status ? (
                                                            <Badge variant="outline">{submission.case_status}</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getValidationBadge(submission.is_business_state_valid)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {formatDate(submission.creation)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/submissions/${submission.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/submissions/${submission.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(submission)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {submissions.last_page > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((submissions.current_page - 1) * submissions.per_page) + 1} to{' '}
                                        {Math.min(submissions.current_page * submissions.per_page, submissions.total)} of{' '}
                                        {submissions.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {submissions.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
