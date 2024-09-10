import Link from "next/link"

export default function Page404() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-800">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#5F33E2] dark:text-gray-50 sm:text-5xl">
          Oops! Não encontramos essa Página.
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Parece que a página que você está procurando não existe.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-[#5F33E2] px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#4d329d] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            prefetch={false}
          >
            Voltar a Página Principal
          </Link>
        </div>
      </div>
    </div>
  )
}