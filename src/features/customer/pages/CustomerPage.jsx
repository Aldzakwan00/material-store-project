import { useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import customerIcon from '../../../assets/img/icon/customer_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

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
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    npwp: '',
    address: '',
  })
  const [formError, setFormError] = useState('')

  const handleEdit = (id) => {
    const customer = customers.find((item) => item.id === id)

    if (customer) {
      setEditingId(customer.id)

      setFormData({
        name: customer.name,
        npwp: customer.npwp,
        address: customer.address,
      })

      setFormError('')
      setIsFormOpen(true)
    }
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setFormError('')
  }

  const closeForm = () => {
    setIsFormClosing(true)

    window.setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)

      setFormData({
        name: '',
        npwp: '',
        address: '',
      })

      setFormError('')
    }, 360)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.npwp.trim() ||
      !formData.address.trim()
    ) {
      setFormError('Kolom tidak boleh kosong')
      return
    }

    if (editingId !== null) {
      // Mode Edit
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === editingId
            ? {
                ...customer,
                ...formData,
              }
            : customer
        )
      )
    } else {
      // Mode Tambah
      setCustomers((currentCustomers) => [
        ...currentCustomers,
        {
          id: Date.now(),
          ...formData,
        },
      ])
    }

    closeForm()
  }

  const columns = [
    {
      key: 'name',
      label: 'Nama Customer',
    },
    {
      key: 'npwp',
      label: 'No. NPWP',
    },
    {
      key: 'address',
      label: 'Alamat',
    },
  ]

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-8 lg:py-10">

      {/* HEADER */}
      <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-9 sm:w-9"
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

        <h1 className="text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DATA CUSTOMER
        </h1>
      </div>

      {/* TABLE CONTAINER */}
      <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">

        {/* ADD BUTTON */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Button Tambah Data */}
          <button
            type="button"
            onClick={() => {
              setEditingId(null)

              setFormData({
                name: '',
                npwp: '',
                address: '',
              })

              setFormError('')
              setIsFormOpen(true)
            }}
            className="inline-flex items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-sm font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff]"
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#51448C] text-sm font-bold text-white">
              +
            </span>

            Tambah Data
          </button>

          {/* Search */}
          <div className="w-48">
            <div className="flex items-center rounded-md border border-[#e0e0e5] bg-white px-3">
              {/* Icon Search */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#51448C]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                />
              </svg>

              {/* Search */}
              <div className="group relative ml-2">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-20 bg-transparent text-sm text-[#51448C] outline-none placeholder:text-[#51448C]"
                />

                {/* Garis hanya di bawah tulisan Search */}
                <span className="absolute bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#51448C] transition-all duration-300 group-focus-within:w-full" />
              </div>
            </div>
          </div>
        </div>
        

        {/* TABLE WRAPPER */}
        <div className="w-full overflow-x-auto">
          <DataTable
            columns={columns}
            data={customers}
            actionLabel="Action"
            tableClassName="text-xs sm:text-sm min-w-[650px]"
            actions={(row) => (
              <button
                type="button"
                onClick={() => handleEdit(row.id)}
                className="flex items-center whitespace-nowrap rounded-md bg-[#51448C] px-2 py-1 text-xs font-medium text-white transition hover:bg-[#433878]"
              >
                <img
                  src={editIcon}
                  alt=""
                  className="mr-2 h-3.5 w-3.5 object-contain"
                />
                Edit
              </button>
            )}
          />
        </div>
      </section>

      {/* MODAL */}
      {isFormOpen && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 ${
            isFormClosing ? 'modal-backdrop-closing' : ''
          }`}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
            className={`modal-panel w-full max-w-md rounded-xl bg-[#f7f7f7] p-4 shadow-[0_5px_18px_rgba(0,0,0,0.18)] sm:p-5 ${
              isFormClosing ? 'modal-panel-closing' : ''
            }`}
          >

            {/* MODAL HEADER */}
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">

                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-8 sm:w-8"
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

                <h2
                  id="customer-form-title"
                  className="text-sm font-bold leading-tight text-[#51448C] sm:text-lg"
                >
                  INPUT &amp; EDIT DATA CUSTOMER
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Tutup form"
                className="shrink-0 text-2xl leading-none text-[#51448C] transition hover:text-[#33295f]"
              >
                ×
              </button>
            </div>

            <p className="mb-3 text-[10px] text-black sm:mb-2">
              Silahkan masukkan data diri customer
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="customer-name"
              >
                Nama
              </label>

              <input
                id="customer-name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Masukkan nama"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* NPWP */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="customer-npwp"
              >
                No. NPWP
              </label>

              <input
                id="customer-npwp"
                name="npwp"
                value={formData.npwp}
                onChange={handleFormChange}
                placeholder="Masukkan No. NPWP"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* ADDRESS */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="customer-address"
              >
                Alamat
              </label>

              <input
                id="customer-address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Masukkan alamat"
                className="h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* ERROR */}
              {formError && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  <span aria-hidden="true" className="mr-1">
                    ⚠
                  </span>
                  {formError}
                </p>
              )}

              {/* SAVE BUTTON */}
              <button
                type="submit"
                className="mt-3 flex items-center rounded-md bg-[#51448C] px-3 py-2 text-[10px] font-medium text-white transition hover:bg-[#433878]"
              >
                <img
                  src={saveIcon}
                  alt=""
                  className="mr-2 h-3.5 w-3.5 object-contain"
                />

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
