import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookUser, BriefcaseBusinessIcon, BusFront, LayoutGrid, Map, OrigamiIcon } from 'lucide-react';
import AppLogo from './app-logo';


export function AppSidebar() {
// Define the expected shape of the auth object
type AuthUser = {
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
        title: 'Tableau de bord - Assistante',
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
        title: 'Tableau de bord - Admin',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {     
        title: 'Mangement des utilisateurs',
        href: '/Admin/Users',
        icon: LayoutGrid,
    },
];
const commerçantNavItems: NavItem[] = [
       {
        title: 'Tableau de bord - Commerçant',
        href: '/dashboardC',
        icon: LayoutGrid,
    }, {
        title: 'RDVs',
        href: '/Commerçant/Rdv',
        icon: LayoutGrid,
    },
];

let roleBaseNaveItems: NavItem[];
if (user === 'assistant') {
    roleBaseNaveItems = [...assistantNavItems];
}
else if (user === 'commerçant') {
    roleBaseNaveItems = [...commerçantNavItems];
} else {
    roleBaseNaveItems = adminNavItems;
}





    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
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
