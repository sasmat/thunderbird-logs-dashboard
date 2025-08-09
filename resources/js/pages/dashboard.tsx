import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, Activity, UserCheck, FileText, Database, BarChart3, Building } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

const dashboardCards = [
    {
        title: 'User Management',
        description: 'Manage system users, create new accounts, and handle permissions',
        href: route('users.index'),
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
        title: 'HubSpot Webhook Logs',
        description: 'View and analyze HubSpot webhook logs and processing status',
        href: route('hubspot-logs.index'),
        icon: Activity,
        color: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
        title: 'Contacts',
        description: 'Manage contact information and view related submissions',
        href: route('contacts.index'),
        icon: UserCheck,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
        title: 'Submissions',
        description: 'View and manage loan submissions and their details',
        href: route('submissions.index'),
        icon: FileText,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
    {
        title: 'Collaterals',
        description: 'Manage collateral properties and assets with their valuations',
        href: route('collaterals.index'),
        icon: Building,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50 dark:bg-teal-950/20',
    },
    {
        title: 'Database Tables',
        description: 'Access all database tables and records',
        href: '#',
        icon: Database,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    },
    {
        title: 'Analytics',
        description: 'View system analytics and performance metrics',
        href: '#',
        icon: BarChart3,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to the Thunderbird Logs Dashboard. Manage your data and monitor system activity.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dashboardCards.map((card) => {
                        const Icon = card.icon;
                        const CardComponent = card.href !== '#' ? Link : 'div';

                        return (
                            <CardComponent
                                key={card.title}
                                href={card.href !== '#' ? card.href : undefined}
                                className={`block transition-all duration-200 ${
                                    card.href !== '#' ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed opacity-60'
                                }`}
                            >
                                <Card className="h-full">
                                    <CardHeader className="pb-3">
                                        <div className={`h-12 w-12 rounded-lg ${card.bgColor} mb-3 flex items-center justify-center`}>
                                            <Icon className={`h-6 w-6 ${card.color}`} />
                                        </div>
                                        <CardTitle className="text-lg">{card.title}</CardTitle>
                                        <CardDescription className="text-sm">{card.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xs text-muted-foreground">{card.href !== '#' ? 'Click to access' : 'Coming soon'}</div>
                                    </CardContent>
                                </Card>
                            </CardComponent>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
