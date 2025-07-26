import Link from "next/link";

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

};

export default function Collection({ product }) {
    if (product) {
        return <>
            <section>
                <div className="max-w-screen-2xl px-4 py-8 mx-auto sm:py-12 lg:px-8">
                    <header className="text-center">
                        <h2 className="text-xl font-bold text-accent sm:text-3xl">
                            Nueva Colección
                        </h2>
                        <p className="max-w-lg mx-auto mt-4 text-gray-500">
                            Descubre nuestra última colección de productos exclusivos, y mejora tu estilo.
                        </p>
                    </header>
                    <div className="max-w-screen-2xl px-4 py-8 mx-auto sm:py-12 lg:px-8">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
                            <div className="grid p-6 bg-gray-300 rounded place-content-center sm:p-8">
                                <div className="max-w-md mx-auto text-center lg:text-left">
                                    <header>
                                        <h2 className="text-xl font-bold text-accent sm:text-3xl">
                                            {product.Título}
                                        </h2>
                                        <p className="mt-4 text-gray-500">
                                            {product.Descripción}
                                        </p>
                                        <p className="mt-1 text-lg mb-10 text-primary">
                                            $ {formatPrice(product.Precio)} c/u
                                        </p>
                                    </header>

                                    <Link href={'/products'} class="rounded-lg border border-gray-300 bg-white px-12 py-3 text-center 
                                    text-md font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring
                                     focus:ring-gray-100 hover:border-secondary">Comprar Todo</Link>
                                </div>
                            </div>
                            <div className="lg-col-span-2 lg:py-8">
                                <ul className="grid grid-cols-2 gap-4">
                                    <li>
                                        <div className="block group">
                                            <img src={product.Imagenes[0]} alt="product" className="object-cover w-full rounded aspect-square" />
                                        </div>
                                    </li>
                                    <li>
                                        <div className="block group">
                                            <img src={product.Imagenes[1]} alt="product" className="object-cover w-full rounded aspect-square" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    }

}