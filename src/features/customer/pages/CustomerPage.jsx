import { useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import customerIcon from '../../../assets/img/icon/customer_icon.png'

const initialCustomers = [
  {
    id: 1,
    name: 'Budi Santoso',
    npwp: '12.345.678.9-123.000',
    address: 'Jl. Ijen No. 12, Malang',
  },
  {
    id: 2,
    name: 'Siti Aminah',
    npwp: '98.765.432.1-098.000',
    address: 'Jl. Soekarno Hatta No. 45, Malang',
  },
  {
    id: 3,
    name: 'Aditya Pratama',
    npwp: '45.678.901.2-345.000',
    address: 'Jl. Veteran No. 8, Malang',
  },
  {
    id: 4,
    name: 'Rina Melati',
    npwp: '87.654.321.0-876.000',
    address: 'Jl. Kawi No. 21, Malang',
  },
  {
    id: 5,
    name: 'Agus Wijaya',
    npwp: '23.456.789.0-234.000',
    address: 'Jl. MT Haryono No. 112, Malang',
  },
  {
    id: 6,
    name: 'Dewi Lestari',
    npwp: '76.543.210.9-765.000',
    address: 'Jl. Tlogomas No. 50, Malang',
  },
]

const CustomerPage = () => {
  const [customers, setCustomers] = useState(initialCustomers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [formData, setFormData] = useState({ name: '', npwp: '', address: '' })
  const [formError, setFormError] = useState('')

  const handleEdit = (id) => {
    const customer = customers.find((item) => item.id === id)
    window.alert(`Edit customer: ${customer.name}`)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setFormError('')
  }

  const closeForm = () => {
    setIsFormClosing(true)
    window.setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setFormData({ name: '', npwp: '', address: '' })
      setFormError('')
    }, 360)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.npwp.trim() || !formData.address.trim()) {
      setFormError('Kolom tidak boleh kosong')
      return
    }

    setCustomers((currentCustomers) => [
      ...currentCustomers,
      { id: Date.now(), ...formData },
    ])
    closeForm()
  }

  const columns = [
    { key: 'name', label: 'Nama Customer' },
    { key: 'npwp', label: 'No. NPWP' },
    { key: 'address', label: 'Alamat' },
  ]

  return (
    <main className="ml-64 min-h-screen bg-white px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-9 w-9 bg-[#51448C]"
          style={{
            maskImage: `url(${customerIcon})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskImage: `url(${customerIcon})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
          }}
        />
        <h1 className="text-3xl font-bold text-[#51448C]">DATA CUSTOMER</h1>
      </div>

      <section className="rounded-2xl border border-[#d9d9df] bg-[#f5f5f6] p-4 shadow-sm">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="mb-3 rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-sm font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff]"
        >
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#51448C] text-xs font-bold text-white">+</span>
          Tambah Data
        </button>

        <DataTable
          columns={columns}
          data={customers}
          actionLabel="Action"
          tableClassName="text-sm"
          actions={(row) => (
            <button
              type="button"
              onClick={() => handleEdit(row.id)}
              className="rounded-md bg-[#51448C] px-2 py-1 text-xs font-medium text-white transition hover:bg-[#433878]"
            >
              <span aria-hidden="true" className="mr-1">↗</span>
              Edit
            </button>
          )}
        />
      </section>

      {isFormOpen && (
        <div className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 ${isFormClosing ? 'modal-backdrop-closing' : ''}`}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
            className={`modal-panel w-full max-w-md rounded-xl bg-[#f7f7f7] p-5 shadow-[0_5px_18px_rgba(0,0,0,0.18)] ${isFormClosing ? 'modal-panel-closing' : ''}`}
          >
            <div className="mb-1 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-8 w-8 bg-[#51448C]"
                  style={{
                    maskImage: `url(${customerIcon})`,
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskImage: `url(${customerIcon})`,
                    WebkitMaskPosition: 'center',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                  }}
                />
                <h2 id="customer-form-title" className="text-lg font-bold text-[#51448C]">
                  INPUT &amp; EDIT DATA CUSTOMER
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Tutup form"
                className="text-2xl leading-none text-[#51448C] transition hover:text-[#33295f]"
              >
                ×
              </button>
            </div>

            <p className="mb-2 text-[10px] text-black">Silahkan masukkan data diri customer</p>

            <form onSubmit={handleSubmit}>
              <label className="mb-1 block text-xs text-black" htmlFor="customer-name">Nama</label>
              <input
                id="customer-name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Masukkan nama"
                className="mb-2.5 h-8 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              <label className="mb-1 block text-xs text-black" htmlFor="customer-npwp">No. NPWP</label>
              <input
                id="customer-npwp"
                name="npwp"
                value={formData.npwp}
                onChange={handleFormChange}
                placeholder="Masukkan No. NPWP"
                className="mb-2.5 h-8 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              <label className="mb-1 block text-xs text-black" htmlFor="customer-address">Alamat</label>
              <input
                id="customer-address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Masukkan alamat"
                className="h-8 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {formError && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  <span aria-hidden="true" className="mr-1">⚠</span>{formError}
                </p>
              )}

              <button
                type="submit"
                className="mt-2.5 rounded-md bg-[#51448C] px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-[#433878]"
              >
                <span aria-hidden="true" className="mr-1">▣</span>
                Simpan Data
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default CustomerPage
