import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, X, Users, UserCheck, UserX } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
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
    users: PaginatedUsers;
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

export default function UsersIndex({ users, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        router.get('/users', { search: searchTerm }, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setIsSearching(true);
        router.get('/users', {}, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Calculate user statistics
    const totalUsers = users.total;
    const verifiedUsers = users.data.filter(user => user.email_verified_at).length;
    const unverifiedUsers = users.data.filter(user => !user.email_verified_at).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">
                            Manage system users and their permissions
                        </p>
                    </div>
                    <Link href="/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{totalUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
                                    <p className="text-2xl font-bold">{verifiedUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <UserX className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Unverified Users</p>
                                    <p className="text-2xl font-bold">{unverifiedUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                            A list of all users in the system including their details and status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Enhanced Search */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-10"
                                        disabled={isSearching}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            disabled={isSearching}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <Button type="submit" disabled={isSearching}>
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                            </form>

                            {/* Search Results Info */}
                            {filters.search && (
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        Showing results for "<span className="font-medium text-foreground">{filters.search}</span>"
                                    </p>
                                    <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                                        Clear search
                                    </Button>
                                </div>
                            )}

                            {/* Enhanced Users Table */}
                            <div className="rounded-lg border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b">
                                            <TableHead className="font-semibold">Name</TableHead>
                                            <TableHead className="font-semibold">Email</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Created</TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12">
                                                    <div className="flex flex-col items-center space-y-4">
                                                        <div className="p-3 bg-muted rounded-full">
                                                            <Users className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-lg font-medium">
                                                                {filters.search ? 'No users found' : 'No users yet'}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground max-w-sm">
                                                                {filters.search
                                                                    ? `No users match your search for "${filters.search}". Try adjusting your search terms.`
                                                                    : 'Get started by creating your first user account.'
                                                                }
                                                            </p>
                                                        </div>
                                                        {!filters.search && (
                                                            <Link href="/users/create">
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add First User
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.data.map((user) => (
                                                <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                                    <TableCell className="font-medium py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-primary">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span>{user.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-muted-foreground">{user.email}</span>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge
                                                            variant={user.email_verified_at ? 'default' : 'secondary'}
                                                            className={user.email_verified_at
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                            }
                                                        >
                                                            {user.email_verified_at ? (
                                                                <>
                                                                    <UserCheck className="mr-1 h-3 w-3" />
                                                                    Verified
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserX className="mr-1 h-3 w-3" />
                                                                    Unverified
                                                                </>
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(user.created_at)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right py-4">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/users/${user.id}`} className="cursor-pointer">
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/users/${user.id}/edit`} className="cursor-pointer">
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit User
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(user)}
                                                                    className="text-red-600 cursor-pointer focus:text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete User
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

                            {/* Enhanced Pagination */}
                            {users.last_page > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing <span className="font-medium text-foreground">
                                            {((users.current_page - 1) * users.per_page) + 1}
                                        </span> to <span className="font-medium text-foreground">
                                            {Math.min(users.current_page * users.per_page, users.total)}
                                        </span> of <span className="font-medium text-foreground">
                                            {users.total}
                                        </span> {users.total === 1 ? 'user' : 'users'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {users.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                disabled={!link.url || isSearching}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={`min-w-[2.5rem] ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                        : 'hover:bg-muted'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Results Summary for single page */}
                            {users.last_page <= 1 && users.total > 0 && (
                                <div className="pt-4 border-t">
                                    <div className="text-sm text-muted-foreground text-center">
                                        Showing all <span className="font-medium text-foreground">{users.total}</span> {users.total === 1 ? 'user' : 'users'}
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
