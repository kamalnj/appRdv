export interface EventExtendedProps {
    representer_par?: string;
    email?: string;
    telephone?: string[];
    localisation?: string;
    commentaire?: string;
    feedback?: string;
    fonction?: string;
    telephoneR?: string;
    details?:string;
    next_step?: string;
    besoin_client?: string;
    idRdv: number;
    idEntreprise: number;
    isqualified?: boolean | null;
    hasAttcom?: boolean;
    idAttcom?: number;
}

export interface CalendarEvent {
    title: string;
    start: Date;
    end?: Date;
    extendedProps: EventExtendedProps;
}

export interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: CalendarEvent | null;
    qualifierConfirm: number | null;
    onQualifierClick: (id: number) => void;
    onCancelQualifier: () => void;
    isLoading: boolean;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface RdvEvent {
    title: string;
    start: string;
    end: string;
    localisation: string;
    representer_par: string;
    fonction: string;
    telephoneR: string;
    email: string;
    telephone: string;
    commentaire: string;
    feedback: string;
    next_step: string;
    besoin_client: string;
    idEntreprise: number;
    idRdv: number;
}

export interface Props {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    rdvs: RdvEvent[];
}
