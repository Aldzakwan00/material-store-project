import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import DataTable from '../../../components/table/DataTable'
import projectIcon from '../../../assets/img/icon/proyek_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

import {
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../../../services/ProjectServices'

import { getCustomers } from '../../../services/CustomerServices'

const ProjectPage = () => {
  const [projects, setProjects] = useState([])
  const [customers, setCustomers] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // =========================
  // SEARCH / FILTER TABEL
  // =========================
  const [searchCustomer, setSearchCustomer] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [isCustomerFilterOpen, setIsCustomerFilterOpen] = useState(false)

  const [searchProject, setSearchProject] = useState('')

  // =========================
  // CUSTOMER FORM
  // =========================
  const [customerSearch, setCustomerSearch] = useState('')
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] =
    useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    customer: '',
    projectName: '',
    city: '',
    shippingAddress: '',
    contactPerson: '',
    phone: '',
  })

  const [formError, setFormError] = useState('')

  // =========================
  // GET PROJECT & CUSTOMER
  // =========================
  const fetchData = async () => {
    try {
      setIsLoading(true)

      const [projectResponse, customerResponse] = await Promise.all([
        getProject(),
        getCustomers(),
      ])

      const projectData = Array.isArray(projectResponse)
        ? projectResponse
        : projectResponse?.items || []

      const customerData = Array.isArray(customerResponse)
        ? customerResponse
        : customerResponse?.items || []

      const formattedProjects = projectData.map((project) => ({
        id: project.id,
        code: project.kode || '',
        customerId: project.customer_id || '',
        customer: project.nama_pelanggan || '',
        projectName: project.nama_proyek || '',
        city: project.kota || '',
        shippingAddress: project.alamat_kirim || '',
        contactPerson: project.contact_person || '',
        phone: project.proyek_telp || '',
      }))

      setProjects(formattedProjects)
      setCustomers(customerData)
    } catch (error) {
      if (error.status === 401) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('isLoggedIn')

        window.location.href = '/login'
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message || 'Gagal mengambil data',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // FILTER CUSTOMER FORM
  // =========================
  const filteredCustomers = customers.filter((customer) => {
    const keyword = customerSearch.toLowerCase().trim()

    return (
      customer.nama_customer?.toLowerCase().includes(keyword) ||
      customer.kode?.toLowerCase().includes(keyword)
    )
  })

  // =========================
  // FILTER CUSTOMER TABEL
  // =========================
  const filteredCustomerOptions = customers.filter((customer) => {
    const keyword = searchCustomer.toLowerCase().trim()

    return (
      customer.nama_customer?.toLowerCase().includes(keyword) ||
      customer.kode?.toLowerCase().includes(keyword)
    )
  })

  // =========================
  // CUSTOMER FILTER INPUT
  // =========================
  const handleCustomerFilterChange = (event) => {
    const value = event.target.value

    setSearchCustomer(value)
    setSelectedCustomerId('')
    setIsCustomerFilterOpen(true)
  }

  // =========================
  // SELECT CUSTOMER FILTER
  // =========================
  const handleSelectCustomerFilter = (customer) => {
    setSelectedCustomerId(String(customer.id))
    setSearchCustomer(customer.nama_customer)
    setIsCustomerFilterOpen(false)
  }

  // =========================
  // CLEAR CUSTOMER FILTER
  // =========================
  const handleClearCustomerFilter = () => {
    setSelectedCustomerId('')
    setSearchCustomer('')
    setIsCustomerFilterOpen(false)
  }

  // =========================
  // CUSTOMER INPUT FORM
  // =========================
  const handleCustomerInputChange = (event) => {
    const value = event.target.value

    setCustomerSearch(value)

    setFormData((currentData) => ({
      ...currentData,
      customerId: '',
      customer: value,
    }))

    setIsCustomerDropdownOpen(true)
    setFormError('')
  }

  // =========================
  // SELECT CUSTOMER FORM
  // =========================
  const handleSelectCustomer = (customer) => {
    setFormData((currentData) => ({
      ...currentData,
      customerId: customer.id,
      customer: customer.nama_customer,
    }))

    setCustomerSearch(customer.nama_customer)
    setIsCustomerDropdownOpen(false)
    setFormError('')
  }

  // =========================
  // EDIT DATA
  // =========================
  const handleEdit = (id) => {
    const project = projects.find((item) => item.id === id)

    if (!project) {
      return
    }

    setEditingId(project.id)

    setFormData({
      customerId: project.customerId,
      customer: project.customer,
      projectName: project.projectName,
      city: project.city,
      shippingAddress: project.shippingAddress,
      contactPerson: project.contactPerson,
      phone: project.phone,
    })

    setCustomerSearch(project.customer)

    setFormError('')
    setIsCustomerDropdownOpen(false)
    setIsFormOpen(true)
  }

  // =========================
  // FORM CHANGE
  // =========================
  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setFormError('')
  }

  // =========================
  // OPEN FORM TAMBAH
  // =========================
  const openAddForm = () => {
    setEditingId(null)

    setFormData({
      customerId: '',
      customer: '',
      projectName: '',
      city: '',
      shippingAddress: '',
      contactPerson: '',
      phone: '',
    })

    setCustomerSearch('')
    setIsCustomerDropdownOpen(false)
    setFormError('')
    setIsFormOpen(true)
  }

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    if (isSubmitting) {
      return
    }

    setIsCustomerDropdownOpen(false)
    setIsFormClosing(true)

    window.setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)

      setFormData({
        customerId: '',
        customer: '',
        projectName: '',
        city: '',
        shippingAddress: '',
        contactPerson: '',
        phone: '',
      })

      setCustomerSearch('')
      setFormError('')
    }, 360)
  }

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.customerId) {
      setFormError('Silahkan pilih customer yang terdaftar')
      return
    }

    if (
      !formData.projectName.trim() ||
      !formData.city.trim() 
    ) {
      setFormError('Nama proyek dan Kota wajib diisi')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError('')

      const payload = {
        customer_id: Number(formData.customerId),
        nama_pelanggan: formData.customer.trim(),
        nama_proyek: formData.projectName.trim(),
        kota: formData.city.trim(),
        alamat_kirim: formData.shippingAddress.trim() || null,
        contact_person: formData.contactPerson.trim() || null,
        proyek_telp: formData.phone.trim() || null,
      }

      if (editingId !== null) {
        await updateProject(editingId, payload)

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data proyek berhasil diperbarui',
          confirmButtonText: 'OKE',
          confirmButtonColor: '#51448C',
        })
      } else {
        await createProject(payload)

        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data proyek berhasil ditambahkan',
          confirmButtonText: 'OKE',
          confirmButtonColor: '#51448C',
        })
      }

      await fetchData()

      closeForm()
    } catch (error) {
      if (error.status === 401) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('isLoggedIn')

        window.location.href = '/login'
        return
      }

      setFormError(
        error.message ||
          (editingId !== null
            ? 'Gagal memperbarui data proyek'
            : 'Gagal menambahkan data proyek')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // =========================
  // DELETE DATA
  // =========================
  const handleDelete = async (id) => {
    const project = projects.find((item) => item.id === id)

    if (!project) {
      return
    }

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Hapus Data?',
      text: `Data proyek "${project.projectName}" akan dihapus.`,
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteProject(id)

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data proyek berhasil dihapus',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })

      await fetchData()
    } catch (error) {
      if (error.status === 401) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('isLoggedIn')

        window.location.href = '/login'
        return
      }

      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message || 'Gagal menghapus data proyek',
        confirmButtonText: 'OKE',
        confirmButtonColor: '#51448C',
      })
    }
  }

  // =========================
  // FILTER PROJECT
  // =========================
  const filteredProjects = projects.filter((project) => {
    const projectKeyword = searchProject.toLowerCase().trim()

    const matchCustomer =
      selectedCustomerId === '' ||
      String(project.customerId) === String(selectedCustomerId)

    const matchProject =
      projectKeyword === '' ||
      project.projectName.toLowerCase().includes(projectKeyword)

    return matchCustomer && matchProject
  })

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    {
      key: 'code',
      label: 'Kode Proyek',
    },
    {
      key: 'customer',
      label: 'Nama Customer',
    },
    {
      key: 'projectName',
      label: 'Nama Proyek',
    },
    {
      key: 'city',
      label: 'Kota',
    },
    {
      key: 'shippingAddress',
      label: 'Alamat Kirim',
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
    },
    {
      key: 'phone',
      label: 'Proyek Telp',
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
        px-3 py-5
        sm:px-5 sm:py-6
        md:px-6
        lg:ml-64
        lg:w-[calc(100%-16rem)]
        lg:px-8 lg:py-8
        xl:px-10 xl:py-10
      "
    >
      {/* HEADER */}
      <div className="mb-5 flex min-w-0 items-center gap-2 sm:mb-6 sm:gap-3">
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-9 sm:w-9"
          style={{
            maskImage: `url(${projectIcon})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskImage: `url(${projectIcon})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
          }}
        />

        <h1 className="min-w-0 truncate text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DATA PROYEK
        </h1>
      </div>

      {/* TABLE CONTAINER */}
      <section
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-xl
          border border-[#d9d9df]
          bg-[#f5f5f6]
          p-3
          shadow-sm
          sm:rounded-2xl
          sm:p-4
        "
      >
        {/* TOP BAR */}
        <div className="mb-4 flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* BUTTON TAMBAH */}
          <button
            type="button"
            onClick={openAddForm}
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              rounded-md
              border border-[#e0e0e5]
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              text-[#51448C]
              shadow-sm
              transition
              hover:bg-[#f8f6ff]
            "
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#51448C] text-sm font-bold text-white">
              +
            </span>

            Tambah Data
          </button>

          {/* FILTER */}
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row lg:w-auto">
            {/* SEARCH CUSTOMER DROPDOWN */}
            <div className="relative z-[80] w-full min-w-0 sm:w-52">
              <div className="flex min-w-0 items-center rounded-lg border border-[#e0e0e5] bg-white px-3">
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

                <div className="relative ml-2 min-w-0 flex-1">
                  <input
                    type="text"
                    placeholder="Search Customer"
                    value={searchCustomer}
                    onChange={handleCustomerFilterChange}
                    onFocus={() => setIsCustomerFilterOpen(true)}
                    autoComplete="off"
                    className="
                      h-10
                      w-full
                      bg-transparent
                      pr-6
                      text-sm
                      text-[#51448C]
                      outline-none
                      placeholder:text-[#51448C]
                    "
                  />

                  <span className="absolute bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#51448C] transition-all duration-300 focus-within:w-full" />
                </div>

                {/* CLEAR */}
                {searchCustomer && (
                  <button
                    type="button"
                    onClick={handleClearCustomerFilter}
                    className="mr-1 shrink-0 text-sm text-gray-400 transition hover:text-[#51448C]"
                    aria-label="Hapus filter customer"
                  >
                    ×
                  </button>
                )}

                {/* ARROW */}
                <button
                  type="button"
                  onClick={() =>
                    setIsCustomerFilterOpen((current) => !current)
                  }
                  className="shrink-0 text-[#51448C]"
                  aria-label="Buka pilihan customer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      isCustomerFilterOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>
              </div>

              {/* CUSTOMER DROPDOWN */}
              {isCustomerFilterOpen && (
                <div className="absolute left-0 right-0 top-[44px] z-[90] max-h-60 overflow-y-auto rounded-lg border border-[#e0e0e5] bg-white shadow-lg">
                  {/* SEMUA CUSTOMER */}
                  <button
                    type="button"
                    onClick={handleClearCustomerFilter}
                    className="
                      flex
                      w-full
                      items-center
                      justify-between
                      border-b
                      border-[#eeeeef]
                      px-3
                      py-2.5
                      text-left
                      transition
                      hover:bg-[#f5f2ff]
                    "
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#51448C]">
                        Semua Customer
                      </p>

                      <p className="text-[10px] text-gray-400">
                        Tampilkan semua proyek
                      </p>
                    </div>

                    {selectedCustomerId === '' && (
                      <span className="ml-2 shrink-0 text-xs text-green-500">
                        ✓
                      </span>
                    )}
                  </button>

                  {/* CUSTOMER LIST */}
                  {filteredCustomerOptions.length > 0 ? (
                    filteredCustomerOptions.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() =>
                          handleSelectCustomerFilter(customer)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-between
                          px-3
                          py-2.5
                          text-left
                          transition
                          hover:bg-[#f5f2ff]
                        "
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-[#51448C]">
                            {customer.nama_customer}
                          </p>

                          <p className="text-[10px] text-gray-400">
                            {customer.kode}
                          </p>
                        </div>

                        {String(selectedCustomerId) ===
                          String(customer.id) && (
                          <span className="ml-2 shrink-0 text-xs text-green-500">
                            ✓
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-3 text-[10px] text-gray-400">
                      Customer tidak ditemukan
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* SEARCH PROJECT */}
            <div className="w-full min-w-0 sm:w-52">
              <div className="flex min-w-0 items-center rounded-lg border border-[#e0e0e5] bg-white px-3">
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
                    placeholder="Search Project"
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    className="
                      h-10
                      w-full
                      bg-transparent
                      text-sm
                      text-[#51448C]
                      outline-none
                      placeholder:text-[#51448C]
                    "
                  />

                  <span className="absolute bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#51448C] transition-all duration-300 group-focus-within:w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden rounded-lg">
          <div className="min-w-[1050px]">
            <DataTable
              columns={columns}
              data={filteredProjects}
              loading={isLoading}
              actionLabel="Action"
              tableClassName="text-xs sm:text-sm min-w-[1050px]"
              actions={(row) => (
                <div className="flex items-center gap-1">
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
          </div>
        </div>
      </section>

      {/* MODAL */}
      {isFormOpen && (
        <div
          className={`
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/10
            px-3
            py-4
            sm:px-5
            sm:py-6
            ${isFormClosing ? 'opacity-0' : 'opacity-100'}
            transition-opacity
            duration-300
          `}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-form-title"
            className={`
              my-auto
              max-h-[calc(100vh-2rem)]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-xl
              bg-[#f7f7f7]
              p-4
              shadow-[0_5px_18px_rgba(0,0,0,0.18)]
              sm:max-h-[calc(100vh-3rem)]
              sm:p-5
              ${isFormClosing ? 'scale-[0.98]' : 'scale-100'}
              transition-transform
              duration-300
            `}
          >
            {/* MODAL HEADER */}
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-8 sm:w-8"
                  style={{
                    maskImage: `url(${projectIcon})`,
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskImage: `url(${projectIcon})`,
                    WebkitMaskPosition: 'center',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                  }}
                />

                <h2
                  id="project-form-title"
                  className="min-w-0 text-sm font-bold leading-tight text-[#51448C] sm:text-lg"
                >
                  INPUT &amp; EDIT DATA PROYEK
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
              Silahkan masukkan data proyek
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* CUSTOMER */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-customer"
              >
                Nama Customer
              </label>

              <div className="relative z-30 mb-2.5">
                <input
                  id="project-customer"
                  name="customer"
                  value={customerSearch}
                  onChange={handleCustomerInputChange}
                  onFocus={() => setIsCustomerDropdownOpen(true)}
                  placeholder="Masukkan nama customer"
                  autoComplete="off"
                  className="
                    h-9
                    w-full
                    rounded-lg
                    border-0
                    bg-white
                    px-3
                    pr-9
                    text-xs
                    outline-none
                    ring-[#51448C]
                    placeholder:text-[#c4c4c4]
                    focus:ring-2
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setIsCustomerDropdownOpen((current) => !current)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#51448C]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>

                {isCustomerDropdownOpen && (
                  <div className="absolute left-0 right-0 top-10 z-[110] max-h-48 overflow-y-auto rounded-lg border border-[#e0e0e5] bg-white shadow-lg">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          className="
                            flex
                            w-full
                            items-center
                            justify-between
                            px-3
                            py-2
                            text-left
                            transition
                            hover:bg-[#f5f2ff]
                          "
                        >
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-[#51448C]">
                              {customer.nama_customer}
                            </p>

                            <p className="text-[10px] text-gray-400">
                              {customer.kode}
                            </p>
                          </div>

                          {Number(formData.customerId) ===
                            Number(customer.id) && (
                            <span className="ml-2 shrink-0 text-xs text-green-500">
                              ✓
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-[10px] text-gray-400">
                        Customer tidak ditemukan
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* PROJECT NAME */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-name"
              >
                Nama Proyek
              </label>

              <input
                id="project-name"
                name="projectName"
                value={formData.projectName}
                onChange={handleFormChange}
                placeholder="Masukkan nama proyek"
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

              {/* KOTA */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-city"
              >
                Kota
              </label>

              <input
                id="project-city"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="Masukkan kota"
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

              {/* ALAMAT KIRIM */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-address"
              >
                Alamat Kirim
              </label>

              <input
                id="project-address"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleFormChange}
                placeholder="Masukkan alamat kirim"
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

              {/* CONTACT PERSON */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-contact"
              >
                Contact Person
              </label>

              <input
                id="project-contact"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleFormChange}
                placeholder="Masukkan contact person"
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

              {/* PHONE */}
              <label
                className="mb-1 block text-xs text-black"
                htmlFor="project-phone"
              >
                Proyek Telp
              </label>

              <input
                id="project-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Masukkan nomor telepon"
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
                disabled={isSubmitting}
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-md
                  bg-[#51448C]
                  px-3
                  py-2
                  text-[10px]
                  font-medium
                  text-white
                  transition
                  hover:bg-[#433878]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-fit
                "
              >
                <img
                  src={saveIcon}
                  alt=""
                  className="mr-2 h-3.5 w-3.5 object-contain"
                />

                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProjectPage