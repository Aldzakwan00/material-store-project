import { useEffect, useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import customerIcon from '../../../assets/img/icon/customer_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'
import Swal from 'sweetalert2'

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../../../services/CustomerServices'

const CustomerPage = () => {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')

  const [formData, setFormData] = useState({
    id: null,
    kode: '',
    name: '',
    npwp: '',
    address: '',
  })

  const [formError, setFormError] = useState('')

  // =========================================================
  // GET DATA CUSTOMER
  // =========================================================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await getCustomers()

        const formattedCustomers = data.items.map((customer) => ({
          id: customer.id,
          kode: customer.kode,
          name: customer.nama_customer,
          npwp: customer.no_npwp || '',
          address: customer.alamat || '',
        }))

        setCustomers(formattedCustomers)
      } catch (error) {
        setError(error.message || 'Gagal mengambil data customer')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // =========================================================
  // EDIT DATA
  // =========================================================
  const handleEdit = (id) => {
    const customer = customers.find((item) => item.id === id)

    if (customer) {
      setEditingId(customer.id)

      setFormData({
        id: customer.id,
        kode: customer.kode,
        name: customer.name,
        npwp: customer.npwp,
        address: customer.address,
      })

      setFormError('')
      setIsFormOpen(true)
    }
  }

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setFormError('')
  }

  // =========================================================
  // OPEN ADD FORM
  // =========================================================
  const openAddForm = () => {
    setEditingId(null)

    setFormData({
      id: null,
      kode: '',
      name: '',
      npwp: '',
      address: '',
    })

    setFormError('')
    setIsFormClosing(false)
    setIsFormOpen(true)
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  const closeForm = () => {
    setIsFormClosing(true)

    window.setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)

      setFormData({
        id: null,
        kode: '',
        name: '',
        npwp: '',
        address: '',
      })

      setFormError('')
    }, 360)
  }

  // =========================================================
  // SUBMIT FORM
  // =========================================================
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap',
        text: 'Nama customer wajib diisi',
        confirmButtonColor: '#51448C',
      })

      return
    }

    try {
      setFormError('')

      // =====================================================
      // EDIT CUSTOMER
      // =====================================================
      if (editingId !== null) {
        const updatedCustomer = await updateCustomer(editingId, {
          id: formData.id,
          kode: formData.kode,
          nama_customer: formData.name,
          no_npwp: formData.npwp || null,
          alamat: formData.address || null,
        })

        setCustomers((currentCustomers) =>
          currentCustomers.map((customer) =>
            customer.id === editingId
              ? {
                  id: updatedCustomer.id,
                  kode: updatedCustomer.kode,
                  name: updatedCustomer.nama_customer,
                  npwp: updatedCustomer.no_npwp || '',
                  address: updatedCustomer.alamat || '',
                }
              : customer,
          ),
        )

        closeForm()

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data customer berhasil diperbarui',
          confirmButtonColor: '#51448C',
        })

        return
      }

      // =====================================================
      // TAMBAH CUSTOMER
      // =====================================================
      const newCustomer = await createCustomer({
        nama_customer: formData.name,
        no_npwp: formData.npwp || null,
        alamat: formData.address || null,
      })

      setCustomers((currentCustomers) => [
        ...currentCustomers,
        {
          id: newCustomer.id,
          kode: newCustomer.kode,
          name: newCustomer.nama_customer,
          npwp: newCustomer.no_npwp || '',
          address: newCustomer.alamat || '',
        },
      ])

      closeForm()

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data customer berhasil ditambahkan',
        confirmButtonColor: '#51448C',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text:
          error.message ||
          (editingId !== null
            ? 'Gagal memperbarui customer'
            : 'Gagal menambahkan customer'),
        confirmButtonColor: '#51448C',
      })
    }
  }

  // =========================================================
  // DELETE DATA
  // =========================================================
  const handleDelete = async (id) => {
    const customer = customers.find((item) => item.id === id)

    if (!customer) {
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus data customer?',
      text: `Data "${customer.name}" akan dihapus secara permanen.`,
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
      await deleteCustomer(id)

      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== id),
      )

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data customer berhasil dihapus',
        confirmButtonColor: '#51448C',
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message || 'Gagal menghapus customer',
        confirmButtonColor: '#51448C',
      })
    }
  }

  // =========================================================
  // SEARCH
  // =========================================================
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase().trim()

    return (
      customer.name.toLowerCase().includes(searchValue) ||
      customer.npwp.toLowerCase().includes(searchValue) ||
      customer.address.toLowerCase().includes(searchValue)
    )
  })

  // =========================================================
  // TABLE COLUMNS
  // =========================================================
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
      {/* =====================================================
          HEADER
      ====================================================== */}
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
          DATA CUSTOMER
        </h1>
      </div>

      {/* =====================================================
          TABLE CONTAINER
      ====================================================== */}
      <section
        className="
          w-full
          min-w-0
          overflow-hidden
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
        {/* ===================================================
            TOP BAR
        ==================================================== */}
        <div
          className="
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
            onClick={openAddForm}
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
              text-sm
              font-medium
              text-[#51448C]
              shadow-sm
              transition
              hover:bg-[#f8f6ff]
              active:scale-[0.98]
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

          {/* SEARCH */}
          <div
            className="
              w-full
              min-w-0
              sm:w-56
              md:w-64
            "
          >
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
                  d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                />
              </svg>

              <div className="group relative ml-2 min-w-0 flex-1">
                <input
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    h-9
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
                    h-[2px]
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

        {/* ===================================================
            ERROR GET
        ==================================================== */}
        {error && (
          <div
            className="
              mb-4
              w-full
              overflow-hidden
              rounded-lg
              bg-red-50
              px-4
              py-3
              text-sm
              break-words
              text-red-500
            "
          >
            {error}
          </div>
        )}

        {/* ===================================================
            TABLE
        ==================================================== */}
        <div
          className="
            w-full
            min-w-0
            overflow-x-auto
            overflow-y-hidden
            rounded-lg
          "
        >
          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Memuat data customer...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredCustomers}
              actionLabel="Action"
              tableClassName="
                min-w-[650px]
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
                      flex
                      items-center
                      whitespace-nowrap
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
          )}
        </div>
      </section>

      {/* =====================================================
          MODAL
      ====================================================== */}
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
            ${isFormClosing ? 'modal-backdrop-closing' : ''}
          `}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
            className={`
              modal-panel
              my-auto
              flex
              max-h-[calc(100vh-2rem)]
              w-full
              max-w-md
              flex-col
              overflow-y-auto
              rounded-xl
              bg-[#f7f7f7]
              p-4
              shadow-[0_5px_18px_rgba(0,0,0,0.18)]
              sm:max-h-[calc(100vh-3rem)]
              sm:p-5
              ${isFormClosing ? 'modal-panel-closing' : ''}
            `}
          >
            {/* =================================================
                MODAL HEADER
            ================================================== */}
            <div className="mb-1 flex shrink-0 items-start justify-between gap-3">
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
                  className="
                    min-w-0
                    text-sm
                    font-bold
                    leading-tight
                    text-[#51448C]
                    sm:text-lg
                  "
                >
                  INPUT &amp; EDIT DATA CUSTOMER
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
              Silahkan masukkan data diri customer
            </p>

            {/* =================================================
                FORM
            ================================================== */}
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
                className="
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
                  <span aria-hidden="true" className="mr-1">
                    ⚠
                  </span>

                  {formError}
                </p>
              )}

              {/* SAVE */}
              <button
                type="submit"
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
                "
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