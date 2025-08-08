import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Users, Activity, UserCheck, FileText, Folder } from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Users',
        href: route('users.index'),
        icon: Users,
    },
    {
        title: 'HubSpot Logs',
        href: route('hubspot-logs.index'),
        icon: Activity,
    },
    {
        title: 'Channel Partners Sync Logs',
        href: route('channel-partners-sync-logs.index'),
        icon: BookOpen,
    },
    {
        title: 'Contacts',
        href: route('contacts.index'),
        icon: UserCheck,
    },
    {
        title: 'Submissions',
        href: route('submissions.index'),
        icon: FileText,
    },
    {
        title: 'Collaterals',
        href: route('collaterals.index'),
        icon: Folder,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
