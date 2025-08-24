import Link from "next/link";

export default function Success() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-center">
        
        {/* Icono de éxito */}
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Tu pedido fue creado con éxito!
        </h2>

        {/* Mensaje */}
        <p className="text-gray-600 mb-4">
          Hemos enviado a tu correo electrónico los <strong>datos bancarios</strong> para completar el pago por transferencia.
          <br />
          Recuerda revisar también la carpeta de <strong>spam</strong> si no lo encuentras 
          en tu bandeja de entrada.
        </p>

        <p className="text-gray-600 mb-6">
          Una vez confirmemos tu pago, comenzaremos a preparar tu envío 🚚.
        </p>

        {/* Botón */}
        <Link
          href="/products"
          className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-md hover:bg-primary/90 transition"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
