import { useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import projectIcon from '../../../assets/img/icon/proyek_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'
import './Project.css'

const initialProjects = [
  {
    id: 1,
    code: 'PRJK-001',
    customer: 'PT Maju Jaya',
    projectName: 'Pembangunan Gedung Kantor',
    city: 'Malang',
    shippingAddress: 'Jl. Soekarno Hatta No. 25, Malang',
    contactPerson: 'Budi Santoso',
    phone: '081234567890',
  },
  {
    id: 2,
    code: 'PRJK-002',
    customer: 'CV Sumber Rezeki',
    projectName: 'Renovasi Gudang',
    city: 'Surabaya',
    shippingAddress: 'Jl. Ahmad Yani No. 88, Surabaya',
    contactPerson: 'Siti Aminah',
    phone: '082345678901',
  },
  {
    id: 3,
    code: 'PRJK-003',
    customer: 'PT Sejahtera Abadi',
    projectName: 'Pembangunan Ruko',
    city: 'Kediri',
    shippingAddress: 'Jl. Diponegoro No. 15, Kediri',
    contactPerson: 'Andi Pratama',
    phone: '083456789012',
  },
  {
    id: 4,
    code: 'PRJK-004',
    customer: 'PT Karya Bersama',
    projectName: 'Pembangunan Perumahan',
    city: 'Blitar',
    shippingAddress: 'Jl. Merdeka No. 40, Blitar',
    contactPerson: 'Rina Melati',
    phone: '084567890123',
  },
  {
    id: 5,
    code: 'PRJK-005',
    customer: 'CV Berkah Makmur',
    projectName: 'Renovasi Gedung Sekolah',
    city: 'Pasuruan',
    shippingAddress: 'Jl. Panglima Sudirman No. 12, Pasuruan',
    contactPerson: 'Agus Wijaya',
    phone: '085678901234',
  },
  {
    id: 6,
    code: 'PRJK-006',
    customer: 'PT Nusantara Jaya',
    projectName: 'Pembangunan Workshop',
    city: 'Malang',
    shippingAddress: 'Jl. Tlogomas No. 75, Malang',
    contactPerson: 'Dewi Lestari',
    phone: '086789012345',
  },
]

const ProjectPage = () => {
  const [projects, setProjects] = useState(initialProjects)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchCustomer, setSearchCustomer] = useState('')
  const [searchProject, setSearchProject] = useState('')

  const [formData, setFormData] = useState({
    customer: '',
    projectName: '',
    city: '',
    shippingAddress: '',
    contactPerson: '',
    phone: '',
  })

  const [formError, setFormError] = useState('')

  // =========================
  // GENERATE KODE PROYEK
  // =========================
  const generateProjectCode = () => {
    if (projects.length === 0) {
      return 'PRJK-001'
    }

    const numbers = projects.map((project) => {
      const number = parseInt(project.code.replace('PRJK-', ''), 10)
      return isNaN(number) ? 0 : number
    })

    const nextNumber = Math.max(...numbers) + 1

    return `PRJK-${String(nextNumber).padStart(3, '0')}`
  }

  // =========================
  // EDIT DATA
  // =========================
  const handleEdit = (id) => {
    const project = projects.find((item) => item.id === id)

    if (project) {
      setEditingId(project.id)

      setFormData({
        customer: project.customer,
        projectName: project.projectName,
        city: project.city,
        shippingAddress: project.shippingAddress,
        contactPerson: project.contactPerson,
        phone: project.phone,
      })

      setFormError('')
      setIsFormOpen(true)
    }
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
      customer: '',
      projectName: '',
      city: '',
      shippingAddress: '',
      contactPerson: '',
      phone: '',
    })

    setFormError('')
    setIsFormOpen(true)
  }

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setIsFormClosing(true)

    window.setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)

      setFormData({
        customer: '',
        projectName: '',
        city: '',
        shippingAddress: '',
        contactPerson: '',
        phone: '',
      })

      setFormError('')
    }, 360)
  }

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      !formData.customer.trim() ||
      !formData.projectName.trim() ||
      !formData.city.trim() ||
      !formData.shippingAddress.trim() ||
      !formData.contactPerson.trim() ||
      !formData.phone.trim()
    ) {
      setFormError('Kolom tidak boleh kosong')
      return
    }

    if (editingId !== null) {
      // Mode Edit
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingId
            ? {
                ...project,
                ...formData,
              }
            : project
        )
      )
    } else {
      // Mode Tambah
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          id: Date.now(),
          code: generateProjectCode(),
          ...formData,
        },
      ])
    }

    closeForm()
  }

  // =========================
  // SEARCH
  // =========================
  const filteredProjects = projects.filter((project) => {
    const customerKeyword = searchCustomer.toLowerCase().trim()
    const projectKeyword = searchProject.toLowerCase().trim()

    const matchCustomer =
      customerKeyword === '' ||
      project.customer.toLowerCase().includes(customerKeyword)

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
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-8 lg:py-10">

      {/* HEADER */}
      <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
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

        <h1 className="text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DATA PROYEK
        </h1>
      </div>

      {/* TABLE CONTAINER */}
      <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">

        {/* TOP BAR */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          {/* BUTTON TAMBAH */}
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex w-fit items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-sm font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff]"
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#51448C] text-sm font-bold text-white">
              +
            </span>

            Tambah Data
          </button>

          {/* SEARCH */}
          <div className="flex flex-col gap-2 sm:flex-row">

            {/* SEARCH CUSTOMER */}
            <div className="w-full sm:w-48">
              <div className="flex items-center rounded-md border border-[#e0e0e5] bg-white px-3">

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

                <div className="group relative ml-2 w-full">
                  <input
                    type="search"
                    placeholder="Search Customer"
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                    className="h-10 w-full bg-transparent text-sm text-[#51448C] outline-none placeholder:text-[#51448C]"
                  />

                  <span className="absolute bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#51448C] transition-all duration-300 group-focus-within:w-full" />
                </div>

              </div>
            </div>

            {/* SEARCH PROJECT */}
            <div className="w-full sm:w-48">
              <div className="flex items-center rounded-md border border-[#e0e0e5] bg-white px-3">

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

                <div className="group relative ml-2 w-full">
                  <input
                    type="search"
                    placeholder="Search Project"
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    className="h-10 w-full bg-transparent text-sm text-[#51448C] outline-none placeholder:text-[#51448C]"
                  />

                  <span className="absolute bottom-1 left-0 h-[2px] w-0 rounded-full bg-[#51448C] transition-all duration-300 group-focus-within:w-full" />
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="project-table-wrapper">
            <div className="project-table-inner">
                <DataTable
                columns={columns}
                data={filteredProjects}
                actionLabel="Action"
                tableClassName="text-xs sm:text-sm project-table"
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
            aria-labelledby="project-form-title"
            className={`modal-panel w-full max-w-lg rounded-xl bg-[#f7f7f7] p-4 shadow-[0_5px_18px_rgba(0,0,0,0.18)] sm:p-5 ${
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
                  className="text-sm font-bold leading-tight text-[#51448C] sm:text-lg"
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

              <input
                id="project-customer"
                name="customer"
                value={formData.customer}
                onChange={handleFormChange}
                placeholder="Masukkan nama customer"
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
              />

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
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
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
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
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
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
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
                className="mb-2.5 h-9 w-full rounded-lg border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
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

              {/* SAVE */}
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

export default ProjectPage
