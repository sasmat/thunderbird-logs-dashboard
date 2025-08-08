import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: 'User Details', href: '#' },
];

export default function ShowUser({ user }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/users">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-muted-foreground">
                                User details and account information
                            </p>
                        </div>
                    </div>
                    <Link href={`/users/${user.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                Basic user account details and status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                </label>
                                <p className="text-lg font-medium">{user.name}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Address
                                </label>
                                <p className="text-lg">{user.email}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Email Verification Status
                                </label>
                                <div className="flex items-center gap-2">
                                    {user.email_verified_at ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <Badge variant="default">Verified</Badge>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 text-red-600" />
                                            <Badge variant="secondary">Unverified</Badge>
                                        </>
                                    )}
                                </div>
                                {user.email_verified_at && (
                                    <p className="text-sm text-muted-foreground">
                                        Verified on {formatDate(user.email_verified_at)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Account Timeline
                            </CardTitle>
                            <CardDescription>
                                Important dates and account activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Account Created
                                </label>
                                <p className="text-lg">{formatDate(user.created_at)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </label>
                                <p className="text-lg">{formatDate(user.updated_at)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    User ID
                                </label>
                                <p className="text-lg font-mono">#{user.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Actions</CardTitle>
                        <CardDescription>
                            Manage this user account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Link href={`/users/${user.id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit User
                                </Button>
                            </Link>
                            {!user.email_verified_at && (
                                <Button variant="outline">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Verification Email
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
