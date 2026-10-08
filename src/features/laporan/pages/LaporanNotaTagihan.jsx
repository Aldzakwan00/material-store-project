import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import DataTable from '../../../components/table/DataTable'

import {
  rekapTagihan,
  labaRugi,
  labaRugiCustomer,
  labaRugiCustomerPeriode,
  labaRugiPeriode,
  labaRugiDetail,
} from '../../../services/LaporanServices'

import { getCustomers } from '../../../services/CustomerServices'

import reportIcon from '../../../assets/img/icon/NotaIcon.png'

/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

const toInputDate = (value) => {
  if (!value) return ''

  const text = String(value)

  if (text.includes('/')) {
    const [day, month, year] = text.split('/')

    if (day && month && year) {
      return `${year}-${month.padStart(
        2,
        '0'
      )}-${day.padStart(2, '0')}`
    }
  }

  return text.split('T')[0]
}

const formatDate = (value) => {
  const date = toInputDate(value)

  if (!date) return '-'

  const [year, month, day] = date.split('-')

  if (!year || !month || !day) {
    return String(value)
  }

  return `${day}/${month}/${year}`
}

const formatDateLong = (value) => {
  const date = toInputDate(value)

  if (!date) return '-'

  const [year, month, day] = date.split('-')

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  return `${Number(day)} ${
    monthNames[Number(month) - 1]
  } ${year}`
}

const toAmount = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 0
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : 0
}

const formatRupiah = (value) => {
  return `Rp ${Number(
    value || 0
  ).toLocaleString('id-ID')}`
}

const formatCompactRupiah = (value) => {
  const number = Number(value || 0)

  if (number >= 1000000000) {
    return `Rp ${(number / 1000000000).toLocaleString(
      'id-ID',
      {
        maximumFractionDigits: 1,
      }
    )} M`
  }

  if (number >= 1000000) {
    return `Rp ${(number / 1000000).toLocaleString(
      'id-ID',
      {
        maximumFractionDigits: 1,
      }
    )} Jt`
  }

  if (number >= 1000) {
    return `Rp ${(number / 1000).toLocaleString(
      'id-ID',
      {
        maximumFractionDigits: 1,
      }
    )} Rb`
  }

  return formatRupiah(number)
}

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString('id-ID')
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

const StatusBadge = ({
  status,
  dilunaskan,
}) => {
  if (dilunaskan) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f9ed] px-2 py-1 text-[9px] font-semibold text-[#14952d]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#14952d]" />
        Lunas
      </span>
    )
  }

  if (status === 'sebagian') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6df] px-2 py-1 text-[9px] font-semibold text-[#b77900]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e5a500]" />
        Sebagian
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0f0] px-2 py-1 text-[9px] font-semibold text-[#d33a3a]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#d33a3a]" />
      Belum Bayar
    </span>
  )
}

/*
|--------------------------------------------------------------------------
| ICON
|--------------------------------------------------------------------------
*/

const Icon = ({
  name,
  className = 'h-4 w-4',
}) => {
  const common = {
    xmlns:
      'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    className,
  }

  if (name === 'eye') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
        />
        <circle
          cx="12"
          cy="12"
          r="2.5"
        />
      </svg>
    )
  }

  if (name === 'filter') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 5h16l-6 7v5l-4 2v-7L4 5z"
        />
      </svg>
    )
  }

  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="2"
        />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          d="M6 6l12 12M18 6L6 18"
        />
      </svg>
    )
  }

  if (name === 'receipt') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"
        />
        <path
          strokeLinecap="round"
          d="M9 8h6M9 12h6M9 16h3"
        />
      </svg>
    )
  }

  if (name === 'refresh') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 11a8 8 0 10-2.3 5.7"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 5v6h-6"
        />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg {...common}>
        <circle
          cx="11"
          cy="11"
          r="7"
        />
        <path
          strokeLinecap="round"
          d="m20 20-4-4"
        />
      </svg>
    )
  }

  if (name === 'chevron') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6 9 6 6 6-6"
        />
      </svg>
    )
  }

  if (name === 'check') {
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 12 4 4L19 6"
        />
      </svg>
    )
  }

  return null
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const LaporanNotaTagihan = () => {
  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [invoices, setInvoices] =
    useState([])

  const [customers, setCustomers] =
    useState([])

  const [profitLossReport, setProfitLossReport] =
    useState(null)

  const [detailRows, setDetailRows] =
    useState([])

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const [isLoading, setIsLoading] =
    useState(true)

  const [isCustomerLoading, setIsCustomerLoading] =
    useState(false)

  const [isReportLoading, setIsReportLoading] =
    useState(true)

  const [isDetailLoading, setIsDetailLoading] =
    useState(true)

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const [error, setError] =
    useState('')

  const [customerError, setCustomerError] =
    useState('')

  const [reportError, setReportError] =
    useState('')

  const [detailError, setDetailError] =
    useState('')

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const [selectedCustomer, setSelectedCustomer] =
    useState('')

  const [customerSearch, setCustomerSearch] =
    useState('')

  const [isCustomerOpen, setIsCustomerOpen] =
    useState(false)

  const [dateFrom, setDateFrom] =
    useState('')

  const [dateTo, setDateTo] =
    useState('')

  const [isFilterOpen, setIsFilterOpen] =
    useState(false)

  const customerDropdownRef =
    useRef(null)

  /*
  |--------------------------------------------------------------------------
  | DETAIL MODAL
  |--------------------------------------------------------------------------
  */

  const [selectedInvoice, setSelectedInvoice] =
    useState(null)

  const [isDetailOpen, setIsDetailOpen] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | LOAD REKAP TAGIHAN
  |--------------------------------------------------------------------------
  */

  const loadInvoices = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response =
        await rekapTagihan()

      const data = Array.isArray(
        response?.items
      )
        ? response.items
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

      setInvoices(data)
    } catch (err) {
      setError(
        err.message ||
          'Gagal mengambil rekap tagihan.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD CUSTOMERS DARI API
  |--------------------------------------------------------------------------
  */

  const loadCustomers = async () => {
    try {
      setIsCustomerLoading(true)
      setCustomerError('')

      const response =
        await getCustomers()

      /*
       * Menangani beberapa kemungkinan
       * struktur response API.
       */

      let rawCustomers = []

      if (Array.isArray(response)) {
        rawCustomers = response
      } else if (
        Array.isArray(response?.items)
      ) {
        rawCustomers =
          response.items
      } else if (
        Array.isArray(response?.data)
      ) {
        rawCustomers =
          response.data
      } else if (
        Array.isArray(
          response?.data?.items
        )
      ) {
        rawCustomers =
          response.data.items
      }

      /*
       * Normalisasi ID + nama customer.
       *
       * ID tetap berasal dari API CUSTOMER.
       */

      const normalizedCustomers =
        rawCustomers
          .map((customer) => ({
            id:
              customer.id ??
              customer.customer_id ??
              customer.id_customer,

            name:
              customer.nama_customer ??
              customer.nama ??
              customer.name ??
              customer.nama_pelanggan ??
              '',
          }))
          .filter(
            (customer) =>
              customer.id !== null &&
              customer.id !== undefined &&
              String(customer.name).trim()
          )
          .map((customer) => ({
            id: String(customer.id),
            name: String(
              customer.name
            ).trim(),
          }))

      /*
       * Hilangkan duplicate customer
       */

      const uniqueCustomers =
        Array.from(
          new Map(
            normalizedCustomers.map(
              (customer) => [
                customer.id,
                customer,
              ]
            )
          ).values()
        ).sort((a, b) =>
          a.name.localeCompare(
            b.name,
            'id'
          )
        )

      setCustomers(uniqueCustomers)
    } catch (err) {
      setCustomerError(
        err.message ||
          'Gagal mengambil data customer.'
      )

      setCustomers([])
    } finally {
      setIsCustomerLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD DETAIL LABA RUGI
  |--------------------------------------------------------------------------
  */

  const loadDetails = async () => {
    try {
      setIsDetailLoading(true)
      setDetailError('')

      const response =
        await labaRugiDetail()

      const data = Array.isArray(
        response?.items
      )
        ? response.items
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

      setDetailRows(data)
    } catch (err) {
      setDetailError(
        err.message ||
          'Gagal mengambil detail laba rugi.'
      )
    } finally {
      setIsDetailLoading(false)
    }
  }

  /*
  |--------------------------------------------------------------------------
  | INITIAL DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadInvoices()
    loadCustomers()
    loadDetails()
  }, [])

  /*
  |--------------------------------------------------------------------------
  | CLOSE CUSTOMER DROPDOWN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(
          event.target
        )
      ) {
        setIsCustomerOpen(false)
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

  /*
  |--------------------------------------------------------------------------
  | LOAD LABA RUGI BERDASARKAN FILTER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true

    const loadReport = async () => {
      try {
        setIsReportLoading(true)
        setReportError('')

        let response

        /*
         * CUSTOMER + PERIODE
         */
        if (
          selectedCustomer &&
          dateFrom &&
          dateTo
        ) {
          response =
            await labaRugiCustomerPeriode(
              selectedCustomer,
              dateFrom,
              dateTo
            )
        }

        /*
         * CUSTOMER SAJA
         */
        else if (selectedCustomer) {
          response =
            await labaRugiCustomer(
              selectedCustomer
            )
        }

        /*
         * PERIODE SAJA
         */
        else if (
          dateFrom &&
          dateTo
        ) {
          response =
            await labaRugiPeriode(
              dateFrom,
              dateTo
            )
        }

        /*
         * SEMUA DATA
         */
        else {
          response =
            await labaRugi()
        }

        if (active) {
          setProfitLossReport(
            response
          )
        }
      } catch (err) {
        if (active) {
          setReportError(
            err.message ||
              'Gagal mengambil laporan laba rugi.'
          )
        }
      } finally {
        if (active) {
          setIsReportLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      active = false
    }
  }, [
    selectedCustomer,
    dateFrom,
    dateTo,
  ])

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredCustomers = useMemo(() => {
    const keyword =
      customerSearch
        .trim()
        .toLowerCase()

    if (!keyword) {
      return customers
    }

    return customers.filter(
      (customer) =>
        customer.name
          .toLowerCase()
          .includes(keyword) ||
        String(customer.id)
          .toLowerCase()
          .includes(keyword)
    )
  }, [
    customers,
    customerSearch,
  ])

  /*
  |--------------------------------------------------------------------------
  | CUSTOMER TERPILIH
  |--------------------------------------------------------------------------
  */

  const selectedCustomerData =
    useMemo(() => {
      return customers.find(
        (customer) =>
          String(customer.id) ===
          String(selectedCustomer)
      )
    }, [
      customers,
      selectedCustomer,
    ])

  /*
  |--------------------------------------------------------------------------
  | FILTER DATA TABEL
  |--------------------------------------------------------------------------
  */

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) => {
        /*
         * PENTING:
         *
         * selectedCustomer berasal dari
         * ID API getCustomers().
         *
         * invoice.customer_id harus dibandingkan
         * sebagai string supaya aman terhadap
         * perbedaan number/string.
         */

        const invoiceCustomerId =
          invoice.customer_id ??
          invoice.id_customer

        const invoiceDate =
          toInputDate(
            invoice.tanggal_nota
          )

        const matchCustomer =
          !selectedCustomer ||
          String(
            invoiceCustomerId
          ) ===
            String(selectedCustomer)

        const matchFrom =
          !dateFrom ||
          invoiceDate >= dateFrom

        const matchTo =
          !dateTo ||
          invoiceDate <= dateTo

        return (
          matchCustomer &&
          matchFrom &&
          matchTo
        )
      }
    )
  }, [
    invoices,
    selectedCustomer,
    dateFrom,
    dateTo,
  ])

  /*
  |--------------------------------------------------------------------------
  | TOTAL TABEL
  |--------------------------------------------------------------------------
  */

  const tableTotals = useMemo(() => {
    return filteredInvoices.reduce(
      (result, invoice) => {
        result.tagihan +=
          toAmount(
            invoice.total_tagihan
          )

        result.bayar +=
          toAmount(
            invoice.bayar
          )

        result.sisa +=
          toAmount(
            invoice.sisa
          )

        return result
      },
      {
        tagihan: 0,
        bayar: 0,
        sisa: 0,
      }
    )
  }, [filteredInvoices])

  /*
  |--------------------------------------------------------------------------
  | REPORT SUMMARY
  |--------------------------------------------------------------------------
  */

  const reportSummary =
    profitLossReport?.ringkasan ?? {}

  const laba =
    toAmount(
      reportSummary.laba
    )

  const totalPenjualan =
    toAmount(
      reportSummary.total_penjualan
    )

  const totalModal =
    toAmount(
      reportSummary.total_modal
    )

  const margin =
    toAmount(
      reportSummary.margin_persen
    )

  const rugi =
    laba < 0
      ? Math.abs(laba)
      : 0

  /*
  |--------------------------------------------------------------------------
  | PERIOD LABEL
  |--------------------------------------------------------------------------
  */

  const periodLabel = useMemo(() => {
    if (
      profitLossReport?.dari &&
      profitLossReport?.sampai
    ) {
      return `${formatDate(
        profitLossReport.dari
      )} - ${formatDate(
        profitLossReport.sampai
      )}`
    }

    if (
      profitLossReport?.seluruh_periode
    ) {
      return 'Seluruh periode'
    }

    if (
      profitLossReport?.periode_data_awal
    ) {
      return `${formatDate(
        profitLossReport.periode_data_awal
      )} - ${formatDate(
        profitLossReport.periode_data_akhir
      )}`
    }

    return 'Periode belum tersedia'
  }, [profitLossReport])

  /*
  |--------------------------------------------------------------------------
  | DETAIL ITEM UNTUK MODAL
  |--------------------------------------------------------------------------
  */

  const selectedDetailRows =
    useMemo(() => {
      if (!selectedInvoice) {
        return []
      }

      const customerName =
        selectedInvoice.nama_customer

      const fromDate =
        toInputDate(
          selectedInvoice.tanggal_kirim_dari
        )

      const toDate =
        toInputDate(
          selectedInvoice.tanggal_kirim_sampai
        )

      return detailRows.filter(
        (item) => {
          const sameCustomer =
            String(
              item.nama_customer
            ).toLowerCase() ===
            String(
              customerName
            ).toLowerCase()

          const itemDate =
            toInputDate(
              item.tanggal
            )

          const sameDate =
            (!fromDate ||
              itemDate >= fromDate) &&
            (!toDate ||
              itemDate <= toDate)

          return (
            sameCustomer &&
            sameDate
          )
        }
      )
    }, [
      detailRows,
      selectedInvoice,
    ])

  /*
  |--------------------------------------------------------------------------
  | DETAIL SUMMARY
  |--------------------------------------------------------------------------
  */

  const selectedDetailSummary =
    useMemo(() => {
      return selectedDetailRows.reduce(
        (result, item) => {
          result.modal +=
            toAmount(
              item.total_modal
            )

          result.penjualan +=
            toAmount(
              item.total_penjualan
            )

          result.laba +=
            toAmount(item.laba)

          result.qty +=
            toAmount(item.qty)

          return result
        },
        {
          modal: 0,
          penjualan: 0,
          laba: 0,
          qty: 0,
        }
      )
    }, [selectedDetailRows])

  /*
  |--------------------------------------------------------------------------
  | OPEN DETAIL
  |--------------------------------------------------------------------------
  */

  const openDetail = (invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailOpen(true)
  }

  /*
  |--------------------------------------------------------------------------
  | CLOSE DETAIL
  |--------------------------------------------------------------------------
  */

  const closeDetail = () => {
    setIsDetailOpen(false)

    setTimeout(() => {
      setSelectedInvoice(null)
    }, 200)
  }

  /*
  |--------------------------------------------------------------------------
  | SELECT CUSTOMER
  |--------------------------------------------------------------------------
  */

  const handleSelectCustomer = (
    customerId
  ) => {
    /*
     * Selalu simpan ID sebagai STRING.
     *
     * Ini penting karena:
     * - option HTML biasanya string
     * - API kadang mengembalikan integer
     *
     * Nanti pencocokan invoice juga
     * menggunakan String().
     */

    setSelectedCustomer(
      String(customerId)
    )

    setCustomerSearch('')
    setIsCustomerOpen(false)
  }

  /*
  |--------------------------------------------------------------------------
  | RESET FILTER
  |--------------------------------------------------------------------------
  */

  const resetFilter = () => {
    setSelectedCustomer('')
    setCustomerSearch('')
    setIsCustomerOpen(false)
    setDateFrom('')
    setDateTo('')
  }

  /*
  |--------------------------------------------------------------------------
  | TABLE DATA
  |--------------------------------------------------------------------------
  */

  const tableData = useMemo(() => {
    return filteredInvoices.map(
      (invoice) => ({
        ...invoice,

        customer_display:
          invoice.nama_customer ||
          '-',

        total_display:
          formatRupiah(
            invoice.total_tagihan
          ),

        bayar_display:
          formatRupiah(
            invoice.bayar
          ),

        sisa_display:
          formatRupiah(
            invoice.sisa
          ),
      })
    )
  }, [filteredInvoices])

  /*
   |--------------------------------------------------------------------------
   | EMPTY STATE TABEL
   |--------------------------------------------------------------------------
   */

  const emptyTableText = useMemo(() => {
    const hasActiveFilter =
      Boolean(selectedCustomer) ||
      Boolean(dateFrom) ||
      Boolean(dateTo)

    if (hasActiveFilter) {
      return 'Data tidak ditemukan untuk filter yang dipilih.'
    }

    if (invoices.length === 0) {
      return 'Belum ada data nota tagihan.'
    }

    return 'Tidak ada data nota tagihan.'
  }, [
    invoices.length,
    selectedCustomer,
    dateFrom,
    dateTo,
  ])

  /*
  |--------------------------------------------------------------------------
  | TABLE COLUMNS
  |--------------------------------------------------------------------------
  */

  const columns = useMemo(
    () => [
      {
        key: 'no_nota',
        label: 'No. Nota',

        render: (row) => (
          <span className="font-semibold text-[#51448C]">
            {row.no_nota}
          </span>
        ),
      },

      {
        key: 'tanggal_nota',
        label: 'Tanggal',

        render: (row) =>
          formatDate(
            row.tanggal_nota
          ),
      },

      {
        key: 'tanggal_kirim_dari',
        label: 'Kirim Awal',

        render: (row) =>
          formatDate(
            row.tanggal_kirim_dari
          ),
      },

      {
        key: 'tanggal_kirim_sampai',
        label: 'Kirim Akhir',

        render: (row) =>
          formatDate(
            row.tanggal_kirim_sampai
          ),
      },

      {
        key: 'customer_display',
        label: 'Nama Customer',

        render: (row) => (
          <div className="max-w-[170px] truncate font-medium text-[#4f4a58]">
            {row.customer_display}
          </div>
        ),
      },

      {
        key: 'total_display',
        label: 'Tagihan',

        render: (row) => (
          <span className="font-medium text-[#33303a]">
            {row.total_display}
          </span>
        ),
      },

      {
        key: 'bayar_display',
        label: 'Bayar',

        render: (row) => (
          <span className="font-medium text-[#14952d]">
            {row.bayar_display}
          </span>
        ),
      },

      {
        key: 'sisa_display',
        label: 'Sisa',

        render: (row) => (
          <span
            className={
              Number(row.sisa) > 0
                ? 'font-semibold text-[#d33a3a]'
                : 'font-medium text-[#14952d]'
            }
          >
            {row.sisa_display}
          </span>
        ),
      },

      {
        key: 'status',
        label: 'Status',

        render: (row) => (
          <StatusBadge
            status={row.status}
            dilunaskan={
              row.dilunaskan
            }
          />
        ),
      },
    ],
    []
  )

  /*
  |--------------------------------------------------------------------------
  | TABLE FOOTER
  |--------------------------------------------------------------------------
  */

  const tableFooter = (
    <tr className="border-t-2 border-[#51448C]/20 bg-[#faf9fd]">
      <td
        colSpan={5}
        className="
          px-3
          py-3
          text-right
          text-[10px]
          font-bold
          uppercase
          tracking-wide
          text-[#51448C]
        "
      >
        Total Tagihan
      </td>

      <td className="px-3 py-3 text-[10px] font-bold text-[#33303a]">
        {formatRupiah(
          tableTotals.tagihan
        )}
      </td>

      <td className="px-3 py-3 text-[10px] font-bold text-[#14952d]">
        {formatRupiah(
          tableTotals.bayar
        )}
      </td>

      <td className="px-3 py-3 text-[10px] font-bold text-[#d33a3a]">
        {formatRupiah(
          tableTotals.sisa
        )}
      </td>

      <td className="px-3 py-3 text-[9px] font-semibold text-[#8b8493]">
        {filteredInvoices.length} Nota
      </td>

      <td className="px-3 py-3" />
    </tr>
  )

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <main className="min-h-screen bg-[#f7f6f9] px-4 py-5 sm:px-6 lg:ml-64 lg:px-8 lg:py-7">

      <div className="mx-auto max-w-[1600px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#51448C] shadow-[0_5px_15px_rgba(81,68,140,0.25)]">
              <span
                className="h-5 w-5 bg-white"
                style={{
                  maskImage: `url(${reportIcon})`,
                  maskPosition:
                    'center',
                  maskRepeat:
                    'no-repeat',
                  maskSize:
                    'contain',
                  WebkitMaskImage: `url(${reportIcon})`,
                  WebkitMaskPosition:
                    'center',
                  WebkitMaskRepeat:
                    'no-repeat',
                  WebkitMaskSize:
                    'contain',
                }}
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#51448C] sm:text-2xl">
                Laporan Nota Tagihan
              </h1>

              <p className="mt-0.5 text-[10px] text-[#8b8592] sm:text-[11px]">
                Monitoring tagihan,
                pembayaran, sisa piutang dan
                laba rugi
              </p>
            </div>
          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={() => {
              loadInvoices()
              loadCustomers()
              loadDetails()
            }}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-2
              self-start
              rounded-lg
              border
              border-[#ddd8e8]
              bg-white
              px-3
              text-[10px]
              font-semibold
              text-[#51448C]
              shadow-sm
              transition
              hover:bg-[#f8f6ff]
              sm:self-auto
            "
          >
            <Icon
              name="refresh"
              className="h-3.5 w-3.5"
            />

            Refresh Data
          </button>
        </div>

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <section className="mb-4 rounded-xl border border-[#e3dfea] bg-white p-3 shadow-[0_3px_15px_rgba(45,35,80,0.05)]">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

            {/* LEFT FILTER */}

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:max-w-[850px]">

              {/* CUSTOMER SEARCHABLE */}

              <div
                ref={
                  customerDropdownRef
                }
                className="relative"
              >
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-[#8c8595]">
                  Customer
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setIsCustomerOpen(
                      (value) => !value
                    )
                  }
                  className="
                    flex
                    h-9
                    w-full
                    items-center
                    justify-between
                    gap-2
                    rounded-lg
                    border
                    border-[#dfdbe7]
                    bg-[#fcfbfd]
                    px-3
                    text-left
                    text-[10px]
                    font-medium
                    text-[#51448C]
                    outline-none
                    transition
                    hover:bg-white
                    focus:border-[#51448C]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#51448C]/10
                  "
                >
                  <span className="min-w-0 truncate">
                    {selectedCustomerData?.name ||
                      'Semua Customer'}
                  </span>

                  <Icon
                    name="chevron"
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isCustomerOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />
                </button>

                {isCustomerOpen && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      z-[60]
                      mt-1.5
                      overflow-hidden
                      rounded-xl
                      border
                      border-[#e3dfea]
                      bg-white
                      shadow-[0_12px_30px_rgba(45,35,80,0.15)]
                    "
                  >

                    {/* SEARCH */}

                    <div className="border-b border-[#eeeaf3] p-2">
                      <div className="relative">

                        <Icon
                          name="search"
                          className="
                            absolute
                            left-2.5
                            top-1/2
                            h-3.5
                            w-3.5
                            -translate-y-1/2
                            text-[#99939f]
                          "
                        />

                        <input
                          type="text"
                          value={
                            customerSearch
                          }
                          onChange={(
                            event
                          ) =>
                            setCustomerSearch(
                              event.target
                                .value
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                              'Escape'
                            ) {
                              setIsCustomerOpen(
                                false
                              )
                            }
                          }}
                          placeholder="Cari nama atau ID customer..."
                          autoFocus
                          className="
                            h-8
                            w-full
                            rounded-lg
                            border
                            border-[#e2dee9]
                            bg-[#faf9fc]
                            pl-8
                            pr-3
                            text-[10px]
                            text-[#51448C]
                            outline-none
                            transition
                            placeholder:text-[#aaa4b0]
                            focus:border-[#51448C]
                            focus:bg-white
                            focus:ring-2
                            focus:ring-[#51448C]/10
                          "
                        />
                      </div>
                    </div>

                    {/* LIST */}

                    <div className="max-h-56 overflow-y-auto p-1.5">

                      {/* SEMUA CUSTOMER */}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(
                            ''
                          )

                          setCustomerSearch(
                            ''
                          )

                          setIsCustomerOpen(
                            false
                          )
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          rounded-lg
                          px-3
                          py-2
                          text-left
                          text-[10px]
                          transition
                          ${
                            !selectedCustomer
                              ? 'bg-[#f1eef9] font-semibold text-[#51448C]'
                              : 'text-[#5f5b68] hover:bg-[#faf9fd]'
                          }
                        `}
                      >
                        <span>
                          Semua Customer
                        </span>

                        {!selectedCustomer && (
                          <Icon
                            name="check"
                            className="h-3.5 w-3.5"
                          />
                        )}
                      </button>

                      {/* LOADING */}

                      {isCustomerLoading && (
                        <div className="flex items-center justify-center gap-2 px-3 py-5">

                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#ddd8e8] border-t-[#51448C]" />

                          <span className="text-[9px] text-[#99939f]">
                            Memuat customer...
                          </span>

                        </div>
                      )}

                      {/* ERROR */}

                      {!isCustomerLoading &&
                        customerError && (
                          <div className="px-3 py-4 text-center">

                            <p className="text-[9px] font-medium text-[#d33a3a]">
                              {customerError}
                            </p>

                            <button
                              type="button"
                              onClick={
                                loadCustomers
                              }
                              className="mt-1 text-[9px] font-semibold text-[#51448C] underline"
                            >
                              Coba lagi
                            </button>

                          </div>
                        )}

                      {/* EMPTY */}

                      {!isCustomerLoading &&
                        !customerError &&
                        filteredCustomers.length ===
                          0 && (
                          <div className="px-3 py-6 text-center">

                            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f0fa] text-[#51448C]">
                              <Icon
                                name="search"
                                className="h-3.5 w-3.5"
                              />
                            </div>

                            <p className="mt-2 text-[9px] font-semibold text-[#5f5b68]">
                              Customer tidak
                              ditemukan
                            </p>

                            <p className="mt-0.5 text-[8px] text-[#99939f]">
                              Coba gunakan kata
                              kunci lain.
                            </p>

                          </div>
                        )}

                      {/* CUSTOMER */}

                      {!isCustomerLoading &&
                        !customerError &&
                        filteredCustomers.map(
                          (customer) => {
                            const isSelected =
                              String(
                                selectedCustomer
                              ) ===
                              String(
                                customer.id
                              )

                            return (
                              <button
                                type="button"
                                key={
                                  customer.id
                                }
                                onClick={() =>
                                  handleSelectCustomer(
                                    customer.id
                                  )
                                }
                                className={`
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-left
                                  transition
                                  ${
                                    isSelected
                                      ? 'bg-[#f1eef9] text-[#51448C]'
                                      : 'text-[#5f5b68] hover:bg-[#faf9fd]'
                                  }
                                `}
                              >

                                <div className="min-w-0">

                                  <p
                                    className={`
                                      truncate
                                      text-[10px]
                                      ${
                                        isSelected
                                          ? 'font-semibold'
                                          : 'font-medium'
                                      }
                                    `}
                                  >
                                    {
                                      customer.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-[8px] text-[#aaa4b0]">
                                    ID:{' '}
                                    {
                                      customer.id
                                    }
                                  </p>

                                </div>

                                {isSelected && (
                                  <Icon
                                    name="check"
                                    className="ml-2 h-3.5 w-3.5 shrink-0"
                                  />
                                )}

                              </button>
                            )
                          }
                        )}

                    </div>
                  </div>
                )}
              </div>

              {/* FROM */}

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-[#8c8595]">
                  Tanggal Dari
                </span>

                <input
                  type="date"
                  value={dateFrom}
                  onChange={(event) =>
                    setDateFrom(
                      event.target.value
                    )
                  }
                  className="
                    h-9
                    w-full
                    rounded-lg
                    border
                    border-[#dfdbe7]
                    bg-[#fcfbfd]
                    px-3
                    text-[10px]
                    font-medium
                    text-[#51448C]
                    outline-none
                    focus:border-[#51448C]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#51448C]/10
                  "
                />
              </label>

              {/* TO */}

              <label className="block">
                <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-wide text-[#8c8595]">
                  Tanggal Sampai
                </span>

                <input
                  type="date"
                  value={dateTo}
                  min={
                    dateFrom ||
                    undefined
                  }
                  onChange={(event) =>
                    setDateTo(
                      event.target.value
                    )
                  }
                  className="
                    h-9
                    w-full
                    rounded-lg
                    border
                    border-[#dfdbe7]
                    bg-[#fcfbfd]
                    px-3
                    text-[10px]
                    font-medium
                    text-[#51448C]
                    outline-none
                    focus:border-[#51448C]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#51448C]/10
                  "
                />
              </label>

            </div>

            {/* FILTER ACTION */}

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setIsFilterOpen(
                    (value) => !value
                  )
                }
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-[#ddd8e8]
                  bg-white
                  px-3
                  text-[10px]
                  font-semibold
                  text-[#51448C]
                  transition
                  hover:bg-[#f7f4fc]
                "
              >
                <Icon
                  name="filter"
                  className="h-3.5 w-3.5"
                />

                Filter
              </button>

              <button
                type="button"
                onClick={resetFilter}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#51448C]
                  px-4
                  text-[10px]
                  font-semibold
                  text-white
                  shadow-[0_4px_10px_rgba(81,68,140,0.2)]
                  transition
                  hover:bg-[#443875]
                "
              >
                Reset
              </button>

            </div>

          </div>

          {/* ACTIVE FILTER */}

          {(selectedCustomer ||
            dateFrom ||
            dateTo) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#eeeaf3] pt-3">

              <span className="text-[9px] font-semibold text-[#8a8492]">
                Filter aktif:
              </span>

              {selectedCustomer && (
                <span className="rounded-full bg-[#f1eef9] px-2.5 py-1 text-[9px] font-semibold text-[#51448C]">
                  {selectedCustomerData?.name ||
                    `Customer #${selectedCustomer}`}
                </span>
              )}

              {dateFrom && (
                <span className="rounded-full bg-[#f1eef9] px-2.5 py-1 text-[9px] font-semibold text-[#51448C]">
                  Dari{' '}
                  {formatDate(
                    dateFrom
                  )}
                </span>
              )}

              {dateTo && (
                <span className="rounded-full bg-[#f1eef9] px-2.5 py-1 text-[9px] font-semibold text-[#51448C]">
                  Sampai{' '}
                  {formatDate(
                    dateTo
                  )}
                </span>
              )}

            </div>
          )}

        </section>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL TAGIHAN */}

          <div className="relative overflow-hidden rounded-xl border border-[#e5e1ed] bg-white p-4 shadow-[0_4px_16px_rgba(45,35,80,0.05)]">

            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#51448C]/5" />

            <div className="relative">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a8492]">
                  Total Tagihan
                </p>

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0edfa] text-[#51448C]">
                  <Icon
                    name="receipt"
                    className="h-3.5 w-3.5"
                  />
                </div>

              </div>

              <p className="text-xl font-bold tracking-tight text-[#51448C] sm:text-2xl">
                {isLoading
                  ? '...'
                  : formatCompactRupiah(
                      tableTotals.tagihan
                    )}
              </p>

              <p className="mt-1 text-[9px] text-[#96909d]">
                {filteredInvoices.length}{' '}
                nota dalam laporan
              </p>

            </div>
          </div>

          {/* TERBAYAR */}

          <div className="relative overflow-hidden rounded-xl border border-[#e5e1ed] bg-white p-4 shadow-[0_4px_16px_rgba(45,35,80,0.05)]">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a8492]">
                Total Terbayar
              </p>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e9f9ed] text-[#14952d]">

                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12l4 4L19 6"
                  />
                </svg>

              </div>
            </div>

            <p className="text-xl font-bold tracking-tight text-[#14952d] sm:text-2xl">
              {isLoading
                ? '...'
                : formatCompactRupiah(
                    tableTotals.bayar
                  )}
            </p>

            <p className="mt-1 text-[9px] text-[#96909d]">
              Pembayaran yang sudah masuk
            </p>

          </div>

          {/* SISA */}

          <div className="relative overflow-hidden rounded-xl border border-[#e5e1ed] bg-white p-4 shadow-[0_4px_16px_rgba(45,35,80,0.05)]">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a8492]">
                Sisa Tagihan
              </p>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff1f1] text-[#d33a3a]">

                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path
                    strokeLinecap="round"
                    d="M8 12h8"
                  />
                </svg>

              </div>
            </div>

            <p className="text-xl font-bold tracking-tight text-[#d33a3a] sm:text-2xl">
              {isLoading
                ? '...'
                : formatCompactRupiah(
                    tableTotals.sisa
                  )}
            </p>

            <p className="mt-1 text-[9px] text-[#96909d]">
              Piutang yang masih berjalan
            </p>

          </div>

          {/* LABA */}

          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#51448C] to-[#40346f] p-4 text-white shadow-[0_6px_20px_rgba(81,68,140,0.22)]">

            <div className="mb-3 flex items-center justify-between">

              <p className="text-[9px] font-bold uppercase tracking-wider text-white/65">
                Laba Bersih
              </p>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">

                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 17l6-6 4 4 8-9"
                  />

                  <path
                    strokeLinecap="round"
                    d="M15 6h6v6"
                  />
                </svg>

              </div>
            </div>

            <p className="text-xl font-bold tracking-tight sm:text-2xl">
              {isReportLoading
                ? '...'
                : formatCompactRupiah(
                    laba
                  )}
            </p>

            <div className="mt-1 flex items-center justify-between">

              <p className="text-[9px] text-white/60">
                Margin{' '}
                {formatNumber(
                  margin
                )}
                %
              </p>

              <p className="text-[9px] text-white/60">
                {periodLabel}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            PROFIT DETAIL
        ================================================= */}

        <section className="mb-4 rounded-xl border border-[#e5e1ed] bg-white p-4 shadow-[0_4px_16px_rgba(45,35,80,0.05)]">

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-[11px] font-bold text-[#51448C]">
                Ringkasan Laporan Laba Rugi
              </h2>

              <p className="mt-0.5 text-[9px] text-[#99939f]">
                {periodLabel}
              </p>

            </div>

            {reportError && (
              <span className="rounded-md bg-[#fff0f0] px-2.5 py-1.5 text-[9px] font-medium text-[#d33a3a]">
                {reportError}
              </span>
            )}

          </div>

          <div className="grid grid-cols-2 divide-x divide-[#eeeaf3] rounded-lg border border-[#eeeaf3] sm:grid-cols-5">

            <div className="p-3">

              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#99939f]">
                Penjualan
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#33303a]">
                {isReportLoading
                  ? '...'
                  : formatRupiah(
                      totalPenjualan
                    )}
              </p>

            </div>

            <div className="p-3">

              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#99939f]">
                Modal
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#33303a]">
                {isReportLoading
                  ? '...'
                  : formatRupiah(
                      totalModal
                    )}
              </p>

            </div>

            <div className="p-3">

              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#99939f]">
                Laba
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#14952d]">
                {isReportLoading
                  ? '...'
                  : formatRupiah(laba)}
              </p>

            </div>

            <div className="p-3">

              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#99939f]">
                Margin
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#51448C]">
                {isReportLoading
                  ? '...'
                  : `${formatNumber(
                      margin
                    )}%`}
              </p>

            </div>

            <div className="p-3">

              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#99939f]">
                Surat Jalan
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#33303a]">
                {isReportLoading
                  ? '...'
                  : formatNumber(
                      reportSummary.jumlah_surat_jalan
                    )}
              </p>

            </div>

          </div>
        </section>

        {/* =================================================
            ERROR REKAP
        ================================================= */}

        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[#ffd6d6] bg-[#fff5f5] px-4 py-3">

            <span className="text-[10px] font-medium text-[#d33a3a]">
              {error}
            </span>

            <button
              type="button"
              onClick={
                loadInvoices
              }
              className="text-[10px] font-bold text-[#51448C] underline"
            >
              Coba lagi
            </button>

          </div>
        )}

        {/* =================================================
            TABLE SECTION
        ================================================= */}

        <section className="rounded-xl border border-[#e3dfea] bg-white shadow-[0_5px_20px_rgba(45,35,80,0.06)]">

          <div className="flex flex-col gap-2 border-b border-[#eeeaf3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="h-7 w-1 rounded-full bg-[#51448C]" />

                <h2 className="text-sm font-bold text-[#403a4a]">
                  Daftar Nota Tagihan
                </h2>

              </div>

              <p className="mt-1 text-[9px] text-[#99939f]">
                Detail transaksi tagihan dan
                status pembayaran customer
              </p>

            </div>

            <div className="flex items-center gap-2">

              <span className="rounded-full bg-[#f3f0fa] px-3 py-1.5 text-[9px] font-semibold text-[#51448C]">
                {filteredInvoices.length}{' '}
                Nota
              </span>

              <span className="rounded-full bg-[#f2faf4] px-3 py-1.5 text-[9px] font-semibold text-[#14952d]">
                Bayar{' '}
                {formatCompactRupiah(
                  tableTotals.bayar
                )}
              </span>

            </div>
          </div>

          <div className="p-3 sm:p-4">

            <DataTable
              columns={columns}
              data={tableData}
              loading={isLoading}
              loadingText="Memuat rekap nota tagihan..."
              emptyText={emptyTableText}
              tableClassName="text-[10px]"
              actionLabel="Detail"
              actions={(row) => (
                <button
                  type="button"
                  onClick={() =>
                    openDetail(row)
                  }
                  className="
                    inline-flex
                    h-7
                    items-center
                    gap-1.5
                    rounded-md
                    border
                    border-[#ddd8e8]
                    bg-white
                    px-2.5
                    text-[9px]
                    font-semibold
                    text-[#51448C]
                    shadow-sm
                    transition
                    hover:border-[#51448C]
                    hover:bg-[#f5f2fb]
                  "
                  title="Lihat detail nota"
                >
                  <Icon
                    name="eye"
                    className="h-3 w-3"
                  />

                  Detail
                </button>
              )}
              footer={tableFooter}
            />

          </div>
        </section>

        {/* =================================================
            FOOTNOTE
        ================================================= */}

        {reportSummary.item_tanpa_harga_beli >
          0 && (
          <div className="mt-3 rounded-lg border border-[#f4dfad] bg-[#fffaf0] px-4 py-3">

            <p className="text-[9px] font-medium text-[#9a6a00]">

              Perhatian: terdapat{' '}

              <strong>
                {
                  reportSummary.item_tanpa_harga_beli
                }
              </strong>{' '}

              item yang belum memiliki harga
              beli sehingga perhitungan laba
              mungkin belum mencakup seluruh
              modal.

            </p>

          </div>
        )}

      </div>

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      {isDetailOpen &&
        selectedInvoice && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-[#1f1a2e]/60
              p-3
              backdrop-blur-sm
              sm:p-5
            "
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeDetail()
              }
            }}
          >

            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_25px_80px_rgba(25,18,45,0.3)]">

              {/* MODAL HEADER */}

              <div className="relative overflow-hidden bg-gradient-to-r from-[#51448C] to-[#6757aa] px-5 py-4 text-white">

                <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/5" />

                <div className="relative flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">

                      <Icon
                        name="receipt"
                        className="h-5 w-5"
                      />

                    </div>

                    <div>

                      <p className="text-[9px] font-medium uppercase tracking-widest text-white/60">
                        Detail Nota Tagihan
                      </p>

                      <h2 className="mt-0.5 text-lg font-bold">
                        {
                          selectedInvoice.no_nota
                        }
                      </h2>

                      <p className="mt-0.5 text-[9px] text-white/65">
                        {
                          selectedInvoice.nama_customer
                        }
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={
                      closeDetail
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                  >
                    <Icon
                      name="close"
                      className="h-4 w-4"
                    />
                  </button>

                </div>
              </div>

              {/* MODAL BODY */}

              <div className="flex-1 overflow-y-auto">

                <div className="p-4 sm:p-5">

                  {/* INFORMATION */}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf9fc] p-3">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#99939f]">
                        Tanggal Nota
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-[#403a4a]">
                        {formatDateLong(
                          selectedInvoice.tanggal_nota
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf9fc] p-3">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#99939f]">
                        Periode Kirim
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-[#403a4a]">

                        {formatDate(
                          selectedInvoice.tanggal_kirim_dari
                        )}

                        {' - '}

                        <br />

                        {formatDate(
                          selectedInvoice.tanggal_kirim_sampai
                        )}

                      </p>

                    </div>

                    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf9fc] p-3">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#99939f]">
                        Status
                      </p>

                      <div className="mt-2">

                        <StatusBadge
                          status={
                            selectedInvoice.status
                          }
                          dilunaskan={
                            selectedInvoice.dilunaskan
                          }
                        />

                      </div>

                    </div>

                    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf9fc] p-3">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#99939f]">
                        Jumlah Cetak
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-[#403a4a]">
                        {selectedInvoice.jumlah_cetak ??
                          0}{' '}
                        kali
                      </p>

                    </div>

                  </div>

                  {/* MONEY SUMMARY */}

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div className="rounded-xl bg-[#f4f1fa] p-4">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#8d8798]">
                        Total Tagihan
                      </p>

                      <p className="mt-1 text-base font-bold text-[#51448C]">
                        {formatRupiah(
                          selectedInvoice.total_tagihan
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-[#effaf2] p-4">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#8d8798]">
                        Sudah Dibayar
                      </p>

                      <p className="mt-1 text-base font-bold text-[#14952d]">
                        {formatRupiah(
                          selectedInvoice.bayar
                        )}
                      </p>

                    </div>

                    <div className="rounded-xl bg-[#fff2f2] p-4">

                      <p className="text-[8px] font-bold uppercase tracking-wide text-[#8d8798]">
                        Sisa Tagihan
                      </p>

                      <p className="mt-1 text-base font-bold text-[#d33a3a]">
                        {formatRupiah(
                          selectedInvoice.sisa
                        )}
                      </p>

                    </div>

                  </div>

                  {/* DETAIL LABA RUGI */}

                  <div className="mt-5">

                    <div className="mb-3 flex items-center justify-between">

                      <div>

                        <h3 className="text-[11px] font-bold text-[#403a4a]">
                          Rincian Barang & Laba
                        </h3>

                        <p className="mt-0.5 text-[9px] text-[#99939f]">
                          Data dari laporan laba
                          rugi detail
                        </p>

                      </div>

                      <span className="rounded-full bg-[#f3f0fa] px-2.5 py-1 text-[9px] font-semibold text-[#51448C]">
                        {
                          selectedDetailRows.length
                        }{' '}
                        item
                      </span>

                    </div>

                    {isDetailLoading ? (
                      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-[#eeeaf3] bg-[#faf9fc]">

                        <div className="flex flex-col items-center gap-2">

                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ddd8e8] border-t-[#51448C]" />

                          <span className="text-[9px] text-[#8d8798]">
                            Memuat detail laba
                            rugi...
                          </span>

                        </div>

                      </div>
                    ) : detailError ? (
                      <div className="rounded-xl border border-[#ffdede] bg-[#fff7f7] p-4 text-[9px] text-[#d33a3a]">
                        {detailError}
                      </div>
                    ) : selectedDetailRows.length >
                      0 ? (
                      <div className="overflow-hidden rounded-xl border border-[#e8e4ef]">

                        <div className="overflow-x-auto">

                          <table className="w-full min-w-[850px] text-left">

                            <thead className="bg-[#f5f3f9]">

                              <tr>

                                <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Barang
                                </th>

                                <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Proyek
                                </th>

                                <th className="px-3 py-2.5 text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  SJ
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Qty
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Harga Beli
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Harga Jual
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Modal
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Penjualan
                                </th>

                                <th className="px-3 py-2.5 text-right text-[8px] font-bold uppercase tracking-wide text-[#77717f]">
                                  Laba
                                </th>

                              </tr>

                            </thead>

                            <tbody className="divide-y divide-[#eeeaf3]">

                              {selectedDetailRows.map(
                                (
                                  item,
                                  index
                                ) => (
                                  <tr
                                    key={
                                      item.item_id ??
                                      `${item.no_surat_jalan}-${index}`
                                    }
                                    className="hover:bg-[#faf9ff]"
                                  >

                                    <td className="px-3 py-2.5">

                                      <p className="text-[9px] font-semibold text-[#403a4a]">
                                        {
                                          item.nama_barang
                                        }
                                      </p>

                                      <p className="mt-0.5 text-[8px] text-[#99939f]">
                                        {
                                          item.satuan
                                        }{' '}
                                        •{' '}
                                        {formatDate(
                                          item.tanggal
                                        )}
                                      </p>

                                    </td>

                                    <td className="px-3 py-2.5 text-[9px] text-[#5f5b68]">
                                      {
                                        item.nama_proyek ||
                                        '-'
                                      }
                                    </td>

                                    <td className="px-3 py-2.5 text-[9px] font-medium text-[#51448C]">
                                      {
                                        item.no_surat_jalan
                                      }
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] font-semibold text-[#403a4a]">
                                      {formatNumber(
                                        item.qty
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] text-[#5f5b68]">
                                      {formatRupiah(
                                        item.harga_beli
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] text-[#5f5b68]">
                                      {formatRupiah(
                                        item.harga_jual
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] text-[#5f5b68]">
                                      {formatRupiah(
                                        item.total_modal
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] text-[#5f5b68]">
                                      {formatRupiah(
                                        item.total_penjualan
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-right text-[9px] font-bold text-[#14952d]">
                                      {formatRupiah(
                                        item.laba
                                      )}
                                    </td>

                                  </tr>
                                )
                              )}

                            </tbody>

                            <tfoot className="border-t-2 border-[#51448C]/10 bg-[#faf9fd]">

                              <tr>

                                <td
                                  colSpan={3}
                                  className="px-3 py-3 text-right text-[9px] font-bold uppercase text-[#51448C]"
                                >
                                  Total
                                </td>

                                <td className="px-3 py-3 text-right text-[9px] font-bold text-[#403a4a]">
                                  {formatNumber(
                                    selectedDetailSummary.qty
                                  )}
                                </td>

                                <td colSpan={2} />

                                <td className="px-3 py-3 text-right text-[9px] font-bold text-[#403a4a]">
                                  {formatRupiah(
                                    selectedDetailSummary.modal
                                  )}
                                </td>

                                <td className="px-3 py-3 text-right text-[9px] font-bold text-[#403a4a]">
                                  {formatRupiah(
                                    selectedDetailSummary.penjualan
                                  )}
                                </td>

                                <td className="px-3 py-3 text-right text-[9px] font-bold text-[#14952d]">
                                  {formatRupiah(
                                    selectedDetailSummary.laba
                                  )}
                                </td>

                              </tr>

                            </tfoot>

                          </table>

                        </div>

                      </div>
                    ) : (
                      <div className="rounded-xl border border-[#eeeaf3] bg-[#faf9fc] px-4 py-10 text-center">

                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#f1eef9] text-[#51448C]">

                          <Icon
                            name="receipt"
                            className="h-4 w-4"
                          />

                        </div>

                        <p className="mt-2 text-[10px] font-semibold text-[#5f5b68]">
                          Detail laba rugi
                          tidak ditemukan
                        </p>

                        <p className="mt-1 text-[8px] text-[#99939f]">
                          Tidak ada item yang
                          cocok dengan customer
                          dan periode pengiriman
                          nota ini.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="flex items-center justify-between border-t border-[#eeeaf3] bg-[#fcfbfe] px-5 py-3">

                <div className="text-[8px] text-[#99939f]">

                  {selectedInvoice.terakhir_dicetak
                    ? `Terakhir dicetak ${formatDateLong(
                        selectedInvoice.terakhir_dicetak
                      )}`
                    : 'Belum ada informasi cetak'}

                </div>

                <button
                  type="button"
                  onClick={
                    closeDetail
                  }
                  className="
                    h-8
                    rounded-lg
                    bg-[#51448C]
                    px-4
                    text-[9px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#433675]
                  "
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>
        )}

    </main>
  )
}

export default LaporanNotaTagihan