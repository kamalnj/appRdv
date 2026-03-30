import { Download } from 'lucide-react';

interface Entreprise {
    id: number;
    denomination: string;
    rc: string;
    tribunal: string;
}

interface FeedbackItem {
    feedback: string;
    count: number;
    percentage?: number;
    entreprises: Entreprise[];
}

interface ExportCSVProps {
    data: FeedbackItem[];
    fileName?: string;
}

const ExportCSV = ({ data, fileName }: ExportCSVProps) => {
    const exportData = () => {
        if (!data?.length) return;

        const BOM = '\uFEFF';
        
        // En-têtes clairs et professionnels
        const headers = [
            'Type de Feedback',
            'Nombre de retours',
            'Pourcentage (%)',
            'Dénomination',
            'Registre de Commerce (RC)',
            'Tribunal'
        ];

        const escapeCSV = (value: string | number) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            // Échapper les guillemets, points-virgules et sauts de ligne
            if (/[",;\n\r]/.test(str)) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows: string[][] = [];
        
        data.forEach((item) => {
            const feedbackVal = escapeCSV(item.feedback);
            const countVal = escapeCSV(item.count);
            // Formatage français pour les nombres (virgule décimale)
            const percentVal = escapeCSV(item.percentage?.toFixed(2).replace('.', ',') || '0,00');

            if (item.entreprises && item.entreprises.length > 0) {
                item.entreprises.forEach((entreprise, index) => {
                    // Pour la première ligne, on affiche les infos du feedback
                    // Pour les suivantes, on laisse vide pour créer un effet visuel de "regroupement"
                    if (index === 0) {
                        rows.push([
                            feedbackVal,
                            countVal,
                            percentVal,
                            escapeCSV(entreprise.denomination),
                            escapeCSV(entreprise.rc),
                            escapeCSV(entreprise.tribunal)
                        ]);
                    } else {
                        rows.push([
                            '', // Vide pour éviter la répétition
                            '',
                            '',
                            escapeCSV(entreprise.denomination),
                            escapeCSV(entreprise.rc),
                            escapeCSV(entreprise.tribunal)
                        ]);
                    }
                });
            } else {
                // Ligne vide pour les feedbacks sans entreprises associées
                rows.push([
                    feedbackVal,
                    countVal,
                    percentVal,
                    '-',
                    '-',
                    '-'
                ]);
            }
            
            // Ajouter une ligne vide après chaque groupe pour améliorer la lisibilité
            rows.push(['', '', '', '', '', '']);
        });

        const delimiter = ';';
        
        // En-têtes du rapport (Métadonnées)
        const reportDate = ['Généré le', new Date().toLocaleDateString('fr-FR')];
        const emptyRow = [''];

        // Utilisation de CRLF (\r\n) pour une meilleure compatibilité Windows
        const csvContent = [
            reportDate,
            emptyRow,
            headers, 
            ...rows
        ]
            .map((row) => row.join(delimiter))
            .join('\r\n');
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `feedbacks-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={exportData}
            disabled={!data?.length}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Download className="h-4 w-4" />
            Exporter CSV
        </button>
    );
};

export default ExportCSV;