import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Activity, Database, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface HubSpotLog {
    id: number;
    event_id: string | null;
    subscription_type: string | null;
    property_name: string | null;
    object_id: string | null;
    incoming_payload: unknown;
    contact_data: unknown;
    quickbase_payload: unknown;
    quickbase_response: unknown;
    quickbase_http_code: number | null;
    hubspot_update_payload: unknown;
    hubspot_update_response: unknown;
    hubspot_update_http_code: number | null;
    processing_result: string | null;
    error_message: string | null;
    error_details: unknown;
    processing_status: 'success' | 'error' | 'partial';
    execution_time_ms: number | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    log: HubSpotLog;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HubSpot Logs', href: '/hubspot-logs' },
    { title: 'Log Details', href: '#' },
];

export default function ShowHubSpotLog({ log }: Props) {
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
            case 'partial':
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Partial
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
            <Head title={`HubSpot Log: ${log.event_id || log.id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/hubspot-logs">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Logs
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Webhook Log Details</h1>
                        <p className="text-muted-foreground">
                            Detailed information about this HubSpot webhook processing
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
                            {getHttpStatusBadge(log.quickbase_http_code)}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">HubSpot Update Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getHttpStatusBadge(log.hubspot_update_http_code)}
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
                            Core webhook details and identifiers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Event ID</label>
                                <p className="text-lg font-mono">{log.event_id || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Object ID</label>
                                <p className="text-lg font-mono">{log.object_id || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Subscription Type</label>
                                <p className="text-lg">{log.subscription_type || 'N/A'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Property Name</label>
                                <p className="text-lg">{log.property_name || 'N/A'}</p>
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

                {/* Processing Results */}
                {(log.processing_result || log.error_message) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Processing Results
                            </CardTitle>
                            <CardDescription>
                                Results and messages from the webhook processing
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {log.processing_result && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Processing Result</label>
                                    <p className="text-sm bg-muted p-3 rounded-lg">{log.processing_result}</p>
                                </div>
                            )}

                            {log.error_message && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Error Message</label>
                                    <p className="text-sm bg-red-50 text-red-800 p-3 rounded-lg border border-red-200">
                                        {log.error_message}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Data Payloads */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Data Payloads
                        </CardTitle>
                        <CardDescription>
                            All JSON payloads and responses from the webhook processing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="incoming" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="incoming">Incoming</TabsTrigger>
                                <TabsTrigger value="contact">Contact</TabsTrigger>
                                <TabsTrigger value="quickbase-req">QB Request</TabsTrigger>
                                <TabsTrigger value="quickbase-res">QB Response</TabsTrigger>
                                <TabsTrigger value="hubspot-req">HS Request</TabsTrigger>
                                <TabsTrigger value="hubspot-res">HS Response</TabsTrigger>
                            </TabsList>

                            <TabsContent value="incoming" className="mt-4">
                                <JsonDisplay data={log.incoming_payload} title="Incoming Payload" />
                            </TabsContent>

                            <TabsContent value="contact" className="mt-4">
                                <JsonDisplay data={log.contact_data} title="Contact Data" />
                            </TabsContent>

                            <TabsContent value="quickbase-req" className="mt-4">
                                <JsonDisplay data={log.quickbase_payload} title="QuickBase Request" />
                            </TabsContent>

                            <TabsContent value="quickbase-res" className="mt-4">
                                <JsonDisplay data={log.quickbase_response} title="QuickBase Response" />
                            </TabsContent>

                            <TabsContent value="hubspot-req" className="mt-4">
                                <JsonDisplay data={log.hubspot_update_payload} title="HubSpot Update Request" />
                            </TabsContent>

                            <TabsContent value="hubspot-res" className="mt-4">
                                <JsonDisplay data={log.hubspot_update_response} title="HubSpot Update Response" />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Error Details */}
                {log.error_details && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <XCircle className="h-5 w-5" />
                                Error Details
                            </CardTitle>
                            <CardDescription>
                                Detailed error information and stack trace
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <JsonDisplay data={log.error_details} title="Error Details" />
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
