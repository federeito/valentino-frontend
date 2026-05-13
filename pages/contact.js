import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ 
                    type: 'success', 
                    message: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.' 
                });
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus({ 
                    type: 'error', 
                    message: data.error || 'Error al enviar el mensaje. Por favor intente nuevamente.' 
                });
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: 'Error al enviar el mensaje. Por favor intente nuevamente.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Contacto | Soledad Accesorios</title>
                <meta name="description" content="Contactá con Soledad Accesorios. Estamos para ayudarte con tus consultas sobre nuestros productos mayoristas." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactanos</h1>
                        <p className="text-lg text-gray-600">
                            ¿Tenés alguna consulta? Estamos para ayudarte
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto mt-6 rounded-full" />
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono (opcional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    placeholder="+54 9 11 1234-5678"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Contanos en qué podemos ayudarte..."
                                />
                            </div>

                            {/* Status Message */}
                            {status.message && (
                                <div className={`p-4 rounded-lg ${
                                    status.type === 'success' 
                                        ? 'bg-green-50 text-green-800 border border-green-200' 
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                    {status.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-center text-gray-600 text-sm">
                                También podés contactarnos directamente a{' '}
                                <a 
                                    href="mailto:contacto@soledadaccesorios.com.ar" 
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    contacto@soledadaccesorios.com.ar
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
