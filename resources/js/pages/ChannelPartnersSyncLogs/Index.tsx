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
import { Search, MoreHorizontal, Eye, Filter } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface ChannelPartnersSyncLog {
    id: number;
    session_id: string;
    contact_id: string | null;
    email: string | null;
    phone: string | null;
    rid: string | null;
    processing_status: 'started' | 'success' | 'error' | 'failed';
    error_message: string | null;
    execution_time_ms: number | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedLogs {
    data: ChannelPartnersSyncLog[];
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
        session_id?: string;
        email?: string;
        processing_status?: string;
        contact_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Channel Partners Sync Logs', href: route('channel-partners-sync-logs.index') },
];

export default function ChannelPartnersSyncLogsIndex({ logs, filters }: Props) {
    const [searchFilters, setSearchFilters] = useState({
        session_id: filters.session_id || '',
        email: filters.email || '',
        processing_status: filters.processing_status || 'all',
        contact_id: filters.contact_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredParams = {
            ...searchFilters,
            processing_status: searchFilters.processing_status === 'all' ? '' : searchFilters.processing_status,
        };
        router.get('/channel-partners-sync-logs', filteredParams, { preserveState: true });
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
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            case 'started':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Started</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Channel Partners Sync Logs" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Channel Partners Sync Logs</h1>
                        <p className="text-muted-foreground">
                            Monitor and analyze channel partner synchronization logs
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                        <CardDescription>
                            Filter sync logs by various criteria to find specific entries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Session ID</label>
                                    <Input
                                        placeholder="Search by session ID..."
                                        value={searchFilters.session_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, session_id: e.target.value }))}
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
                                    <label className="text-sm font-medium">Contact ID</label>
                                    <Input
                                        placeholder="Search by contact ID..."
                                        value={searchFilters.contact_id}
                                        onChange={(e) => setSearchFilters(prev => ({ ...prev, contact_id: e.target.value }))}
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
                                            <SelectItem value="started">Started</SelectItem>
                                            <SelectItem value="success">Success</SelectItem>
                                            <SelectItem value="error">Error</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
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
                                            session_id: '',
                                            email: '',
                                            processing_status: 'all',
                                            contact_id: '',
                                            date_from: '',
                                            date_to: '',
                                        });
                                        router.get('/channel-partners-sync-logs');
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
                        <CardTitle>Sync Logs ({logs.total} total)</CardTitle>
                        <CardDescription>
                            Recent channel partner synchronization activities and their processing status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Session ID</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Contact ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Execution Time</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="w-[70px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No sync logs found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.data.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {log.session_id.substring(0, 8)}...
                                                </TableCell>
                                                <TableCell>{log.email || '-'}</TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {log.contact_id || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(log.processing_status)}
                                                </TableCell>
                                                <TableCell>
                                                    {log.execution_time_ms ? `${log.execution_time_ms}ms` : '-'}
                                                </TableCell>
                                                <TableCell>{formatDate(log.created_at)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/channel-partners-sync-logs/${log.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
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

                        {logs.last_page > 1 && (
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((logs.current_page - 1) * logs.per_page) + 1} to{' '}
                                    {Math.min(logs.current_page * logs.per_page, logs.total)} of {logs.total} entries
                                </div>
                                <div className="flex space-x-2">
                                    {logs.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
