import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, User, Mail, Shield, Lock } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/dashboard',
    },
    {
        title: 'Nouveau Utlisateur',
        href: '/',
    },
];

type RegisterForm = {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}> 
            <Head title="Register" />
            
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Créer Un Nouveau Utlisateur
                        </h1>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={submit}>
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Nom complet
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Entrez votre nom complet"
                                            className={`h-12 pl-4 pr-4 text-base transition-all duration-200 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.name 
                                                    ? 'ring-2 ring-red-500/20 border-red-500 bg-red-50 dark:bg-red-900/10' 
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                    <InputError message={errors.name} className="text-xs" />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Adresse email
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="votre@email.com"
                                            className={`h-12 pl-4 pr-4 text-base transition-all duration-200 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.email 
                                                    ? 'ring-2 ring-red-500/20 border-red-500 bg-red-50 dark:bg-red-900/10' 
                                                    : ''
                                            }`}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="text-xs" />
                                </div>
                                
                                {/* Role Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Rôle
                                    </Label>
                                    <Select
                                        value={data.role}
                                        onValueChange={(value) => setData('role', value)}
                                        disabled={processing}
                                        required
                                    >
                                        <SelectTrigger className={`h-12 text-base bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                            errors.role 
                                                ? 'ring-2 ring-red-500/20 border-red-500 bg-red-50 dark:bg-red-900/10' 
                                                : ''
                                        }`}>
                                            <SelectValue placeholder="Choisissez votre rôle" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-0 shadow-lg">
                                            <SelectItem value="assistant" className="rounded-lg">Assistant</SelectItem>
                                            <SelectItem value="commerçant" className="rounded-lg">Commerçant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} className="text-xs" />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Créez un mot de passe sécurisé"
                                            className={`h-12 pl-4 pr-12 text-base transition-all duration-200 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.password 
                                                    ? 'ring-2 ring-red-500/20 border-red-500 bg-red-50 dark:bg-red-900/10' 
                                                    : ''
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="text-xs" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirmez votre mot de passe"
                                            className={`h-12 pl-4 pr-12 text-base transition-all duration-200 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                                                errors.password_confirmation 
                                                    ? 'ring-2 ring-red-500/20 border-red-500 bg-red-50 dark:bg-red-900/10' 
                                                    : ''
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="text-xs" />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
                                    tabIndex={5} 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                                    {processing ? 'Création en cours...' : 'Nouveau Utilisateur'}
                                </Button>
                            </form>
                        </div>
                    </div>


                </div>
            </div>
        </AppLayout>
    );
}