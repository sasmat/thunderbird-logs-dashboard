import { type SharedData } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface WelcomeProps {
    canResetPassword: boolean;
    status?: string;
}

export default function Welcome({ canResetPassword, status }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // If user is already authenticated, redirect to dashboard
    if (auth.user) {
        return (
            <>
                <Head title="Welcome" />
                <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Welcome to Thunderbird Logs Dashboard" />
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-12 fill-current text-foreground" />
                            </div>
                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome to Thunderbird Logs Dashboard</h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    Please sign in to access your dashboard
                                </p>
                            </div>
                        </div>

                        {status && (
                            <div className="text-center text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                                {status}
                            </div>
                        )}

                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="ml-auto text-sm text-primary hover:underline"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Sign in to Dashboard
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
