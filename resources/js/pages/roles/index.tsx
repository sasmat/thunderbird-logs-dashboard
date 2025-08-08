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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, X, Shield, Users, Key } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    users_count?: number;
    created_at: string;
    updated_at: string;
}

interface PaginatedRoles {
    data: Role[];
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
    roles: PaginatedRoles;
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
];

export default function RolesIndex({ roles, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        router.get('/roles', { search: searchTerm }, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setIsSearching(true);
        router.get('/roles', {}, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    const handleDelete = (role: Role) => {
        if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            router.delete(`/roles/${role.id}`);
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

    // Calculate role statistics
    const totalRoles = roles.total;
    const totalPermissions = roles.data.reduce((sum, role) => sum + role.permissions.length, 0);
    const avgPermissionsPerRole = totalRoles > 0 ? Math.round(totalPermissions / totalRoles) : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
                        <p className="text-muted-foreground">
                            Manage system roles and their permissions
                        </p>
                    </div>
                    <Link href="/roles/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Role
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Roles</p>
                                    <p className="text-2xl font-bold">{totalRoles}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Key className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Permissions</p>
                                    <p className="text-2xl font-bold">{totalPermissions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Permissions/Role</p>
                                    <p className="text-2xl font-bold">{avgPermissionsPerRole}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Role Management</CardTitle>
                        <CardDescription>
                            A list of all roles in the system including their permissions and assigned users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Enhanced Search */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Search roles by name..."
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

                            {/* Enhanced Roles Table */}
                            <div className="rounded-lg border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b">
                                            <TableHead className="font-semibold">Role Name</TableHead>
                                            <TableHead className="font-semibold">Permissions</TableHead>
                                            <TableHead className="font-semibold">Users</TableHead>
                                            <TableHead className="font-semibold">Created</TableHead>
                                            <TableHead className="text-right font-semibold">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roles.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12">
                                                    <div className="flex flex-col items-center space-y-4">
                                                        <div className="p-3 bg-muted rounded-full">
                                                            <Shield className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-lg font-medium">
                                                                {filters.search ? 'No roles found' : 'No roles yet'}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground max-w-sm">
                                                                {filters.search
                                                                    ? `No roles match your search for "${filters.search}". Try adjusting your search terms.`
                                                                    : 'Get started by creating your first role.'
                                                                }
                                                            </p>
                                                        </div>
                                                        {!filters.search && (
                                                            <Link href="/roles/create">
                                                                <Button>
                                                                    <Plus className="mr-2 h-4 w-4" />
                                                                    Add First Role
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            roles.data.map((role) => (
                                                <TableRow key={role.id} className="hover:bg-muted/50 transition-colors">
                                                    <TableCell className="font-medium py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Shield className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <span className="capitalize">{role.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {role.permissions.slice(0, 3).map((permission) => (
                                                                <Badge key={permission.id} variant="secondary" className="text-xs">
                                                                    {permission.name}
                                                                </Badge>
                                                            ))}
                                                            {role.permissions.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{role.permissions.length - 3} more
                                                                </Badge>
                                                            )}
                                                            {role.permissions.length === 0 && (
                                                                <span className="text-muted-foreground text-sm">No permissions</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline">
                                                            {role.users_count || 0} users
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(role.created_at)}
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
                                                                    <Link href={`/roles/${role.id}`} className="cursor-pointer">
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/roles/${role.id}/edit`} className="cursor-pointer">
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit Role
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(role)}
                                                                    className="text-red-600 cursor-pointer focus:text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Role
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
                            {roles.last_page > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Showing <span className="font-medium text-foreground">
                                            {((roles.current_page - 1) * roles.per_page) + 1}
                                        </span> to <span className="font-medium text-foreground">
                                            {Math.min(roles.current_page * roles.per_page, roles.total)}
                                        </span> of <span className="font-medium text-foreground">
                                            {roles.total}
                                        </span> {roles.total === 1 ? 'role' : 'roles'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {roles.links.map((link, index) => (
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
                            {roles.last_page <= 1 && roles.total > 0 && (
                                <div className="pt-4 border-t">
                                    <div className="text-sm text-muted-foreground text-center">
                                        Showing all <span className="font-medium text-foreground">{roles.total}</span> {roles.total === 1 ? 'role' : 'roles'}
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
