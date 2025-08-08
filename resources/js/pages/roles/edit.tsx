import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Shield, Key } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
    users_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    role: Role;
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/roles' },
    { title: 'Edit Role', href: '#' },
];

export default function EditRole({ role, permissions }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map(p => p.id),
    });

    const [selectAll, setSelectAll] = useState(false);

    // Update selectAll state when permissions change
    useEffect(() => {
        setSelectAll(data.permissions.length === permissions.length && permissions.length > 0);
    }, [data.permissions, permissions]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId]);
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            setData('permissions', permissions.map(p => p.id));
        } else {
            setData('permissions', []);
        }
    };

    // Group permissions by category (based on permission name prefix)
    const groupedPermissions = permissions.reduce((groups, permission) => {
        const category = permission.name.split(' ')[0] || 'General';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {} as Record<string, Permission[]>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role: ${role.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/roles">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Roles
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
                        <p className="text-muted-foreground">
                            Update role information and permissions
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Role Information */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Role Information
                                </CardTitle>
                                <CardDescription>
                                    Update the basic details for this role.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Role Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter role name (e.g., Admin, Editor, Viewer)"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.name}</AlertDescription>
                                            </Alert>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Choose a descriptive name for this role. It will be displayed throughout the system.
                                        </p>
                                    </div>

                                    {/* Role Statistics */}
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                        <h4 className="font-medium">Role Statistics</h4>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>Users assigned: <span className="font-medium text-foreground">{role.users_count || 0}</span></p>
                                            <p>Created: <span className="font-medium text-foreground">
                                                {new Date(role.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span></p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex gap-4">
                                            <Button type="submit" disabled={processing}>
                                                <Save className="mr-2 h-4 w-4" />
                                                {processing ? 'Updating...' : 'Update Role'}
                                            </Button>
                                            <Link href="/roles">
                                                <Button type="button" variant="outline">
                                                    Cancel
                                                </Button>
                                            </Link>
                                            <Link href={`/roles/${role.id}`}>
                                                <Button type="button" variant="outline">
                                                    View Role
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Permissions Assignment */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Permissions
                                </CardTitle>
                                <CardDescription>
                                    Update the permissions that users with this role should have.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Select All Option */}
                                    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                                        <Checkbox
                                            id="select-all"
                                            checked={selectAll}
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <Label htmlFor="select-all" className="font-medium">
                                            Select All Permissions
                                        </Label>
                                    </div>

                                    {errors.permissions && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.permissions}</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Permissions by Category */}
                                    {Object.keys(groupedPermissions).length > 0 ? (
                                        <div className="space-y-6">
                                            {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                                <div key={category} className="space-y-3">
                                                    <h3 className="text-lg font-medium capitalize">{category} Permissions</h3>
                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        {categoryPermissions.map((permission) => (
                                                            <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={data.permissions.includes(permission.id)}
                                                                    onCheckedChange={(checked) =>
                                                                        handlePermissionChange(permission.id, checked as boolean)
                                                                    }
                                                                />
                                                                <Label
                                                                    htmlFor={`permission-${permission.id}`}
                                                                    className="flex-1 cursor-pointer"
                                                                >
                                                                    <span className="font-medium">{permission.name}</span>
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <h3 className="text-lg font-medium mb-2">No Permissions Available</h3>
                                            <p className="text-muted-foreground">
                                                No permissions have been created yet. Create some permissions first to assign them to roles.
                                            </p>
                                        </div>
                                    )}

                                    {/* Permission Changes Summary */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {/* Currently Selected */}
                                        {data.permissions.length > 0 && (
                                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                                <h4 className="font-medium mb-2">Selected Permissions ({data.permissions.length})</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {permissions
                                                        .filter(p => data.permissions.includes(p.id))
                                                        .map(permission => (
                                                            <span
                                                                key={permission.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                                                            >
                                                                {permission.name}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}

                                        {/* Changes Summary */}
                                        {(() => {
                                            const originalPermissions = role.permissions.map(p => p.id);
                                            const added = data.permissions.filter(id => !originalPermissions.includes(id));
                                            const removed = originalPermissions.filter(id => !data.permissions.includes(id));

                                            if (added.length > 0 || removed.length > 0) {
                                                return (
                                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <h4 className="font-medium mb-2">Changes Summary</h4>
                                                        {added.length > 0 && (
                                                            <div className="mb-2">
                                                                <p className="text-sm font-medium text-green-700 mb-1">Added ({added.length}):</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {permissions
                                                                        .filter(p => added.includes(p.id))
                                                                        .map(permission => (
                                                                            <span
                                                                                key={permission.id}
                                                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                                                                            >
                                                                                +{permission.name}
                                                                            </span>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                        {removed.length > 0 && (
                                                            <div>
                                                                <p className="text-sm font-medium text-red-700 mb-1">Removed ({removed.length}):</p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {permissions
                                                                        .filter(p => removed.includes(p.id))
                                                                        .map(permission => (
                                                                            <span
                                                                                key={permission.id}
                                                                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800"
                                                                            >
                                                                                -{permission.name}
                                                                            </span>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
