import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
// const basePath = '/appS2'; // Sous-dossier de l'application

// // Intercepter toutes les requêtes Inertia pour forcer le bon préfixe
// router.on('start', ({ detail: { visit } }) => {
//     const path = visit.url.pathname;

//     // Ajouter le préfixe uniquement si nécessaire
//     if (path.startsWith('/') && !path.startsWith(basePath)) {
//         visit.url.pathname = basePath + path;
//     }
// });

// // Gestion des erreurs pour forcer le rechargement si nécessaire
// router.on('error', ({ detail: { errors } }) => {
//     console.log('Erreur Inertia:', errors);

//     // Si erreur 404 ou 500 côté Inertia, forcer un rechargement complet
//     if (
//         errors.response &&
//         typeof errors.response === 'object' &&
//         errors.response !== null &&
//         typeof (errors.response as { status?: number }).status === 'number' &&
//         ((errors.response as { status: number }).status === 404 ||
//             (errors.response as { status: number }).status === 500)
//     ) {
//         setTimeout(() => {
//             window.location.reload();
//         }, 100);
//     }
// });

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// Initialisation du thème (light / dark)
initializeTheme();
