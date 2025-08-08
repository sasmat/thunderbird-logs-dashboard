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
import { Search, Download, MoreHorizontal, Eye, Trash2, Filter } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface HubSpotLog {
    id: number;
    event_id: string | null;
    subscription_type: string | null;
    property_name: string | null;
    object_id: string | null;
    processing_status: 'success' | 'error' | 'partial';
    processing_result: string | null;
    error_message: string | null;
    execution_time_ms: number | null;
    created_at: string;
}

interface PaginatedLogs {
    data: HubSpotLog[];
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
    logs: PaginatedLogs;
    filters: {
        event_id?: string;
        subscription_type?: string;
        processing_status?: string;
        object_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HubSpot Logs', href: '/hubspot-logs' },
];

export default function HubSpotLogsIndex({ logs, filters }: Props) {
    const [searchFilters, setSearchFilters] = useState({
        event_id: filters.event_id || '',
        subscription_type: filters.subscription_type || '',
        processing_status: filters.processing_status || 'all',
        object_id: filters.object_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredParams = {
            ...searchFilters,
            processing_status: searchFilters.processing_status === 'all' ? '' : searchFilters.processing_status,
        };
        router.get('/hubspot-logs', filteredParams, { preserveState: true });
    };

    const handleExport = () => {
        const filteredParams = {
            ...searchFilters,
            processing_status: searchFilters.processing_status === 'all' ? '' : searchFilters.processing_status,
        };
        const params = new URLSearchParams(filteredParams);
        window.location.href = `/hubspot-logs/export?${params.toString()}`;
    };

    const handleDelete = (log: HubSpotLog) => {
        if (confirm('Are you sure you want to delete this log entry?')) {
            router.delete(`/hubspot-logs/${log.id}`);
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
            case 'error':
                return <Badge variant="destructive">Error</Badge>;
            case 'partial':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partial</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="HubSpot Webhook Logs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">HubSpot Webhook Logs</h1>
                        <p className="text-muted-foreground">
                            Monitor and analyze HubSpot webhook processing logs
                        </p>
                    </div>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                        <CardDescription>
                            Filter webhook logs by various criteria to find specific entries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Event ID</label>
                                    <Input
                                        placeholder="Search by event ID..."
                                        value={searchFilters.event_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, event_id: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Object ID</label>
                                    <Input
                                        placeholder="Search by object ID..."
                                        value={searchFilters.object_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, object_id: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Processing Status</label>
                                    <Select
                                        value={searchFilters.processing_status}
                                        onValueChange={(value) => setSearchFilters(prev => ({ ...prev, processing_status: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="success">Success</SelectItem>
                                            <SelectItem value="error">Error</SelectItem>
                                            <SelectItem value="partial">Partial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date From</label>
                                    <Input
                                        type="date"
                                        value={searchFilters.date_from}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, date_from: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date To</label>
                                    <Input
                                        type="date"
                                        value={searchFilters.date_to}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, date_to: e.target.value }))}
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
                                            event_id: '',
                                            subscription_type: '',
                                            processing_status: 'all',
                                            object_id: '',
                                            date_from: '',
                                            date_to: '',
                                        });
                                        router.get('/hubspot-logs');
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
                        <CardTitle>Webhook Logs</CardTitle>
                        <CardDescription>
                            A list of all HubSpot webhook processing logs with their status and details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Logs Table */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event ID</TableHead>
                                            <TableHead>Object ID</TableHead>
                                            <TableHead>Subscription Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Execution Time</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    No webhook logs found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.data.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {log.event_id ? log.event_id.substring(0, 12) + '...' : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {log.object_id || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>{log.subscription_type || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(log.processing_status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.execution_time_ms ? `${log.execution_time_ms}ms` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(log.created_at)}
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
                                                                    <Link href={`/hubspot-logs/${log.id}`}>
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(log)}
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
                            {logs.last_page > 1 && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Showing {((logs.current_page - 1) * logs.per_page) + 1} to{' '}
                                        {Math.min(logs.current_page * logs.per_page, logs.total)} of{' '}
                                        {logs.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {logs.links.map((link, index) => (
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
