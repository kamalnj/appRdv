import SuccessModal from '@/components/ui/SuccessModal';
import { Head, router, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, Shield, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administration',
        href: '/dashboard',
    },
    {
        title: 'Nouveau Utilisateur',
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
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            onSuccess: () => {
                setIsModalOpen(true);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register" />

            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Créer Un Nouveau Utilisateur</h1>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-8">
                            <form className="space-y-6" onSubmit={submit}>
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <User className="h-4 w-4" />
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
                                            placeholder="Entrez le nom complet"
                                            className={`h-12 rounded-xl border-0 bg-gray-50 pr-4 pl-4 text-base transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:focus:bg-gray-600 ${
                                                errors.name ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-900/10' : ''
                                            }`}
                                        />
                                    </div>
                                    <InputError message={errors.name} className="text-xs" />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Mail className="h-4 w-4" />
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
                                            placeholder="nom@email.com"
                                            className={`h-12 rounded-xl border-0 bg-gray-50 pr-4 pl-4 text-base transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:focus:bg-gray-600 ${
                                                errors.email ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-900/10' : ''
                                            }`}
                                        />
                                    </div>
                                    <InputError message={errors.email} className="text-xs" />
                                </div>

                                {/* Role Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Shield className="h-4 w-4" />
                                        Rôle
                                    </Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)} disabled={processing} required>
                                        <SelectTrigger
                                            className={`h-12 rounded-xl border-0 bg-gray-50 text-base focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:focus:bg-gray-600 ${
                                                errors.role ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <SelectValue placeholder="Choisissez le rôle" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-0 shadow-lg">
                                            <SelectItem value="assistant" className="rounded-lg">
                                                Assistant
                                            </SelectItem>
                                            <SelectItem value="commerçant" className="rounded-lg">
                                                Commerçant
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} className="text-xs" />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Créez un mot de passe sécurisé"
                                            className={`h-12 rounded-xl border-0 bg-gray-50 pr-12 pl-4 text-base transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:focus:bg-gray-600 ${
                                                errors.password ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-900/10' : ''
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none dark:hover:text-gray-300"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="text-xs" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirmez le mot de passe"
                                            className={`h-12 rounded-xl border-0 bg-gray-50 pr-12 pl-4 text-base transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-700 dark:focus:bg-gray-600 ${
                                                errors.password_confirmation
                                                    ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20 dark:bg-red-900/10'
                                                    : ''
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none dark:hover:text-gray-300"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="text-xs" />
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                    tabIndex={5}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />}
                                    {processing ? 'Création en cours...' : 'Créer Utilisateur'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message="Utilisateur créé avec succès!"
                buttonText="Continuer"
                onContinue={() => router.visit('/dashboard')}
            />
        </AppLayout>
    );
}
