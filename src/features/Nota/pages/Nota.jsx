import { useEffect, useMemo, useRef, useState } from 'react'
import Swal from 'sweetalert2'

import DataTable from '../../../components/table/DataTable'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

import {
  getNotaTagihan,
  getSuratJalanDariSampai,
  createNotaTagihanAll,
  createNotaTagihanChecked,
  updateNotaTagihanCicil,
  updateNotaTagihanLunas,
  deleteNotaTagihan,
  pratinjauNotaTagihan,
  printUlangNotaTagihan
} from '../../../services/NotaServices'

import {
  bayarCicil,
  bayarLunas,
} from '../../../services/PembayaranNota'

import { getCustomers } from '../../../services/CustomerServices'
import { getDriver } from '../../../services/DriverServices'


// ======================================================
// FORMAT RUPIAH
// ======================================================
const formatRupiah = (value) => {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}.00`
}

const formatNumberWithDots = (value) => {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const digitsOnly = String(value).replace(/\D/g, '')

  if (!digitsOnly) {
    return ''
  }

  return Number(digitsOnly).toLocaleString('id-ID')
}


// ======================================================
// FORMAT TANGGAL UNTUK INPUT
// ======================================================
const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  const value = String(dateString)

  if (value.includes('/')) {
    const [day, month, year] = value.split('/')

    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }

  if (value.includes('T')) {
    return value.split('T')[0]
  }

  return value
}


// ======================================================
// FORMAT TANGGAL DISPLAY
// ======================================================
const formatDateDisplay = (dateString) => {
  if (!dateString) return ''

  const value = formatDateForInput(dateString)

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return dateString
  }

  return `${day}/${month}/${year}`
}


// ======================================================
// AMBIL ID ITEM SURAT JALAN
// ======================================================
const getSuratJalanItemId = (item) => {
  if (!item) return null

  return (
    item.item_id ??
    item.surat_jalan_item_id ??
    item.id_item ??
    item.id
  )
}


// ======================================================
// NORMALISASI ID
// ======================================================
const normalizeIds = (ids) => {
  return (ids || [])
    .filter(
      (id) =>
        id !== null &&
        id !== undefined &&
        id !== ''
    )
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id))
}


// ======================================================
// CUSTOM SEARCHABLE DROPDOWN
// ======================================================
const SearchableDropdown = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  loading,
  disabled = false,
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  const selectedOption = options.find(
    (option) =>
      String(option.id) === String(value)
  )

  const filteredOptions = options.filter((option) =>
    String(option.name || '')
      .toLowerCase()
      .includes(
        searchValue.toLowerCase()
      )
  )


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSearchValue('')
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])


  const handleOpen = () => {
    if (disabled) return

    setIsOpen((current) => !current)

    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 50)
  }


  const handleSelect = (option) => {
    onChange(String(option.id))
    setIsOpen(false)
    setSearchValue('')
  }


  return (
    <div
      ref={dropdownRef}
      className="relative min-w-0"
    >

      {showLabel && (
        <label className="mb-1.5 block text-xs font-medium text-[#333333]">
          {label}
        </label>
      )}


      <button
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={`flex h-11 w-full min-w-0 items-center justify-between rounded-lg border bg-white px-3 text-left text-xs outline-none transition ${
          isOpen
            ? 'border-[#51448C] ring-2 ring-[#51448C]/10'
            : 'border-[#e2e0e8]'
        } ${
          disabled
            ? 'cursor-not-allowed bg-[#eeeeee] text-[#aaaaaa]'
            : 'text-[#707070] hover:border-[#cfcbdc]'
        }`}
      >

        <span
          className={
            selectedOption
              ? 'min-w-0 truncate text-[#333333]'
              : 'min-w-0 truncate text-[#a5a5a5]'
          }
        >
          {loading
            ? `Memuat ${label.toLowerCase()}...`
            : selectedOption
              ? selectedOption.name
              : placeholder}
        </span>


        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-2 h-4 w-4 shrink-0 text-[#51448C] transition-transform ${
            isOpen ? 'rotate-180' : ''
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


      {isOpen && !disabled && (
        <div
          className={`absolute left-0 right-0 z-[100] overflow-hidden rounded-xl border border-[#dedde5] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] ${
            showLabel
              ? 'top-[72px]'
              : 'top-[46px]'
          }`}
        >

          <div className="border-b border-[#eeeeee] bg-white p-2.5">

            <div className="flex h-10 items-center rounded-lg border border-[#e3e1e9] bg-[#fafafa] px-3 transition focus-within:border-[#51448C] focus-within:ring-2 focus-within:ring-[#51448C]/10">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-[#8b849e]"
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

              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value
                  )
                }
                placeholder={`Cari ${label.toLowerCase()}...`}
                className="ml-2 h-full min-w-0 w-full bg-transparent text-xs text-[#333333] outline-none placeholder:text-[#aaa5b5]"
              />

            </div>

          </div>


          <div className="max-h-[220px] overflow-y-auto p-1.5 scrollbar-thin">

            <button
              type="button"
              onClick={() => {
                onChange('')
                setIsOpen(false)
                setSearchValue('')
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-xs transition ${
                !value
                  ? 'bg-[#f1effa] text-[#51448C]'
                  : 'text-[#707070] hover:bg-[#f7f6fa]'
              }`}
            >
              Pilih {label}
            </button>


            {filteredOptions.length > 0 ? (

              filteredOptions.map((option) => (

                <button
                  type="button"
                  key={option.id}
                  onClick={() =>
                    handleSelect(option)
                  }
                  className={`flex w-full min-w-0 items-center rounded-lg px-3 py-2.5 text-left text-xs transition ${
                    String(option.id) ===
                    String(value)
                      ? 'bg-[#f1effa] font-medium text-[#51448C]'
                      : 'text-[#333333] hover:bg-[#f7f6fa]'
                  }`}
                >

                  <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eeebf7] text-[10px] font-semibold text-[#51448C]">
                    {String(option.name || '?')
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="min-w-0 flex-1 truncate">
                    {option.name}
                  </span>

                  {String(option.id) ===
                    String(value) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-4 w-4 shrink-0 text-[#51448C]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  )}

                </button>

              ))

            ) : (

              <div className="px-3 py-6 text-center text-xs text-[#999999]">
                Tidak ada {label.toLowerCase()} yang ditemukan.
              </div>

            )}

          </div>

        </div>
      )}

    </div>
  )
}


// ======================================================
// COMPONENT
// ======================================================
const Nota = () => {

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const [customers, setCustomers] = useState([])
  const [drivers, setDrivers] = useState([])

  const [loadingCustomer, setLoadingCustomer] =
    useState(false)

  const [loadingDriver, setLoadingDriver] =
    useState(false)

  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
    useState('')

  const [isFilterOpen, setIsFilterOpen] =
    useState(false)

  const [filterStart, setFilterStart] =
    useState('')

  const [filterEnd, setFilterEnd] =
    useState('')

  const [isFormOpen, setIsFormOpen] =
    useState(false)

  const [isFormClosing, setIsFormClosing] =
    useState(false)

  const [editingId, setEditingId] =
    useState(null)

  const [editingStatus, setEditingStatus] =
    useState('')

  const [formData, setFormData] = useState({
    tanggal: '',
    customer_id: '',
    driver_id: '',
    tanggal_kirim_dari: '',
    tanggal_kirim_sampai: '',
  })

  const [suratJalanItems, setSuratJalanItems] =
    useState([])

  const [selectedItemIds, setSelectedItemIds] =
    useState([])

  const [totalTagihan, setTotalTagihan] =
    useState(0)

  const [loadingSuratJalan, setLoadingSuratJalan] =
    useState(false)

  const [suratJalanSearched, setSuratJalanSearched] =
    useState(false)

  const [isPaymentOpen, setIsPaymentOpen] =
    useState(false)

  const [isPaymentClosing, setIsPaymentClosing] =
    useState(false)

  const [paymentData, setPaymentData] = useState({
    id: null,
    noNota: '',
    tanggalBayar: '',
    totalTagihan: 0,
    sisaTagihan: 0,
    status: 'normal',
    jumlahBayar: '',
  })

  const [paymentLoading, setPaymentLoading] =
    useState(false)

  // ======================================================
  // PRATINJAU + PRINT ULANG
  // ======================================================
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isPreviewClosing, setIsPreviewClosing] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  const [previewData, setPreviewData] = useState('')
  const [previewInvoice, setPreviewInvoice] = useState(null)


  // ======================================================
  // ID ITEM EDIT YANG HARUS TETAP TERPILIH
  // ======================================================
  const editSelectedItemIdsRef = useRef([])


  // ======================================================
  // GET NOTA TAGIHAN
  // ======================================================
  const fetchNotaTagihan = async () => {

    try {

      setLoading(true)

      const response =
        await getNotaTagihan()

      const items =
        response?.items || []

      const formattedData =
        items.map((item) => {

          const detailItems =
            Array.isArray(item.items)
              ? item.items
              : []

          return {
            id: item.id,

            noNota:
              item.no_nota,

            tanggal:
              item.tanggal_nota,

            customerId:
              item.customer_id ??
              item.customer?.id,

            customer:
              item.nama_customer ??
              item.customer?.nama_customer ??
              item.customer?.name ??
              '',

            driverId:
              item.driver_id ??
              item.driver?.id ??
              item.id_driver,

            driver:
              item.nama_supir ??
              item.nama_driver ??
              item.driver?.nama_supir ??
              item.driver?.nama_driver ??
              item.driver?.name ??
              '',

            tanggalKirimDari:
              item.tanggal_kirim_dari,

            tanggalKirimSampai:
              item.tanggal_kirim_sampai,

            jumlah:
              item.total_tagihan,

            bayar:
              item.bayar,

            sisa:
              item.sisa,

            status:
              item.status,

            dilunaskan:
              item.dilunaskan,

            jumlahCetak:
              item.jumlah_cetak,

            terakhirDicetak:
              item.terakhir_dicetak,

            items:
              detailItems,

            pembayaran:
              Array.isArray(item.pembayaran)
                ? item.pembayaran
                : Array.isArray(item.riwayat_pembayaran)
                  ? item.riwayat_pembayaran
                  : [],
          }
        })

      setInvoices(formattedData)

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Gagal mengambil data',
        text:
          error?.message ||
          'Data nota tagihan gagal diambil.',
        confirmButtonColor: '#51448C',
      })

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {
    fetchNotaTagihan()
  }, [])


  // ======================================================
  // GET CUSTOMER
  // ======================================================
  const fetchCustomers = async () => {

    try {

      setLoadingCustomer(true)

      const response =
        await getCustomers()

      const items =
        response?.items ||
        response ||
        []

      const formattedCustomers =
        items.map((item) => ({
          id: item.id,
          name:
            item.nama_customer ||
            item.name ||
            '',
        }))

      setCustomers(
        formattedCustomers
      )

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Gagal mengambil customer',
        text:
          error?.message ||
          'Data customer gagal diambil.',
        confirmButtonColor: '#51448C',
      })

    } finally {

      setLoadingCustomer(false)

    }

  }


  // ======================================================
  // GET DRIVER
  // ======================================================
  const fetchDrivers = async () => {

    try {

      setLoadingDriver(true)

      const response =
        await getDriver()

      const items =
        response?.items ||
        response ||
        []

      const formattedDrivers =
        items.map((item) => ({
          id: item.id,
          name:
            item.nama_supir ||
            item.nama_driver ||
            item.nama ||
            item.name ||
            '',
        }))

      setDrivers(
        formattedDrivers
      )

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Gagal mengambil driver',
        text:
          error?.message ||
          'Data driver gagal diambil.',
        confirmButtonColor: '#51448C',
      })

    } finally {

      setLoadingDriver(false)

    }

  }


  // ======================================================
  // LOAD CUSTOMER
  // ======================================================
  useEffect(() => {
    fetchCustomers()
  }, [])


  // ======================================================
  // LOAD DRIVER KETIKA MODAL TERBUKA
  // ======================================================
  useEffect(() => {

    if (!isFormOpen) return

    fetchDrivers()

  }, [isFormOpen])


  // ======================================================
  // FILTER TABLE
  // ======================================================
  const filteredInvoices = useMemo(() => {

    return invoices.filter((invoice) => {

      const searchValue =
        search.toLowerCase()

      const noNota =
        String(
          invoice.noNota || ''
        ).toLowerCase()

      const customer =
        String(
          invoice.customer || ''
        ).toLowerCase()

      const status =
        String(
          invoice.status || ''
        ).toLowerCase()

      const matchesSearch =
        noNota.includes(searchValue) ||
        customer.includes(searchValue) ||
        status.includes(searchValue)

      const matchesCustomer =
        !selectedCustomer ||
        Number(invoice.customerId) ===
          Number(selectedCustomer)

      let matchesDate = true

      const invoiceDate =
        new Date(
          formatDateForInput(
            invoice.tanggal
          )
        )

      if (filterStart) {

        matchesDate =
          matchesDate &&
          invoiceDate >=
            new Date(filterStart)

      }

      if (filterEnd) {

        matchesDate =
          matchesDate &&
          invoiceDate <=
            new Date(filterEnd)

      }

      return (
        matchesSearch &&
        matchesCustomer &&
        matchesDate
      )

    })

  }, [
    invoices,
    search,
    selectedCustomer,
    filterStart,
    filterEnd,
  ])


  // ======================================================
  // FORM CHANGE
  // ======================================================
  const handleFormChange = (event) => {

    const {
      name,
      value,
    } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

  }


  // ======================================================
  // FETCH SURAT JALAN BERDASARKAN PARAMETER
  // ======================================================
  const fetchSuratJalanByFilter = async ({
    customerId,
    driverId,
    tanggalDari,
    tanggalSampai,
    preserveSelectedIds = [],
  }) => {

    if (
      !customerId ||
      !driverId ||
      !tanggalDari ||
      !tanggalSampai
    ) {

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(false)

      return

    }


    if (
      tanggalDari >
      tanggalSampai
    ) {

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(false)

      return

    }


    try {

      setLoadingSuratJalan(true)
      setSuratJalanSearched(false)

      const response =
        await getSuratJalanDariSampai(
          Number(customerId),
          Number(driverId),
          tanggalDari,
          tanggalSampai
        )

      const items =
        Array.isArray(response?.items)
          ? response.items
          : []


      setSuratJalanItems(items)


      setTotalTagihan(
        Number(
          response?.total_tagihan || 0
        )
      )


      const normalizedPreservedIds =
        normalizeIds(
          preserveSelectedIds
        )


      // ==================================================
      // EDIT:
      // HANYA ITEM YANG SEBELUMNYA MASUK NOTA YANG DICENTANG
      // ==================================================
      if (
        normalizedPreservedIds.length > 0
      ) {

        const availableSelectedIds =
          items
            .map((item) =>
              getSuratJalanItemId(item)
            )
            .filter(
              (itemId) =>
                itemId !== null &&
                normalizedPreservedIds.includes(
                  Number(itemId)
                )
            )
            .map((itemId) =>
              Number(itemId)
            )

        setSelectedItemIds(
          availableSelectedIds
        )

      } else {

        // ==================================================
        // ADD:
        // SEMUA ITEM OTOMATIS TERPILIH
        // ==================================================
        setSelectedItemIds(
          items
            .map((item) =>
              getSuratJalanItemId(item)
            )
            .filter(
              (itemId) =>
                itemId !== null &&
                itemId !== undefined
            )
            .map((itemId) =>
              Number(itemId)
            )
        )

      }


      setSuratJalanSearched(true)

    } catch (error) {

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(true)

      Swal.fire({
        icon: 'error',
        title: 'Gagal mengambil surat jalan',
        text:
          error?.message ||
          'Data surat jalan gagal diambil.',
        confirmButtonColor: '#51448C',
      })

    } finally {

      setLoadingSuratJalan(false)

    }

  }


  // ======================================================
  // FETCH SURAT JALAN
  // ======================================================
  const fetchSuratJalan = async () => {

    await fetchSuratJalanByFilter({
      customerId:
        formData.customer_id,

      driverId:
        formData.driver_id,

      tanggalDari:
        formData.tanggal_kirim_dari,

      tanggalSampai:
        formData.tanggal_kirim_sampai,

      preserveSelectedIds:
        editingId !== null
          ? editSelectedItemIdsRef.current
          : [],
    })

  }


  // ======================================================
  // AUTO LOAD SURAT JALAN
  // ======================================================
  useEffect(() => {

    if (!isFormOpen) return


    if (
      !formData.customer_id ||
      !formData.driver_id ||
      !formData.tanggal_kirim_dari ||
      !formData.tanggal_kirim_sampai
    ) {

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(false)

      return

    }

    const timer =
      window.setTimeout(() => {

        fetchSuratJalan()

      }, 150)


    return () => {
      window.clearTimeout(timer)
    }

  }, [
    isFormOpen,
    formData.customer_id,
    formData.driver_id,
    formData.tanggal_kirim_dari,
    formData.tanggal_kirim_sampai,
  ])


  // ======================================================
  // SELECT ALL
  // ======================================================
  const isAllSelected =
    suratJalanItems.length > 0 &&
    selectedItemIds.length ===
      suratJalanItems.length


  const handleSelectAll = (event) => {

    if (event.target.checked) {

      const ids =
        suratJalanItems
          .map((item) =>
            getSuratJalanItemId(item)
          )
          .filter(
            (id) =>
              id !== null &&
              id !== undefined
          )
          .map((id) =>
            Number(id)
          )

      setSelectedItemIds(ids)

    } else {

      setSelectedItemIds([])

    }

  }


  // ======================================================
  // SELECT ITEM
  // ======================================================
  const handleSelectItem = (itemId) => {

    const normalizedId =
      Number(itemId)

    setSelectedItemIds(
      (currentIds) => {

        const normalizedCurrentIds =
          normalizeIds(currentIds)

        if (
          normalizedCurrentIds.includes(
            normalizedId
          )
        ) {

          const result =
            normalizedCurrentIds.filter(
              (id) =>
                id !== normalizedId
            )

          if (editingId !== null) {
            editSelectedItemIdsRef.current =
              result
          }

          return result

        }

        const result = [
          ...normalizedCurrentIds,
          normalizedId,
        ]

        if (editingId !== null) {
          editSelectedItemIdsRef.current =
            result
        }

        return result

      }
    )

  }


  // ======================================================
  // TOTAL TERPILIH
  // ======================================================
  const selectedTotal = useMemo(() => {

    return suratJalanItems
      .filter((item) => {

        const itemId =
          Number(
            getSuratJalanItemId(item)
          )

        return selectedItemIds.includes(
          itemId
        )

      })
      .reduce(
        (total, item) =>
          total +
          Number(item.total || 0),
        0
      )

  }, [
    suratJalanItems,
    selectedItemIds,
  ])


  // ======================================================
  // ADD
  // ======================================================
  const openAddForm = () => {

    editSelectedItemIdsRef.current = []

    setEditingId(null)
    setEditingStatus('')

    setFormData({
      tanggal: '',
      customer_id: '',
      driver_id: '',
      tanggal_kirim_dari: '',
      tanggal_kirim_sampai: '',
    })

    setSuratJalanItems([])
    setSelectedItemIds([])
    setTotalTagihan(0)
    setSuratJalanSearched(false)

    setIsFormClosing(false)
    setIsFormOpen(true)

  }


  // ======================================================
  // EDIT
  // ======================================================
  const openEditForm = (id) => {
  const invoice = invoices.find(
    (item) => Number(item.id) === Number(id)
  )

  if (!invoice) {
    Swal.fire({
      icon: 'error',
      title: 'Data tidak ditemukan',
      text: 'Data nota tagihan tidak ditemukan.',
      confirmButtonColor: '#51448C',
    })
    return
  }

  const existingItems = Array.isArray(invoice.items)
    ? invoice.items
    : []

  setEditingId(invoice.id)

  setEditingStatus(
    String(invoice.status || '').toLowerCase()
  )

  // SEMUA DATA NOTA LAMA DIMASUKKAN KEMBALI KE FORM
  setFormData({
    tanggal: formatDateForInput(invoice.tanggal),

    customer_id:
      invoice.customerId !== null &&
      invoice.customerId !== undefined
        ? String(invoice.customerId)
        : '',

    driver_id:
      invoice.driverId !== null &&
      invoice.driverId !== undefined
        ? String(invoice.driverId)
        : '',

    tanggal_kirim_dari:
      formatDateForInput(invoice.tanggalKirimDari),

    tanggal_kirim_sampai:
      formatDateForInput(invoice.tanggalKirimSampai),
  })

  // Surat jalan lama tetap ditampilkan
  setSuratJalanItems(existingItems)

  // Item lama tetap terpilih
  setSelectedItemIds(
    existingItems
      .map((item) => {
        return (
          item.item_id ??
          item.id ??
          item.surat_jalan_item_id
        )
      })
      .filter(
        (itemId) =>
          itemId !== null &&
          itemId !== undefined
      )
  )

  // Total lama tetap ditampilkan
  setTotalTagihan(
    Number(invoice.jumlah || 0)
  )

  setSuratJalanSearched(
    existingItems.length > 0
  )

  setIsFormClosing(false)
  setIsFormOpen(true)
}


  // ======================================================
  // CLOSE FORM
  // ======================================================
  const closeForm = () => {

    setIsFormClosing(true)

    window.setTimeout(() => {

      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)
      setEditingStatus('')

      editSelectedItemIdsRef.current =
        []

      setFormData({
        tanggal: '',
        customer_id: '',
        driver_id: '',
        tanggal_kirim_dari: '',
        tanggal_kirim_sampai: '',
      })

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(false)

    }, 250)

  }


  // ======================================================
  // SUBMIT
  // ======================================================
  const handleSubmit = async (event) => {

    event.preventDefault()


    // ==================================================
    // VALIDASI TANGGAL NOTA
    // ==================================================
    if (!formData.tanggal) {

      Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap',
        text:
          'Tanggal nota wajib diisi.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    // ==================================================
    // VALIDASI CUSTOMER
    // ==================================================
    if (!formData.customer_id) {

      Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap',
        text:
          'Customer wajib dipilih.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    // ==================================================
    // VALIDASI DRIVER
    // ==================================================
    if (!formData.driver_id) {

      Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap',
        text:
          'Driver wajib dipilih.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    // ==================================================
    // VALIDASI TANGGAL KIRIM
    // ==================================================
    if (
      !formData.tanggal_kirim_dari ||
      !formData.tanggal_kirim_sampai
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Data belum lengkap',
        text:
          'Tanggal kirim dari dan sampai wajib diisi.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    if (
      formData.tanggal_kirim_dari >
      formData.tanggal_kirim_sampai
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Tanggal tidak valid',
        text:
          'Tanggal kirim dari tidak boleh lebih besar dari tanggal sampai.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    // ==================================================
    // VALIDASI SURAT JALAN
    // ==================================================
    if (
      suratJalanItems.length === 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Surat jalan tidak tersedia',
        text:
          'Tidak ada surat jalan yang dapat digunakan untuk nota tagihan.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    if (
      selectedItemIds.length === 0
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Surat jalan belum dipilih',
        text:
          'Pilih minimal satu surat jalan.',
        confirmButtonColor: '#51448C',
      })

      return

    }


    // ==================================================
    // UPDATE
    // ==================================================
    if (editingId !== null) {

      const currentInvoice =
        invoices.find(
          (item) =>
            Number(item.id) ===
            Number(editingId)
        )


      if (!currentInvoice) {

        Swal.fire({
          icon: 'error',
          title: 'Data tidak ditemukan',
          text:
            'Data nota yang akan diperbarui tidak ditemukan.',
          confirmButtonColor: '#51448C',
        })

        return

      }


      const currentStatus =
        String(
          currentInvoice.status ||
          editingStatus ||
          ''
        ).toLowerCase()


      const isLunas =
        currentStatus === 'lunas' ||
        currentStatus === 'dilunaskan' ||
        currentInvoice.dilunaskan === true


      const useLunasApi =
        isLunas


      const statusText =
        useLunasApi
          ? 'Lunas'
          : currentStatus === 'cicil'
            ? 'Cicil'
            : 'Belum Bayar'


      const confirmResult =
        await Swal.fire({
          icon: 'question',
          title: 'Update Nota Tagihan?',
          html: `
            <div style="font-size:13px;color:#707070;line-height:1.8">
              <div>
                No. Nota:
                <strong>${currentInvoice.noNota || '-'}</strong>
              </div>

              <div>
                Customer:
                <strong>${currentInvoice.customer || '-'}</strong>
              </div>

              <div>
                Driver:
                <strong>${currentInvoice.driver || '-'}</strong>
              </div>

              <div>
                Surat Jalan:
                <strong>${selectedItemIds.length} item</strong>
              </div>

              <div>
                Status:
                <strong style="color:#51448C">
                  ${statusText}
                </strong>
              </div>

              <div style="margin-top:8px">
                Data nota akan diperbarui berdasarkan
                customer, driver, tanggal kirim,
                dan surat jalan yang dipilih.
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText:
            'Ya, Update',
          cancelButtonText:
            'Batal',
          confirmButtonColor:
            '#51448C',
          cancelButtonColor:
            '#999999',
          reverseButtons: true,
        })


      if (
        !confirmResult.isConfirmed
      ) {
        return
      }


      try {

        const payload = {

          customer_id:
            Number(
              formData.customer_id
            ),

          tanggal_kirim_dari:
            formData.tanggal_kirim_dari,

          tanggal_kirim_sampai:
            formData.tanggal_kirim_sampai,

          item_ids:
            normalizeIds(
              selectedItemIds
            ),

        }


        let response


        if (useLunasApi) {

          response =
            await updateNotaTagihanLunas(
              editingId,
              payload
            )

        } else {

          response =
            await updateNotaTagihanCicil(
              editingId,
              payload
            )

        }


        closeForm()


        await Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text:
            response?.message ||
            'Nota tagihan berhasil diperbarui.',
          confirmButtonColor:
            '#51448C',
        })


        await fetchNotaTagihan()

      } catch (error) {

        Swal.fire({
          icon: 'error',
          title: 'Gagal Update Nota',
          text:
            error?.message ||
            'Gagal memperbarui nota tagihan.',
          confirmButtonColor:
            '#51448C',
        })

      }

      return

    }


    // ==================================================
    // CREATE
    // ==================================================
    try {

      let response


      if (isAllSelected) {

        response =
          await createNotaTagihanAll({
            customer_id:
              Number(
                formData.customer_id
              ),

            tanggal_kirim_dari:
              formData.tanggal_kirim_dari,

            tanggal_kirim_sampai:
              formData.tanggal_kirim_sampai,
          })

      } else {

        response =
          await createNotaTagihanChecked({
            customer_id:
              Number(
                formData.customer_id
              ),

            tanggal_kirim_dari:
              formData.tanggal_kirim_dari,

            tanggal_kirim_sampai:
              formData.tanggal_kirim_sampai,

            item_ids:
              normalizeIds(
                selectedItemIds
              ),
          })

      }


      closeForm()


      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text:
          response?.message ||
          'Nota tagihan berhasil dibuat.',
        confirmButtonColor:
          '#51448C',
      })


      await fetchNotaTagihan()

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text:
          error?.message ||
          'Gagal membuat nota tagihan.',
        confirmButtonColor:
          '#51448C',
      })

    }

  }


  // ======================================================
  // PEMBAYARAN
  // ======================================================
  const handlePayment = (row) => {

    const today =
      new Date()
        .toISOString()
        .split('T')[0]


    const sisaTagihan =
      Number(
        row.sisa || 0
      )


    setPaymentData({

      id:
        row.id,

      noNota:
        row.noNota || '',

      tanggalBayar:
        today,

      totalTagihan:
        Number(
          row.jumlah || 0
        ),

      sisaTagihan:
        sisaTagihan,

      status:
        'normal',

      jumlahBayar:
        '',

    })


    setIsPaymentClosing(false)
    setIsPaymentOpen(true)

  }


  // ======================================================
  // CHANGE PEMBAYARAN
  // ======================================================
  const handlePaymentChange = (event) => {

    const {
      name,
      value,
    } = event.target


    setPaymentData((current) => {

      if (
        name === 'status' &&
        value === 'dilunaskan'
      ) {

        return {
          ...current,
          status:
            value,
          jumlahBayar:
            current.sisaTagihan,
        }

      }


      if (
        name === 'status' &&
        value === 'normal'
      ) {

        return {
          ...current,
          status:
            value,
          jumlahBayar:
            '',
        }

      }


      if (name === 'jumlahBayar') {
        const sanitizedValue = String(value).replace(/\D/g, '')

        return {
          ...current,
          jumlahBayar:
            sanitizedValue === ''
              ? ''
              : Number(sanitizedValue),
        }
      }


      return {
        ...current,
        [name]:
          value,
      }

    })

  }


  // ======================================================
  // CLOSE PAYMENT
  // ======================================================
  const closePaymentForm = (force = false) => {

    if (paymentLoading && !force) return

    setIsPaymentClosing(true)

    window.setTimeout(() => {

      setIsPaymentOpen(false)
      setIsPaymentClosing(false)

      setPaymentData({
        id: null,
        noNota: '',
        tanggalBayar: '',
        totalTagihan: 0,
        sisaTagihan: 0,
        status: 'normal',
        jumlahBayar: '',
      })

    }, 250)

  }


  // ======================================================
  // SUBMIT PAYMENT
  // ======================================================
  const handlePaymentSubmit =
    async (event) => {

      event.preventDefault()


      if (!paymentData.tanggalBayar) {

        Swal.fire({
          icon: 'warning',
          title: 'Tanggal belum diisi',
          text:
            'Tanggal bayar wajib diisi.',
          confirmButtonColor:
            '#51448C',
        })

        return

      }


      const jumlahBayar =
        Number(
          paymentData.jumlahBayar || 0
        )


      const sisaTagihan =
        Number(
          paymentData.sisaTagihan || 0
        )


      if (jumlahBayar <= 0) {

        Swal.fire({
          icon: 'warning',
          title:
            'Jumlah pembayaran tidak valid',
          text:
            'Jumlah bayar harus lebih dari 0.',
          confirmButtonColor:
            '#51448C',
        })

        return

      }


      if (
        jumlahBayar >
        sisaTagihan
      ) {

        Swal.fire({
          icon: 'warning',
          title:
            'Jumlah pembayaran terlalu besar',
          text:
            `Jumlah pembayaran tidak boleh lebih besar dari sisa tagihan ${formatRupiah(sisaTagihan)}.`,
          confirmButtonColor:
            '#51448C',
        })

        return

      }


      const isLunas =
        paymentData.status ===
        'dilunaskan'


      const statusText =
        isLunas
          ? 'Lunas'
          : 'Normal / Cicil'


      const confirmResult =
        await Swal.fire({

          icon: 'question',

          title:
            'Simpan Pembayaran?',

          html: `
            <div style="font-size:13px;color:#707070;line-height:1.8">

              <div>
                No. Nota:
                <strong>${paymentData.noNota}</strong>
              </div>

              <div>
                Status:
                <strong style="color:#51448C">
                  ${statusText}
                </strong>
              </div>

              <div>
                Jumlah:
                <strong style="color:#51448C">
                  ${formatRupiah(jumlahBayar)}
                </strong>
              </div>

            </div>
          `,

          showCancelButton:
            true,

          confirmButtonText:
            'Ya, Simpan',

          cancelButtonText:
            'Batal',

          confirmButtonColor:
            '#51448C',

          cancelButtonColor:
            '#999999',

          reverseButtons:
            true,

        })


      if (
        !confirmResult.isConfirmed
      ) {
        return
      }


      const payload = {

        status:
          isLunas
            ? 'dilunaskan'
            : 'normal',

        tanggal_bayar:
          paymentData.tanggalBayar,

        jumlah_bayar:
          jumlahBayar,

      }


      try {

        setPaymentLoading(true)

        let response


        if (!isLunas) {

          response =
            await bayarCicil(
              paymentData.id,
              payload
            )

        } else {

          response =
            await bayarLunas(
              paymentData.id,
              payload
            )

        }


        closePaymentForm(true)


        await Swal.fire({
          icon: 'success',
          title:
            'Pembayaran Berhasil',
          text:
            response?.message ||
            'Pembayaran berhasil dicatat.',
          confirmButtonColor:
            '#51448C',
        })


        await fetchNotaTagihan()

      } catch (error) {

        Swal.fire({
          icon: 'error',
          title:
            'Pembayaran Gagal',
          text:
            error?.message ||
            'Gagal mencatat pembayaran.',
          confirmButtonColor:
            '#51448C',
        })

      } finally {

        setPaymentLoading(false)

      }

    }


  // ======================================================
  // DELETE
  // ======================================================
  const handleDelete = async (row) => {

    const result =
      await Swal.fire({

        icon: 'warning',

        title:
          'Hapus Nota Tagihan?',

        html: `
          <div style="font-size:13px;color:#707070">
            Nota <strong>${row.noNota || '-'}</strong>
            akan dihapus.
            <br/>
            Data yang sudah dihapus tidak dapat dikembalikan.
          </div>
        `,

        showCancelButton:
          true,

        confirmButtonText:
          'Ya, Hapus',

        cancelButtonText:
          'Batal',

        confirmButtonColor:
          '#d33',

        cancelButtonColor:
          '#999999',

        reverseButtons:
          true,

      })


    if (!result.isConfirmed) {
      return
    }


    try {

      const response =
        await deleteNotaTagihan(
          row.id
        )


      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text:
          response?.message ||
          'Nota tagihan berhasil dihapus.',
        confirmButtonColor:
          '#51448C',
      })


      await fetchNotaTagihan()

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title:
          'Gagal Menghapus',
        text:
          error?.message ||
          'Nota tagihan gagal dihapus.',
        confirmButtonColor:
          '#51448C',
      })

    }

  }


  // ======================================================
  // PRATINJAU NOTA
  // ======================================================
  const handlePreview = async (row) => {
    try {
      setPreviewInvoice(row)
      setPreviewData('')
      setPreviewLoading(true)
      setIsPreviewClosing(false)
      setIsPreviewOpen(true)

      const response = await pratinjauNotaTagihan(row.id)

      const result =
        response?.data ??
        response?.preview ??
        response?.content ??
        response?.hasil ??
        response

      if (typeof result === 'string') {
        setPreviewData(result)
      } else if (result !== null && result !== undefined) {
        setPreviewData(JSON.stringify(result, null, 2))
      } else {
        setPreviewData('Data pratinjau nota tidak tersedia.')
      }
    } catch (error) {
      setIsPreviewOpen(false)

      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Pratinjau',
        text:
          error?.message ||
          'Pratinjau nota gagal diambil.',
        confirmButtonColor: '#51448C',
      })
    } finally {
      setPreviewLoading(false)
    }
  }

  // ======================================================
  // PRINT ULANG NOTA
  // ======================================================
  const handlePrintUlang = async () => {
    if (!previewInvoice?.id || printLoading) return

    const result = await Swal.fire({
      icon: 'question',
      title: 'Print Ulang Nota?',
      html: `
        <div style="font-size:13px;color:#707070;line-height:1.8">
          Nota <strong>${previewInvoice.noNota || '-'}</strong>
          akan dikirim ke API print ulang.
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Ya, Print Ulang',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#51448C',
      cancelButtonColor: '#999999',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      setPrintLoading(true)

      const response =
        await printUlangNotaTagihan(
          previewInvoice.id
        )

      await Swal.fire({
        icon: 'success',
        title: 'Print Ulang Berhasil',
        text:
          response?.message ||
          'Perintah print ulang berhasil dikirim.',
        confirmButtonColor: '#51448C',
      })

      // Refresh jumlah cetak / waktu cetak terbaru
      await fetchNotaTagihan()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Print Ulang Gagal',
        text:
          error?.message ||
          'Gagal mengirim perintah print ulang.',
        confirmButtonColor: '#51448C',
      })
    } finally {
      setPrintLoading(false)
    }
  }

  // ======================================================
  // CLOSE PRATINJAU
  // ======================================================
  const closePreview = () => {
    if (printLoading) return

    setIsPreviewClosing(true)

    window.setTimeout(() => {
      setIsPreviewOpen(false)
      setIsPreviewClosing(false)
      setPreviewData('')
      setPreviewInvoice(null)
    }, 200)
  }


  // ======================================================
  // STATUS
  // ======================================================
  const formatStatus = (status) => {

    if (!status)
      return 'Belum Bayar'


    const normalized =
      String(status)
        .toLowerCase()


    if (
      normalized ===
        'belum_bayar' ||
      normalized ===
        'belum bayar'
    ) {

      return 'Belum Bayar'

    }


    if (
      normalized ===
      'cicil'
    ) {

      return 'Cicil'

    }


    if (
      normalized ===
      'lunas'
    ) {

      return 'Lunas'

    }


    return status

  }


  // ======================================================
  // RENDER STATUS
  // ======================================================
  const renderStatus = (status) => {

    const formattedStatus =
      formatStatus(status)


    let className =
      'bg-[#f04423]'


    if (
      formattedStatus ===
      'Lunas'
    ) {

      className =
        'bg-[#459653]'

    } else if (
      formattedStatus ===
      'Cicil'
    ) {

      className =
        'bg-[#d0ad00]'

    }


    return (
      <span
        className={`inline-flex min-w-[92px] justify-center rounded-md px-3 py-1.5 text-xs font-medium text-white ${className}`}
      >
        {formattedStatus}
      </span>
    )

  }


  // ======================================================
  // TABLE COLUMNS
  // ======================================================
  const columns = [

    {
      key:
        'noNota',

      label:
        'No. Nota',
    },

    {
      key:
        'tanggal',

      label:
        'Tanggal',

      render:
        (row) =>
          formatDateDisplay(
            row.tanggal
          ),
    },

    {
      key:
        'customer',

      label:
        'Nama Customer',
    },

    {
      key:
        'jumlah',

      label:
        'Jumlah',

      render:
        (row) =>
          formatRupiah(
            row.jumlah
          ),
    },

    {
      key:
        'status',

      label:
        'Status',

      render:
        (row) =>
          renderStatus(
            row.status
          ),
    },

    {
      key:
        'update',

      label:
        'Update',

      render:
        (row) => (

          <button
            type="button"
            onClick={() =>
              handlePayment(row)
            }
            className="inline-flex items-center whitespace-nowrap rounded-md bg-[#51448C] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#433878]"
          >

            <span className="mr-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white text-[9px]">
              $
            </span>

            Pembayaran

          </button>

        ),

    },

  ]

  const paymentHistory =
    invoices.find(
      (invoice) =>
        Number(invoice.id) === Number(paymentData.id)
    )?.pembayaran || []


  // ======================================================
  // RETURN
  // ======================================================
  return (

    <main className="min-h-screen bg-white px-3 py-5 sm:px-5 sm:py-7 lg:ml-64 lg:px-8 lg:py-10">


      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="mb-5 flex items-center gap-3 sm:mb-6">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#51448C]">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 2.75h9l4 4V21.25H6A2.25 2.25 0 0 1 3.75 19V5A2.25 2.25 0 0 1 6 2.75Z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 2.75v4h5"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 11h7M8 14h7M8 17h4"
            />

          </svg>

        </div>

        <h1 className="text-lg font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          DAFTAR NOTA TAGIHAN
        </h1>

      </div>


      {/* ==================================================
          TABLE CONTAINER
      ================================================== */}
      <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">

        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex h-10 w-fit items-center rounded-md border border-[#e0e0e5] bg-white px-3 text-sm font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff]"
          >

            <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#51448C] text-xs font-bold text-white">
              +
            </span>

            Tambah Data

          </button>


          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap xl:w-auto">

            <div className="w-full sm:w-[200px]">

              <SearchableDropdown
                label="Customer"
                value={
                  selectedCustomer
                }
                options={
                  customers
                }
                onChange={
                  (value) =>
                    setSelectedCustomer(
                      value
                    )
                }
                placeholder="Pilih Customer"
                loading={
                  loadingCustomer
                }
                showLabel={false}
              />

            </div>


            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setIsFilterOpen(
                    (value) =>
                      !value
                  )
                }
                className={`inline-flex h-10 w-full items-center justify-center rounded-md border px-3 text-xs font-medium transition sm:w-auto ${
                  isFilterOpen ||
                  filterStart ||
                  filterEnd
                    ? 'border-[#51448C] bg-[#51448C] text-white'
                    : 'border-[#e0e0e5] bg-white text-[#51448C]'
                }`}
              >

                <span className="mr-1.5 text-[10px]">
                  ◉
                </span>

                Filter

              </button>


              {isFilterOpen && (

                <div className="absolute right-0 top-12 z-30 w-[min(285px,calc(100vw-32px))] rounded-xl border border-[#e0e0e5] bg-white p-4 shadow-[0_5px_18px_rgba(0,0,0,0.15)]">

                  <div className="mb-3 text-sm font-semibold text-[#51448C]">
                    Filter Tanggal
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">

                    <div className="flex-1">

                      <label className="mb-1 block text-[10px] text-[#707070]">
                        Dari
                      </label>

                      <input
                        type="date"
                        value={
                          filterStart
                        }
                        onChange={(e) =>
                          setFilterStart(
                            e.target.value
                          )
                        }
                        className="h-9 w-full rounded-md border border-[#e0e0e5] bg-white px-2 text-xs text-[#707070] outline-none focus:border-[#51448C]"
                      />

                    </div>

                    <div className="hidden pb-2 text-sm font-bold text-[#51448C] sm:block">
                      →
                    </div>

                    <div className="flex-1">

                      <label className="mb-1 block text-[10px] text-[#707070]">
                        Sampai
                      </label>

                      <input
                        type="date"
                        value={
                          filterEnd
                        }
                        onChange={(e) =>
                          setFilterEnd(
                            e.target.value
                          )
                        }
                        className="h-9 w-full rounded-md border border-[#e0e0e5] bg-white px-2 text-xs text-[#707070] outline-none focus:border-[#51448C]"
                      />

                    </div>

                  </div>


                  <div className="mt-3 flex justify-end gap-2">

                    <button
                      type="button"
                      onClick={() => {
                        setFilterStart('')
                        setFilterEnd('')
                      }}
                      className="rounded-md px-3 py-1.5 text-xs text-[#707070] hover:bg-[#f5f5f5]"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsFilterOpen(
                          false
                        )
                      }
                      className="rounded-md bg-[#51448C] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Terapkan
                    </button>

                  </div>

                </div>

              )}

            </div>


            <div className="flex h-10 w-full items-center rounded-md border border-[#e0e0e5] bg-white px-3 sm:w-[180px]">

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
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="h-8 w-full bg-transparent text-xs text-[#51448C] outline-none placeholder:text-[#51448C]"
                />

                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full bg-[#51448C] transition-all duration-300 group-focus-within:w-full" />

              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            TABLE
        ================================================== */}
        <div className="w-full overflow-x-auto">

          {loading ? (

            <div className="flex min-h-[200px] items-center justify-center text-sm text-[#51448C]">
              Memuat data nota tagihan...
            </div>

          ) : (

            <DataTable
              columns={columns}
              data={
                filteredInvoices
              }
              actionLabel="Action"
              tableClassName="min-w-[850px] text-xs sm:text-sm"
              actions={(row) => (

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(
                        row.id
                      )
                    }
                    className="inline-flex items-center whitespace-nowrap rounded-md bg-[#51448C] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#433878]"
                  >

                    <img
                      src={editIcon}
                      alt=""
                      className="mr-1.5 h-3.5 w-3.5 object-contain"
                    />

                    Edit

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        row
                      )
                    }
                    className="inline-flex items-center whitespace-nowrap rounded-md bg-[#d9534f] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#c9302c]"
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 7h12M9 7V4h6v3m-8 0 .75 13h6.5L15 7M10 11v5M14 11v5"
                      />

                    </svg>

                    Delete

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePreview(row)
                    }
                    className="inline-flex items-center whitespace-nowrap rounded-md bg-[#51448C] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#433878]"
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>

                    Pratinjau

                  </button>

                </div>

              )}
            />

          )}

        </div>

      </section>


      {/* ==================================================
          MODAL FORM
      ================================================== */}
      {isFormOpen && (

        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4 ${
            isFormClosing
              ? 'modal-backdrop-closing'
              : ''
          }`}
        >

          <div
            role="dialog"
            aria-modal="true"
            className={`flex max-h-[94vh] w-full max-w-[900px] flex-col overflow-hidden rounded-2xl bg-[#f7f7f7] shadow-[0_12px_40px_rgba(0,0,0,0.22)] ${
              isFormClosing
                ? 'modal-panel-closing'
                : ''
            }`}
          >

            {/* HEADER */}
            <div className="shrink-0 border-b border-[#e5e3ea] bg-[#f7f7f7] px-4 py-4 sm:px-6">

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#51448C]">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4.5A2.5 2.5 0 0 1 6.5 2H15l5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-13Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 2v6h6"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 13h8M8 16h5"
                      />

                    </svg>

                  </div>


                  <div className="min-w-0">

                    <h2 className="truncate text-base font-bold text-[#51448C] sm:text-xl">
                      {editingId !== null
                        ? 'EDIT NOTA TAGIHAN'
                        : 'INPUT NOTA TAGIHAN'}
                    </h2>

                    <p className="mt-0.5 text-[10px] text-[#707070] sm:text-xs">
                      Silahkan masukkan data nota tagihan
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-[#51448C] transition hover:bg-[#ebe8f4] hover:text-[#33295f]"
                >
                  ×
                </button>

              </div>

            </div>


            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin sm:px-6 sm:py-5">

              <form
                onSubmit={
                  handleSubmit
                }
              >

                {/* NO NOTA + TANGGAL */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                  <div>

                    <label className="mb-1.5 block text-xs font-medium text-[#333333]">
                      No. Nota
                    </label>

                    <input
                      value={
                        editingId !== null
                          ? invoices.find(
                              (item) =>
                                Number(item.id) ===
                                Number(editingId)
                            )?.noNota || ''
                          : ''
                      }
                      readOnly
                      placeholder="Otomatis oleh sistem"
                      className="h-11 w-full rounded-lg border border-[#e3e1e9] bg-[#eeeeee] px-3 text-xs text-[#707070] outline-none placeholder:text-[#bdbdbd]"
                    />

                  </div>


                  <div>

                    <label className="mb-1.5 block text-xs font-medium text-[#333333]">
                      Tanggal
                    </label>

                    <input
                      type="date"
                      name="tanggal"
                      value={
                        formData.tanggal
                      }
                      onChange={
                        handleFormChange
                      }
                      className="h-11 w-full rounded-lg border border-[#e3e1e9] bg-white px-3 text-xs text-[#707070] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                    />

                  </div>

                </div>


                {/* CUSTOMER + DRIVER */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                  <SearchableDropdown
                    label="Customer"
                    value={
                      formData.customer_id
                    }
                    options={
                      customers
                    }
                    onChange={(value) => {

                      editSelectedItemIdsRef.current =
                        []

                      setSelectedItemIds([])

                      setFormData(
                        (current) => ({
                          ...current,
                          customer_id:
                            value,
                        })
                      )

                    }}
                    placeholder="Pilih Customer"
                    loading={
                      loadingCustomer
                    }
                    disabled={
                      loadingCustomer
                    }
                  />


                  <SearchableDropdown
                    label="Driver"
                    value={
                      formData.driver_id
                    }
                    options={
                      drivers
                    }
                    onChange={(value) => {

                      editSelectedItemIdsRef.current =
                        []

                      setSelectedItemIds([])

                      setFormData(
                        (current) => ({
                          ...current,
                          driver_id:
                            value,
                        })
                      )

                    }}
                    placeholder="Pilih Driver"
                    loading={
                      loadingDriver
                    }
                    disabled={
                      loadingDriver
                    }
                  />

                </div>


                {/* TANGGAL KIRIM */}
                <div className="mt-4">

                  <label className="mb-1.5 block text-xs font-medium text-[#333333]">
                    Tanggal Kirim
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end sm:gap-4">

                    <div>

                      <label className="mb-1 block text-[10px] text-[#707070]">
                        Dari
                      </label>

                      <input
                        type="date"
                        name="tanggal_kirim_dari"
                        value={
                          formData.tanggal_kirim_dari
                        }
                        onChange={
                          handleFormChange
                        }
                        className="h-11 w-full rounded-lg border border-[#e3e1e9] bg-white px-3 text-xs text-[#707070] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                      />

                    </div>


                    <div className="hidden pb-2 text-xs font-semibold text-[#51448C] sm:block">
                      s/d
                    </div>


                    <div>

                      <label className="mb-1 block text-[10px] text-[#707070]">
                        Sampai
                      </label>

                      <input
                        type="date"
                        name="tanggal_kirim_sampai"
                        value={
                          formData.tanggal_kirim_sampai
                        }
                        onChange={
                          handleFormChange
                        }
                        className="h-11 w-full rounded-lg border border-[#e3e1e9] bg-white px-3 text-xs text-[#707070] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                      />

                    </div>

                  </div>

                </div>


                {/* LOADING */}
                {loadingSuratJalan && (

                  <div className="mt-4 flex items-center rounded-lg border border-[#ddd8f0] bg-[#f0eefb] px-3 py-2.5 text-[10px] text-[#51448C]">

                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#51448C]/30 border-t-[#51448C]" />

                    Sedang mengambil data surat jalan...

                  </div>

                )}


                {/* TABEL SURAT JALAN */}
                <div className="mt-4">

                  <div className="mb-2 flex items-center justify-between">

                    <div>

                      <h3 className="text-xs font-semibold text-[#333333]">
                        Daftar Surat Jalan
                      </h3>

                      <p className="mt-0.5 text-[9px] text-[#999999]">
                        Pilih surat jalan yang akan dimasukkan ke nota tagihan
                      </p>

                    </div>


                    {suratJalanItems.length > 0 && (

                      <span className="rounded-full bg-[#eeebf7] px-2.5 py-1 text-[9px] font-medium text-[#51448C]">
                        {selectedItemIds.length} / {suratJalanItems.length} dipilih
                      </span>

                    )}

                  </div>


                  <div className="w-full overflow-hidden rounded-xl border border-[#dedde5] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">

                    <div className="w-full overflow-x-auto scrollbar-thin">

                      <div className="max-h-[300px] min-w-[760px] overflow-y-auto scrollbar-thin">

                        <table className="w-full text-left text-[10px]">

                          <thead className="sticky top-0 z-20 bg-[#faf9fd] text-[#51448C]">

                            <tr className="border-b border-[#51448C]/30">

                              <th className="sticky left-0 z-30 w-12 bg-[#faf9fd] px-2 py-3 text-center">

                                <input
                                  type="checkbox"
                                  checked={
                                    isAllSelected
                                  }
                                  onChange={
                                    handleSelectAll
                                  }
                                  disabled={
                                    suratJalanItems.length ===
                                    0
                                  }
                                  className="h-4 w-4 cursor-pointer accent-[#51448C]"
                                />

                              </th>

                              <th className="min-w-[110px] whitespace-nowrap px-3 py-3 font-semibold">
                                No. SJ
                              </th>

                              <th className="min-w-[110px] whitespace-nowrap px-3 py-3 font-semibold">
                                Tanggal
                              </th>

                              <th className="min-w-[220px] px-3 py-3 font-semibold">
                                Material
                              </th>

                              <th className="min-w-[80px] px-3 py-3 text-center font-semibold">
                                Qty
                              </th>

                              <th className="min-w-[150px] whitespace-nowrap px-3 py-3 text-right font-semibold">
                                Harga Jual
                              </th>

                              <th className="min-w-[150px] whitespace-nowrap px-3 py-3 text-right font-semibold">
                                Total
                              </th>

                            </tr>

                          </thead>


                          <tbody className="divide-y divide-[#eeeeee] text-[#707070]">

                            {suratJalanItems.length > 0 ? (

                              suratJalanItems.map(
                                (item) => {

                                  const itemId =
                                    getSuratJalanItemId(
                                      item
                                    )

                                  const normalizedItemId =
                                    Number(
                                      itemId
                                    )

                                  const isChecked =
                                    selectedItemIds.includes(
                                      normalizedItemId
                                    )


                                  return (

                                    <tr
                                      key={
                                        `${itemId}-${item.no_surat_jalan || ''}`
                                      }
                                      className={`transition ${
                                        isChecked
                                          ? 'bg-[#faf9ff]'
                                          : 'bg-white'
                                      } hover:bg-[#f8f7fc]`}
                                    >

                                      <td
                                        className={`sticky left-0 z-10 px-2 py-3 text-center ${
                                          isChecked
                                            ? 'bg-[#faf9ff]'
                                            : 'bg-white'
                                        }`}
                                      >

                                        <input
                                          type="checkbox"
                                          checked={
                                            isChecked
                                          }
                                          onChange={() =>
                                            handleSelectItem(
                                              normalizedItemId
                                            )
                                          }
                                          className="h-4 w-4 cursor-pointer accent-[#51448C]"
                                        />

                                      </td>


                                      <td className="whitespace-nowrap px-3 py-3 font-medium text-[#444444]">
                                        {
                                          item.no_surat_jalan ||
                                          '-'
                                        }
                                      </td>


                                      <td className="whitespace-nowrap px-3 py-3">

                                        {item.tanggal
                                          ? formatDateDisplay(
                                              item.tanggal
                                            )
                                          : '-'}

                                      </td>


                                      <td className="max-w-[300px] px-3 py-3 uppercase">

                                        <div
                                          className="truncate"
                                          title={
                                            item.nama_barang ||
                                            ''
                                          }
                                        >
                                          {
                                            item.nama_barang ||
                                            '-'
                                          }
                                        </div>

                                      </td>


                                      <td className="px-3 py-3 text-center">
                                        {
                                          item.qty ??
                                          0
                                        }
                                      </td>


                                      <td className="whitespace-nowrap px-3 py-3 text-right">

                                        {formatRupiah(
                                          item.harga_jual
                                        )}

                                      </td>


                                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-[#333333]">

                                        {formatRupiah(
                                          item.total
                                        )}

                                      </td>

                                    </tr>

                                  )

                                }
                              )

                            ) : (

                              <tr>

                                <td
                                  colSpan={7}
                                  className="h-[180px] px-3 py-5 text-center"
                                >

                                  {!formData.customer_id ||
                                  !formData.driver_id ||
                                  !formData.tanggal_kirim_dari ||
                                  !formData.tanggal_kirim_sampai ? (

                                    <div className="flex flex-col items-center justify-center">

                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mb-2 h-9 w-9 text-[#c7c3d3]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                      >

                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 5h6M9 9h6M9 13h3m-7 8h10a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 13.172 2H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2Z"
                                        />

                                      </svg>

                                      <span className="text-[11px] font-medium text-[#8f899d]">
                                        Surat jalan akan muncul di sini
                                      </span>

                                      <span className="mt-1 text-[9px] text-[#b0abb8]">
                                        Pilih customer, driver, dan tanggal kirim
                                      </span>

                                    </div>

                                  ) : loadingSuratJalan ? (

                                    <div className="flex flex-col items-center justify-center">

                                      <span className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-[#51448C]/20 border-t-[#51448C]" />

                                      <span className="text-[10px] text-[#8f899d]">
                                        Memuat surat jalan...
                                      </span>

                                    </div>

                                  ) : suratJalanSearched ? (

                                    <div className="flex flex-col items-center justify-center">

                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mb-2 h-9 w-9 text-[#c7c3d3]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                      >

                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 5h6M9 9h6M9 13h3m-7 8h10a2 2 0 0 0 2-2V7.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 13.172 2H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2Z"
                                        />

                                      </svg>

                                      <span className="text-[11px] font-medium text-[#8f899d]">
                                        Tidak ada surat jalan
                                      </span>

                                      <span className="mt-1 text-[9px] text-[#b0abb8]">
                                        Tidak ditemukan data pada filter yang dipilih
                                      </span>

                                    </div>

                                  ) : (

                                    <div className="text-[10px] text-[#a5a0ae]">
                                      Belum ada data surat jalan
                                    </div>

                                  )}

                                </td>

                              </tr>

                            )}

                          </tbody>


                          <tfoot>

                            <tr className="border-t border-[#dedde5] bg-[#fafafa]">

                              <td
                                colSpan={6}
                                className="px-3 py-3 text-right font-semibold text-[#333333]"
                              >
                                Total
                              </td>

                              <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-[#333333]">

                                {formatRupiah(
                                  selectedTotal
                                )}

                              </td>

                            </tr>

                          </tfoot>

                        </table>

                      </div>

                    </div>

                  </div>

                </div>


                {/* WARNING */}
                {suratJalanSearched &&
                  suratJalanItems.length > 0 &&
                  selectedItemIds.length === 0 && (

                    <div className="mt-2 flex items-center rounded-md bg-red-50 px-3 py-2 text-[10px] text-red-500">

                      <span className="mr-1.5">
                        ⚠
                      </span>

                      Pilih minimal satu surat jalan

                    </div>

                  )}


                {/* FOOTER */}
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e5e3ea] pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={
                      closeForm
                    }
                    className="w-full rounded-lg border border-[#dedbe6] bg-white px-4 py-2.5 text-xs font-medium text-[#707070] transition hover:bg-[#f4f3f6] sm:w-auto"
                  >
                    Batal
                  </button>


                  <button
                    type="submit"
                    disabled={
                      loadingSuratJalan ||
                      selectedItemIds.length === 0
                    }
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-xs font-medium text-white transition sm:w-auto ${
                      loadingSuratJalan ||
                      selectedItemIds.length === 0
                        ? 'cursor-not-allowed bg-[#aaa5c1]'
                        : 'bg-[#51448C] hover:bg-[#433878]'
                    }`}
                  >

                    <img
                      src={saveIcon}
                      alt=""
                      className="mr-2 h-4 w-4 object-contain"
                    />

                    {editingId !== null
                      ? 'Update Data'
                      : 'Simpan Data'}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          MODAL PRATINJAU NOTA
      ================================================== */}
      {isPreviewOpen && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-2 backdrop-blur-[2px] sm:p-4 ${
            isPreviewClosing
              ? 'modal-backdrop-closing'
              : ''
          }`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePreview()
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-nota-title"
            className={`flex max-h-[96vh] w-full max-w-[980px] flex-col overflow-hidden rounded-2xl bg-[#f3f3f5] shadow-[0_20px_70px_rgba(0,0,0,0.30)] ${
              isPreviewClosing
                ? 'modal-panel-closing'
                : ''
            }`}
          >
            {/* HEADER */}
            <div className="shrink-0 border-b border-[#dedde5] bg-white px-4 py-3.5 sm:px-6">
              <div className="flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#51448C] shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 2.75h9l4 4V21.25H6A2.25 2.25 0 0 1 3.75 19V5A2.25 2.25 0 0 1 6 2.75Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 2.75v4h5"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h2
                      id="preview-nota-title"
                      className="truncate text-base font-bold text-[#51448C] sm:text-xl"
                    >
                      PRATINJAU NOTA TAGIHAN
                    </h2>

                    <p className="mt-0.5 truncate text-[10px] text-[#8a8791] sm:text-xs">
                      {previewInvoice?.noNota || 'Nota Tagihan'}
                      {previewInvoice?.customer
                        ? ` • ${previewInvoice.customer}`
                        : ''}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {/* PRINT ULANG - DI UJUNG KANAN */}
                  <button
                    type="button"
                    onClick={handlePrintUlang}
                    disabled={previewLoading || printLoading}
                    className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-sm transition ${
                      previewLoading || printLoading
                        ? 'cursor-not-allowed bg-[#aaa5c1]'
                        : 'bg-[#51448C] hover:bg-[#433878]'
                    }`}
                  >
                    {printLoading ? (
                      <>
                        <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 14h12v7H6z"
                          />
                        </svg>
                        Print Ulang
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closePreview}
                    disabled={printLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl leading-none text-[#51448C] transition hover:bg-[#eeebf7] hover:text-[#33295f] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Tutup pratinjau"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#e9e9ec] p-3 sm:p-5">
              {previewLoading ? (
                <div className="flex min-h-[500px] items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="mb-3 h-9 w-9 animate-spin rounded-full border-4 border-[#51448C]/20 border-t-[#51448C]" />
                    <span className="text-xs font-medium text-[#51448C]">
                      Memuat pratinjau nota...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-full max-w-[900px] overflow-hidden rounded-xl bg-white shadow-[0_5px_25px_rgba(0,0,0,0.14)]">
                  <div className="h-1.5 bg-[#51448C]" />

                  <div className="overflow-x-auto p-4 sm:p-7">
                    <pre className="min-w-max whitespace-pre font-mono text-[10px] leading-[1.55] text-[#222222] sm:text-xs">
{previewData || 'Data pratinjau nota tidak tersedia.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="shrink-0 border-t border-[#dedde5] bg-white px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] text-[#999999] sm:text-xs">
                  Pastikan isi nota sudah benar sebelum melakukan print ulang.
                </div>

                <button
                  type="button"
                  onClick={closePreview}
                  disabled={printLoading}
                  className="shrink-0 rounded-lg border border-[#dedbe6] bg-white px-4 py-2 text-xs font-medium text-[#707070] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ==================================================
          MODAL PEMBAYARAN
      ================================================== */}
      {isPaymentOpen && (

        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-2 sm:p-4 ${
            isPaymentClosing
              ? 'modal-backdrop-closing'
              : ''
          }`}
        >

          <div
            role="dialog"
            aria-modal="true"
            className={`flex max-h-[94vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-2xl bg-[#f7f7f7] shadow-[0_15px_50px_rgba(0,0,0,0.25)] ${
              isPaymentClosing
                ? 'modal-panel-closing'
                : ''
            }`}
          >

            {/* HEADER */}
            <div className="shrink-0 border-b border-[#e5e3ea] bg-[#f7f7f7] px-4 py-4 sm:px-6">

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#51448C]">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-4-3.5c0 1.1 1.8 2 4 2s4-.9 4-2-1.8-2-4-2-4-.9-4-2 1.8-2 4-2 4 .9 4 2"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3v3M12 18v3"
                      />

                    </svg>

                  </div>


                  <div className="min-w-0">

                    <h2 className="text-lg font-bold text-[#51448C] sm:text-2xl">
                      PEMBAYARAN NOTA TAGIHAN
                    </h2>

                    <p className="mt-0.5 text-[10px] text-[#707070] sm:text-xs">
                      Input pembayaran untuk nota tagihan
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={
                    closePaymentForm
                  }
                  disabled={
                    paymentLoading
                  }
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-[#51448C] transition hover:bg-[#ebe8f4] hover:text-[#33295f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ×
                </button>

              </div>

            </div>


            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-thin sm:px-6 sm:py-6">

              <form
                onSubmit={
                  handlePaymentSubmit
                }
              >

                <div className="rounded-xl border border-[#dedde5] bg-white p-4 shadow-sm sm:p-5">

                  <div className="mb-4">

                    <h3 className="text-sm font-bold text-[#333333] sm:text-base">
                      Informasi Pembayaran
                    </h3>

                    <p className="mt-1 text-[10px] text-[#999999] sm:text-xs">
                      Data nota terisi otomatis berdasarkan nota yang dipilih.
                    </p>

                  </div>


                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        No. Nota
                      </label>

                      <input
                        type="text"
                        value={
                          paymentData.noNota
                        }
                        readOnly
                        className="h-12 w-full rounded-lg border border-[#e3e1e9] bg-[#eeeeee] px-3 text-sm font-semibold text-[#51448C] outline-none"
                      />

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        Tanggal Bayar
                      </label>

                      <input
                        type="date"
                        name="tanggalBayar"
                        value={
                          paymentData.tanggalBayar
                        }
                        onChange={
                          handlePaymentChange
                        }
                        disabled={
                          paymentLoading
                        }
                        className="h-12 w-full rounded-lg border border-[#e3e1e9] bg-white px-3 text-sm text-[#707070] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                      />

                    </div>

                  </div>


                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        Total Tagihan
                      </label>

                      <div className="flex h-12 items-center rounded-lg border border-[#e3e1e9] bg-[#eeeeee] px-3">

                        <span className="text-base font-bold text-[#333333] sm:text-lg">
                          {formatRupiah(
                            paymentData.totalTagihan
                          )}
                        </span>

                      </div>

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        Sisa Tagihan
                      </label>

                      <div className="flex h-12 items-center rounded-lg border border-[#ddd8f0] bg-[#f1effa] px-3">

                        <span className="text-base font-bold text-[#51448C] sm:text-lg">
                          {formatRupiah(
                            paymentData.sisaTagihan
                          )}
                        </span>

                      </div>

                    </div>

                  </div>


                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        Opsi Pembayaran
                      </label>

                      <select
                        name="status"
                        value={
                          paymentData.status
                        }
                        onChange={
                          handlePaymentChange
                        }
                        disabled={
                          paymentLoading
                        }
                        className="h-12 w-full rounded-lg border border-[#e3e1e9] bg-white px-3 text-sm text-[#333333] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                      >

                        <option value="normal">
                          Normal / Cicil
                        </option>

                        <option value="dilunaskan">
                          Lunas
                        </option>

                      </select>

                      <p className="mt-1.5 text-[10px] text-[#999999]">

                        {paymentData.status ===
                        'dilunaskan'
                          ? 'Jumlah pembayaran otomatis mengikuti seluruh sisa tagihan.'
                          : 'Masukkan nominal pembayaran yang akan dicicil.'}

                      </p>

                    </div>


                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-[#333333]">
                        Jumlah Bayar
                      </label>

                      <div className="relative">

                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#707070]">
                          Rp
                        </span>

                        <input
                          type="text"
                          inputMode="numeric"
                          name="jumlahBayar"
                          value={
                            paymentData.jumlahBayar
                              ? formatNumberWithDots(
                                  paymentData.jumlahBayar
                                )
                              : ''
                          }
                          onChange={
                            handlePaymentChange
                          }
                          readOnly={
                            paymentData.status ===
                            'dilunaskan'
                          }
                          disabled={
                            paymentLoading
                          }
                          placeholder="Masukkan jumlah pembayaran"
                          className={`h-12 w-full rounded-lg border border-[#e3e1e9] pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10 ${
                            paymentData.status ===
                            'dilunaskan'
                              ? 'bg-[#eeeeee] text-[#51448C]'
                              : 'bg-white text-[#333333]'
                          }`}
                        />

                      </div>

                      <p className="mt-1.5 text-[10px] text-[#999999]">

                        Maksimal pembayaran:{' '}

                        <span className="font-semibold text-[#51448C]">

                          {formatRupiah(
                            paymentData.sisaTagihan
                          )}

                        </span>

                      </p>

                    </div>

                  </div>

                </div>


                {/* RIWAYAT */}
                <div className="mt-5 rounded-xl border border-[#dedde5] bg-white shadow-sm">

                  <div className="border-b border-[#eeeeee] px-4 py-4 sm:px-5">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <h3 className="text-sm font-bold text-[#333333] sm:text-base">
                          Riwayat Pembayaran
                        </h3>

                        <p className="mt-1 text-[10px] text-[#999999] sm:text-xs">
                          Riwayat pembayaran tersimpan untuk nota ini.
                        </p>

                      </div>

                      <span className="w-fit rounded-full bg-[#f1effa] px-3 py-1 text-[10px] font-medium text-[#51448C]">
                        {paymentHistory.length} pembayaran
                      </span>

                    </div>

                  </div>


                  <div className="w-full overflow-x-auto">

                    <div className="max-h-[260px] min-w-[650px] overflow-y-auto scrollbar-thin">

                      <table className="w-full text-left text-xs">

                        <thead className="sticky top-0 z-10 bg-[#faf9fd] text-[#51448C]">

                          <tr className="border-b border-[#dedde5]">

                            <th className="px-4 py-3 font-semibold">
                              No.
                            </th>

                            <th className="px-4 py-3 font-semibold">
                              Tanggal Bayar
                            </th>

                            <th className="px-4 py-3 font-semibold">
                              Status
                            </th>

                            <th className="px-4 py-3 text-right font-semibold">
                              Jumlah Bayar
                            </th>

                            <th className="px-4 py-3 text-center font-semibold">
                              Aksi
                            </th>

                          </tr>

                        </thead>


                        <tbody className="divide-y divide-[#eeeeee]">
                          {paymentHistory.length > 0 ? (
                            paymentHistory.map((payment, index) => {
                              const status =
                                String(payment.status || '').toLowerCase() === 'dilunaskan' ||
                                String(payment.status || '').toLowerCase() === 'lunas'
                                  ? 'Lunas'
                                  : 'Cicil'

                              return (
                                <tr key={payment.id ?? payment.pembayaran_id ?? index}>
                                  <td className="px-4 py-3 text-[#707070]">
                                    {index + 1}
                                  </td>
                                  <td className="px-4 py-3 text-[#707070]">
                                    {formatDateDisplay(
                                      payment.tanggal_bayar ?? payment.tanggal
                                    ) || '-'}
                                  </td>
                                  <td className="px-4 py-3">
                                    {renderStatus(status)}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-[#333333]">
                                    {formatRupiah(
                                      payment.jumlah_bayar ?? payment.jumlah
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-center text-[#999999]">
                                    -
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="h-[120px] px-4 py-6 text-center text-xs text-[#8f899d]">
                                Belum ada riwayat pembayaran untuk nota ini.
                              </td>
                            </tr>
                          )}
                        </tbody>

                      </table>

                    </div>

                  </div>

                </div>


                {/* INFO */}
                <div className="mt-4 rounded-lg border border-[#ddd8f0] bg-[#f5f3fb] px-4 py-3">

                  <div className="flex items-start gap-2">

                    <span className="mt-0.5 text-sm text-[#51448C]">
                      ℹ
                    </span>

                    <div className="text-[10px] leading-relaxed text-[#707070] sm:text-xs">

                      <p className="font-semibold text-[#51448C]">
                        Informasi Pembayaran
                      </p>

                      <p className="mt-1">
                        Pilih <strong>Normal / Cicil</strong> jika hanya membayar sebagian tagihan.
                        Pilih <strong>Lunas</strong> jika ingin melunasi seluruh sisa tagihan.
                      </p>

                    </div>

                  </div>

                </div>


                {/* FOOTER */}
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e5e3ea] pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={
                      closePaymentForm
                    }
                    disabled={
                      paymentLoading
                    }
                    className="w-full rounded-lg border border-[#dedbe6] bg-white px-5 py-3 text-xs font-medium text-[#707070] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Batal
                  </button>


                  <button
                    type="submit"
                    disabled={
                      paymentLoading ||
                      !paymentData.tanggalBayar ||
                      Number(
                        paymentData.jumlahBayar || 0
                      ) <= 0
                    }
                    className={`flex w-full items-center justify-center rounded-lg px-6 py-3 text-xs font-medium text-white transition sm:w-auto ${
                      paymentLoading ||
                      !paymentData.tanggalBayar ||
                      Number(
                        paymentData.jumlahBayar || 0
                      ) <= 0
                        ? 'cursor-not-allowed bg-[#aaa5c1]'
                        : 'bg-[#51448C] hover:bg-[#433878]'
                    }`}
                  >

                    {paymentLoading ? (

                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Menyimpan...
                      </>

                    ) : (

                      <>
                        <img
                          src={saveIcon}
                          alt=""
                          className="mr-2 h-4 w-4 object-contain"
                        />

                        Simpan Pembayaran
                      </>

                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}

export default Nota