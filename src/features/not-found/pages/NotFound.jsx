const NotFound = () => {
  return (
    <main className="ml-64 flex min-h-screen items-center justify-center bg-[#f7f5fb] px-8 py-12">
        <section className="w-full max-w-xl rounded-2xl border border-purple-100 bg-white px-8 py-12 text-center shadow-sm">
          <p className="text-7xl font-bold text-[#7000ff]">404</p>
          <h1 className="mt-4 text-2xl font-bold text-[#24113c]">Halaman belum tersedia</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#907ca2]">
            Halaman ini masih dalam tahap pengembangan. Gunakan menu di sidebar untuk berpindah ke halaman lain.
          </p>
        </section>
    </main>
  )
}

export default NotFound
