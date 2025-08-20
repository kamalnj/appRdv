import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BriefcaseBusinessIcon, Clock, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    type AuthUser = {
        id?: number;
        role?: string;
    };
    type PageProps = {
        auth?: {
            user?: AuthUser;
        };
    };

    const { auth } = usePage<PageProps>().props;
    const user = auth?.user?.role || 'assistant';

    const assistantNavItems: NavItem[] = [
        {
            title: 'Tableau de bord',
            href: '/dashboardA',
            icon: LayoutGrid,
        },
        {
            title: 'Entreprises',
            href: '/entreprises',
            icon: BriefcaseBusinessIcon,
        },
    ];
    const adminNavItems: NavItem[] = [
        {
            title: 'Tableau de bord',
            href: '/dashboard',
            icon: LayoutGrid,
            
        },
        {
            title: 'Gestion des entreprises',
            href: '/entreprise',
            icon: BriefcaseBusinessIcon,
            
        },
    ];
    const commerçantNavItems: NavItem[] = [
        {
            title: 'Tableau de bord ',
            href: '/dashboardC',
            icon: LayoutGrid,
        },
        {
            title: 'RDVs',
            href: '/calendrier',
            icon: Clock,
        },
    ];

    let roleBaseNaveItems: NavItem[] = [];

    if (user === 'assistant') {
        roleBaseNaveItems = [...assistantNavItems];
    } else if (user === 'commerçant') {
        roleBaseNaveItems = [...commerçantNavItems];
    } else {
        roleBaseNaveItems = [...adminNavItems];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                                <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={roleBaseNaveItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
