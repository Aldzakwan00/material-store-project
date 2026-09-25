import { useState } from 'react'
import DataTable from '../../../components/table/DataTable'
import materialIcon from '../../../assets/img/icon/material_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

const initialMaterials = [
  {
    id: 1,
    code: 'MTRL-001',
    name: 'Pasir',
    unit: 'm3',
    buyPrice: 150000,
    sellPrice: 175000,
  },
  {
    id: 2,
    code: 'MTRL-002',
    name: 'Batu Split',
    unit: 'm3',
    buyPrice: 180000,
    sellPrice: 210000,
  },
  {
    id: 3,
    code: 'MTRL-003',
    name: 'Semen',
    unit: 'sak',
    buyPrice: 65000,
    sellPrice: 75000,
  },
  {
    id: 4,
    code: 'MTRL-004',
    name: 'Besi Beton 10 mm',
    unit: 'batang',
    buyPrice: 85000,
    sellPrice: 100000,
  },
  {
    id: 5,
    code: 'MTRL-005',
    name: 'Besi Beton 12 mm',
    unit: 'batang',
    buyPrice: 120000,
    sellPrice: 140000,
  },
  {
    id: 6,
    code: 'MTRL-006',
    name: 'Bata Merah',
    unit: 'pcs',
    buyPrice: 1200,
    sellPrice: 1500,
  },
]

const MaterialPage = () => {
  const [materials, setMaterials] = useState(initialMaterials)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    unit: '',
    buyPrice: '',
    sellPrice: '',
  })

  const [formError, setFormError] = useState('')

  const getNextMaterialCode = () => {
    if (materials.length === 0) {
      return 'MTRL-001'
    }

    const lastNumber = Math.max(
      ...materials.map((material) =>
        Number(material.code.replace('MTRL-', ''))
      )
    )

    return `MTRL-${String(lastNumber + 1).padStart(3, '0')}`
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price)
  }

  const handleEdit = (id) => {
    const material = materials.find((item) => item.id === id)

    if (material) {
      setEditingId(material.id)

      setFormData({
        code: material.code,
        name: material.name,
        unit: material.unit,
        buyPrice: String(material.buyPrice),
        sellPrice: String(material.sellPrice),
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
        unit: '',
        buyPrice: '',
        sellPrice: '',
      })

      setFormError('')
    }, 360)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      !formData.code.trim() ||
      !formData.name.trim() ||
      !formData.unit.trim() ||
      !formData.buyPrice.trim() ||
      !formData.sellPrice.trim()
    ) {
      setFormError('Kolom tidak boleh kosong')
      return
    }

    if (editingId !== null) {
      // Mode Edit
      setMaterials((currentMaterials) =>
        currentMaterials.map((material) =>
          material.id === editingId
            ? {
                ...material,
                ...formData,
                buyPrice: Number(formData.buyPrice),
                sellPrice: Number(formData.sellPrice),
              }
            : material
        )
      )
    } else {
      // Mode Tambah
      setMaterials((currentMaterials) => [
        ...currentMaterials,
        {
          id: Date.now(),
          ...formData,
          buyPrice: Number(formData.buyPrice),
          sellPrice: Number(formData.sellPrice),
        },
      ])
    }

    closeForm()
  }

  const columns = [
    {
      key: 'code',
      label: 'Kode Barang',
    },
    {
      key: 'name',
      label: 'Nama Barang',
    },
    {
      key: 'unit',
      label: 'Satuan',
    },
    {
      key: 'buyPrice',
      label: 'Harga Beli',
      render: (row) => `Rp ${formatPrice(row.buyPrice)}`,
    },
    {
      key: 'sellPrice',
      label: 'Harga Jual',
      render: (row) => `Rp ${formatPrice(row.sellPrice)}`,
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
            maskImage: `url(${materialIcon})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskImage: `url(${materialIcon})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
          }}
        />

        <h1 className="text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DATA MATERIAL
        </h1>
      </div>

      {/* TABLE CONTAINER */}
      <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">

        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={() => {
            setEditingId(null)

            setFormData({
              code: getNextMaterialCode(),
              name: '',
              unit: '',
              buyPrice: '',
              sellPrice: '',
            })

            setFormError('')
            setIsFormOpen(true)
          }}
          className="mb-3 inline-flex items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] sm:text-sm"
        >
          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#51448C] text-xs font-bold text-white">
            +
          </span>

          Tambah Data
        </button>

        {/* TABLE WRAPPER */}
        <div className="w-full overflow-x-auto">
          <DataTable
            columns={columns}
            data={materials}
            actionLabel="Action"
            tableClassName="text-xs sm:text-sm min-w-[800px]"
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
            aria-labelledby="material-form-title"
            className={`modal-panel w-full max-w-[480px] rounded-xl bg-[#f7f7f7] px-5 py-5 shadow-[0_5px_18px_rgba(0,0,0,0.18)] ${
              isFormClosing ? 'modal-panel-closing' : ''
            }`}
          >

            {/* MODAL HEADER */}
            <div className="mb-1 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">

                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 bg-[#51448C]"
                  style={{
                    maskImage: `url(${materialIcon})`,
                    maskPosition: 'center',
                    maskRepeat: 'no-repeat',
                    maskSize: 'contain',
                    WebkitMaskImage: `url(${materialIcon})`,
                    WebkitMaskPosition: 'center',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                  }}
                />

                <h2
                  id="material-form-title"
                  className="text-[15px] font-bold leading-tight text-[#51448C]"
                >
                  INPUT &amp; EDIT DATA MATERIAL
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

            <p className="mb-3 text-[9px] text-black">
              Silahkan masukkan data material
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* KODE BARANG */}
              <label
                htmlFor="material-code"
                className="mb-1 block text-xs text-black"
              >
                Kode Barang
              </label>

              <input
                id="material-code"
                name="code"
                value={formData.code}
                readOnly
                className="mb-2.5 h-10 w-full cursor-not-allowed rounded-md border-0 bg-[#b1adae] px-3 text-xs text-white outline-none"
              />

              {/* NAMA BARANG + SATUAN */}
              <div className="mb-2.5 grid grid-cols-[1fr_64px] gap-2">

                {/* Nama Barang */}
                <div>
                  <label
                    htmlFor="material-name"
                    className="mb-1 block text-xs text-black"
                  >
                    Nama barang
                  </label>

                  <input
                    id="material-name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Masukkan Nama Material"
                    className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                  />
                </div>

                {/* Satuan */}
                <div>
                  <label
                    htmlFor="material-unit"
                    className="mb-1 block text-xs text-black"
                  >
                    Satuan
                  </label>

                  <select
                    id="material-unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleFormChange}
                    className="h-10 w-full rounded-md border-0 bg-white px-2 text-xs text-[#333] outline-none ring-[#51448C] focus:ring-2"
                  >
                    <option value="">-</option>
                    <option value="m3">M3</option>
                    <option value="sak">Sak</option>
                    <option value="batang">Batang</option>
                    <option value="pcs">Pcs</option>
                  </select>
                </div>

              </div>

              {/* HARGA BELI + HARGA JUAL */}
              <div className="grid grid-cols-2 gap-2">

                {/* Harga Beli */}
                <div>
                  <label
                    htmlFor="material-buy-price"
                    className="mb-1 block text-xs text-black"
                  >
                    Harga Beli
                  </label>

                  <input
                    id="material-buy-price"
                    name="buyPrice"
                    type="number"
                    min="0"
                    value={formData.buyPrice}
                    onChange={handleFormChange}
                    placeholder="Masukkan Harga"
                    className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                  />
                </div>

                {/* Harga Jual */}
                <div>
                  <label
                    htmlFor="material-sell-price"
                    className="mb-1 block text-xs text-black"
                  >
                    Harga Jual
                  </label>

                  <input
                    id="material-sell-price"
                    name="sellPrice"
                    type="number"
                    min="0"
                    value={formData.sellPrice}
                    onChange={handleFormChange}
                    placeholder="Masukkan Harga"
                    className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                  />
                </div>

              </div>

              {/* ERROR */}
              {formError && (
                <p className="mt-1.5 text-[9px] text-red-500">
                  <span aria-hidden="true" className="mr-1">
                    ⚠
                  </span>
                  {formError}
                </p>
              )}

              {/* SAVE BUTTON */}
              <button
                type="submit"
                className="mt-3 flex items-center rounded-md bg-[#51448C] px-3 py-1.5 text-[9px] font-medium text-white transition hover:bg-[#433878]"
              >
                <img
                  src={saveIcon}
                  alt=""
                  className="mr-1.5 h-3 w-3 object-contain"
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

export default MaterialPage