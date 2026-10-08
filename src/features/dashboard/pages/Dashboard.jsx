import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const menuGroups = [
    {
      title: 'Master Data',
      description: 'Kelola data utama yang digunakan dalam sistem.',
      items: [
        {
          title: 'Data Material',
          description: 'Kelola data material dan harga barang.',
          path: '/data-material',
        },
        {
          title: 'Data Driver',
          description: 'Kelola data driver dan kendaraan.',
          path: '/data-driver',
        },
        {
          title: 'Data Customer',
          description: 'Kelola data customer.',
          path: '/data-customer',
        },
        {
          title: 'Data Proyek',
          description: 'Kelola data proyek customer.',
          path: '/data-project',
        },
      ],
    },
    {
      title: 'Transaksi',
      description: 'Kelola proses transaksi dan penagihan.',
      items: [
        {
          title: 'Input Surat Jalan',
          description: 'Buat dan kelola surat jalan.',
          path: '/surat-jalan',
        },
        {
          title: 'Nota Tagihan',
          description: 'Kelola nota dan proses penagihan.',
          path: '/nota-tagihan',
        },
      ],
    },
    {
      title: 'Laporan',
      description: 'Lihat informasi dan rekapitulasi transaksi.',
      items: [
        {
          title: 'Laporan',
          description: 'Lihat berbagai laporan transaksi.',
          path: '/laporan-nota-tagihan',
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-[#f7f5fb] lg:ml-64">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Header */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-[#51448C] shadow-sm">
          <div className="relative px-6 py-8 sm:px-8">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-white/5" />

            <div className="relative">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                Dashboard
              </span>

              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Selamat Datang 👋
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                Akses dan kelola data, transaksi, serta laporan
                melalui menu yang tersedia.
              </p>
            </div>
          </div>
        </section>

        {/* Akses Cepat */}
        <section className="mb-9">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2d2340]">
              Akses Cepat
            </h2>

            <p className="mt-1 text-sm text-[#8c8298]">
              Menu yang sering digunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAccessCard
              number="01"
              title="Input Surat Jalan"
              description="Buat surat jalan baru"
              onClick={() => navigate('/surat-jalan')}
              primary
            />

            <QuickAccessCard
              number="02"
              title="Nota Tagihan"
              description="Kelola nota tagihan"
              onClick={() => navigate('/nota-tagihan')}
            />

            <QuickAccessCard
              number="03"
              title="Data Customer"
              description="Kelola data customer"
              onClick={() => navigate('/data-customer')}
            />

            <QuickAccessCard
              number="04"
              title="Laporan"
              description="Lihat laporan transaksi"
              onClick={() => navigate('/laporan-nota-tagihan')}
            />

          </div>
        </section>

        {/* Semua Fitur */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#2d2340]">
              Semua Fitur
            </h2>

            <p className="mt-1 text-sm text-[#8c8298]">
              Akses seluruh menu yang tersedia pada sistem.
            </p>
          </div>

          <div className="space-y-8">
            {menuGroups.map((group) => (
              <div key={group.title}>

                {/* Group Header */}
                <div className="mb-4 flex items-start gap-3">
                  <div className="mt-1 h-5 w-1 shrink-0 rounded-full bg-[#51448C]" />

                  <div>
                    <h3 className="text-base font-semibold text-[#302642]">
                      {group.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-[#968ca2]">
                      {group.description}
                    </p>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((item, index) => (
                    <FeatureCard
                      key={item.path}
                      number={String(index + 1).padStart(2, '0')}
                      title={item.title}
                      description={item.description}
                      onClick={() => navigate(item.path)}
                    />
                  ))}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-10 border-t border-[#e6e1ed] pt-5 text-center">
          <p className="text-xs text-[#a198aa]">
            ADI KARYA UTAMA
          </p>
        </div>

      </div>
    </main>
  )
}


/* =========================================================
   QUICK ACCESS CARD
========================================================= */

const QuickAccessCard = ({
  number,
  title,
  description,
  onClick,
  primary = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative min-h-[125px] w-full overflow-hidden rounded-xl border p-5 text-left transition-all duration-200 ${
        primary
          ? 'border-[#51448C] bg-[#51448C] shadow-sm hover:-translate-y-0.5 hover:bg-[#463b7c] hover:shadow-md'
          : 'border-[#e5e0eb] bg-white hover:-translate-y-0.5 hover:border-[#cfc7e0] hover:shadow-md'
      }`}
    >

      {/* Number */}
      <span
        className={`text-xs font-semibold tracking-wider ${
          primary
            ? 'text-white/50'
            : 'text-[#aaa1b4]'
        }`}
      >
        {number}
      </span>

      <h3
        className={`mt-4 text-sm font-bold ${
          primary
            ? 'text-white'
            : 'text-[#302642]'
        }`}
      >
        {title}
      </h3>

      <p
        className={`mt-1 text-xs ${
          primary
            ? 'text-white/65'
            : 'text-[#92889f]'
        }`}
      >
        {description}
      </p>

      {/* Arrow */}
      <span
        className={`absolute bottom-5 right-5 text-lg transition-transform duration-200 group-hover:translate-x-1 ${
          primary
            ? 'text-white/70'
            : 'text-[#51448C]'
        }`}
      >
        →
      </span>

    </button>
  )
}


/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  number,
  title,
  description,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[105px] w-full flex-col rounded-xl border border-[#e5e0eb] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cfc7e0] hover:shadow-md"
    >

      {/* Top */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-[#aaa1b4]">
          {number}
        </span>

        <span className="text-sm text-[#b4acbb] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#51448C]">
          →
        </span>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[#302642]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#968ca2]">
          {description}
        </p>
      </div>

    </button>
  )
}

export default Dashboard