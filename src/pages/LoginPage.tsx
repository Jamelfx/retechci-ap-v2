
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../types/types';

interface LoginPageProps {
    onLogin: (email: string, password?: string) => Promise<{user: Member, token: string}>;
}

// SVG Icons for social buttons
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.611 20.083H42V20H24V28H35.303C33.674 32.69 29.213 36 24 36C18.486 36 14 31.514 14 26C14 20.486 18.486 16 24 16C26.46 16 28.691 16.957 30.36 18.465L36.242 12.582C32.885 9.488 28.69 8 24 8C12.954 8 4 16.954 4 28C4 39.046 12.954 48 24 48C35.046 48 44 39.046 44 28C44 25.962 43.856 23.95 43.611 22.083V20.083Z" fill="#FFC107"/>
        <path d="M43.611 20.083H24V28H35.303C33.674 32.69 29.213 36 24 36C18.486 36 14 31.514 14 26C14 20.486 18.486 16 24 16C26.46 16 28.691 16.957 30.36 18.465L36.242 12.582C32.885 9.488 28.69 8 24 8C12.954 8 4 16.954 4 28C4 39.046 12.954 48 24 48C35.046 48 44 39.046 44 28C44 25.962 43.856 23.95 43.611 22.083V20.083Z" fill="url(#paint0_linear)"/>
        <path d="M43.611 20.083H24V28H35.303C34.51 30.245 33.161 32.13 31.391 33.37L36.242 39.242C40.941 35.15 44 29.9 44 24C44 22.962 43.856 21.95 43.611 20.083Z" fill="#FF3D00"/>
        <defs>
            <linearGradient id="paint0_linear" x1="43.611" y1="20.083" x2="43.611" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4285F4"/>
                <stop offset="1" stopColor="#34A853"/>
            </linearGradient>
        </defs>
    </svg>
);

const AppleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.066 2.001a4.802 4.802 0 00-2.012.385c-.972.527-1.742 1.545-2.128 2.658-.553-1.09-.949-2.225-2.074-2.673-.96-.38-2.072.33-2.612.94-.852.962-1.573 2.593-1.07 4.13.313.96.862 1.84 1.572 2.536.873.855 1.533 1.514 1.94 2.487.426.99.324 2.227-.215 3.14-.582 1.01-1.638 1.815-2.628 1.89-.96.074-1.93-.31-2.58-.95-.06-.06-.11-.12-.11-.12 0 .01.01.02.01.02.53.58 1.34 1.13 2.15 1.25.92.14 1.89-.19 2.7-.8.8-.6 1.4-1.58 1.76-2.65.29-.87.27-1.77.02-2.6-.45-1.48-.96-2.85-2.4-4.04-.26-.22-.53-.44-.79-.67a4.91 4.91 0 01-1.12-1.74c-.21-.46-.17-.99.1-1.39.42-.62 1.22-.9 1.9-.66.8.25 1.28 1.17 1.43 1.96.04.18.06.32.06.32s.01 0 .01-.02a5.42 5.42 0 01-1.1-1.97c.45-.45 1.2-.84 1.9-.68.79.18 1.48.82 1.76 1.62.24.69.17 1.64-.26 2.37-.58 1.01-1.46 1.8-2.26 2.7-.42.47-.84.94-1.1 1.5-.24.51-.25 1.15-.02 1.72.35.84 1.23 1.55 2.15 1.55.15 0 .29 0 .44-.02.9-.11 1.72-.69 2.18-1.53.5-.91.43-2.08-.1-2.93-.46-.73-1.1-1.4-1.78-2.03-.68-.62-1.32-1.32-1.56-2.26-.06-.23-.08-.48-.04-.71.21-.95 1.1-1.58 1.98-1.33.82.23 1.44.97 1.5 1.8.02.21 0 .42-.04.62h.01c.02-.28.05-.62.05-.9 0-1.1-.56-2.1-1.48-2.62z"/>
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [view, setView] = useState<'login' | 'forgotPassword' | 'forgotPasswordConfirmation'>('login');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await onLogin(email, password);
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.message || 'Email ou mot de passe incorrect.');
        }
    };

    const handleForgotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email
        console.log(`Password reset link sent to: ${email}`);
        setView('forgotPasswordConfirmation');
    };

    const handleSocialLogin = async (socialEmail: string) => {
        setError('');
        try {
            // We simulate social login by passing a special dummy password to bypass the check
            await onLogin(socialEmail, 'social_login_dummy_password');
            navigate('/dashboard');
        } catch (error: any) {
            setError(`Impossible de se connecter avec ${socialEmail}. Le compte n'est pas trouvé.`);
        }
    };
  
    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-brand-gray p-8 rounded-lg shadow-xl">
                
                {view === 'login' && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6">Espace Membre - Connexion</h1>
                        
                        {error && (
                            <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="aya.kone@retechci.ci"
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Mot de passe</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="password123"
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                             <div className="text-right text-sm">
                                <button 
                                    type="button" 
                                    onClick={() => setView('forgotPassword')}
                                    className="font-medium text-brand-red hover:underline"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <div>
                                <button type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors">
                                    Se connecter
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-brand-gray text-gray-400">Ou connectez-vous avec</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div>
                                    <button
                                        onClick={() => handleSocialLogin('aya.kone@retechci.ci')}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-brand-dark text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                                    >
                                        <GoogleIcon />
                                        <span>Google</span>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        onClick={() => alert('La connexion via Apple sera bientôt disponible.')}
                                        className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-brand-dark text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                                    >
                                        <AppleIcon />
                                        <span>Apple</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {view === 'forgotPassword' && (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-2">Mot de passe oublié</h1>
                        <p className="text-center text-gray-400 mb-6 text-sm">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input 
                                    type="email" 
                                    name="forgot-email" 
                                    id="forgot-email" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                            <button type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-red hover:bg-opacity-90">
                                Envoyer le lien
                            </button>
                        </form>
                        <div className="text-center mt-4">
                            <button onClick={() => setView('login')} className="text-sm font-medium text-brand-red hover:underline">
                                Retour à la connexion
                            </button>
                        </div>
                    </>
                )}

                {view === 'forgotPasswordConfirmation' && (
                    <div className="text-center py-4">
                        <h1 className="text-2xl font-bold text-center mb-4">Vérifiez vos emails</h1>
                        <p className="text-gray-300 mb-6">
                            Si un compte existe pour <strong>{email}</strong>, un email contenant un lien pour réinitialiser votre mot de passe vient d'être envoyé.
                        </p>
                        <button onClick={() => setView('login')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gray-600 hover:bg-gray-700">
                           Retour à la connexion
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginPage;