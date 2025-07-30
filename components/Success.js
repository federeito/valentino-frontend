import Link from "next/link";
export default function Success() {
return <>

<div className="flex items-center justify-center h-screen">
<div class="h-80">
  <div >
    <div class="flex justify-center">
      <button class="rounded-lg border border-primary bg-primary px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">Toggle Modal</button>
    </div>
    <div  class="fixed inset-0 z-10 bg-secondary-700/50"></div>
    <div  class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div class="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-xl">
        <div class="relative p-6">
          <div class="flex gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-secondary-900">Pedido Realizado</h3>
              <div class="mt-2 text-sm text-secondary-500">Su pedido se ha realizado, le informaremos sobre los datos de entrega</div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Link href='/products' type="button" class="rounded-lg border border-primary bg-primary px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300">Continuar Comprando</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

</>
}