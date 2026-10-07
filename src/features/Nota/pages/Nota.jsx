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
} from '../../../services/NotaServices'

import { getCustomers } from '../../../services/CustomerServices'
import { getDriver } from '../../../services/DriverServices'


// ======================================================
// FORMAT RUPIAH
// ======================================================
const formatRupiah = (value) => {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}.00`
}


// ======================================================
// FORMAT TANGGAL
// ======================================================
const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/')

    return `${year}-${month}-${day}`
  }

  return dateString
}


const formatDateDisplay = (dateString) => {
  if (!dateString) return ''

  const [year, month, day] = dateString.split('-')

  return `${day}/${month}/${year}`
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
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  const selectedOption = options.find(
    (option) => String(option.id) === String(value)
  )

  const filteredOptions = options.filter((option) =>
    String(option.name || '')
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  )


  // ======================================================
  // CLICK OUTSIDE
  // ======================================================
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


  // ======================================================
  // BUKA DROPDOWN
  // ======================================================
  const handleOpen = () => {
    if (disabled) return

    setIsOpen((current) => !current)

    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 50)
  }


  // ======================================================
  // PILIH DATA
  // ======================================================
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

      <label className="mb-1.5 block text-xs font-medium text-[#333333]">
        {label}
      </label>


      {/* ==================================================
          BUTTON DROPDOWN
      ================================================== */}
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


      {/* ==================================================
          DROPDOWN
      ================================================== */}
      {isOpen && !disabled && (

        <div className="absolute left-0 right-0 top-[72px] z-[100] overflow-hidden rounded-xl border border-[#dedde5] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.16)]">

          {/* SEARCH */}
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
                  setSearchValue(event.target.value)
                }
                placeholder={`Cari ${label.toLowerCase()}...`}
                className="ml-2 h-full min-w-0 w-full bg-transparent text-xs text-[#333333] outline-none placeholder:text-[#aaa5b5]"
              />

            </div>

          </div>


          {/* OPTION LIST */}
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


  // ======================================================
  // GET NOTA TAGIHAN
  // ======================================================
  const fetchNotaTagihan = async () => {
    try {
      setLoading(true)

      const response = await getNotaTagihan()

      const items = response?.items || []

      const formattedData = items.map((item) => ({
        id: item.id,
        noNota: item.no_nota,
        tanggal: item.tanggal_nota,

        customerId: item.customer_id,
        customer: item.nama_customer,

        driverId: item.driver_id,
        driver: item.nama_supir,

        tanggalKirimDari: item.tanggal_kirim_dari,
        tanggalKirimSampai: item.tanggal_kirim_sampai,

        jumlah: item.total_tagihan,
        bayar: item.bayar,
        sisa: item.sisa,

        status: item.status,
        dilunaskan: item.dilunaskan,

        jumlahCetak: item.jumlah_cetak,
        terakhirDicetak: item.terakhir_dicetak,

        // simpan detail item apabila tersedia
        items: item.items || [],
        pembayaran: item.pembayaran || [],
      }))

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
  // LOAD CUSTOMER & DRIVER
  // ======================================================
  useEffect(() => {

    if (!isFormOpen) return

    fetchCustomers()
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
        invoice.customerId ===
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
  // FETCH SURAT JALAN
  // ======================================================
  const fetchSuratJalan = async () => {

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

    if (
      formData.tanggal_kirim_dari >
      formData.tanggal_kirim_sampai
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Tanggal tidak valid',
        text:
          'Tanggal dari tidak boleh lebih besar dari tanggal sampai.',
        confirmButtonColor: '#51448C',
      })

      return
    }

    try {

      setLoadingSuratJalan(true)
      setSuratJalanSearched(false)

      const response =
        await getSuratJalanDariSampai(
          Number(
            formData.customer_id
          ),
          Number(
            formData.driver_id
          ),
          formData.tanggal_kirim_dari,
          formData.tanggal_kirim_sampai
        )

      const items =
        response?.items || []

      setSuratJalanItems(items)

      setTotalTagihan(
        Number(
          response?.total_tagihan || 0
        )
      )

      setSelectedItemIds(
        items.map(
          (item) => item.item_id
        )
      )

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
  // AUTO LOAD SURAT JALAN
  // ======================================================
  useEffect(() => {

    if (!isFormOpen) return

    if (editingId !== null) return

    if (
      formData.customer_id &&
      formData.driver_id &&
      formData.tanggal_kirim_dari &&
      formData.tanggal_kirim_sampai
    ) {

      fetchSuratJalan()

    } else {

      setSuratJalanItems([])
      setSelectedItemIds([])
      setTotalTagihan(0)
      setSuratJalanSearched(false)

    }

  }, [
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

      setSelectedItemIds(
        suratJalanItems.map(
          (item) => item.item_id
        )
      )

    } else {

      setSelectedItemIds([])

    }

  }


  // ======================================================
  // SELECT ITEM
  // ======================================================
  const handleSelectItem = (itemId) => {

    setSelectedItemIds(
      (currentIds) => {

        if (
          currentIds.includes(itemId)
        ) {

          return currentIds.filter(
            (id) => id !== itemId
          )

        }

        return [
          ...currentIds,
          itemId,
        ]

      }
    )

  }


  // ======================================================
  // TOTAL TERPILIH
  // ======================================================
  const selectedTotal = useMemo(() => {

    return suratJalanItems
      .filter((item) =>
        selectedItemIds.includes(
          item.item_id
        )
      )
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

  setIsFormOpen(true)
}


  // ======================================================
  // EDIT
  // ======================================================
  const openEditForm = (id) => {

  const invoice = invoices.find(
    (item) => item.id === id
  )

  if (!invoice) return

  setEditingId(invoice.id)

  setEditingStatus(
    invoice.status || ''
  )

  setFormData({
    tanggal:
      formatDateForInput(
        invoice.tanggal
      ),

    customer_id:
      invoice.customerId
        ? String(invoice.customerId)
        : '',

    driver_id:
      invoice.driverId
        ? String(invoice.driverId)
        : '',

    tanggal_kirim_dari:
      formatDateForInput(
        invoice.tanggalKirimDari
      ),

    tanggal_kirim_sampai:
      formatDateForInput(
        invoice.tanggalKirimSampai
      ),
  })

  // gunakan items dari response apabila tersedia
  const existingItems =
    invoice.items || []

  setSuratJalanItems(
    existingItems
  )

  setSelectedItemIds(
    existingItems.map(
      (item) => item.item_id
    )
  )

  setTotalTagihan(
    Number(
      invoice.jumlah || 0
    )
  )

  setSuratJalanSearched(
    existingItems.length > 0
  )

  setIsFormOpen(true)
}


  // ======================================================
  // CLOSE
  // ======================================================
  const closeForm = () => {

    setIsFormClosing(true)

    window.setTimeout(() => {

      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingId(null)

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

  // ======================================================
  // VALIDASI UMUM
  // ======================================================

  if (!formData.tanggal) {

    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      text: 'Tanggal nota wajib diisi.',
      confirmButtonColor: '#51448C',
    })

    return
  }

  if (!formData.customer_id) {

    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      text: 'Customer wajib dipilih.',
      confirmButtonColor: '#51448C',
    })

    return
  }

  if (!formData.driver_id) {

    Swal.fire({
      icon: 'warning',
      title: 'Data belum lengkap',
      text: 'Driver wajib dipilih.',
      confirmButtonColor: '#51448C',
    })

    return
  }

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


  // ======================================================
  // UPDATE
  // ======================================================

  if (editingId !== null) {

    const isLunas =
      editingStatus === 'lunas' ||
      editingStatus === 'Lunas' ||
      editingStatus === 'dilunaskan' ||
      editingStatus === 'lunas' ||
      invoices.find(
        (item) => item.id === editingId
      )?.dilunaskan === true


    const isCicil =
      editingStatus === 'sebagian' ||
      editingStatus === 'cicil' ||
      editingStatus === 'Cicil'


    const statusText =
      isLunas
        ? 'Lunas'
        : 'Cicil'


    // ====================================================
    // KONFIRMASI SWAL
    // ====================================================

    const confirmResult =
      await Swal.fire({
        icon: 'question',
        title: 'Update Nota Tagihan?',
        html: `
          <div style="font-size:13px;color:#707070">
            Data nota <strong>${
              invoices.find(
                (item) =>
                  item.id === editingId
              )?.noNota || ''
            }</strong> akan diperbarui.
            <br/>
            Status update:
            <strong style="color:#51448C">
              ${statusText}
            </strong>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Ya, Update',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#51448C',
        cancelButtonColor: '#999999',
        reverseButtons: true,
      })


    if (!confirmResult.isConfirmed) {
      return
    }


    try {

      // ==================================================
      // BODY UPDATE
      // ==================================================

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
          selectedItemIds,
      }


      let response


      // ==================================================
      // CICIL / SEBAGIAN
      // ==================================================

      if (isCicil) {

        response =
          await updateTagihanCicil(
            editingId,
            payload
          )

      }


      // ==================================================
      // LUNAS
      // ==================================================

      else {

        response =
          await updateTagihanLunas(
            editingId,
            payload
          )

      }


      // ==================================================
      // BERHASIL
      // ==================================================

      closeForm()

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text:
          response?.message ||
          'Nota tagihan berhasil diperbarui.',
        confirmButtonColor: '#51448C',
      })

      fetchNotaTagihan()

    } catch (error) {

      // ==================================================
      // ERROR DARI BACKEND
      // ==================================================

      Swal.fire({
        icon: 'error',
        title: 'Gagal Update Nota',
        text:
          error?.message ||
          'Gagal memperbarui nota tagihan.',
        confirmButtonColor: '#51448C',
      })

    }

    return
  }


  // ======================================================
  // CREATE
  // ======================================================

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
            selectedItemIds,
        })
    }

    closeForm()

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text:
        response?.message ||
        'Nota tagihan berhasil dibuat.',
      confirmButtonColor: '#51448C',
    })

    fetchNotaTagihan()

  } catch (error) {

    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text:
        error?.message ||
        'Gagal membuat nota tagihan.',
      confirmButtonColor: '#51448C',
    })

  }
}


  // ======================================================
  // PEMBAYARAN
  // ======================================================
  const handlePayment = async (row) => {

    const result =
      await Swal.fire({
        title: 'Pembayaran',
        text:
          `Apakah ingin mencatat pembayaran untuk ${row.noNota}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Bayar',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#51448C',
        cancelButtonColor: '#999999',
      })

    if (!result.isConfirmed) return

    try {

      await updateNotaTagihanLunas(
        row.id
      )

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text:
          'Pembayaran berhasil dicatat.',
        confirmButtonColor: '#51448C',
      })

      fetchNotaTagihan()

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text:
          error?.message ||
          'Gagal mencatat pembayaran.',
        confirmButtonColor: '#51448C',
      })

    }

  }


  // ======================================================
  // STATUS
  // ======================================================
  const formatStatus = (status) => {

    if (!status)
      return 'Belum Bayar'

    if (
      status === 'belum_bayar' ||
      status === 'belum bayar'
    ) {

      return 'Belum Bayar'

    }

    if (status === 'cicil')
      return 'Cicil'

    if (status === 'lunas')
      return 'Lunas'

    return status

  }


  const renderStatus = (status) => {

    const formattedStatus =
      formatStatus(status)

    let className = ''

    if (
      formattedStatus === 'Lunas'
    ) {

      className =
        'bg-[#459653]'

    } else if (
      formattedStatus === 'Cicil'
    ) {

      className =
        'bg-[#d0ad00]'

    } else {

      className =
        'bg-[#f04423]'

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
      key: 'noNota',
      label: 'No. Nota',
    },

    {
      key: 'tanggal',
      label: 'Tanggal',

      render: (row) =>
        formatDateDisplay(
          row.tanggal
        ),
    },

    {
      key: 'customer',
      label: 'Nama Customer',
    },

    {
      key: 'jumlah',
      label: 'Jumlah',

      render: (row) =>
        formatRupiah(
          row.jumlah
        ),
    },

    {
      key: 'status',
      label: 'Status',

      render: (row) =>
        renderStatus(
          row.status
        ),
    },

    {
      key: 'update',
      label: 'Update',

      render: (row) => (
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

            {/* CUSTOMER FILTER */}
            <select
              value={selectedCustomer}
              onChange={(e) =>
                setSelectedCustomer(
                  e.target.value
                )
              }
              className="h-10 w-full rounded-md border border-[#e0e0e5] bg-white px-3 text-xs text-[#51448C] outline-none focus:ring-2 focus:ring-[#51448C]/20 sm:w-[200px]"
            >

              <option value="">
                Pilih Customer
              </option>

              {customers.map(
                (customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                )
              )}

            </select>


            {/* FILTER */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setIsFilterOpen(
                    (value) => !value
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
                        value={filterStart}
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
                        value={filterEnd}
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
                        setIsFilterOpen(false)
                      }
                      className="rounded-md bg-[#51448C] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      Terapkan
                    </button>

                  </div>

                </div>

              )}

            </div>


            {/* SEARCH */}
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
            TABLE NOTA
        ================================================== */}
        <div className="w-full overflow-x-auto">

          {loading ? (

            <div className="flex min-h-[200px] items-center justify-center text-sm text-[#51448C]">
              Memuat data nota tagihan...
            </div>

          ) : (

            <DataTable
              columns={columns}
              data={filteredInvoices}
              actionLabel="Action"
              tableClassName="min-w-[850px] text-xs sm:text-sm"
              actions={(row) => (
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
              )}
            />

          )}

        </div>

      </section>


      {/* ==================================================
          MODAL
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

            {/* ==================================================
                HEADER MODAL
            ================================================== */}
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
                      INPUT & EDIT NOTA TAGIHAN
                    </h2>

                    <p className="mt-0.5 text-[10px] text-[#707070] sm:text-xs">
                      Silahkan masukkan data nota tagihan
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={closeForm}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-[#51448C] transition hover:bg-[#ebe8f4] hover:text-[#33295f]"
                >
                  ×
                </button>

              </div>

            </div>


            {/* ==================================================
                MODAL CONTENT
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin sm:px-6 sm:py-5">

              <form onSubmit={handleSubmit}>

                {/* ==================================================
                    NO NOTA + TANGGAL
                ================================================== */}
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
                                item.id ===
                                editingId
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


                {/* ==================================================
                    CUSTOMER + DRIVER
                ================================================== */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">

                  <SearchableDropdown
                    label="Customer"
                    value={
                      formData.customer_id
                    }
                    options={customers}
                    onChange={(value) =>
                      setFormData(
                        (current) => ({
                          ...current,
                          customer_id:
                            value,
                        })
                      )
                    }
                    placeholder="Pilih Customer"
                    loading={
                      loadingCustomer
                    }
                    disabled={
                      loadingCustomer ||
                      editingId !== null
                    }
                  />


                  <SearchableDropdown
                    label="Driver"
                    value={
                      formData.driver_id
                    }
                    options={drivers}
                    onChange={(value) =>
                      setFormData(
                        (current) => ({
                          ...current,
                          driver_id:
                            value,
                        })
                      )
                    }
                    placeholder="Pilih Driver"
                    loading={
                      loadingDriver
                    }
                    disabled={
                      loadingDriver ||
                      editingId !== null
                    }
                  />

                </div>


                {/* ==================================================
                    TANGGAL KIRIM
                ================================================== */}
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


                {/* ==================================================
                    INFO LOAD
                ================================================== */}
                {loadingSuratJalan && (

                  <div className="mt-4 flex items-center rounded-lg border border-[#ddd8f0] bg-[#f0eefb] px-3 py-2.5 text-[10px] text-[#51448C]">

                    <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#51448C]/30 border-t-[#51448C]" />

                    Sedang mengambil data surat jalan...

                  </div>

                )}


                {/* ==================================================
                    TABEL SURAT JALAN
                ================================================== */}
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


                  {/* OUTER TABLE SCROLL */}
                  <div className="w-full overflow-hidden rounded-xl border border-[#dedde5] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">

                    {/* Horizontal Scroll */}
                    <div className="w-full overflow-x-auto scrollbar-thin">

                      {/* Vertical Scroll */}
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

                                  const isChecked =
                                    selectedItemIds.includes(
                                      item.item_id
                                    )

                                  return (

                                    <tr
                                      key={
                                        item.item_id
                                      }
                                      className={`transition ${
                                        isChecked
                                          ? 'bg-[#faf9ff]'
                                          : 'bg-white'
                                      } hover:bg-[#f8f7fc]`}
                                    >

                                      <td className={`sticky left-0 z-10 px-2 py-3 text-center ${
                                        isChecked
                                          ? 'bg-[#faf9ff]'
                                          : 'bg-white'
                                      }`}>

                                        <input
                                          type="checkbox"
                                          checked={
                                            isChecked
                                          }
                                          onChange={() =>
                                            handleSelectItem(
                                              item.item_id
                                            )
                                          }
                                          className="h-4 w-4 cursor-pointer accent-[#51448C]"
                                        />

                                      </td>


                                      <td className="whitespace-nowrap px-3 py-3 font-medium text-[#444444]">
                                        {
                                          item.no_surat_jalan
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
                                            item.nama_barang
                                          }
                                        >
                                          {
                                            item.nama_barang
                                          }
                                        </div>

                                      </td>


                                      <td className="px-3 py-3 text-center">
                                        {
                                          item.qty
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


                          {/* ==================================================
                              TOTAL
                          ================================================== */}
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
                                  selectedItemIds.length ===
                                    suratJalanItems.length &&
                                  suratJalanItems.length >
                                    0
                                    ? totalTagihan
                                    : selectedTotal
                                )}

                              </td>

                            </tr>

                          </tfoot>

                        </table>

                      </div>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    WARNING
                ================================================== */}
                {suratJalanSearched &&
                  suratJalanItems.length > 0 &&
                  selectedItemIds.length ===
                    0 && (

                  <div className="mt-2 flex items-center rounded-md bg-red-50 px-3 py-2 text-[10px] text-red-500">

                    <span className="mr-1.5">
                      ⚠
                    </span>

                    Kolom tidak boleh kosong

                  </div>

                )}


                {/* ==================================================
                    FOOTER BUTTON
                ================================================== */}
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#e5e3ea] pt-4 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={closeForm}
                    className="w-full rounded-lg border border-[#dedbe6] bg-white px-4 py-2.5 text-xs font-medium text-[#707070] transition hover:bg-[#f4f3f6] sm:w-auto"
                  >
                    Batal
                  </button>


                  <button
                    type="submit"
                    disabled={
                      loadingSuratJalan ||
                      (
                        editingId === null &&
                        selectedItemIds.length === 0
                      )
                    }
                    className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-xs font-medium text-white transition sm:w-auto ${
                      loadingSuratJalan ||
                      (
                        editingId === null &&
                        selectedItemIds.length === 0
                      )
                        ? 'cursor-not-allowed bg-[#aaa5c1]'
                        : 'bg-[#51448C] hover:bg-[#433878]'
                    }`}
                  >

                    <img
                      src={saveIcon}
                      alt=""
                      className="mr-2 h-4 w-4 object-contain"
                    />

                    Simpan Data

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