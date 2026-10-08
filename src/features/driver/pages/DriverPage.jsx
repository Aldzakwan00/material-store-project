import { useEffect, useState } from 'react'
import DataTable from '../../../components/table/DataTable'

import driverIcon from '../../../assets/img/icon/driver_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

import {
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} from '../../../services/DriverServices'

import Swal from 'sweetalert2'

const DriverPage = () => {
  // ========================================
  // DATA
  // ========================================

  const [drivers, setDrivers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ========================================
  // MODAL
  // ========================================

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // ========================================
  // SEARCH
  // ========================================

  const [search, setSearch] = useState('')

  // ========================================
  // FILTER
  // ========================================

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
  })

  const [appliedFilter, setAppliedFilter] = useState({
    startDate: '',
    endDate: '',
  })

  // ========================================
  // FORM
  // ========================================

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    plateNumber: '',
    address: '',
    delivery: '',
  })

  const [formError, setFormError] = useState('')

  // ========================================
  // GET DATA
  // ========================================

  const fetchDrivers = async () => {
    try {
      setIsLoading(true)

      const response = await getDriver()

      const driverData = Array.isArray(response)
        ? response
        : response?.items || []

      const formattedDrivers = driverData.map((driver) => ({
        id: driver.id,

        code: driver.kode || '',

        name: driver.nama_supir || '',

        plateNumber: driver.no_plat_mobil || '',

        address: driver.alamat || '',

        delivery: Number(driver.jumlah_pengantaran || 0),

        // ====================================
        // SIMPAN TANGGAL DARI API
        // ====================================
        date:
          driver.tanggal ||
          driver.created_at ||
          driver.tanggal_dibuat ||
          driver.created_at_date ||
          '',
      }))

      setDrivers(formattedDrivers)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message,
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  // ========================================
  // FILTER
  // ========================================

  const handleOpenFilter = () => {
    setFilterData(appliedFilter)
    setIsFilterOpen(true)
  }

  const handleCloseFilter = () => {
    setFilterData(appliedFilter)
    setIsFilterOpen(false)
  }

  const handleResetFilter = () => {
    const emptyFilter = {
      startDate: '',
      endDate: '',
    }

    setFilterData(emptyFilter)
    setAppliedFilter(emptyFilter)
    setIsFilterOpen(false)
  }

  const handleApplyFilter = () => {
    const { startDate, endDate } = filterData

    // ======================================
    // VALIDASI TANGGAL
    // ======================================

    if (startDate && endDate && startDate > endDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Tanggal Tidak Valid',
        text: 'Tanggal mulai tidak boleh lebih besar dari tanggal sampai.',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })

      return
    }

    setAppliedFilter({
      startDate,
      endDate,
    })

    setIsFilterOpen(false)
  }

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (id) => {
    const driver = drivers.find((item) => item.id === id)

    if (!driver) return

    setEditingId(driver.id)

    setFormData({
      code: driver.code,
      name: driver.name,
      plateNumber: driver.plateNumber,
      address: driver.address,
      delivery: String(driver.delivery),
    })

    setFormError('')
    setIsFormClosing(false)
    setIsFormOpen(true)
  }

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setFormError('')
  }

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const handleOpenAddForm = () => {
    setEditingId(null)

    setFormData({
      code: '',
      name: '',
      plateNumber: '',
      address: '',
      delivery: '',
    })

    setFormError('')
    setIsFormClosing(false)
    setIsFormOpen(true)
  }

  // ========================================
  // CLOSE FORM
  // ========================================

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

  // ========================================
  // CREATE / UPDATE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.plateNumber.trim() ||
      !formData.address.trim()
    ) {
      setFormError('Kolom tidak boleh kosong')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        nama_supir: formData.name.trim(),
        no_plat_mobil: formData.plateNumber.trim(),
        alamat: formData.address.trim(),
        jumlah_pengantaran: Number(formData.delivery || 0),
      }

      // UPDATE
      if (editingId !== null) {
        await updateDriver(editingId, payload)

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data driver berhasil diperbarui',
          confirmButtonText: 'OKE',
          confirmButtonColor: '#51448C',
        })
      }

      // CREATE
      else {
        await createDriver(payload)

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data driver berhasil ditambahkan',
          confirmButtonText: 'OKE',
          confirmButtonColor: '#51448C',
        })
      }

      await fetchDrivers()

      closeForm()
    } catch (error) {
      if (
        error.status === 409 ||
        error.message?.toLowerCase().includes('plat') ||
        error.message?.toLowerCase().includes('no_plat') ||
        error.message?.toLowerCase().includes('nomor plat')
      ) {
        Swal.fire({
          icon: 'warning',
          title: 'No. Plat Sudah Ada',
          text: 'Nomor plat mobil tersebut sudah terdaftar.',
          confirmButtonText: 'OKE',
          confirmButtonColor: '#51448C',
        })

        return
      }

      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message || 'Gagal menyimpan data driver',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (id) => {
    const driver = drivers.find((item) => item.id === id)

    if (!driver) return

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus Data Driver?',
      html: `
        Data driver
        <strong>${driver.name}</strong>
        akan dihapus secara permanen.
      `,
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#51448C',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteDriver(id)

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data driver berhasil dihapus',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
        timer: 1500,
        showConfirmButton: false,
      })

      await fetchDrivers()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message || 'Gagal menghapus data driver',
        confirmButtonColor: '#51448C',
      })
    }
  }

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredDrivers = drivers.filter((driver) => {
    // ======================================
    // SEARCH
    // ======================================

    const keyword = search.toLowerCase().trim()

    const code = String(driver.code || '').toLowerCase()
    const name = String(driver.name || '').toLowerCase()
    const plateNumber = String(
      driver.plateNumber || '',
    ).toLowerCase()
    const address = String(
      driver.address || '',
    ).toLowerCase()

    const matchesSearch =
      !keyword ||
      code.includes(keyword) ||
      name.includes(keyword) ||
      plateNumber.includes(keyword) ||
      address.includes(keyword)

    if (!matchesSearch) {
      return false
    }

    // ======================================
    // FILTER TANGGAL
    // ======================================

    const { startDate, endDate } = appliedFilter

    // Tidak ada filter tanggal
    if (!startDate && !endDate) {
      return true
    }

    // Driver tidak memiliki tanggal
    if (!driver.date) {
      return false
    }

    // Ambil bagian tanggal saja
    const driverDate = String(driver.date).slice(0, 10)

    // ======================================
    // FILTER TANGGAL MULAI
    // ======================================

    if (startDate && driverDate < startDate) {
      return false
    }

    // ======================================
    // FILTER TANGGAL SAMPAI
    // ======================================

    if (endDate && driverDate > endDate) {
      return false
    }

    return true
  })

  // ========================================
  // CEK FILTER AKTIF
  // ========================================

  const isFilterApplied =
    Boolean(appliedFilter.startDate) ||
    Boolean(appliedFilter.endDate)

  // ========================================
  // TABLE COLUMNS
  // ========================================

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

  // ========================================
  // RENDER
  // ========================================

  return (
    <main
      className="
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-white
        px-3
        py-5
        sm:px-5
        sm:py-6
        md:px-6
        lg:ml-64
        lg:w-[calc(100%-16rem)]
        lg:px-8
        lg:py-8
        xl:px-10
      "
    >
      {/* ==================================
          HEADER
      ================================== */}

      <div
        className="
          mb-5
          flex
          min-w-0
          items-center
          gap-2
          sm:mb-6
          sm:gap-3
        "
      >
        <span
          aria-hidden="true"
          className="
            h-7
            w-7
            shrink-0
            bg-[#51448C]
            sm:h-9
            sm:w-9
          "
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

        <h1
          className="
            min-w-0
            truncate
            text-lg
            font-bold
            text-[#51448C]
            sm:text-2xl
            lg:text-3xl
          "
        >
          DATA DRIVER
        </h1>
      </div>

      {/* ==================================
          TABLE SECTION
      ================================== */}

      <section
        className="
          relative
          z-10
          w-full
          min-w-0
          overflow-visible
          rounded-xl
          border
          border-[#d9d9df]
          bg-[#f5f5f6]
          p-3
          shadow-sm
          sm:rounded-2xl
          sm:p-4
          lg:p-5
        "
      >
        {/* =================================
            TOP ACTION
        ================================= */}

        <div
          className="
            relative
            z-50
            mb-4
            flex
            w-full
            min-w-0
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* TAMBAH DATA */}

          <button
            type="button"
            onClick={handleOpenAddForm}
            className="
              inline-flex
              h-10
              w-fit
              shrink-0
              items-center
              rounded-md
              border
              border-[#e0e0e5]
              bg-white
              px-3
              text-xs
              font-medium
              text-[#51448C]
              shadow-sm
              transition
              hover:bg-[#f8f6ff]
              active:scale-[0.98]
              sm:text-sm
            "
          >
            <span
              className="
                mr-2
                inline-flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#51448C]
                text-sm
                font-bold
                text-white
              "
            >
              +
            </span>

            Tambah Data
          </button>

          {/* FILTER + SEARCH */}

          <div
            className="
              relative
              z-50
              flex
              w-full
              min-w-0
              flex-col
              gap-2
              sm:w-auto
              sm:flex-row
              sm:items-center
            "
          >
            {/* FILTER */}

            <div className="relative z-[70] w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (isFilterOpen) {
                    handleCloseFilter()
                  } else {
                    handleOpenFilter()
                  }
                }}
                className={`
                  inline-flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  border
                  px-3
                  text-xs
                  font-medium
                  shadow-sm
                  transition-all
                  duration-200
                  sm:w-auto
                  sm:text-sm
                  ${
                    isFilterOpen || isFilterApplied
                      ? 'border-[#51448C] bg-[#51448C] text-white hover:bg-[#453a7a]'
                      : 'border-[#e0e0e5] bg-white text-[#51448C] hover:bg-[#f8f6ff]'
                  }
                `}
              >
                <span className="mr-2 text-sm">
                  {isFilterApplied ? '✓' : '⚙'}
                </span>

                {isFilterOpen ? 'Tutup Filter' : 'Filter'}

                {isFilterApplied && (
                  <span
                    className="
                      ml-2
                      inline-flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      px-1
                      text-[9px]
                      font-bold
                      text-[#51448C]
                    "
                  >
                    1
                  </span>
                )}
              </button>

              {/* ==================================
                  FILTER POPUP
              ================================== */}

              {isFilterOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-[999]
                    w-[calc(100vw-2rem)]
                    max-w-[450px]
                    min-w-0
                    rounded-xl
                    border
                    border-[#e0e0e5]
                    bg-white
                    p-4
                    shadow-[0_8px_30px_rgba(0,0,0,0.18)]
                  "
                >
                  {/* POPUP HEADER */}

                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#eeeeee]
                      pb-3
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-sm
                          font-bold
                          text-[#51448C]
                        "
                      >
                        Filter Data Driver
                      </h3>

                      <p className="mt-0.5 text-[10px] text-gray-500">
                        Pilih rentang tanggal data driver
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseFilter}
                      className="
                        text-xl
                        leading-none
                        text-gray-400
                        transition
                        hover:text-[#51448C]
                      "
                    >
                      ×
                    </button>
                  </div>

                  {/* DATE INPUT */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-end
                    "
                  >
                    {/* START DATE */}

                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="start-date"
                        className="
                          mb-1.5
                          block
                          text-[10px]
                          font-semibold
                          text-[#51448C]
                        "
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
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-[#dedee5]
                          bg-white
                          px-3
                          text-xs
                          text-[#555]
                          outline-none
                          transition
                          focus:border-[#51448C]
                          focus:ring-2
                          focus:ring-[#51448C]/10
                        "
                      />
                    </div>

                    {/* ARROW */}

                    <div
                      className="
                        hidden
                        shrink-0
                        pb-2
                        text-sm
                        font-bold
                        text-[#51448C]
                        sm:block
                      "
                    >
                      →
                    </div>

                    {/* END DATE */}

                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="end-date"
                        className="
                          mb-1.5
                          block
                          text-[10px]
                          font-semibold
                          text-[#51448C]
                        "
                      >
                        Tanggal Sampai
                      </label>

                      <input
                        id="end-date"
                        type="date"
                        value={filterData.endDate}
                        min={filterData.startDate || undefined}
                        onChange={(event) =>
                          setFilterData((current) => ({
                            ...current,
                            endDate: event.target.value,
                          }))
                        }
                        className="
                          h-10
                          w-full
                          rounded-lg
                          border
                          border-[#dedee5]
                          bg-white
                          px-3
                          text-xs
                          text-[#555]
                          outline-none
                          transition
                          focus:border-[#51448C]
                          focus:ring-2
                          focus:ring-[#51448C]/10
                        "
                      />
                    </div>
                  </div>

                  {/* BUTTON */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-end
                      gap-2
                      border-t
                      border-[#eeeeee]
                      pt-3
                    "
                  >
                    <button
                      type="button"
                      onClick={handleResetFilter}
                      className="
                        h-9
                        rounded-md
                        border
                        border-[#dedee5]
                        bg-white
                        px-3
                        text-xs
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-50
                      "
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={handleApplyFilter}
                      className="
                        h-9
                        rounded-md
                        bg-[#51448C]
                        px-4
                        text-xs
                        font-medium
                        text-white
                        transition
                        hover:bg-[#433878]
                        active:scale-[0.98]
                      "
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH */}

            <div
              className="
                flex
                h-10
                w-full
                min-w-0
                items-center
                rounded-md
                border
                border-[#e0e0e5]
                bg-white
                px-3
                shadow-sm
                transition-all
                duration-200
                focus-within:border-[#51448C]
                sm:w-48
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-[#51448C]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0Z"
                />
              </svg>

              <div className="group relative ml-2 min-w-0 flex-1">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    h-8
                    w-full
                    min-w-0
                    bg-transparent
                    text-sm
                    text-[#51448C]
                    outline-none
                    placeholder:text-[#51448C]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[1.5px]
                    w-0
                    rounded-full
                    bg-[#51448C]
                    transition-all
                    duration-300
                    group-focus-within:w-full
                  "
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================
            FILTER STATUS
        ================================== */}

        {isFilterApplied && (
          <div
            className="
              mb-3
              flex
              flex-wrap
              items-center
              gap-2
              rounded-lg
              border
              border-[#e4dcff]
              bg-[#f8f6ff]
              px-3
              py-2
            "
          >
            <span
              className="
                text-[10px]
                font-semibold
                text-[#51448C]
              "
            >
              Filter aktif:
            </span>

            {appliedFilter.startDate && (
              <span
                className="
                  rounded-md
                  bg-white
                  px-2
                  py-1
                  text-[10px]
                  text-[#51448C]
                  shadow-sm
                "
              >
                Dari: {appliedFilter.startDate}
              </span>
            )}

            {appliedFilter.endDate && (
              <span
                className="
                  rounded-md
                  bg-white
                  px-2
                  py-1
                  text-[10px]
                  text-[#51448C]
                  shadow-sm
                "
              >
                Sampai: {appliedFilter.endDate}
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilter}
              className="
                ml-auto
                text-[10px]
                font-semibold
                text-red-500
                transition
                hover:text-red-600
              "
            >
              Hapus Filter
            </button>
          </div>
        )}

        {/* ==================================
            TABLE
        ================================== */}

        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-[#51448C]">
              <div
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-[#51448C]
                  border-t-transparent
                "
              />

              Memuat data driver...
            </div>
          </div>
        ) : (
          <div
            className="
              relative
              z-0
              w-full
              min-w-0
              overflow-x-auto
              overflow-y-hidden
              rounded-lg
            "
          >
            <DataTable
              columns={columns}
              data={filteredDrivers}
              actionLabel="Action"
              tableClassName="
                min-w-[800px]
                text-xs
                sm:text-sm
              "
              actions={(row) => (
                <div className="flex items-center gap-2">
                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => handleEdit(row.id)}
                    className="
                      flex
                      items-center
                      whitespace-nowrap
                      rounded-md
                      bg-[#51448C]
                      px-2
                      py-1
                      text-xs
                      font-medium
                      text-white
                      transition
                      hover:bg-[#433878]
                    "
                  >
                    <img
                      src={editIcon}
                      alt=""
                      className="mr-2 h-3.5 w-3.5 object-contain"
                    />

                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() => handleDelete(row.id)}
                    className="
                      rounded-md
                      bg-red-500
                      px-2
                      py-1
                      text-xs
                      font-medium
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    Hapus
                  </button>
                </div>
              )}
            />
          </div>
        )}

        {/* ==================================
            EMPTY RESULT
        ================================== */}

        {!isLoading &&
          filteredDrivers.length === 0 && (
            <div
              className="
                py-8
                text-center
                text-xs
                text-gray-500
              "
            >
              Tidak ada data driver yang sesuai dengan pencarian atau filter.
            </div>
          )}
      </section>

      {/* ==================================
          MODAL FORM
      ================================== */}

      {isFormOpen && (
        <div
          className={`
            modal-backdrop
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/20
            px-3
            py-4
            sm:px-5
            sm:py-6
            ${
              isFormClosing
                ? 'modal-backdrop-closing'
                : ''
            }
          `}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="driver-form-title"
            className={`
              modal-panel
              my-auto
              max-h-[calc(100vh-2rem)]
              w-full
              max-w-md
              overflow-y-auto
              rounded-xl
              bg-[#f7f7f7]
              p-4
              shadow-[0_5px_18px_rgba(0,0,0,0.18)]
              sm:max-h-[calc(100vh-3rem)]
              sm:p-5
              ${
                isFormClosing
                  ? 'modal-panel-closing'
                  : ''
              }
            `}
          >
            {/* MODAL HEADER */}

            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="
                    h-7
                    w-7
                    shrink-0
                    bg-[#51448C]
                    sm:h-8
                    sm:w-8
                  "
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
                  className="
                    min-w-0
                    text-sm
                    font-bold
                    leading-tight
                    text-[#51448C]
                    sm:text-lg
                  "
                >
                  {editingId !== null
                    ? 'EDIT DATA DRIVER'
                    : 'INPUT DATA DRIVER'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Tutup form"
                className="
                  shrink-0
                  text-2xl
                  leading-none
                  text-[#51448C]
                  transition
                  hover:text-[#33295f]
                "
              >
                ×
              </button>
            </div>

            <p className="mb-3 text-[10px] text-black sm:mb-2">
              Silahkan masukkan data driver
            </p>

            <form onSubmit={handleSubmit}>
              {/* KODE DRIVER */}

              {editingId !== null && (
                <>
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
                    className="
                      mb-2.5
                      h-9
                      w-full
                      cursor-not-allowed
                      rounded-lg
                      border-0
                      bg-[#eeeeee]
                      px-3
                      text-xs
                      text-[#707070]
                      outline-none
                    "
                  />
                </>
              )}

              {/* NAMA DRIVER */}

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
                className="
                  mb-2.5
                  h-9
                  w-full
                  rounded-lg
                  border-0
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  ring-[#51448C]
                  placeholder:text-[#c4c4c4]
                  focus:ring-2
                "
              />

              {/* NO PLAT */}

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
                className="
                  mb-2.5
                  h-9
                  w-full
                  rounded-lg
                  border-0
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  ring-[#51448C]
                  placeholder:text-[#c4c4c4]
                  focus:ring-2
                "
              />

              {/* ALAMAT */}

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
                className="
                  mb-2.5
                  h-9
                  w-full
                  rounded-lg
                  border-0
                  bg-white
                  px-3
                  text-xs
                  outline-none
                  ring-[#51448C]
                  placeholder:text-[#c4c4c4]
                  focus:ring-2
                "
              />

              {/* ERROR */}

              {formError && (
                <p className="mt-1.5 text-[10px] text-red-500">
                  <span
                    aria-hidden="true"
                    className="mr-1"
                  >
                    ⚠
                  </span>

                  {formError}
                </p>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  mt-3
                  inline-flex
                  items-center
                  rounded-md
                  bg-[#51448C]
                  px-3
                  py-2
                  text-[10px]
                  font-medium
                  text-white
                  transition
                  hover:bg-[#433878]
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="
                        mr-2
                        h-3.5
                        w-3.5
                        animate-spin
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                      "
                    />

                    Menyimpan...
                  </>
                ) : (
                  <>
                    <img
                      src={saveIcon}
                      alt=""
                      className="mr-2 h-3.5 w-3.5 object-contain"
                    />

                    {editingId !== null
                      ? 'Update Data'
                      : 'Simpan Data'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default DriverPage