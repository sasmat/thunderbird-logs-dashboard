import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Activity, Database, AlertCircle, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface ChannelPartnersSyncLog {
    id: number;
    session_id: string;
    incoming_payload: unknown;
    contact_id: string | null;
    email: string | null;
    phone: string | null;
    rid: string | null;
    processing_status: 'started' | 'success' | 'error' | 'failed';

    // HubSpot API interactions
    hubspot_get_contact_email_payload: unknown;
    hubspot_get_contact_email_response: unknown;
    hubspot_get_contact_email_http_code: number | null;

    hubspot_get_contact_cid_payload: unknown;
    hubspot_get_contact_cid_response: unknown;
    hubspot_get_contact_cid_http_code: number | null;

    hubspot_create_contact_payload: unknown;
    hubspot_create_contact_response: unknown;
    hubspot_create_contact_http_code: number | null;

    hubspot_update_contact_payload: unknown;
    hubspot_update_contact_response: unknown;
    hubspot_update_contact_http_code: number | null;

    // QuickBase API interactions
    quickbase_update_payload: unknown;
    quickbase_update_response: unknown;
    quickbase_update_http_code: number | null;

    // Processing results and errors
    final_result: unknown;
    error_message: string | null;
    error_details: unknown;
    execution_time_ms: number | null;

    created_at: string;
    updated_at: string;
}

interface Props {
    log: ChannelPartnersSyncLog;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Channel Partners Sync Logs', href: route('channel-partners-sync-logs.index') },
    { title: 'Log Details', href: '#' },
];

export default function ShowChannelPartnersSyncLog({ log }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Success
                    </Badge>
                );
            case 'error':
                return (
                    <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Error
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Failed
                    </Badge>
                );
            case 'started':
                return (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Clock className="mr-1 h-3 w-3" />
                        Started
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getHttpStatusBadge = (code: number | null) => {
        if (!code) return <Badge variant="outline">N/A</Badge>;

        if (code >= 200 && code < 300) {
            return <Badge variant="default" className="bg-green-100 text-green-800">{code}</Badge>;
        } else if (code >= 400) {
            return <Badge variant="destructive">{code}</Badge>;
        } else {
            return <Badge variant="secondary">{code}</Badge>;
        }
    };

    const JsonDisplay = ({ data, title }: { data: unknown; title: string }) => {
        if (!data) {
            return (
                <div className="text-center py-8 text-muted-foreground">
                    No {title.toLowerCase()} data available
                </div>
            );
        }

        return (
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Channel Partners Sync Log: ${log.session_id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/channel-partners-sync-logs">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Logs
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Sync Log Details</h1>
                        <p className="text-muted-foreground">
                            Detailed information about this channel partner synchronization
                        </p>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getStatusBadge(log.processing_status)}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Execution Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-lg font-semibold">
                                    {log.execution_time_ms ? `${log.execution_time_ms}ms` : 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">QuickBase Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getHttpStatusBadge(log.quickbase_update_http_code)}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                    {log.email || log.contact_id || 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Core sync details and identifiers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Session ID</label>
                                <p className="text-lg font-mono">{log.session_id}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Contact ID</label>
                                <p className="text-lg font-mono">{log.contact_id || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="text-lg">{log.email || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <p className="text-lg">{log.phone || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">RID</label>
                                <p className="text-lg font-mono">{log.rid || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                <p className="text-lg">{formatDate(log.created_at)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Updated At</label>
                                <p className="text-lg">{formatDate(log.updated_at)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Error Information */}
                {(log.error_message || log.error_details) && (
                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <AlertCircle className="h-5 w-5" />
                                Error Information
                            </CardTitle>
                            <CardDescription>
                                Details about any errors that occurred during processing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {log.error_message && (
                                <div className="space-y-2 mb-4">
                                    <label className="text-sm font-medium text-muted-foreground">Error Message</label>
                                    <p className="text-red-700 bg-red-50 p-3 rounded-lg">{log.error_message}</p>
                                </div>
                            )}
                            {log.error_details && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Error Details</label>
                                    <JsonDisplay data={log.error_details} title="Error Details" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Data Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            API Interactions & Data
                        </CardTitle>
                        <CardDescription>
                            Detailed payloads and responses from various API interactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="incoming" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                                <TabsTrigger value="incoming">Incoming</TabsTrigger>
                                <TabsTrigger value="hubspot-get-email">HS Get Email</TabsTrigger>
                                <TabsTrigger value="hubspot-get-cid">HS Get CID</TabsTrigger>
                                <TabsTrigger value="hubspot-create">HS Create</TabsTrigger>
                                <TabsTrigger value="hubspot-update">HS Update</TabsTrigger>
                                <TabsTrigger value="quickbase">QuickBase</TabsTrigger>
                            </TabsList>

                            <TabsContent value="incoming" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Incoming Payload</h4>
                                        <JsonDisplay data={log.incoming_payload} title="Incoming Payload" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hubspot-get-email" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-lg font-semibold">HubSpot Get Contact by Email</h4>
                                        {getHttpStatusBadge(log.hubspot_get_contact_email_http_code)}
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Request Payload</h5>
                                        <JsonDisplay data={log.hubspot_get_contact_email_payload} title="Request Payload" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Response</h5>
                                        <JsonDisplay data={log.hubspot_get_contact_email_response} title="Response" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hubspot-get-cid" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-lg font-semibold">HubSpot Get Contact by CID</h4>
                                        {getHttpStatusBadge(log.hubspot_get_contact_cid_http_code)}
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Request Payload</h5>
                                        <JsonDisplay data={log.hubspot_get_contact_cid_payload} title="Request Payload" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Response</h5>
                                        <JsonDisplay data={log.hubspot_get_contact_cid_response} title="Response" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hubspot-create" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-lg font-semibold">HubSpot Create Contact</h4>
                                        {getHttpStatusBadge(log.hubspot_create_contact_http_code)}
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Request Payload</h5>
                                        <JsonDisplay data={log.hubspot_create_contact_payload} title="Request Payload" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Response</h5>
                                        <JsonDisplay data={log.hubspot_create_contact_response} title="Response" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hubspot-update" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-lg font-semibold">HubSpot Update Contact</h4>
                                        {getHttpStatusBadge(log.hubspot_update_contact_http_code)}
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Request Payload</h5>
                                        <JsonDisplay data={log.hubspot_update_contact_payload} title="Request Payload" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Response</h5>
                                        <JsonDisplay data={log.hubspot_update_contact_response} title="Response" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="quickbase" className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h4 className="text-lg font-semibold">QuickBase Update</h4>
                                        {getHttpStatusBadge(log.quickbase_update_http_code)}
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Request Payload</h5>
                                        <JsonDisplay data={log.quickbase_update_payload} title="Request Payload" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2">Response</h5>
                                        <JsonDisplay data={log.quickbase_update_response} title="Response" />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Final Result */}
                {log.final_result && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                Final Result
                            </CardTitle>
                            <CardDescription>
                                The final processing result and outcome
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <JsonDisplay data={log.final_result} title="Final Result" />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
