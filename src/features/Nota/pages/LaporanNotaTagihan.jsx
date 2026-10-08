import { useEffect, useMemo, useState } from 'react'
import {
  getLaporanLabaRugi,
  getNotaTagihan,
} from '../../../services/NotaServices'
import reportIcon from '../../../assets/img/icon/NotaIcon.png'

const toInputDate = (value) => {
  if (!value) return ''

  const date = String(value)
  if (date.includes('/')) {
    const [day, month, year] = date.split('/')
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }

  return date.split('T')[0]
}

const formatDate = (value) => {
  const date = toInputDate(value)
  if (!date) return '-'

  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return String(value)

  return `${day}/${month}/${year}`
}

const toAmount = (value) => {
  if (value === null || value === undefined || value === '') return null

  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

const formatRupiah = (value) =>
  `Rp${Number(value || 0).toLocaleString('id-ID')}.00`

const getPaymentTotal = (invoice) => {
  const recordedTotal = toAmount(invoice.bayar)
  if (recordedTotal !== null) return recordedTotal

  if (!Array.isArray(invoice.pembayaran)) return 0

  return invoice.pembayaran.reduce(
    (total, payment) => total + (toAmount(payment.jumlah_bayar) || 0),
    0
  )
}

const LaporanNotaTagihan = () => {
  const [invoices, setInvoices] = useState([])
  const [profitLossReport, setProfitLossReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReportLoading, setIsReportLoading] = useState(true)
  const [error, setError] = useState('')
  const [profitLossError, setProfitLossError] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    let isActive = true

    const loadInvoices = async () => {
      try {
        const response = await getNotaTagihan()
        const data = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : []

        if (isActive) {
          setInvoices(data)
          setError('')
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message || 'Gagal mengambil data laporan nota tagihan.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadInvoices()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadProfitLossReport = async () => {
      setIsReportLoading(true)

      try {
        const report = await getLaporanLabaRugi({
          dari: dateFrom,
          sampai: dateTo,
        })

        if (isActive) {
          setProfitLossReport(report)
          setProfitLossError('')
        }
      } catch (reportError) {
        if (isActive) {
          setProfitLossError(
            reportError.message || 'Gagal mengambil laporan laba rugi.'
          )
        }
      } finally {
        if (isActive) setIsReportLoading(false)
      }
    }

    loadProfitLossReport()

    return () => {
      isActive = false
    }
  }, [dateFrom, dateTo])

  const customers = useMemo(() => {
    const customerMap = new Map()

    invoices.forEach((invoice) => {
      const id = invoice.customer_id ?? invoice.customer?.id
      const name =
        invoice.nama_customer ??
        invoice.customer?.nama_customer ??
        invoice.customer?.name ??
        ''

      if (id !== null && id !== undefined && name) {
        customerMap.set(String(id), name)
      }
    })

    return [...customerMap.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((first, second) => first.name.localeCompare(second.name, 'id'))
  }, [invoices])

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const customerId = invoice.customer_id ?? invoice.customer?.id
      const invoiceDate = toInputDate(invoice.tanggal_nota ?? invoice.tanggal)

      const matchesCustomer =
        !selectedCustomer || String(customerId) === selectedCustomer
      const matchesDateFrom = !dateFrom || invoiceDate >= dateFrom
      const matchesDateTo = !dateTo || invoiceDate <= dateTo

      return matchesCustomer && matchesDateFrom && matchesDateTo
    })
  }, [invoices, selectedCustomer, dateFrom, dateTo])

  const totals = useMemo(() => {
    return filteredInvoices.reduce(
      (current, invoice) => {
        const billed = toAmount(invoice.total_tagihan) || 0
        const paid = getPaymentTotal(invoice)
        const remaining = toAmount(invoice.sisa) ?? Math.max(billed - paid, 0)

        current.billed += billed
        current.paid += paid
        current.remaining += remaining

        return current
      },
      {
        billed: 0,
        paid: 0,
        remaining: 0,
      }
    )
  }, [filteredInvoices])

  const reportSummary = useMemo(
    () => profitLossReport?.ringkasan ?? {},
    [profitLossReport]
  )
  const reportPeriod = profitLossReport?.periode_data_awal
    ? `${formatDate(profitLossReport.periode_data_awal)} - ${formatDate(profitLossReport.periode_data_akhir)}`
    : profitLossReport?.seluruh_periode
      ? 'Seluruh periode'
      : ''

  const customerReportRows = useMemo(() => {
    const rows = Array.isArray(profitLossReport?.per_customer)
      ? profitLossReport.per_customer
      : []

    return selectedCustomer
      ? rows.filter((row) => String(row.customer_id) === selectedCustomer)
      : rows
  }, [profitLossReport, selectedCustomer])

  const reportTotals = useMemo(() => {
    if (!selectedCustomer) return reportSummary
    if (customerReportRows.length === 0) return null

    const sales = customerReportRows.reduce(
      (sum, row) => sum + (toAmount(row.total_penjualan) || 0),
      0
    )
    const cost = customerReportRows.reduce(
      (sum, row) => sum + (toAmount(row.total_modal) || 0),
      0
    )
    const profit = customerReportRows.reduce(
      (sum, row) => sum + (toAmount(row.laba) || 0),
      0
    )

    return {
      total_penjualan: sales,
      total_modal: cost,
      laba: profit,
      margin_persen: sales > 0 ? (profit / sales) * 100 : 0,
    }
  }, [reportSummary, selectedCustomer, customerReportRows])

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-8 lg:py-10">
      <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 bg-[#51448C] sm:h-9 sm:w-9"
          style={{
            maskImage: `url(${reportIcon})`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskImage: `url(${reportIcon})`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
          }}
        />
        <h1 className="text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
          LAPORAN NOTA TAGIHAN
        </h1>
      </div>

      <section className="rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="block w-full sm:w-[185px]">
            <span className="sr-only">Pilih Customer</span>
            <select
              value={selectedCustomer}
              onChange={(event) => setSelectedCustomer(event.target.value)}
              className="h-9 w-full rounded-md border border-[#e0e0e5] bg-white px-3 text-xs text-[#51448C] outline-none focus:border-[#51448C]"
            >
              <option value="">Pilih Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setIsFilterOpen((open) => !open)}
            aria-expanded={isFilterOpen}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-md border border-[#e0e0e5] bg-white px-3 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] sm:self-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 4.75A.75.75 0 0 1 3.75 4h12.5a.75.75 0 0 1 .6 1.2L12 12v3.25a.75.75 0 0 1-1.1.67l-2-1A.75.75 0 0 1 8.5 14.25V12L3.15 5.2A.75.75 0 0 1 3 4.75Z"
                clipRule="evenodd"
              />
            </svg>
            Filter
          </button>
        </div>

        {isFilterOpen && (
          <div className="mb-3 grid grid-cols-1 gap-3 rounded-lg border border-[#e4e1eb] bg-white p-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end">
            <label className="text-xs text-[#707070]">
              Tanggal nota dari
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-[#e0e0e5] bg-white px-2 text-xs text-[#51448C] outline-none focus:border-[#51448C]"
              />
            </label>
            <span className="hidden pb-2 text-xs text-[#707070] sm:block">s/d</span>
            <label className="text-xs text-[#707070]">
              Tanggal nota sampai
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                min={dateFrom || undefined}
                className="mt-1 h-9 w-full rounded-md border border-[#e0e0e5] bg-white px-2 text-xs text-[#51448C] outline-none focus:border-[#51448C]"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
              className="h-9 rounded-md px-3 text-xs font-medium text-[#51448C] transition hover:bg-[#f1effa]"
            >
              Reset tanggal
            </button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['Total Penjualan', reportTotals?.total_penjualan],
            ['Total Modal', reportTotals?.total_modal],
            ['Laba', reportTotals?.laba],
            ['Margin', reportTotals?.margin_persen, '%'],
          ].map(([label, value, suffix]) => (
            <div key={label} className="rounded-lg border border-[#e4e1eb] bg-white px-3 py-3 shadow-sm">
              <p className="text-[10px] font-medium text-[#8a8791]">{label}</p>
              <p className="mt-1 text-sm font-bold text-[#51448C]">
                {isReportLoading
                  ? 'Memuat...'
                  : profitLossError
                    ? 'Gagal dimuat'
                    : value === null || value === undefined
                      ? 'Belum tersedia'
                      : suffix
                        ? `${Number(value).toLocaleString('id-ID', { maximumFractionDigits: 2 })}${suffix}`
                        : formatRupiah(value)}
              </p>
            </div>
          ))}
        </div>

        {reportPeriod && (
          <p className="mb-3 text-[11px] text-[#707070]">
            Periode data laporan: <span className="font-semibold">{reportPeriod}</span>
            {profitLossReport?.seluruh_periode && ' (seluruh periode)'}
          </p>
        )}

        {error && (
          <div role="alert" className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-[#e1e1e5] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <table className="min-w-[1050px] w-full text-left text-xs">
            <thead className="bg-[#51448C] text-white">
              <tr>
                {['No. Nota', 'Tanggal', 'Kirim Awal', 'Kirim Akhir', 'Nama Customer', 'Tagihan', 'Bayar', 'Sisa'].map((label) => (
                  <th key={label} className="whitespace-nowrap px-2.5 py-2.5 font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8eb] text-[#707070]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[#51448C]">
                    Memuat laporan nota tagihan...
                  </td>
                </tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  const billed = toAmount(invoice.total_tagihan) || 0
                  const paid = getPaymentTotal(invoice)
                  const remaining = toAmount(invoice.sisa) ?? Math.max(billed - paid, 0)

                  return (
                    <tr key={invoice.id} className="transition-colors hover:bg-[#faf9ff]">
                      <td className="whitespace-nowrap px-2.5 py-2">{invoice.no_nota || '-'}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatDate(invoice.tanggal_nota ?? invoice.tanggal)}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatDate(invoice.tanggal_kirim_dari)}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatDate(invoice.tanggal_kirim_sampai)}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">
                        {invoice.nama_customer ?? invoice.customer?.nama_customer ?? invoice.customer?.name ?? '-'}
                      </td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(billed)}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(paid)}</td>
                      <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(remaining)}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[#907ca2]">
                    Tidak ada nota tagihan untuk filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="font-semibold text-black">
              <tr className="border-t border-[#e8e8eb]">
                <td colSpan={5} className="px-2.5 py-2 text-right">Total Tagihan</td>
                <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(totals.billed)}</td>
                <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(totals.paid)}</td>
                <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(totals.remaining)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {profitLossError && (
          <p className="mt-2 text-[11px] text-[#8a8791]">
            {profitLossError}
          </p>
        )}

        <div className="mt-4 overflow-x-auto rounded-md border border-[#e1e1e5] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          <table className="min-w-[700px] w-full text-left text-xs">
            <thead className="bg-[#51448C] text-white">
              <tr>
                {['Nama Customer', 'Total Penjualan', 'Total Modal', 'Laba', 'Margin'].map((label) => (
                  <th key={label} className="whitespace-nowrap px-2.5 py-2.5 font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8eb] text-[#707070]">
              {isReportLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#51448C]">
                    Memuat rincian laba rugi...
                  </td>
                </tr>
              ) : profitLossError ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-red-600">
                    {profitLossError}
                  </td>
                </tr>
              ) : customerReportRows.length > 0 ? (
                customerReportRows.map((row) => (
                  <tr key={row.customer_id} className="hover:bg-[#faf9ff]">
                    <td className="whitespace-nowrap px-2.5 py-2">{row.nama_customer || '-'}</td>
                    <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(row.total_penjualan)}</td>
                    <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(row.total_modal)}</td>
                    <td className="whitespace-nowrap px-2.5 py-2">{formatRupiah(row.laba)}</td>
                    <td className="whitespace-nowrap px-2.5 py-2">
                      {`${Number(row.margin_persen || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#907ca2]">
                    Tidak ada data laba rugi untuk filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {reportSummary.item_tanpa_harga_beli > 0 && (
          <p className="mt-2 text-[11px] text-amber-700">
            {reportSummary.item_tanpa_harga_beli} item tidak memiliki harga beli sehingga hasil laba dapat belum mencakup seluruh modal.
          </p>
        )}
      </section>
    </main>
  )
}

export default LaporanNotaTagihan
