import Sidebar from '../../../components/layout/Sidebar'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f5fb]">
      <Sidebar />

      <main className="ml-56 min-h-screen flex-1 px-8 py-7">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#79549d]">Senin, 20 September 2026</p>
            <h1 className="text-3xl font-bold text-[#24113c]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#24113c]">3AS</p>
              <p className="text-xs text-[#907ca2]">Administrator</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7000ff] text-sm font-bold text-white shadow-lg shadow-purple-200">
              3AS
            </div>
          </div>
        </header>

        <section className="mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4c00a8] via-[#7000ff] to-[#9b4dff] px-7 py-8 text-white shadow-xl shadow-purple-200">
          <p className="mb-2 text-sm font-medium text-purple-100">Ringkasan toko hari ini</p>
          <h2 className="mb-2 text-2xl font-bold">Selamat datang kembali, Admin.</h2>
          <p className="max-w-xl text-sm leading-6 text-purple-100">
            Pantau data material, proyek, dan pengiriman dari satu tempat.
          </p>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#907ca2]">Total customer</p>
            <p className="mt-3 text-3xl font-bold text-[#24113c]">128</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">+12% bulan ini</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#907ca2]">Material tersedia</p>
            <p className="mt-3 text-3xl font-bold text-[#24113c]">64</p>
            <p className="mt-2 text-xs font-medium text-[#7000ff]">5 kategori aktif</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#907ca2]">Proyek berjalan</p>
            <p className="mt-3 text-3xl font-bold text-[#24113c]">18</p>
            <p className="mt-2 text-xs font-medium text-amber-600">3 perlu perhatian</p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-[#907ca2]">Surat jalan</p>
            <p className="mt-3 text-3xl font-bold text-[#24113c]">42</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">9 dikirim hari ini</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#24113c]">Aktivitas terbaru</h2>
                <p className="mt-1 text-sm text-[#907ca2]">Perubahan terakhir di toko</p>
              </div>
              <button className="text-sm font-semibold text-[#7000ff] hover:text-[#4c00a8]">Lihat semua</button>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#24113c]">Surat jalan baru dibuat</p>
                  <p className="text-xs text-[#907ca2]">SJ-0248 untuk Proyek IKN</p>
                </div>
                <span className="text-xs text-[#907ca2]">10 mnt</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7000ff]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#24113c]">Material diperbarui</p>
                  <p className="text-xs text-[#907ca2]">Sawit Bubuk 50 kg</p>
                </div>
                <span className="text-xs text-[#907ca2]">1 jam</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#24113c]">Customer baru ditambahkan</p>
                  <p className="text-xs text-[#907ca2]">Fufu Fafa</p>
                </div>
                <span className="text-xs text-[#907ca2]">3 jam</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-purple-100 bg-[#24113c] p-6 text-white shadow-sm">
            <p className="mb-2 text-sm text-purple-200">Status pengiriman</p>
            <h2 className="text-xl font-bold">Pengiriman hari ini</h2>
            <div className="mt-7 flex items-end justify-between">
              <p className="text-5xl font-bold">9</p>
              <p className="pb-1 text-sm text-purple-200">dari 12 surat jalan</p>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-purple-950">
              <div className="h-full w-3/4 rounded-full bg-[#b77aff]" />
            </div>
            <p className="mt-4 text-xs text-purple-200">75% pengiriman sudah selesai</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
