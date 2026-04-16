import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FaGoogle, FaFacebook, FaUser, FaSignOutAlt, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import OrderTracking from "@/src/components/OrderTracking";
import axios from "axios";
import Head from 'next/head';

export default function Account() {
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStatus, setUserStatus] = useState({ isApproved: false, canViewPrices: true });
    const [statusLoading, setStatusLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        cuitCuil: '',
        businessName: '',
        shippingAddress: '',
    });
    const [profileLoading, setProfileLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            fetchOrders();
            fetchUserStatus();
            fetchUserProfile();
        }
    }, [session]);

    async function fetchOrders() {
        try {
            setLoading(true);
            const response = await axios.get(`/api/orders?email=${session.user.email}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchUserStatus() {
        try {
            setStatusLoading(true);
            const response = await axios.get(`/api/user/status?email=${session.user.email}`);
            setUserStatus(response.data);
        } catch (error) {
            console.error('Failed to fetch user status:', error);
        } finally {
            setStatusLoading(false);
        }
    }

    async function fetchUserProfile() {
        try {
            const response = await axios.get('/api/user/profile');
            setProfileData(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();
        setProfileLoading(true);
        setSaveMessage('');

        try {
            await axios.put('/api/user/profile', profileData);
            setSaveMessage('Perfil actualizado exitosamente');
            setIsEditingProfile(false);
            await fetchUserProfile();
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setSaveMessage('Error al actualizar el perfil: ' + (error.response?.data?.error || error.message));
        } finally {
            setProfileLoading(false);
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function getStatusDisplay() {
        if (statusLoading) {
            return {
                text: 'Cargando...',
                className: 'bg-gray-100 text-gray-600',
                icon: '⏳'
            };
        }
        
        if (userStatus.isApproved) {
            return {
                text: 'Activo',
                className: 'bg-green-100 text-green-800',
                icon: '✓'
            };
        }
        
        return {
            text: 'Pendiente de aprobación',
            className: 'bg-yellow-100 text-yellow-800',
            icon: '⏱'
        };
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (session) {
        const statusDisplay = getStatusDisplay();

        return (
            <>
                <Head>
                <title>Mi Cuenta | Valentino Accesorios</title>
                </Head>
                {/* Background */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50/30" />
                
                <div className={`min-h-screen py-6 sm:py-10 md:py-12 lg:py-16 transform transition-all duration-1000 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}>
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                                Mi Cuenta
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4">
                                Gestioná tu perfil y preferencias
                            </p>
                            <div className="w-12 sm:w-16 md:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-3 sm:mt-4 md:mt-6 rounded-full" />
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
                            {/* Header Section */}
                            <div className="bg-gradient-to-r from-blue-400 to-purple-400 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 lg:py-12 text-white">
                                <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                                    {session.user.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 sm:border-4 border-white shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 sm:border-4 border-white bg-white/20 flex items-center justify-center">
                                            <FaUser className="text-3xl sm:text-4xl md:text-5xl" />
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center px-2">
                                    {session.user.name || 'Usuario'}
                                </h2>
                                <p className="text-center text-white/90 mt-1 sm:mt-2 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base px-2">
                                    <FaEnvelope className="text-xs sm:text-sm flex-shrink-0" />
                                    <span className="break-all max-w-full">{session.user.email}</span>
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 lg:py-10">
                                {/* Account Info */}
                                <div className="mb-5 sm:mb-6 md:mb-8">
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                                        Información de la Cuenta
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                        <div className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 bg-gray-50 rounded-lg">
                                            <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Proveedor</span>
                                            <span className="text-xs sm:text-sm md:text-base text-gray-900 capitalize font-semibold">
                                                {session.user.provider || 'Email'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 sm:p-3.5 md:p-4 bg-gray-50 rounded-lg">
                                            <span className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">Estado</span>
                                            <span className={`inline-flex items-center px-2 sm:px-2.5 md:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${statusDisplay.className}`}>
                                                {statusDisplay.icon} {statusDisplay.text}
                                            </span>
                                        </div>
                                        {!userStatus.isApproved && !statusLoading && (
                                            <div className="p-3 sm:p-3.5 md:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-xs sm:text-sm text-yellow-800">
                                                Tu cuenta está pendiente de aprobación.
                                                Para agilizar la activación y acceder a los precios mayoristas, te recomendamos completar los datos de tu cuenta.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Information Section */}
                                <div className="mb-5 sm:mb-6 md:mb-8">
                                    <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                                            Información Personal
                                        </h3>
                                        {!isEditingProfile && (
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                <FaEdit /> Editar
                                            </button>
                                        )}
                                    </div>

                                    {saveMessage && (
                                        <div className={`mb-4 p-3 rounded-lg text-sm ${
                                            saveMessage.includes('Error') 
                                                ? 'bg-red-50 text-red-800 border border-red-200' 
                                                : 'bg-green-50 text-green-800 border border-green-200'
                                        }`}>
                                            {saveMessage}
                                        </div>
                                    )}

                                    {isEditingProfile ? (
                                        <form onSubmit={handleProfileSubmit} className="space-y-3 sm:space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                        Nombre
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={profileData.firstName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="Juan"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                        Apellido
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={profileData.lastName}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                        placeholder="Pérez"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    Teléfono
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                    placeholder="+54 11 1234-5678"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    CUIT/CUIL
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cuitCuil"
                                                    value={profileData.cuitCuil}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                    placeholder="20-12345678-9"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    Nombre del negocio
                                                </label>
                                                <input
                                                    type="text"
                                                    name="businessName"
                                                    value={profileData.businessName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                                    placeholder="Mi Negocio S.A."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    Dirección de envío
                                                </label>
                                                <textarea
                                                    name="shippingAddress"
                                                    value={profileData.shippingAddress}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                                                    placeholder="Calle 123, Piso 4, Depto A, Ciudad, Provincia, CP"
                                                />
                                            </div>

                                            <div className="flex gap-2 sm:gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={profileLoading}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                                                >
                                                    <FaSave className="text-sm sm:text-base" />
                                                    {profileLoading ? 'Guardando...' : 'Guardar cambios'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditingProfile(false);
                                                        fetchUserProfile();
                                                    }}
                                                    className="px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm"
                                                >
                                                    <FaTimes className="inline mr-1" /> Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <span className="block text-xs text-gray-500 mb-1">Nombre</span>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                        {profileData.firstName || 'No especificado'}
                                                    </span>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <span className="block text-xs text-gray-500 mb-1">Apellido</span>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                        {profileData.lastName || 'No especificado'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="block text-xs text-gray-500 mb-1">Teléfono</span>
                                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                    {profileData.phone || 'No especificado'}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="block text-xs text-gray-500 mb-1">CUIT/CUIL</span>
                                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                    {profileData.cuitCuil || 'No especificado'}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="block text-xs text-gray-500 mb-1">Nombre del negocio</span>
                                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                    {profileData.businessName || 'No especificado'}
                                                </span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="block text-xs text-gray-500 mb-1">Dirección de envío</span>
                                                <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-pre-line">
                                                    {profileData.shippingAddress || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-5 sm:my-6 md:my-8" />

                                {/* Orders Section */}
                                <div className="mb-5 sm:mb-6 md:mb-8">
                                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                                        Mis Pedidos
                                    </h3>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-6 sm:py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            {orders.map(order => (
                                                <OrderTracking key={order._id} order={order} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center py-6 sm:py-8">
                                            No se encontraron pedidos
                                        </p>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-5 sm:my-6 md:my-8" />

                                {/* Actions */}
                                <div className="space-y-3 sm:space-y-4">
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
                                    >
                                        <FaSignOutAlt className="text-base sm:text-lg md:text-xl" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-5 sm:mt-6 md:mt-8 text-center text-gray-600 text-xs sm:text-sm px-4">
                            <p className="break-words">¿Necesitás ayuda? Contactanos a <span className="hidden sm:inline">contacto@valentinoaccesorios.com.ar</span><span className="sm:hidden">nuestro email</span></p>
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
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50/30" />
            
            <div className={`min-h-screen flex items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="max-w-sm w-full">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8 md:mb-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Bienvenido
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 px-4">
                            Iniciá sesión para continuar
                        </p>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 sm:mt-5 md:mt-6 rounded-full" />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100 transform hover:shadow-2xl transition-all duration-300">
                        <div className="space-y-3 sm:space-y-4">
                            {/* Google Sign In */}
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/account' })}
                                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
                            >
                                <FaGoogle className="text-lg sm:text-xl text-red-500 flex-shrink-0" />
                                <span className="truncate">Continuar con Google</span>
                            </button>

                            {/* Facebook Sign In */}
                            <button
                                onClick={() => signIn('facebook', { callbackUrl: '/account' })}
                                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-[#1877F2] text-white font-semibold rounded-lg hover:bg-[#166FE5] active:scale-95 sm:hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
                            >
                                <FaFacebook className="text-lg sm:text-xl flex-shrink-0" />
                                <span className="truncate">Continuar con Facebook</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-5 sm:my-6 md:my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">
                                    Acceso seguro
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-600 px-2">
                                Al continuar, aceptás nuestros términos y condiciones
                            </p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-5 sm:mt-6 md:mt-8 text-center px-4">
                        <p className="text-xs sm:text-sm text-gray-600">
                            ¿Primera vez? No te preocupes, crearemos tu cuenta automáticamente
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
