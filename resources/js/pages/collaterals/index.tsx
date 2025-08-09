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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building, MapPin, DollarSign } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
}

interface Submission {
    id: number;
    submission_id: string;
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

interface PaginatedCollaterals {
    data: Collateral[];
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
    collaterals: PaginatedCollaterals;
    filters: {
        contact_id?: string;
        type?: string;
        state?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Collaterals', href: route('collaterals.index') },
];

const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

export default function CollateralsIndex({ collaterals, filters }: Props) {
    const [searchFilters, setSearchFilters] = useState({
        contact_id: filters.contact_id || '',
        type: filters.type || 'all',
        state: filters.state || 'all',
        status: filters.status || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredParams = {
            ...searchFilters,
            type: searchFilters.type === 'all' ? '' : searchFilters.type,
            state: searchFilters.state === 'all' ? '' : searchFilters.state,
            status: searchFilters.status === 'all' ? '' : searchFilters.status,
        };
        router.get(route('collaterals.index'), filteredParams, { preserveState: true });
    };

    const handleDelete = (collateral: Collateral) => {
        if (confirm(`Are you sure you want to delete collateral #${collateral.collateral_id}?`)) {
            router.delete(route('collaterals.destroy', collateral.collateral_id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collaterals" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Collaterals</h1>
                        <p className="text-muted-foreground">
                            Manage collateral properties and assets
                        </p>
                    </div>
                    <Link href={route('collaterals.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Collateral
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
                            Search collaterals by contact ID, type, state, or status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact ID</label>
                                    <Input
                                        placeholder="Search by contact ID..."
                                        value={searchFilters.contact_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, contact_id: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <Select
                                        value={searchFilters.type}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All types</SelectItem>
                                            <SelectItem value="Residential">Residential</SelectItem>
                                            <SelectItem value="Commercial">Commercial</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <Select
                                        value={searchFilters.state}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, state: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All states" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All states</SelectItem>
                                            <SelectItem value="AL">Alabama</SelectItem>
                                            <SelectItem value="AZ">Arizona</SelectItem>
                                            <SelectItem value="CA">California</SelectItem>
                                            <SelectItem value="FL">Florida</SelectItem>
                                            <SelectItem value="IL">Illinois</SelectItem>
                                            <SelectItem value="IN">Indiana</SelectItem>
                                            <SelectItem value="MI">Michigan</SelectItem>
                                            <SelectItem value="MS">Mississippi</SelectItem>
                                            <SelectItem value="NC">North Carolina</SelectItem>
                                            <SelectItem value="NY">New York</SelectItem>
                                            <SelectItem value="PA">Pennsylvania</SelectItem>
                                            <SelectItem value="SC">South Carolina</SelectItem>
                                            <SelectItem value="TX">Texas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select
                                        value={searchFilters.status}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="YES">Yes</SelectItem>
                                            <SelectItem value="NO">No</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            type: 'all',
                                            state: 'all',
                                            status: 'all',
                                        });
                                        router.get('/collaterals');
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
                        <CardTitle>Collateral Management</CardTitle>
                        <CardDescription>
                            A list of all collaterals with their details and related information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Collaterals Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Contact ID</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Disclosed Value</TableHead>
                                            <TableHead>TB Valuation</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {collaterals.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-8">
                                                    No collaterals found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            collaterals.data.map((collateral) => (
                                                <TableRow key={collateral.collateral_id}>
                                                    <TableCell className="font-mono font-medium">
                                                        #{collateral.collateral_id}
                                                    </TableCell>
                                                    <TableCell className="font-mono">
                                                        {collateral.contact_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {collateral.type ? (
                                                            <div className="flex items-center gap-2">
                                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                                <Badge variant="outline">{collateral.type}</Badge>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {collateral.address ? (
                                                            <div className="max-w-xs truncate" title={collateral.address}>
                                                                {collateral.address}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {collateral.state ? (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <Badge variant="outline">{collateral.state}</Badge>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={collateral.status === 'YES' ? "default" : "secondary"}
                                                        >
                                                            {collateral.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            {collateral.borrower_disclosed_value || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                            {formatCurrency(collateral.thunderbird_valuation)}
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
                                                                    <Link href={route('collaterals.show', collateral.collateral_id)}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={route('collaterals.edit', collateral.collateral_id)}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                {collateral.contact && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={route('contacts.show', collateral.contact.id)}>
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            View Contact
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {collateral.submission && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={route('submissions.show', collateral.submission.id)}>
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            View Submission
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(collateral)}
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
                            {collaterals.last_page > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((collaterals.current_page - 1) * collaterals.per_page) + 1} to{' '}
                                        {Math.min(collaterals.current_page * collaterals.per_page, collaterals.total)} of{' '}
                                        {collaterals.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {collaterals.links.map((link, index) => (
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
