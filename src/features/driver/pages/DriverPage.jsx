import { useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import driverIcon from '../../../assets/img/icon/driver_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

const initialDrivers = [
  {
    id: 1,
    code: 'D-142',
    name: 'Slamet Riyadi',
    plateNumber: 'N 1245 AB',
    address: 'Jl. Panglima Sudirman 15, Malang',
    delivery: 10,
  },
  {
    id: 2,
    code: 'D-287',
    name: 'Asep Hidayat',
    plateNumber: 'N 8731 CD',
    address: 'Jl. Raya Langsep 42, Malang',
    delivery: 20,
  },
  {
    id: 3,
    code: 'D-415',
    name: 'Eko Prasetyo',
    plateNumber: 'N 452 EF',
    address: 'Jl. Candi Panggung 9, Malang',
    delivery: 12,
  },
  {
    id: 4,
    code: 'D-639',
    name: 'Yudi Hermawan',
    plateNumber: 'N 9088 GH',
    address: 'Jl. Danau Toba 101, Malang',
    delivery: 23,
  },
  {
    id: 5,
    code: 'D-791',
    name: 'Joko Sutopo',
    plateNumber: 'N 3341 IJ',
    address: 'Jl. Raya Tidar 77, Malang',
    delivery: 14,
  },
  {
    id: 6,
    code: 'D-904',
    name: 'Suwarto Pradana',
    plateNumber: 'N 762 KL',
    address: 'Jl. Pahlawan Trip 25, Malang',
    delivery: 8,
  },
]

const DriverPage = () => {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    plateNumber: '',
    address: '',
    delivery: '',
  })

  const [formError, setFormError] = useState('')

  const getNextDriverCode = () => {
    if (drivers.length === 0) {
      return 'D-001'
    }

    const lastNumber = Math.max(
      ...drivers.map((driver) =>
        Number(driver.code.replace('D-', ''))
      )
    )

    return `D-${String(lastNumber + 1).padStart(3, '0')}`
  }

    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
    })

    const [appliedFilter, setAppliedFilter] = useState({
    startDate: '',
    endDate: '',
    })

    const handleApplyFilter = () => {
        setAppliedFilter(filterData)
    }


  const handleEdit = (id) => {
    const driver = drivers.find((item) => item.id === id)

    if (driver) {
        setEditingId(driver.id)

        setFormData({
        code: driver.code,
        name: driver.name,
        plateNumber: driver.plateNumber,
        address: driver.address,
        delivery: String(driver.delivery),
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
      code: '',
      name: '',
      plateNumber: '',
      address: '',
      delivery: '',
    })

    setFormError('')
  }, 360)
}

  const handleSubmit = (event) => {
  event.preventDefault()

  if (
    !formData.code.trim() ||
    !formData.name.trim() ||
    !formData.plateNumber.trim() ||
    !formData.address.trim() ||
    !formData.delivery.trim()
  ) {
    setFormError('Kolom tidak boleh kosong')
    return
  }

  if (editingId !== null) {
    // Mode Edit
    setDrivers((currentDrivers) =>
      currentDrivers.map((driver) =>
        driver.id === editingId
          ? {
              ...driver,
              ...formData,
              delivery: Number(formData.delivery),
            }
          : driver
      )
    )
  } else {
    // Mode Tambah
    setDrivers((currentDrivers) => [
      ...currentDrivers,
      {
        id: Date.now(),
        ...formData,
        delivery: Number(formData.delivery),
      },
    ])
  }

  closeForm()
}

  const columns = [
    {
      key: 'code',
      label: 'Kode Driver',
    },
    {
      key: 'name',
      label: 'Nama Driver',
    },
    {
      key: 'plateNumber',
      label: 'No. Plat Mobil',
    },
    {
      key: 'address',
      label: 'Alamat',
    },
    {
      key: 'delivery',
      label: 'Pengantaran',
    },
  ]

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-8 lg:py-10">

      {/* Header */}
      <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-9 sm:w-9"
          style={{
            maskImage: `url(${driverIcon})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskImage: `url(${driverIcon})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
          }}
        />

        <h1 className="text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DATA DRIVER
        </h1>
      </div>

        {/* Table Section */}
        <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">

        {/* Top Action */}
        <div className="mb-3 flex items-start justify-between gap-3">

            {/* Tambah Data */}
            <button
            type="button"
            onClick={() => {
            setEditingId(null)

            setFormData({
                code: getNextDriverCode(),
                name: '',
                plateNumber: '',
                address: '',
                delivery: '',
            })

            setFormError('')
            setIsFormOpen(true)
            }}
            className="inline-flex shrink-0 items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] sm:text-sm"
            >
            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#51448C] text-xs font-bold text-white">
                +
            </span>

            Tambah Data
            </button>

            {/* Filter */}
            <button
            type="button"
            onClick={() => setIsFilterOpen((current) => !current)}
            className="inline-flex shrink-0 items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] sm:text-sm"
            >
            <span className="mr-2">
                ⚙
            </span>

            Filter
            </button>
        </div>

        {/* Filter Form */}
        {isFilterOpen && (
            <div className="mb-4 rounded-lg border border-[#dedee5] bg-white p-3 sm:p-4">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {/* Tanggal Mulai */}
                <div>
                <label
                    htmlFor="start-date"
                    className="mb-1.5 block text-xs font-medium text-black"
                >
                    Tanggal Mulai
                </label>

                <input
                    id="start-date"
                    type="date"
                    value={filterData.startDate}
                    onChange={(event) =>
                    setFilterData((current) => ({
                        ...current,
                        startDate: event.target.value,
                    }))
                    }
                    className="h-9 w-full rounded-lg border border-[#d9d9df] bg-white px-3 text-xs text-black outline-none ring-[#51448C] focus:ring-2"
                />
                </div>

                {/* Tanggal Sampai */}
                <div>
                <label
                    htmlFor="end-date"
                    className="mb-1.5 block text-xs font-medium text-black"
                >
                    Tanggal Sampai
                </label>

                <input
                    id="end-date"
                    type="date"
                    value={filterData.endDate}
                    onChange={(event) =>
                    setFilterData((current) => ({
                        ...current,
                        endDate: event.target.value,
                    }))
                    }
                    className="h-9 w-full rounded-lg border border-[#d9d9df] bg-white px-3 text-xs text-black outline-none ring-[#51448C] focus:ring-2"
                />
                </div>
            </div>

            {/* Terapkan */}
            <div className="mt-3">
                <button
                type="button"
                onClick={handleApplyFilter}
                className="rounded-md bg-[#51448C] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#433878]"
                >
                Terapkan
                </button>
            </div>
            </div>
        )}

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto">
            <DataTable
            columns={columns}
            data={drivers}
            actionLabel="Action"
            tableClassName="min-w-[800px] text-xs sm:text-sm"
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


      {/* Modal Form */}
      {isFormOpen && (
        <div
          className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/10 px-4 py-4 ${
            isFormClosing ? 'modal-backdrop-closing' : ''
          }`}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="driver-form-title"
            className={`modal-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-[#f7f7f7] p-4 shadow-[0_5px_18px_rgba(0,0,0,0.18)] sm:p-5 ${
              isFormClosing ? 'modal-panel-closing' : ''
            }`}
          >

            {/* Modal Header */}
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">

                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-8 sm:w-8"
                  style={{
                    maskImage: `url(${driverIcon})`,
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskImage: `url(${driverIcon})`,
                    WebkitMaskPosition: 'center',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                  }}
                />

                <h2
                  id="driver-form-title"
                  className="text-sm font-bold leading-tight text-[#51448C] sm:text-lg"
                >
                  INPUT &amp; EDIT DATA DRIVER
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
              Silahkan masukkan data driver
            </p>

            <form onSubmit={handleSubmit}>

              {/* Kode Driver */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="driver-code"
              >
                Kode Driver
              </label>

              <input
                id="driver-code"
                name="code"
                value={formData.code}
                readOnly
                className="mb-2.5 h-9 w-full cursor-not-allowed rounded-lg border-0 bg-[#eeeeee] px-3 text-xs text-[#707070] outline-none"
              />

              {/* Nama Driver */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="driver-name"
              >
                Nama Driver
              </label>

              <input
                id="driver-name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Masukkan nama driver"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* No Plat */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="driver-plate"
              >
                No. Plat Mobil
              </label>

              <input
                id="driver-plate"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleFormChange}
                placeholder="Masukkan nomor plat mobil"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* Alamat */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="driver-address"
              >
                Alamat
              </label>

              <input
                id="driver-address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Masukkan alamat"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* Pengantaran */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="driver-delivery"
              >
                Pengantaran
              </label>

              <input
                id="driver-delivery"
                name="delivery"
                type="number"
                min="0"
                value={formData.delivery}
                onChange={handleFormChange}
                placeholder="Masukkan jumlah pengantaran"
                className="h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

              {/* Error */}
              {formError && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  <span aria-hidden="true" className="mr-1">
                    ⚠
                  </span>
                  {formError}
                </p>
              )}

              {/* Submit */}
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

export default DriverPage
