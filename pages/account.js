import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaGoogle, FaFacebook, FaUser, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';

export default function Account() {
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (session) {
        return (
            <>
                {/* Background */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />
                
                <div className={`min-h-screen py-16 transform transition-all duration-1000 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                                Mi Cuenta
                            </h1>
                            <p className="text-lg text-gray-600">
                                Gestioná tu perfil y preferencias
                            </p>
                            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-12 text-white">
                                <div className="flex items-center justify-center mb-4">
                                    {session.user.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name}
                                            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                                            <FaUser className="text-5xl" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-center">
                                    {session.user.name || 'Usuario'}
                                </h2>
                                <p className="text-center text-white/90 mt-2 flex items-center justify-center gap-2">
                                    <FaEnvelope className="text-sm" />
                                    {session.user.email}
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-10">
                                {/* Account Info */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                        Información de la Cuenta
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600 font-medium">Proveedor</span>
                                            <span className="text-gray-900 capitalize font-semibold">
                                                {session.user.provider || 'Email'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600 font-medium">Estado</span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                                ✓ Activo
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-8" />

                                {/* Actions */}
                                <div className="space-y-4">
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        <FaSignOutAlt className="text-xl" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 text-center text-gray-600 text-sm">
                            <p>¿Necesitás ayuda? Contactanos a valentinobayres@hotmail.com</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Login Page
    return (
        <>
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-white to-red-50/20" />
            
            <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Bienvenido
                        </h1>
                        <p className="text-lg text-gray-600">
                            Iniciá sesión para continuar
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-4">
                            {/* Google Sign In */}
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/account' })}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FaGoogle className="text-xl text-red-500" />
                                Continuar con Google
                            </button>

                            {/* Facebook Sign In */}
                            <button
                                onClick={() => signIn('facebook', { callbackUrl: '/account' })}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] text-white font-semibold rounded-lg hover:bg-[#166FE5] transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FaFacebook className="text-xl" />
                                Continuar con Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">
                                    Acceso seguro
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Al continuar, aceptás nuestros términos y condiciones
                            </p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            ¿Primera vez? No te preocupes, crearemos tu cuenta automáticamente
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
