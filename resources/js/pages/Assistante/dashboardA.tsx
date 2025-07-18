// import React from 'react';
// import { type BreadcrumbItem } from '@/types';

// import { 
//     Building2, 
//     Calendar, 
//     Activity, 
//     Users, 
//     Phone,
//     Mail,
//     MapPin,
//     Clock,
//     CheckCircle,
//     AlertCircle,
//     ArrowRight,
//     Plus,
//     Search,
//     Filter,
//     Eye,
//     Edit,
//     User,
//     Target,
//     TrendingUp,
//     Star,
//     MessageCircle,
//     CalendarDays,
//     UserCheck
// } from 'lucide-react';
// import appLayout from '@/layouts/app-layout';
// import AppLayout from '@/layouts/app-layout';

// // Mock data
// const mockStats = {
//     totalEntreprises: 142,
//     activeActions: 28,
//     scheduledRdvs: 15,
//     availableCommercants: 8,
//     monthlyTarget: 50,
//     completed: 37
// };

// const mockEnterprises = [
//     {
//         id: 1,
//         name: "TechCorp Solutions",
//         contact: "Marie Dubois",
//         email: "marie@techcorp.com",
//         phone: "01 23 45 67 89",
//         address: "123 Rue de la Paix, Paris",
//         status: "new",
//         lastContact: "Il y a 2 heures",
//         priority: "high"
//     },
//     {
//         id: 2,
//         name: "Green Energy Co",
//         contact: "Pierre Martin",
//         email: "pierre@greenenergy.com",
//         phone: "01 98 76 54 32",
//         address: "456 Avenue Verte, Lyon",
//         status: "contacted",
//         lastContact: "Hier",
//         priority: "medium"
//     },
//     {
//         id: 3,
//         name: "Digital Partners",
//         contact: "Sophie Laurent",
//         email: "sophie@digitalpartners.com",
//         phone: "01 11 22 33 44",
//         address: "789 Boulevard Digital, Marseille",
//         status: "rdv_scheduled",
//         lastContact: "Il y a 3 jours",
//         priority: "high",
//         assignedCommercant: "Jean Dupont",
//         rdvDate: "2025-07-20"
//     },
//     {
//         id: 4,
//         name: "Innovate Labs",
//         contact: "Marc Rousseau",
//         email: "marc@innovatelabs.com",
//         phone: "01 55 66 77 88",
//         address: "321 Rue Innovation, Toulouse",
//         status: "assigned",
//         lastContact: "Il y a 1 semaine",
//         priority: "medium",
//         assignedCommercant: "Alice Bernard"
//     },
//     {
//         id: 5,
//         name: "Future Systems",
//         contact: "Emma Moreau",
//         email: "emma@futuresystems.com",
//         phone: "01 99 88 77 66",
//         address: "654 Place Futur, Nice",
//         status: "completed",
//         lastContact: "Il y a 2 semaines",
//         priority: "low",
//         assignedCommercant: "Paul Leroy"
//     }
// ];

// const mockCommercants = [
//     {
//         id: 1,
//         name: "Jean Dupont",
//         email: "jean@example.com",
//         phone: "06 12 34 56 78",
//         availability: "available",
//         rating: 4.8,
//         completedRdvs: 23,
//         location: "Paris"
//     },
//     {
//         id: 2,
//         name: "Alice Bernard",
//         email: "alice@example.com",
//         phone: "06 98 76 54 32",
//         availability: "busy",
//         rating: 4.6,
//         completedRdvs: 18,
//         location: "Lyon"
//     },
//     {
//         id: 3,
//         name: "Paul Leroy",
//         email: "paul@example.com",
//         phone: "06 55 44 33 22",
//         availability: "available",
//         rating: 4.9,
//         completedRdvs: 31,
//         location: "Marseille"
//     },
//     {
//         id: 4,
//         name: "Sophie Blanc",
//         email: "sophie@example.com",
//         phone: "06 11 22 33 44",
//         availability: "offline",
//         rating: 4.7,
//         completedRdvs: 15,
//         location: "Toulouse"
//     }
// ];

// const mockRecentActions = [
//     {
//         id: 1,
//         type: "contact",
//         enterprise: "TechCorp Solutions",
//         description: "Premier contact établi",
//         timestamp: "Il y a 30 min",
//         status: "completed"
//     },
//     {
//         id: 2,
//         type: "rdv",
//         enterprise: "Digital Partners",
//         description: "RDV planifié avec Jean Dupont",
//         timestamp: "Il y a 2 heures",
//         status: "completed"
//     },
//     {
//         id: 3,
//         type: "follow_up",
//         enterprise: "Green Energy Co",
//         description: "Suivi nécessaire",
//         timestamp: "Il y a 4 heures",
//         status: "pending"
//     },
//     {
//         id: 4,
//         type: "assignment",
//         enterprise: "Innovate Labs",
//         description: "Assigné à Alice Bernard",
//         timestamp: "Hier",
//         status: "completed"
//     }
// ];

// const StatCard = ({ 
//     title, 
//     value, 
//     icon: Icon, 
//     trend, 
//     subtitle,
//     color = 'teal'
// }) => {
//     const colorClasses:any = {
//         teal: 'bg-teal-50 text-teal-600',
//         green: 'bg-green-50 text-green-600',
//         blue: 'bg-blue-50 text-blue-600',
//         purple: 'bg-purple-50 text-purple-600',
//         orange: 'bg-orange-50 text-orange-600',
//         indigo: 'bg-indigo-50 text-indigo-600'
//     };

//     return (
//         <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
//                         <Icon className="h-5 w-5" />
//                     </div>
//                     <h3 className="text-sm font-medium text-gray-600">
//                         {title}
//                     </h3>
//                 </div>
//                 {trend && (
//                     <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
//                         trend.isPositive 
//                             ? 'bg-green-50 text-green-700' 
//                             : 'bg-red-50 text-red-700'
//                     }`}>
//                         <TrendingUp className={`h-3 w-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
//                         {trend.percentage}%
//                     </div>
//                 )}
//             </div>
            
//             <div className="space-y-2">
//                 <div className="text-3xl font-bold text-gray-900">
//                     {typeof value === 'number' ? value.toLocaleString() : value}
//                 </div>
//                 <p className="text-sm text-gray-500">
//                     {subtitle}
//                 </p>
//             </div>
//         </div>
//     );
// };

// const PipelineColumn:any = ({ 
//     title, 
//     count, 
//     enterprises, 
//     status,
//     color 
// }) => {
//     const filteredEnterprises = enterprises.filter(e => e.status === status);
    
//     return (
//         <div className="flex-1 min-w-80">
//             <div className={`rounded-lg p-4 mb-4 ${color}`}>
//                 <div className="flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-900">{title}</h3>
//                     <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
//                         {count}
//                     </span>
//                 </div>
//             </div>
            
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {filteredEnterprises.map((enterprise:any) => (
//                     <div key={enterprise.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
//                         <div className="flex items-start justify-between mb-2">
//                             <h4 className="font-medium text-gray-900">{enterprise.name}</h4>
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 enterprise.priority === 'high' 
//                                     ? 'bg-red-100 text-red-700'
//                                     : enterprise.priority === 'medium'
//                                     ? 'bg-yellow-100 text-yellow-700'
//                                     : 'bg-green-100 text-green-700'
//                             }`}>
//                                 {enterprise.priority}
//                             </span>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-2">{enterprise.contact}</p>
//                         <div className="flex items-center gap-2 text-xs text-gray-500">
//                             <Clock className="h-3 w-3" />
//                             {enterprise.lastContact}
//                         </div>
//                         {enterprise.assignedCommercant && (
//                             <div className="flex items-center gap-2 text-xs text-teal-600 mt-2">
//                                 <UserCheck className="h-3 w-3" />
//                                 {enterprise.assignedCommercant}
//                             </div>
//                         )}
//                         <div className="flex items-center gap-2 mt-3">
//                             <button className="flex items-center gap-1 px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded hover:bg-teal-200">
//                                 <Eye className="h-3 w-3" />
//                                 Voir
//                             </button>
//                             <button className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
//                                 <Edit className="h-3 w-3" />
//                                 Modifier
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// const CommercantCard = ({ commercant, onAssign }:any) => (
//     <div className="bg-white rounded-lg p-4 border border-gray-200">
//         <div className="flex items-start justify-between mb-3">
//             <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
//                     {commercant.name.charAt(0)}
//                 </div>
//                 <div>
//                     <h4 className="font-medium text-gray-900">{commercant.name}</h4>
//                     <p className="text-xs text-gray-500">{commercant.location}</p>
//                 </div>
//             </div>
//             <div className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 commercant.availability === 'available' 
//                     ? 'bg-green-100 text-green-700'
//                     : commercant.availability === 'busy'
//                     ? 'bg-yellow-100 text-yellow-700'
//                     : 'bg-red-100 text-red-700'
//             }`}>
//                 {commercant.availability}
//             </div>
//         </div>
        
//         <div className="flex items-center gap-4 mb-3">
//             <div className="flex items-center gap-1">
//                 <Star className="h-4 w-4 text-yellow-500 fill-current" />
//                 <span className="text-sm font-medium">{commercant.rating}</span>
//             </div>
//             <div className="text-sm text-gray-600">
//                 {commercant.completedRdvs} RDV
//             </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//             <button 
//                 onClick={() => onAssign(commercant.id)}
//                 className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
//             >
//                 Assigner
//             </button>
//             <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                 <MessageCircle className="h-4 w-4" />
//             </button>
//         </div>
//     </div>
// );

// export default function AssistantDashboard() {
//     const pipelineData = [
//         { title: 'Nouveaux leads', status: 'new', count: mockEnterprises.filter(e => e.status === 'new').length, color: 'bg-blue-50' },
//         { title: 'Contactés', status: 'contacted', count: mockEnterprises.filter(e => e.status === 'contacted').length, color: 'bg-yellow-50' },
//         { title: 'RDV planifiés', status: 'rdv_scheduled', count: mockEnterprises.filter(e => e.status === 'rdv_scheduled').length, color: 'bg-purple-50' },
//         { title: 'Assignés', status: 'assigned', count: mockEnterprises.filter(e => e.status === 'assigned').length, color: 'bg-orange-50' },
//         { title: 'Terminés', status: 'completed', count: mockEnterprises.filter(e => e.status === 'completed').length, color: 'bg-green-50' }
//     ];
//         const breadcrumbs: BreadcrumbItem[] = [
//             {
//                 title: 'Tableau de bord',
//                 href: '/dashboardA',
//             }]

//     return (
//         <AppLayout breadcrumbs={breadcrumbs} >
//         <div className="min-h-screen bg-gray-50 p-6">
//             {/* Header */}
//             <div className="mb-8">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-green-600">
//                             <Target className="h-6 w-6 text-white" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">
//                                 Assistant Dashboard
//                             </h1>
//                             <p className="text-gray-600">
//                                 Gérez vos entreprises et coordonnez les rendez-vous
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
//                             <Plus className="h-4 w-4" />
//                             Nouvelle entreprise
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//                             <Calendar className="h-4 w-4" />
//                             Planifier RDV
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             <div className="space-y-6">
//                 {/* Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//                     <StatCard
//                         title="Total Entreprises"
//                         value={mockStats.totalEntreprises}
//                         icon={Building2}
//                         trend={{ isPositive: true, percentage: 8 }}
//                         subtitle="Entreprises gérées"
//                         color="teal"
//                     />
//                     <StatCard
//                         title="Actions Actives"
//                         value={mockStats.activeActions}
//                         icon={Activity}
//                         trend={{ isPositive: true, percentage: 15 }}
//                         subtitle="En cours"
//                         color="blue"
//                     />
//                     <StatCard
//                         title="RDV Planifiés"
//                         value={mockStats.scheduledRdvs}
//                         icon={Calendar}
//                         trend={{ isPositive: true, percentage: 12 }}
//                         subtitle="Cette semaine"
//                         color="purple"
//                     />
//                     <StatCard
//                         title="Commerçants"
//                         value={mockStats.availableCommercants}
//                         icon={Users}
//                         subtitle="Disponibles"
//                         color="green"
//                     />
//                     <StatCard
//                         title="Objectif mensuel"
//                         value={`${mockStats.completed}/${mockStats.monthlyTarget}`}
//                         icon={Target}
//                         trend={{ isPositive: true, percentage: 20 }}
//                         subtitle="Progression"
//                         color="orange"
//                     />
//                     <StatCard
//                         title="Taux de conversion"
//                         value="73%"
//                         icon={TrendingUp}
//                         trend={{ isPositive: true, percentage: 5 }}
//                         subtitle="Ce mois"
//                         color="indigo"
//                     />
//                 </div>

//                 {/* Pipeline Kanban */}
//                 <div className="rounded-xl border border-gray-200 bg-white p-6">
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-lg font-semibold text-gray-900">
//                             Pipeline des entreprises
//                         </h2>
//                         <div className="flex items-center gap-3">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                                 <input 
//                                     type="text" 
//                                     placeholder="Rechercher une entreprise..." 
//                                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
//                                 />
//                             </div>
//                             <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//                                 <Filter className="h-4 w-4" />
//                                 Filtrer
//                             </button>
//                         </div>
//                     </div>
                    
//                     <div className="flex gap-6 overflow-x-auto pb-4">
//                         {pipelineData.map((column) => (
//                             <PipelineColumn
//                                 key={column.status}
//                                 title={column.title}
//                                 count={column.count}
//                                 enterprises={mockEnterprises}
//                                 status={column.status}
//                                 color={column.color}
//                             />
//                         ))}
//                     </div>
//                 </div>

//                 {/* Bottom Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Commercants disponibles */}
//                     <div className="lg:col-span-2">
//                         <div className="rounded-xl border border-gray-200 bg-white p-6">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h2 className="text-lg font-semibold text-gray-900">
//                                     Commerçants disponibles
//                                 </h2>
//                                 <button className="text-sm text-teal-600 hover:text-teal-700">
//                                     Voir tous
//                                 </button>
//                             </div>
                            
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {mockCommercants.slice(0, 4).map((commercant) => (
//                                     <CommercantCard 
//                                         key={commercant.id}
//                                         commercant={commercant}
//                                         onAssign={(id) => console.log('Assign commercant', id)}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Actions récentes */}
//                     <div className="space-y-6">
//                         <div className="rounded-xl border border-gray-200 bg-white p-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                 Actions récentes
//                             </h3>
//                             <div className="space-y-3">
//                                 {mockRecentActions.map((action) => (
//                                     <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
//                                         <div className={`w-2 h-2 rounded-full mt-2 ${
//                                             action.status === 'completed' ? 'bg-green-500' :
//                                             action.status === 'pending' ? 'bg-yellow-500' :
//                                             'bg-blue-500'
//                                         }`}></div>
//                                         <div className="flex-1">
//                                             <p className="text-sm font-medium text-gray-900">
//                                                 {action.description}
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 {action.enterprise} • {action.timestamp}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Actions rapides */}
//                         <div className="rounded-xl border border-gray-200 bg-white p-6">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                                 Actions rapides
//                             </h3>
//                             <div className="space-y-3">
//                                 <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <Building2 className="h-4 w-4 text-teal-600" />
//                                         <span className="text-sm font-medium">Ajouter une entreprise</span>
//                                     </div>
//                                 </button>
//                                 <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <Activity className="h-4 w-4 text-blue-600" />
//                                         <span className="text-sm font-medium">Créer une action</span>
//                                     </div>
//                                 </button>
//                                 <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <CalendarDays className="h-4 w-4 text-purple-600" />
//                                         <span className="text-sm font-medium">Planifier un RDV</span>
//                                     </div>
//                                 </button>
//                                 <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <Phone className="h-4 w-4 text-green-600" />
//                                         <span className="text-sm font-medium">Contacter une entreprise</span>
//                                     </div>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//         </AppLayout>
//     );
// }