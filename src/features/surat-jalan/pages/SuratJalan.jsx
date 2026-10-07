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
    getSuratJalanAll,
    createSuratJalan,
    updateSuratJalan,
    deleteSuratJalan,
} from '../../../services/SuratJalanServices'

const SuratJalan = () => {
    // =====================================================
    // DATA STATE
    // =====================================================
    const [suratJalans, setSuratJalans] = useState([])
    const [suratJalanParents, setSuratJalanParents] = useState([])

    const [drivers, setDrivers] = useState([])
    const [customers, setCustomers] = useState([])
    const [projects, setProjects] = useState([])
    const [materials, setMaterials] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [tableSearch, setTableSearch] = useState('')
    const [customerFilter, setCustomerFilter] = useState('')

    // =====================================================
    // EDIT STATE
    // =====================================================
    const [isEditing, setIsEditing] = useState(false)
    const [editingSuratJalanId, setEditingSuratJalanId] = useState(null)

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
    // LOAD INITIAL DATA
    // =====================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)

                const [
                    suratJalanResponse,
                    suratJalanAllResponse,
                    driverResponse,
                    customerResponse,
                    projectResponse,
                    materialResponse,
                ] = await Promise.all([
                    getSuratJalan(),
                    getSuratJalanAll(),
                    getDriver(),
                    getCustomers(),
                    getProject(),
                    getMaterial(),
                ])

                const suratJalanItems =
                    getResponseItems(
                        suratJalanResponse
                    )

                const suratJalanParentItems =
                    getResponseItems(
                        suratJalanAllResponse
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

                setSuratJalanParents(
                    suratJalanParentItems
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

            } catch (error) {
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
    // FILTER MATERIAL
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
    // SELL PRICE CHANGE
    // =====================================================
    const handleSellPriceChange = (
        itemId,
        value
    ) => {
        const digitsOnly = value.replace(/\D/g, '')

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? {
                          ...item,
                          harga_jual:
                              digitsOnly === ''
                                  ? ''
                                  : Number(digitsOnly),
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
    // FIND PARENT SURAT JALAN
    // =====================================================
    const findParentSuratJalan = (item) => {
        if (!item) {
            return null
        }

        // Prioritas 1:
        // ID parent dari response item
        const suratJalanId =
            item.surat_jalan_id ??
            item.suratJalanId ??
            item.parent_id

        if (
            suratJalanId !== undefined &&
            suratJalanId !== null
        ) {
            const parentById =
                suratJalanParents.find(
                    (parent) =>
                        Number(parent.id) ===
                        Number(suratJalanId)
                )

            if (parentById) {
                return parentById
            }
        }

        // Prioritas 2:
        // Cari berdasarkan nomor surat jalan
        if (item.no_surat_jalan) {
            const parentByNumber =
                suratJalanParents.find(
                    (parent) =>
                        String(
                            parent.no_surat_jalan
                        ) ===
                        String(
                            item.no_surat_jalan
                        )
                )

            if (parentByNumber) {
                return parentByNumber
            }
        }

        return null
    }

    // =====================================================
    // REFRESH DATA
    // =====================================================
    const refreshSuratJalanData = async () => {
        const [
            itemResponse,
            parentResponse,
        ] = await Promise.all([
            getSuratJalan(),
            getSuratJalanAll(),
        ])

        const latestItems =
            getResponseItems(
                itemResponse
            )

        const latestParents =
            getResponseItems(
                parentResponse
            )

        setSuratJalans(
            latestItems
        )

        setSuratJalanParents(
            latestParents
        )

        return {
            latestItems,
            latestParents,
        }
    }

    // =====================================================
    // RESET FORM
    // =====================================================
    const resetForm = () => {
        setIsFormModalOpen(false)
        setIsEditing(false)
        setEditingSuratJalanId(null)

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
            no_surat_jalan: '',
            tanggal: new Date()
                .toISOString()
                .split('T')[0],
            driver_id: '',
            customer_id: '',
            proyek_id: '',
        })
    }

    // =====================================================
    // EDIT SURAT JALAN
    // =====================================================
    // =====================================================
// EDIT SURAT JALAN
// =====================================================
const handleEditSuratJalan = async (item) => {
    const parent = findParentSuratJalan(item)

    if (!parent) {
        showErrorAlert(
            'Data Tidak Ditemukan',
            'Data surat jalan induk untuk item ini tidak ditemukan.'
        )
        return
    }

    try {
        setIsEditing(true)
        setEditingSuratJalanId(parent.id)

        // =================================================
        // CARI DRIVER BERDASARKAN NAMA
        // =================================================
        const driver = drivers.find(
            (driverItem) =>
                String(driverItem.nama_supir || '')
                    .trim()
                    .toLowerCase() ===
                String(
                    item.nama_supir ||
                        parent.nama_supir ||
                        ''
                )
                    .trim()
                    .toLowerCase()
        )

        // =================================================
        // CARI CUSTOMER BERDASARKAN ID
        // =================================================
        const customer = customers.find(
            (customerItem) =>
                Number(customerItem.id) ===
                Number(
                    item.customer_id ??
                        parent.customer_id
                )
        )

        // =================================================
        // CARI PROJECT BERDASARKAN NAMA
        // =================================================
        const project = projects.find(
            (projectItem) =>
                String(
                    projectItem.nama_proyek || ''
                )
                    .trim()
                    .toLowerCase() ===
                String(
                    item.nama_proyek ||
                        parent.nama_proyek ||
                        ''
                )
                    .trim()
                    .toLowerCase()
        )

        // =================================================
        // SET DRIVER
        // =================================================
        setSelectedDriver(driver || null)

        setDriverSearch(
            driver?.nama_supir ||
                item.nama_supir ||
                parent.nama_supir ||
                ''
        )

        // =================================================
        // SET CUSTOMER
        // =================================================
        setSelectedCustomer(customer || null)

        setCustomerSearch(
            customer?.nama_customer ||
                item.nama_customer ||
                parent.nama_customer ||
                ''
        )

        // =================================================
        // SET PROJECT
        // =================================================
        setSelectedProject(project || null)

        // =================================================
        // SET FORM
        // =================================================
        setFormData({
            no_surat_jalan:
                parent.no_surat_jalan ||
                item.no_surat_jalan ||
                '',

            tanggal:
                parent.tanggal ||
                item.tanggal ||
                new Date()
                    .toISOString()
                    .split('T')[0],

            driver_id:
                driver?.id || '',

            customer_id:
                customer?.id ||
                item.customer_id ||
                parent.customer_id ||
                '',

            proyek_id:
                project?.id || '',
        })

        // =================================================
        // LOAD MATERIAL CUSTOMER
        // =================================================
        let editMaterials = materials

        const customerId =
            customer?.id ||
            item.customer_id ||
            parent.customer_id

        if (customerId) {
            try {
                const materialResponse =
                    await getMaterialCustomer(
                        customerId
                    )

                const customerMaterials =
                    getResponseItems(
                        materialResponse
                    )

                if (
                    customerMaterials.length > 0
                ) {
                    editMaterials =
                        customerMaterials

                    setMaterials(
                        customerMaterials
                    )
                }
            } catch {
                // Tetap gunakan material yang sudah ada
            }
        }

        // =================================================
        // CARI SEMUA ITEM MILIK SURAT JALAN
        // =================================================
        let parentItems =
            suratJalans.filter(
                (row) =>
                    Number(
                        row.surat_jalan_id
                    ) === Number(parent.id)
            )

        // =================================================
        // FALLBACK BERDASARKAN NO SURAT JALAN
        // =================================================
        if (parentItems.length === 0) {
            parentItems =
                suratJalans.filter(
                    (row) =>
                        String(
                            row.no_surat_jalan
                        ) ===
                        String(
                            parent.no_surat_jalan ||
                                item.no_surat_jalan
                        )
                )
        }

        // =================================================
        // FALLBACK ROW YANG DIKLIK
        // =================================================
        if (parentItems.length === 0) {
            parentItems = [item]
        }

        // =================================================
        // SET ITEM KE FORM EDIT
        // =================================================
        const editItems = parentItems.map(
            (currentItem, index) => {

                // -----------------------------------------
                // CARI MATERIAL BERDASARKAN ID
                // Jika API menyediakan material_id
                // -----------------------------------------
                let material =
                    editMaterials.find(
                        (materialItem) =>
                            currentItem.material_id &&
                            Number(
                                materialItem.id
                            ) ===
                                Number(
                                    currentItem.material_id
                                )
                    )

                // -----------------------------------------
                // JIKA material_id TIDAK ADA
                // CARI BERDASARKAN NAMA BARANG
                // -----------------------------------------
                if (!material) {
                    material =
                        editMaterials.find(
                            (materialItem) =>
                                String(
                                    materialItem.nama_barang ||
                                        ''
                                )
                                    .trim()
                                    .toLowerCase() ===
                                String(
                                    currentItem.nama_barang ||
                                        ''
                                )
                                    .trim()
                                    .toLowerCase()
                        )
                }

                return {
                    id:
                        Date.now() +
                        index,

                    // Prioritas:
                    // 1. material_id dari API
                    // 2. material.id hasil pencarian nama
                    material_id:
                        currentItem.material_id ||
                        material?.id ||
                        '',

                    nama_barang:
                        currentItem.nama_barang ||
                        material?.nama_barang ||
                        '',

                    satuan:
                        currentItem.satuan ||
                        material?.satuan ||
                        '',

                    // PENTING:
                    // qty tetap mengambil dari API
                    qty:
                        currentItem.qty ?? '',

                    harga_beli:
                        Number(
                            currentItem.harga_beli ??
                                material?.harga_beli ??
                                0
                        ),

                    harga_jual:
                        Number(
                            currentItem.harga_jual ??
                                material?.harga_jual ??
                                0
                        ),

                }
            }
        )

        setItems(editItems)

        // =================================================
        // TUTUP DROPDOWN
        // =================================================
        setIsDriverDropdownOpen(false)
        setIsCustomerDropdownOpen(false)
        setIsMaterialDropdownOpen(null)
        setIsFormModalOpen(true)
    } catch (error) {
        setIsFormModalOpen(false)
        setIsEditing(false)
        setEditingSuratJalanId(null)

        showErrorAlert(
            'Gagal Mengedit',
            error.message ||
                'Data surat jalan tidak dapat dimuat.'
        )
    }
}

    // =====================================================
    // DELETE SURAT JALAN
    // =====================================================
    // =====================================================
// =====================================================
// DELETE SURAT JALAN
// =====================================================
const handleDeleteSuratJalan = async (item) => {
    // =================================================
    // AMBIL ID SURAT JALAN PARENT
    // =================================================
    const suratJalanId =
        item?.surat_jalan_id ??
        item?.suratJalanId ??
        item?.parent_id

    if (
        suratJalanId === undefined ||
        suratJalanId === null ||
        suratJalanId === ''
    ) {
        showErrorAlert(
            'Data Tidak Ditemukan',
            'ID surat jalan tidak ditemukan.'
        )
        return
    }

    // =================================================
    // CARI NOMOR SURAT JALAN
    // =================================================
    const parent =
        suratJalanParents.find(
            (suratJalan) =>
                Number(suratJalan.id) ===
                Number(suratJalanId)
        )

    const noSuratJalan =
        parent?.no_surat_jalan ||
        item?.no_surat_jalan ||
        '-'

    // =================================================
    // KONFIRMASI
    // =================================================
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Hapus Surat Jalan?',
        text: `Surat jalan ${noSuratJalan} beserta seluruh itemnya akan dihapus.`,
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        customClass: {
            popup: 'rounded-2xl',
        },
    })

    if (!result.isConfirmed) {
        return
    }

    try {
        setIsSaving(true)

        // =================================================
        // DELETE PARENT
        // =================================================
        await deleteSuratJalan(
            Number(suratJalanId)
        )

        // =================================================
        // REFRESH DATA
        // =================================================
        try {
            const {
                latestParents,
            } = await refreshSuratJalanData()

        } catch {
            // DELETE SUDAH BERHASIL.
            // Kalau refresh gagal, jangan tampilkan
            // sebagai error delete.
        }

        // =================================================
        // TAMPILKAN BERHASIL
        // =================================================
        showSuccessAlert(
            'Berhasil Dihapus',
            `Surat jalan ${noSuratJalan} berhasil dihapus.`
        )
    } catch (error) {
        showErrorAlert(
            'Gagal Menghapus',
            error.message ||
                'Surat jalan gagal dihapus.'
        )
    } finally {
        setIsSaving(false)
    }
}

    // =====================================================
    // SUBMIT
    // =====================================================
    // =====================================================
// SUBMIT
// =====================================================
const handleSubmit = async (event) => {
    event.preventDefault()

    // =================================================
    // VALIDASI NOMOR SURAT JALAN
    // =================================================
    if (!formData.no_surat_jalan.trim()) {
        showErrorAlert(
            'Data Belum Lengkap',
            'Nomor surat jalan harus diisi.'
        )
        return
    }

    // =================================================
    // VALIDASI TANGGAL
    // =================================================
    if (!formData.tanggal) {
        showErrorAlert(
            'Data Belum Lengkap',
            'Tanggal surat jalan harus diisi.'
        )
        return
    }

    // =================================================
    // VALIDASI DRIVER
    // =================================================
    if (!formData.driver_id) {
        showErrorAlert(
            'Data Belum Lengkap',
            'Silakan pilih nama supir terlebih dahulu.'
        )
        return
    }

    // =================================================
    // VALIDASI CUSTOMER
    // =================================================
    if (!formData.customer_id) {
        showErrorAlert(
            'Data Belum Lengkap',
            'Silakan pilih customer terlebih dahulu.'
        )
        return
    }

    // =================================================
    // VALIDASI PROJECT
    // =================================================
    if (!formData.proyek_id) {
        showErrorAlert(
            'Data Belum Lengkap',
            'Silakan pilih proyek terlebih dahulu.'
        )
        return
    }

    // =================================================
    // NORMALISASI ITEM
    // =================================================
    const normalizedItems = items.map(
        (item) => {
            let materialId =
                item.material_id

            // Jika material_id kosong,
            // cari berdasarkan nama barang
            if (
                !materialId &&
                item.nama_barang
            ) {
                const material =
                    materials.find(
                        (materialItem) =>
                            String(
                                materialItem.nama_barang ||
                                    ''
                            )
                                .trim()
                                .toLowerCase() ===
                            String(
                                item.nama_barang ||
                                    ''
                            )
                                .trim()
                                .toLowerCase()
                    )

                if (material) {
                    materialId =
                        material.id
                }
            }

            return {
                ...item,

                material_id:
                    materialId,

                qty:
                    Number(item.qty),
            }
        }
    )

    // =================================================
    // CEK MATERIAL
    // =================================================
    const itemsWithoutMaterial =
        normalizedItems.filter(
            (item) =>
                !item.material_id
        )

    if (
        itemsWithoutMaterial.length > 0
    ) {
        showErrorAlert(
            'Material Tidak Valid',
            'Ada material yang belum memiliki ID material. Silakan pilih ulang material tersebut.'
        )
        return
    }

    // =================================================
    // CEK QUANTITY
    // =================================================
    const itemsWithInvalidQty =
        normalizedItems.filter(
            (item) =>
                !Number.isFinite(
                    item.qty
                ) ||
                item.qty <= 0
        )

    if (
        itemsWithInvalidQty.length > 0
    ) {
        showErrorAlert(
            'Quantity Tidak Valid',
            'Quantity setiap material harus lebih dari 0.'
        )
        return
    }

    // =================================================
    // VALIDASI HARGA JUAL
    // =================================================
    const itemsWithInvalidSellPrice =
        normalizedItems.filter((item) => {
            const hargaJual = Number(item.harga_jual)

            return (
                String(item.harga_jual ?? '').trim() === '' ||
                !Number.isFinite(hargaJual) ||
                hargaJual < 0
            )
        })

    if (itemsWithInvalidSellPrice.length > 0) {
        showErrorAlert(
            'Harga Jual Tidak Valid',
            'Harga jual setiap material harus berupa angka nol atau lebih.'
        )
        return
    }

    // =================================================
    // CEK DUPLIKAT MATERIAL
    // =================================================
    const materialIds =
        normalizedItems.map(
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

    // =================================================
    // PAYLOAD
    // =================================================
    const payload = {
        no_surat_jalan:
            formData.no_surat_jalan,

        tanggal:
            formData.tanggal,

        driver_id:
            Number(formData.driver_id),

        customer_id:
            Number(formData.customer_id),

        proyek_id:
            Number(formData.proyek_id),

        items:
            normalizedItems.map(
                (item) => ({
                    material_id:
                        Number(
                            item.material_id
                        ),

                    qty:
                        Number(
                            item.qty
                        ),

                    harga_jual:
                        Number(
                            item.harga_jual
                        ),
                })
            ),
    }

    try {
        setIsSaving(true)

        // =================================================
        // UPDATE
        // =================================================
        if (
            isEditing &&
            editingSuratJalanId
        ) {
            await updateSuratJalan(
                editingSuratJalanId,
                payload
            )

            const {
                latestParents,
            } =
                await refreshSuratJalanData()

            showSuccessAlert(
                'Berhasil Diupdate',
                `Surat jalan ${formData.no_surat_jalan} berhasil diupdate.`
            )

            resetForm()

            return
        }

        // =================================================
        // CREATE
        // =================================================
        await createSuratJalan(
            payload
        )

        const {
            latestParents,
        } =
            await refreshSuratJalanData()

        showSuccessAlert(
            'Berhasil Disimpan',
            `Surat jalan ${formData.no_surat_jalan} berhasil dibuat.`
        )

        resetForm()
    } catch (error) {
        showErrorAlert(
            isEditing
                ? 'Gagal Mengupdate'
                : 'Gagal Menyimpan',
            error.message ||
                (
                    isEditing
                        ? 'Surat jalan gagal diupdate.'
                        : 'Surat jalan gagal dibuat.'
                )
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
            key: 'tanggal',
            label: 'Tanggal',
            render: (row) =>
                formatDate(
                    row.tanggal
                ),
        },
        {
            key: 'no_surat_jalan',
            label: 'No. SJ',
            render: (row) =>
                row.no_surat_jalan || '-',
        },
        {
            key: 'nama_supir',
            label: 'Driver',
            render: (row) =>
                row.nama_supir || '-',
        },
        {
            key: 'nama_customer',
            label: 'Customer',
            render: (row) =>
                row.nama_customer || '-',
        },
        {
            key: 'nama_proyek',
            label: 'Proyek',
            render: (row) =>
                row.nama_proyek || '-',
        },
        {
            key: 'nama_barang',
            label: 'Material',
            render: (row) =>
                row.nama_barang || '-',
        },
        {
            key: 'qty',
            label: 'Quantity',
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
            key: 'action',
            label: 'Aksi',
            render: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            handleEditSuratJalan(
                                row
                            )
                        }
                        disabled={isSaving}
                        className="rounded-md bg-[#51448C] px-2.5 py-1 text-[10px] font-medium text-white transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleDeleteSuratJalan(
                                row
                            )
                        }
                        disabled={isSaving}
                        className="rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Hapus
                    </button>
                </div>
            ),
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

                    // ID khusus untuk row React.
                    // TIDAK dipakai sebagai ID surat jalan.
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

    const filteredTableData = useMemo(() => {
        const keyword = tableSearch.trim().toLowerCase()

        return tableData.filter((row) => {
            const matchesCustomer =
                !customerFilter ||
                String(row.customer_id ?? '') === customerFilter

            const matchesSearch =
                !keyword ||
                [
                    row.tanggal,
                    row.no_surat_jalan,
                    row.nama_supir,
                    row.nama_customer,
                    row.nama_proyek,
                    row.nama_barang,
                    row.qty,
                    row.harga_jual,
                ].some((value) =>
                    String(value ?? '')
                        .toLowerCase()
                        .includes(keyword)
                )

            return matchesCustomer && matchesSearch
        })
    }, [tableData, tableSearch, customerFilter])

    const handleCreateSuratJalan = () => {
        resetForm()
        setIsFormModalOpen(true)
    }

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
                    SURAT JALAN
                </h1>
            </div>

            {/* SURAT JALAN TABLE */}
            <section className="min-h-[65vh] w-full rounded-2xl border border-[#d9d9df] bg-[#f5f5f6] p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={handleCreateSuratJalan}
                        disabled={isSaving}
                        className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg bg-white px-3 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="text-base leading-none">+</span>
                        Tambah Data
                    </button>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                            value={customerFilter}
                            onChange={(event) =>
                                setCustomerFilter(event.target.value)
                            }
                            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-[#51448C] outline-none focus:border-[#51448C]"
                            aria-label="Filter berdasarkan customer"
                        >
                            <option value="">Pilih Customer</option>
                            {customers.map((customer) => (
                                <option
                                    key={customer.id}
                                    value={String(customer.id)}
                                >
                                    {customer.nama_customer}
                                </option>
                            ))}
                        </select>

                        <label className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-400 focus-within:border-[#51448C]">
                            <span aria-hidden="true">⌕</span>
                            <input
                                type="search"
                                value={tableSearch}
                                onChange={(event) =>
                                    setTableSearch(event.target.value)
                                }
                                placeholder="Search..."
                                className="w-36 bg-transparent text-xs text-gray-700 outline-none sm:w-40"
                                aria-label="Cari surat jalan"
                            />
                        </label>
                    </div>
                </div>

                <div className="custom-scrollbar w-full overflow-x-auto">
                    <DataTable
                        columns={suratJalanColumns}
                        data={filteredTableData}
                        tableClassName="text-left text-[13px] tabular-nums"
                    />
                </div>
            {isFormModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="surat-jalan-modal-title"
                >
            {/* FORM MODAL */}
            <section className="max-h-[94vh] w-full max-w-[63rem] overflow-y-auto rounded-2xl border border-[#d9d9df] bg-[#f5f5f6] p-5 shadow-2xl">
                <div className="mb-5 flex items-start justify-between">
                    <div>
                        <h2
                            id="surat-jalan-modal-title"
                            className="text-base font-bold text-[#51448C]"
                        >
                            {isEditing
                                ? 'Edit Surat Jalan'
                                : 'Input Surat Jalan'}
                        </h2>
                        <p className="mt-1 text-[10px] text-gray-500">
                            Lengkapi informasi surat jalan dan material.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => resetForm()}
                        disabled={isSaving}
                        className="rounded-md px-2 text-2xl leading-none text-gray-400 transition hover:text-[#51448C] disabled:opacity-50"
                        aria-label="Tutup form surat jalan"
                    >
                        ×
                    </button>
                </div>
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
                                onChange={(event) =>
                                    setFormData((current) => ({
                                        ...current,
                                        no_surat_jalan: event.target.value,
                                    }))
                                }
                                placeholder="Masukkan nomor surat jalan"
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
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

                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#51448C]">
                                                            Rp
                                                        </span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            value={
                                                                item.harga_jual ===
                                                                ''
                                                                    ? ''
                                                                    : formatPrice(
                                                                          item.harga_jual
                                                                      )
                                                            }
                                                            onChange={(event) =>
                                                                handleSellPriceChange(
                                                                    item.id,
                                                                    event.target.value
                                                                )
                                                            }
                                                            className="h-9 w-full rounded-md border border-[#e4dfff] bg-[#f8f6ff] pl-9 pr-3 text-[10px] font-semibold text-[#51448C] outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                                                            placeholder="0"
                                                        />
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
                    {/* SAVE / UPDATE */}
                    <div className="flex justify-end gap-2">

                        {isEditing && (
                            <button
                                type="button"
                                onClick={() =>
                                    resetForm()
                                }
                                disabled={
                                    isSaving
                                }
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Batal
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={
                                isSaving
                            }
                            className="rounded-lg bg-[#51448C] px-5 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? isEditing
                                    ? 'Mengupdate...'
                                    : 'Menyimpan...'
                                : isEditing
                                  ? 'Update Surat Jalan'
                                  : 'Simpan Surat Jalan'}
                        </button>

                    </div>

                </form>
            </section>
                </div>
            )}
            </section>

        </main>
    )
}

export default SuratJalan