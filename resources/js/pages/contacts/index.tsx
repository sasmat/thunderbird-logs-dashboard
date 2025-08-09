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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, MapPin } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';

interface Contact {
    id: number;
    contact_id: string;
    email: string | null;
    post_approve_link: string | null;
    business_state: string | null;
    collaterals_count?: number;
    submissions_count?: number;
}

interface PaginatedContacts {
    data: Contact[];
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
    contacts: PaginatedContacts;
    filters: {
        contact_id?: string;
        email?: string;
        business_state?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Contacts', href: route('contacts.index') },
];

export default function ContactsIndex({ contacts, filters }: Props) {
    const [searchFilters, setSearchFilters] = useState({
        contact_id: filters.contact_id || '',
        email: filters.email || '',
        business_state: filters.business_state || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredParams = {
            ...searchFilters,
            business_state: searchFilters.business_state === 'all' ? '' : searchFilters.business_state,
        };
        router.get(route('contacts.index'), filteredParams, { preserveState: true });
    };

    const handleDelete = (contact: Contact) => {
        if (confirm(`Are you sure you want to delete contact ${contact.contact_id}?`)) {
            router.delete(route('contacts.destroy', contact.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contacts" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
                        <p className="text-muted-foreground">
                            Manage contact information and view related data
                        </p>
                    </div>
                    <Link href={route('contacts.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Contact
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
                            Search contacts by ID, email, or business state.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact ID</label>
                                    <Input
                                        placeholder="Search by contact ID..."
                                        value={searchFilters.contact_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, contact_id: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        placeholder="Search by email..."
                                        value={searchFilters.email}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business State</label>
                                    <Select
                                        value={searchFilters.business_state}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, business_state: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All states" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All states</SelectItem>
                                            <SelectItem value="AL">Alabama</SelectItem>
                                            <SelectItem value="CA">California</SelectItem>
                                            <SelectItem value="FL">Florida</SelectItem>
                                            <SelectItem value="NY">New York</SelectItem>
                                            <SelectItem value="TX">Texas</SelectItem>
                                            {/* Add more states as needed */}
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
                                            email: '',
                                            business_state: 'all',
                                        });
                                        router.get(route('contacts.index'));
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
                        <CardTitle>Contact Management</CardTitle>
                        <CardDescription>
                            A list of all contacts with their details and related information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Contacts Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contact ID</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Business State</TableHead>
                                            <TableHead>Collaterals</TableHead>
                                            <TableHead>Submissions</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contacts.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    No contacts found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            contacts.data.map((contact) => (
                                                <TableRow key={contact.id}>
                                                    <TableCell className="font-mono font-medium">
                                                        {contact.contact_id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {contact.email ? (
                                                                <>
                                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                                    {contact.email}
                                                                </>
                                                            ) : (
                                                                <span className="text-muted-foreground">No email</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {contact.business_state ? (
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                <Badge variant="outline">{contact.business_state}</Badge>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">N/A</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {contact.collaterals_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {contact.submissions_count || 0}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={contact.post_approve_link ? "default" : "secondary"}
                                                        >
                                                            {contact.post_approve_link ? "Active" : "Inactive"}
                                                        </Badge>
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
                                                                    <Link href={`/contacts/${contact.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/contacts/${contact.id}/edit`}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(contact)}
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
                            {contacts.last_page > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((contacts.current_page - 1) * contacts.per_page) + 1} to{' '}
                                        {Math.min(contacts.current_page * contacts.per_page, contacts.total)} of{' '}
                                        {contacts.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {contacts.links.map((link, index) => (
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
