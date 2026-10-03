import { useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'

import DataTable from '../../../components/table/DataTable'

import suratJalanIcon from '../../../assets/img/icon/surat_jalan_icon.png'

import { getCustomers } from '../../../services/CustomerServices'
import { getDriver } from '../../../services/DriverServices'
import {
    getMaterialCustomer,
    getMaterial,
} from '../../../services/MaterialServices'
import { getProject } from '../../../services/ProjectServices'
import {
    getSuratJalan,
    createSuratJalan,
} from '../../../services/SuratJalanServices'

const SuratJalan = () => {
    // =====================================================
    // DATA STATE
    // =====================================================
    const [suratJalans, setSuratJalans] = useState([])
    const [drivers, setDrivers] = useState([])
    const [customers, setCustomers] = useState([])
    const [projects, setProjects] = useState([])
    const [materials, setMaterials] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // =====================================================
    // SEARCH STATE
    // =====================================================
    const [driverSearch, setDriverSearch] = useState('')
    const [customerSearch, setCustomerSearch] = useState('')
    const [materialSearch, setMaterialSearch] = useState('')

    const [isDriverDropdownOpen, setIsDriverDropdownOpen] =
        useState(false)

    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] =
        useState(false)

    const [isMaterialDropdownOpen, setIsMaterialDropdownOpen] =
        useState(null)

    // =====================================================
    // FORM STATE
    // =====================================================
    const [formData, setFormData] = useState({
        no_surat_jalan: '',
        tanggal: new Date().toISOString().split('T')[0],
        driver_id: '',
        customer_id: '',
        proyek_id: '',
    })

    const [selectedDriver, setSelectedDriver] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedProject, setSelectedProject] = useState(null)

    // =====================================================
    // ITEMS
    // =====================================================
    const [items, setItems] = useState([
        {
            id: Date.now(),
            material_id: '',
            nama_barang: '',
            satuan: '',
            qty: '',
            harga_beli: 0,
            harga_jual: 0,
        },
    ])

    // =====================================================
    // ALERT
    // =====================================================
    const showSuccessAlert = (title, text) => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#51448C',
            customClass: {
                popup: 'rounded-2xl',
            },
        })
    }

    const showErrorAlert = (title, text) => {
        Swal.fire({
            icon: 'error',
            title,
            text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#51448C',
            customClass: {
                popup: 'rounded-2xl',
            },
        })
    }

    // =====================================================
    // FORMAT PRICE
    // =====================================================
    const formatPrice = (price) => {
        const number = Number(price)

        return new Intl.NumberFormat('id-ID').format(
            Number.isFinite(number) ? number : 0
        )
    }

    // =====================================================
    // FORMAT DATE
    // =====================================================
    const formatDate = (date) => {
        if (!date) {
            return '-'
        }

        const parts = String(date).split('-')

        if (parts.length !== 3) {
            return date
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`
    }

    // =====================================================
    // NORMALIZE RESPONSE
    // =====================================================
    const getResponseItems = (response) => {
        if (Array.isArray(response)) {
            return response
        }

        if (Array.isArray(response?.items)) {
            return response.items
        }

        if (Array.isArray(response?.data)) {
            return response.data
        }

        return []
    }

    // =====================================================
    // GENERATE NO SURAT JALAN
    // =====================================================
    const generateNextSuratJalanNumber = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return 'SJ0001'
        }

        const numbers = data
            .map((item) => {
                const number = item.no_surat_jalan

                if (!number) {
                    return 0
                }

                const match = String(number).match(
                    /^SJ(\d+)$/
                )

                return match
                    ? Number(match[1])
                    : 0
            })
            .filter((number) => number > 0)

        const nextNumber =
            numbers.length > 0
                ? Math.max(...numbers) + 1
                : 1

        return `SJ${String(nextNumber).padStart(4, '0')}`
    }

    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)

                const [
                    suratJalanResponse,
                    driverResponse,
                    customerResponse,
                    projectResponse,
                    materialResponse,
                ] = await Promise.all([
                    getSuratJalan(),
                    getDriver(),
                    getCustomers(),
                    getProject(),
                    getMaterial(),
                ])

                const suratJalanItems =
                    getResponseItems(
                        suratJalanResponse
                    )

                const driverItems =
                    getResponseItems(
                        driverResponse
                    )

                const customerItems =
                    getResponseItems(
                        customerResponse
                    )

                const projectItems =
                    getResponseItems(
                        projectResponse
                    )

                const materialItems =
                    getResponseItems(
                        materialResponse
                    )

                setSuratJalans(
                    suratJalanItems
                )

                setDrivers(
                    driverItems
                )

                setCustomers(
                    customerItems
                )

                setProjects(
                    projectItems
                )

                setMaterials(
                    materialItems
                )

                setFormData(
                    (current) => ({
                        ...current,
                        no_surat_jalan:
                            generateNextSuratJalanNumber(
                                suratJalanItems
                            ),
                    })
                )
            } catch (error) {
                console.error(
                    'Gagal memuat data:',
                    error
                )

                showErrorAlert(
                    'Gagal Memuat Data',
                    error.message ||
                        'Data tidak dapat dimuat.'
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    // =====================================================
    // FILTER DRIVER
    // =====================================================
    const filteredDrivers = useMemo(() => {
        const keyword =
            driverSearch
                .toLowerCase()
                .trim()

        if (!keyword) {
            return drivers
        }

        return drivers.filter(
            (driver) =>
                driver.nama_supir
                    ?.toLowerCase()
                    .includes(keyword) ||
                driver.no_plat_mobil
                    ?.toLowerCase()
                    .includes(keyword)
        )
    }, [drivers, driverSearch])

    // =====================================================
    // FILTER CUSTOMER
    // =====================================================
    const filteredCustomers = useMemo(() => {
        const keyword =
            customerSearch
                .toLowerCase()
                .trim()

        if (!keyword) {
            return customers
        }

        return customers.filter(
            (customer) =>
                customer.nama_customer
                    ?.toLowerCase()
                    .includes(keyword) ||
                customer.kode
                    ?.toLowerCase()
                    .includes(keyword)
        )
    }, [customers, customerSearch])

    // =====================================================
    // PROJECT BERDASARKAN CUSTOMER
    // =====================================================
    const customerProjects = useMemo(() => {
        if (!selectedCustomer) {
            return []
        }

        return projects.filter(
            (project) =>
                Number(project.customer_id) ===
                Number(selectedCustomer.id)
        )
    }, [projects, selectedCustomer])

    // =====================================================
    // SELECT DRIVER
    // =====================================================
    const handleSelectDriver = (driver) => {
        setSelectedDriver(driver)

        setFormData((current) => ({
            ...current,
            driver_id: driver.id,
        }))

        setDriverSearch(
            driver.nama_supir || ''
        )

        setIsDriverDropdownOpen(false)
    }

    // =====================================================
    // SELECT CUSTOMER
    // =====================================================
    const handleSelectCustomer = async (
        customer
    ) => {
        try {
            setSelectedCustomer(customer)

            setFormData((current) => ({
                ...current,
                customer_id: customer.id,
                proyek_id: '',
            }))

            setSelectedProject(null)

            setCustomerSearch(
                customer.nama_customer || ''
            )

            setIsCustomerDropdownOpen(false)

            const response =
                await getMaterialCustomer(
                    customer.id
                )

            const customerMaterials =
                getResponseItems(response)

            if (
                customerMaterials.length > 0
            ) {
                setMaterials(
                    customerMaterials
                )
            } else {
                const defaultResponse =
                    await getMaterial()

                const defaultMaterials =
                    getResponseItems(
                        defaultResponse
                    )

                setMaterials(
                    defaultMaterials
                )
            }

            setItems([
                {
                    id: Date.now(),
                    material_id: '',
                    nama_barang: '',
                    satuan: '',
                    qty: '',
                    harga_beli: 0,
                    harga_jual: 0,
                },
            ])
        } catch (error) {
            console.error(
                'Gagal mengambil material customer:',
                error
            )

            showErrorAlert(
                'Gagal Memuat Material',
                error.message ||
                    'Material customer tidak dapat dimuat.'
            )
        }
    }

    // =====================================================
    // SELECT PROJECT
    // =====================================================
    const handleSelectProject = (
        project
    ) => {
        setSelectedProject(project)

        setFormData((current) => ({
            ...current,
            proyek_id: project.id,
        }))
    }

    // =====================================================
    // GET BUY PRICE
    // =====================================================
    const getBuyPrice = (material) => {
        const price = Number(
            material?.harga_beli ??
                material?.buyPrice ??
                0
        )

        return Number.isFinite(price)
            ? price
            : 0
    }

    // =====================================================
    // GET SELL PRICE
    // =====================================================
    const getSellPrice = (material) => {
        if (!material) {
            return 0
        }

        let price = 0

        if (
            material.harga_jual !== null &&
            material.harga_jual !== undefined
        ) {
            price = Number(
                material.harga_jual
            )
        } else if (
            material.harga_jual_default !== null &&
            material.harga_jual_default !== undefined
        ) {
            price = Number(
                material.harga_jual_default
            )
        } else if (
            material.harga_default !== null &&
            material.harga_default !== undefined
        ) {
            price = Number(
                material.harga_default
            )
        } else {
            price = Number(
                material.defaultPrice ?? 0
            )
        }

        return Number.isFinite(price)
            ? price
            : 0
    }

    // =====================================================
    // SELECT MATERIAL
    // =====================================================
    const handleSelectMaterial = (
        itemId,
        material
    ) => {
        const hargaBeli =
            getBuyPrice(material)

        const hargaJual =
            getSellPrice(material)

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          material_id:
                              material.id,
                          nama_barang:
                              material.nama_barang ||
                              '',
                          satuan:
                              material.satuan ||
                              '',
                          harga_beli:
                              hargaBeli,
                          harga_jual:
                              hargaJual,
                      }
                    : item
            )
        )

        setMaterialSearch('')
        setIsMaterialDropdownOpen(null)
    }

    // =====================================================
    // FILTER MATERIAL PER ROW
    // =====================================================
    const getFilteredMaterials = () => {
        const keyword =
            materialSearch
                .toLowerCase()
                .trim()

        if (!keyword) {
            return materials
        }

        return materials.filter(
            (material) =>
                material.nama_barang
                    ?.toLowerCase()
                    .includes(keyword) ||
                material.kode
                    ?.toLowerCase()
                    .includes(keyword)
        )
    }

    // =====================================================
    // QUANTITY CHANGE
    // =====================================================
    const handleQuantityChange = (
        itemId,
        value
    ) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          qty: value,
                      }
                    : item
            )
        )
    }

    // =====================================================
    // ADD MATERIAL
    // =====================================================
    const handleAddMaterial = () => {
        setItems((currentItems) => [
            ...currentItems,
            {
                id:
                    Date.now() +
                    currentItems.length,
                material_id: '',
                nama_barang: '',
                satuan: '',
                qty: '',
                harga_beli: 0,
                harga_jual: 0,
            },
        ])
    }

    // =====================================================
    // REMOVE MATERIAL
    // =====================================================
    const handleRemoveMaterial = (
        itemId
    ) => {
        if (items.length === 1) {
            return
        }

        setItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    item.id !== itemId
            )
        )
    }

    // =====================================================
    // TOTAL HARGA JUAL
    // =====================================================
    const totalHargaJual = useMemo(() => {
        return items.reduce(
            (total, item) => {
                const qty =
                    Number(item.qty)

                const hargaJual =
                    Number(
                        item.harga_jual
                    )

                const safeQty =
                    Number.isFinite(qty)
                        ? qty
                        : 0

                const safeHargaJual =
                    Number.isFinite(
                        hargaJual
                    )
                        ? hargaJual
                        : 0

                return (
                    total +
                    safeQty *
                        safeHargaJual
                )
            },
            0
        )
    }, [items])

    // =====================================================
    // RESET FORM
    // =====================================================
    const resetForm = (
        latestSuratJalans = suratJalans
    ) => {
        setSelectedDriver(null)
        setSelectedCustomer(null)
        setSelectedProject(null)

        setDriverSearch('')
        setCustomerSearch('')
        setMaterialSearch('')

        setIsDriverDropdownOpen(false)
        setIsCustomerDropdownOpen(false)
        setIsMaterialDropdownOpen(null)

        setItems([
            {
                id: Date.now(),
                material_id: '',
                nama_barang: '',
                satuan: '',
                qty: '',
                harga_beli: 0,
                harga_jual: 0,
            },
        ])

        setFormData({
            no_surat_jalan:
                generateNextSuratJalanNumber(
                    latestSuratJalans
                ),
            tanggal: new Date()
                .toISOString()
                .split('T')[0],
            driver_id: '',
            customer_id: '',
            proyek_id: '',
        })
    }

    // =====================================================
    // SUBMIT
    // =====================================================
    const handleSubmit = async (
        event
    ) => {
        event.preventDefault()

        if (!formData.tanggal) {
            showErrorAlert(
                'Data Belum Lengkap',
                'Tanggal surat jalan harus diisi.'
            )
            return
        }

        if (!selectedDriver) {
            showErrorAlert(
                'Data Belum Lengkap',
                'Silakan pilih nama supir terlebih dahulu.'
            )
            return
        }

        if (!selectedCustomer) {
            showErrorAlert(
                'Data Belum Lengkap',
                'Silakan pilih customer terlebih dahulu.'
            )
            return
        }

        if (!selectedProject) {
            showErrorAlert(
                'Data Belum Lengkap',
                'Silakan pilih proyek terlebih dahulu.'
            )
            return
        }

        const invalidItem =
            items.some(
                (item) =>
                    !item.material_id ||
                    !item.qty ||
                    Number(item.qty) <= 0
            )

        if (invalidItem) {
            showErrorAlert(
                'Material Belum Lengkap',
                'Pastikan semua material sudah dipilih dan quantity lebih dari 0.'
            )
            return
        }

        const materialIds =
            items.map(
                (item) =>
                    String(
                        item.material_id
                    )
            )

        const hasDuplicate =
            new Set(materialIds).size !==
            materialIds.length

        if (hasDuplicate) {
            showErrorAlert(
                'Material Duplikat',
                'Material yang sama tidak boleh dipilih lebih dari satu kali.'
            )
            return
        }

        try {
            setIsSaving(true)

            const payload = {
                no_surat_jalan:
                    formData.no_surat_jalan,

                tanggal:
                    formData.tanggal,

                driver_id:
                    Number(
                        formData.driver_id
                    ),

                customer_id:
                    Number(
                        formData.customer_id
                    ),

                proyek_id:
                    Number(
                        formData.proyek_id
                    ),

                items: items.map(
                    (item) => ({
                        material_id:
                            Number(
                                item.material_id
                            ),
                        qty: Number(
                            item.qty
                        ),
                    })
                ),
            }

            await createSuratJalan(
                payload
            )

            const response =
                await getSuratJalan()

            const latestSuratJalans =
                getResponseItems(
                    response
                )

            setSuratJalans(
                latestSuratJalans
            )

            showSuccessAlert(
                'Berhasil Disimpan',
                `Surat jalan ${formData.no_surat_jalan} berhasil dibuat.`
            )

            resetForm(
                latestSuratJalans
            )
        } catch (error) {
            console.error(
                'Gagal membuat surat jalan:',
                error
            )

            showErrorAlert(
                'Gagal Menyimpan',
                error.message ||
                    'Surat jalan gagal dibuat.'
            )
        } finally {
            setIsSaving(false)
        }
    }

    // =====================================================
    // TABLE COLUMNS
    // =====================================================
    const suratJalanColumns = [
        {
            key: 'no',
            label: 'No',
            render: (_, index) =>
                index + 1,
        },
        {
            key: 'no_surat_jalan',
            label: 'No Surat Jalan',
            render: (row) =>
                row.no_surat_jalan || '-',
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (row) =>
                formatDate(
                    row.tanggal
                ),
        },
        {
            key: 'nama_customer',
            label: 'Customer',
            render: (row) =>
                row.nama_customer || '-',
        },
        {
            key: 'nama_proyek',
            label: 'Project',
            render: (row) =>
                row.nama_proyek || '-',
        },
        {
            key: 'nama_supir',
            label: 'Nama Supir',
            render: (row) =>
                row.nama_supir || '-',
        },
        {
            key: 'no_plat_mobil',
            label: 'No Mobil',
            render: (row) =>
                row.no_plat_mobil || '-',
        },
        {
            key: 'nama_barang',
            label: 'Material',
            render: (row) =>
                row.nama_barang || '-',
        },
        {
            key: 'satuan',
            label: 'Satuan',
            render: (row) =>
                row.satuan || '-',
        },
        {
            key: 'qty',
            label: 'Qty',
            render: (row) => {
                const qty =
                    Number(row.qty)

                return Number.isFinite(
                    qty
                )
                    ? qty
                    : 0
            },
        },
        {
            key: 'harga_beli',
            label: 'Harga Beli',
            render: (row) => {
                const hargaBeli =
                    Number(
                        row.harga_beli
                    )

                return `Rp ${formatPrice(
                    Number.isFinite(
                        hargaBeli
                    )
                        ? hargaBeli
                        : 0
                )}`
            },
        },
        {
            key: 'harga_jual',
            label: 'Harga Jual',
            render: (row) => {
                const hargaJual =
                    Number(
                        row.harga_jual
                    )

                return `Rp ${formatPrice(
                    Number.isFinite(
                        hargaJual
                    )
                        ? hargaJual
                        : 0
                )}`
            },
        },
        {
            key: 'total',
            label: 'Total',
            render: (row) => {
                const qty =
                    Number(row.qty)

                const hargaJual =
                    Number(
                        row.harga_jual
                    )

                const safeQty =
                    Number.isFinite(
                        qty
                    )
                        ? qty
                        : 0

                const safeHargaJual =
                    Number.isFinite(
                        hargaJual
                    )
                        ? hargaJual
                        : 0

                const total =
                    safeQty *
                    safeHargaJual

                return `Rp ${formatPrice(
                    total
                )}`
            },
        },
        {
            key: 'no_nota',
            label: 'No Nota',
            render: (row) =>
                row.no_nota || '-',
        },
    ]

    // =====================================================
    // TABLE DATA
    // =====================================================
    const tableData = useMemo(() => {
        return suratJalans.map(
            (item, index) => {
                const qty =
                    Number(item.qty)

                const hargaBeli =
                    Number(
                        item.harga_beli
                    )

                const hargaJual =
                    Number(
                        item.harga_jual
                    )

                const safeQty =
                    Number.isFinite(qty)
                        ? qty
                        : 0

                const safeHargaBeli =
                    Number.isFinite(
                        hargaBeli
                    )
                        ? hargaBeli
                        : 0

                const safeHargaJual =
                    Number.isFinite(
                        hargaJual
                    )
                        ? hargaJual
                        : 0

                return {
                    ...item,

                    // ID unik untuk React
                    id: `${item.id ?? item.item_id ?? 'row'}-${index}`,

                    qty: safeQty,

                    harga_beli:
                        safeHargaBeli,

                    harga_jual:
                        safeHargaJual,

                    total:
                        safeQty *
                        safeHargaJual,
                }
            }
        )
    }, [suratJalans])

    // =====================================================
    // LOADING
    // =====================================================
    if (isLoading) {
        return (
            <main className="ml-64 flex min-h-screen items-center justify-center bg-gray-100 px-4">
                <div className="text-center">
                    <span className="mx-auto mb-3 block h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#51448C]" />

                    <p className="text-sm text-gray-500">
                        Memuat data...
                    </p>
                </div>
            </main>
        )
    }

    // =====================================================
    // RETURN
    // =====================================================
    return (
        <main className="ml-64 min-h-screen bg-gray-100 px-6 py-8">

            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className="h-9 w-9 bg-[#51448C]"
                    style={{
                        maskImage: `url(${suratJalanIcon})`,
                        maskPosition: 'center',
                        maskRepeat: 'no-repeat',
                        maskSize: 'contain',

                        WebkitMaskImage: `url(${suratJalanIcon})`,
                        WebkitMaskPosition: 'center',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskSize: 'contain',
                    }}
                />

                <h1 className="text-2xl font-bold text-[#51448C]">
                    INPUT SURAT JALAN
                </h1>
            </div>

            {/* FORM */}
            <section className="w-full rounded-2xl border border-[#d9d9df] bg-[#f5f5f6] p-5 shadow-sm">

                <form onSubmit={handleSubmit}>

                    {/* ROW 1 */}
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* NO SURAT JALAN */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                No Surat Jalan
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.no_surat_jalan
                                }
                                readOnly
                                className="h-10 w-full cursor-not-allowed rounded-lg border-0 bg-[#b1adae] px-3 text-xs font-medium text-white outline-none"
                            />
                        </div>

                        {/* TANGGAL */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Tanggal
                            </label>

                            <input
                                type="date"
                                value={
                                    formData.tanggal
                                }
                                onChange={(
                                    event
                                ) =>
                                    setFormData(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            tanggal:
                                                event
                                                    .target
                                                    .value,
                                        })
                                    )
                                }
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                            />
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* NO MOBIL */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                No Mobil
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedDriver?.no_plat_mobil ||
                                    ''
                                }
                                readOnly
                                placeholder="Otomatis dari supir"
                                className="h-10 w-full cursor-not-allowed rounded-lg border-0 bg-[#b1adae] px-3 text-xs text-white outline-none placeholder:text-gray-200"
                            />
                        </div>

                        {/* NAMA SUPIR */}
                        <div className="relative">
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Nama Supir
                            </label>

                            <input
                                type="text"
                                value={
                                    driverSearch
                                }
                                onChange={(
                                    event
                                ) => {
                                    setDriverSearch(
                                        event
                                            .target
                                            .value
                                    )

                                    setSelectedDriver(
                                        null
                                    )

                                    setFormData(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            driver_id:
                                                '',
                                        })
                                    )

                                    setIsDriverDropdownOpen(
                                        true
                                    )
                                }}
                                onFocus={() =>
                                    setIsDriverDropdownOpen(
                                        true
                                    )
                                }
                                placeholder="Cari nama supir..."
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                            />

                            {isDriverDropdownOpen && (
                                <div className="absolute left-0 right-0 top-[66px] z-50 overflow-hidden rounded-lg border border-[#dedee5] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
                                    <div className="max-h-[220px] overflow-y-auto">
                                        {filteredDrivers.length ===
                                        0 ? (
                                            <div className="px-4 py-5 text-center text-xs text-gray-500">
                                                Supir tidak ditemukan.
                                            </div>
                                        ) : (
                                            filteredDrivers.map(
                                                (
                                                    driver
                                                ) => (
                                                    <button
                                                        key={
                                                            driver.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectDriver(
                                                                driver
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-between border-b border-gray-50 px-3 py-2.5 text-left transition last:border-0 hover:bg-[#f7f5ff]"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-700">
                                                                {
                                                                    driver.nama_supir
                                                                }
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                {
                                                                    driver.no_plat_mobil
                                                                }
                                                            </p>
                                                        </div>

                                                        {selectedDriver?.id ===
                                                            driver.id && (
                                                            <span className="font-bold text-[#51448C]">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* CUSTOMER */}
                        <div className="relative">
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Customer
                            </label>

                            <input
                                type="text"
                                value={
                                    customerSearch
                                }
                                onChange={(
                                    event
                                ) => {
                                    setCustomerSearch(
                                        event
                                            .target
                                            .value
                                    )

                                    setSelectedCustomer(
                                        null
                                    )

                                    setSelectedProject(
                                        null
                                    )

                                    setFormData(
                                        (
                                            current
                                        ) => ({
                                            ...current,
                                            customer_id:
                                                '',
                                            proyek_id:
                                                '',
                                        })
                                    )

                                    setIsCustomerDropdownOpen(
                                        true
                                    )
                                }}
                                onFocus={() =>
                                    setIsCustomerDropdownOpen(
                                        true
                                    )
                                }
                                placeholder="Cari customer..."
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                            />

                            {isCustomerDropdownOpen && (
                                <div className="absolute left-0 right-0 top-[66px] z-50 overflow-hidden rounded-lg border border-[#dedee5] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
                                    <div className="max-h-[220px] overflow-y-auto">
                                        {filteredCustomers.length ===
                                        0 ? (
                                            <div className="px-4 py-5 text-center text-xs text-gray-500">
                                                Customer tidak ditemukan.
                                            </div>
                                        ) : (
                                            filteredCustomers.map(
                                                (
                                                    customer
                                                ) => (
                                                    <button
                                                        key={
                                                            customer.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleSelectCustomer(
                                                                customer
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-between border-b border-gray-50 px-3 py-2.5 text-left transition last:border-0 hover:bg-[#f7f5ff]"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-700">
                                                                {
                                                                    customer.nama_customer
                                                                }
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                {
                                                                    customer.kode
                                                                }
                                                            </p>
                                                        </div>

                                                        {selectedCustomer?.id ===
                                                            customer.id && (
                                                            <span className="font-bold text-[#51448C]">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PROJECT */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-700">
                                Proyek
                            </label>

                            <select
                                value={
                                    formData.proyek_id
                                }
                                onChange={(
                                    event
                                ) => {
                                    const project =
                                        customerProjects.find(
                                            (
                                                item
                                            ) =>
                                                Number(
                                                    item.id
                                                ) ===
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                        )

                                    if (
                                        project
                                    ) {
                                        handleSelectProject(
                                            project
                                        )
                                    }
                                }}
                                disabled={
                                    !selectedCustomer
                                }
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                <option value="">
                                    {!selectedCustomer
                                        ? 'Pilih customer terlebih dahulu'
                                        : customerProjects.length ===
                                            0
                                          ? 'Tidak ada proyek'
                                          : 'Pilih proyek'}
                                </option>

                                {customerProjects.map(
                                    (
                                        project
                                    ) => (
                                        <option
                                            key={
                                                project.id
                                            }
                                            value={
                                                project.id
                                            }
                                        >
                                            {
                                                project.nama_proyek
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    {/* MATERIAL */}
                    <div className="mb-5">

                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-xs font-medium text-gray-700">
                                Material
                            </label>

                            <button
                                type="button"
                                onClick={
                                    handleAddMaterial
                                }
                                disabled={
                                    !selectedCustomer ||
                                    materials.length ===
                                        0
                                }
                                className="inline-flex items-center gap-1.5 rounded-md bg-[#51448C] px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <span className="text-sm leading-none">
                                    +
                                </span>

                                Tambah Material
                            </button>
                        </div>

                        <div className="space-y-3">

                            {items.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const qty =
                                        Number(
                                            item.qty
                                        )

                                    const hargaJual =
                                        Number(
                                            item.harga_jual
                                        )

                                    const safeQty =
                                        Number.isFinite(
                                            qty
                                        )
                                            ? qty
                                            : 0

                                    const safeHargaJual =
                                        Number.isFinite(
                                            hargaJual
                                        )
                                            ? hargaJual
                                            : 0

                                    const subtotal =
                                        safeQty *
                                        safeHargaJual

                                    const filteredMaterialsForRow =
                                        getFilteredMaterials().filter(
                                            (
                                                material
                                            ) => {
                                                const alreadySelected =
                                                    items.some(
                                                        (
                                                            otherItem
                                                        ) =>
                                                            otherItem.id !==
                                                                item.id &&
                                                            Number(
                                                                otherItem.material_id
                                                            ) ===
                                                                Number(
                                                                    material.id
                                                                )
                                                    )

                                                return !alreadySelected
                                            }
                                        )

                                    return (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="rounded-xl border border-gray-200 bg-white p-3"
                                        >

                                            {/* MATERIAL HEADER */}
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-gray-400">
                                                    MATERIAL{' '}
                                                    {index +
                                                        1}
                                                </span>

                                                {items.length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMaterial(
                                                                item.id
                                                            )
                                                        }
                                                        className="text-[10px] font-medium text-red-500 hover:underline"
                                                    >
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_100px_1fr_1fr_1fr]">

                                                {/* MATERIAL */}
                                                <div className="relative">
                                                    <label className="mb-1 block text-[10px] text-gray-500">
                                                        Pilih Material
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            item.nama_barang ||
                                                            (isMaterialDropdownOpen ===
                                                            item.id
                                                                ? materialSearch
                                                                : '')
                                                        }
                                                        onChange={(
                                                            event
                                                        ) => {
                                                            setMaterialSearch(
                                                                event
                                                                    .target
                                                                    .value
                                                            )

                                                            setIsMaterialDropdownOpen(
                                                                item.id
                                                            )

                                                            setItems(
                                                                (
                                                                    currentItems
                                                                ) =>
                                                                    currentItems.map(
                                                                        (
                                                                            currentItem
                                                                        ) =>
                                                                            currentItem.id ===
                                                                            item.id
                                                                                ? {
                                                                                      ...currentItem,
                                                                                      material_id:
                                                                                          '',
                                                                                      nama_barang:
                                                                                          '',
                                                                                      satuan:
                                                                                          '',
                                                                                      harga_beli:
                                                                                          0,
                                                                                      harga_jual:
                                                                                          0,
                                                                                  }
                                                                                : currentItem
                                                                    )
                                                            )
                                                        }}
                                                        onFocus={() => {
                                                            setMaterialSearch(
                                                                ''
                                                            )

                                                            setIsMaterialDropdownOpen(
                                                                item.id
                                                            )
                                                        }}
                                                        disabled={
                                                            !selectedCustomer
                                                        }
                                                        placeholder={
                                                            selectedCustomer
                                                                ? 'Cari material...'
                                                                : 'Pilih customer terlebih dahulu'
                                                        }
                                                        className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[10px] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                    />

                                                    {isMaterialDropdownOpen ===
                                                        item.id && (
                                                        <div className="absolute left-0 right-0 top-[55px] z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                                                            <div className="max-h-[220px] overflow-y-auto">
                                                                {filteredMaterialsForRow.length ===
                                                                0 ? (
                                                                    <div className="px-3 py-4 text-center text-[10px] text-gray-500">
                                                                        Material tidak ditemukan.
                                                                    </div>
                                                                ) : (
                                                                    filteredMaterialsForRow.map(
                                                                        (
                                                                            material
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    material.id
                                                                                }
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleSelectMaterial(
                                                                                        item.id,
                                                                                        material
                                                                                    )
                                                                                }
                                                                                className="flex w-full items-center justify-between border-b border-gray-50 px-3 py-2 text-left last:border-0 hover:bg-[#f7f5ff]"
                                                                            >
                                                                                <div>
                                                                                    <p className="text-[10px] font-semibold text-gray-700">
                                                                                        {
                                                                                            material.nama_barang
                                                                                        }
                                                                                    </p>

                                                                                    <p className="text-[9px] text-gray-400">
                                                                                        {
                                                                                            material.kode
                                                                                        }
                                                                                    </p>
                                                                                </div>

                                                                                <span className="text-[9px] text-gray-400">
                                                                                    {
                                                                                        material.satuan
                                                                                    }
                                                                                </span>
                                                                            </button>
                                                                        )
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* QTY */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] text-gray-500">
                                                        Quantity
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={
                                                            item.qty
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                                                        placeholder="0"
                                                    />
                                                </div>

                                                {/* HARGA BELI */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] text-gray-500">
                                                        Harga Beli
                                                    </label>

                                                    <div className="flex h-9 items-center rounded-md bg-gray-100 px-3 text-[10px] font-medium text-gray-600">
                                                        Rp{' '}
                                                        {formatPrice(
                                                            item.harga_beli
                                                        )}
                                                    </div>
                                                </div>

                                                {/* HARGA JUAL */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] text-gray-500">
                                                        Harga Jual
                                                    </label>

                                                    <div className="flex h-9 items-center rounded-md bg-[#f8f6ff] px-3 text-[10px] font-semibold text-[#51448C]">
                                                        Rp{' '}
                                                        {formatPrice(
                                                            item.harga_jual
                                                        )}
                                                    </div>
                                                </div>

                                                {/* SUBTOTAL */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] text-gray-500">
                                                        Subtotal
                                                    </label>

                                                    <div className="flex h-9 items-center rounded-md bg-[#f8f6ff] px-3 text-[10px] font-bold text-[#51448C]">
                                                        Rp{' '}
                                                        {formatPrice(
                                                            subtotal
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }
                            )}

                        </div>
                    </div>

                    {/* TOTAL */}
                    <div className="mb-5 flex items-center justify-between rounded-xl bg-[#51448C] px-4 py-4 text-white">

                        <div>
                            <p className="text-[10px] opacity-80">
                                TOTAL HARGA JUAL
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                Rp{' '}
                                {formatPrice(
                                    totalHargaJual
                                )}
                            </p>
                        </div>

                        <div className="text-right text-[10px] opacity-80">
                            {items.length}{' '}
                            material
                        </div>

                    </div>

                    {/* SAVE */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                isSaving
                            }
                            className="rounded-lg bg-[#51448C] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? 'Menyimpan...'
                                : 'Simpan Surat Jalan'}
                        </button>
                    </div>

                </form>
            </section>

            {/* DATA SURAT JALAN */}
            <section className="mt-8 w-full">

                <div className="mb-4">
                    <h2 className="text-lg font-bold text-[#51448C]">
                        Data Surat Jalan
                    </h2>

                    <p className="text-xs text-gray-500">
                        Daftar surat jalan yang telah dibuat
                    </p>
                </div>

                <div className="custom-scrollbar w-full overflow-x-auto">

                    <DataTable
                        columns={
                            suratJalanColumns
                        }
                        data={tableData}
                    />

                </div>
            </section>

        </main>
    )
}

export default SuratJalan   