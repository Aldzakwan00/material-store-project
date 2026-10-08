import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import DataTable from '../../../components/table/DataTable'

import materialIcon from '../../../assets/img/icon/material_icon.png'
import saveIcon from '../../../assets/img/icon/SaveIcon.png'
import editIcon from '../../../assets/img/icon/EditIcon.png'

import {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialCustomer,
    updateMaterialPriceCustomer,
    deleteMaterialPriceCustomer,
} from '../../../services/MaterialServices'

import { getCustomers } from '../../../services/CustomerServices'

const MaterialPage = () => {
    // =====================================================
    // MATERIAL STATE
    // =====================================================
    const [materials, setMaterials] = useState([])
    const [defaultMaterials, setDefaultMaterials] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // =====================================================
    // CUSTOMER STATE
    // =====================================================
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerSearch, setCustomerSearch] = useState('')
    const [
        isCustomerDropdownOpen,
        setIsCustomerDropdownOpen,
    ] = useState(false)
    const [isCustomerLoading, setIsCustomerLoading] = useState(false)

    // =====================================================
    // MATERIAL FORM STATE
    // =====================================================
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isFormClosing, setIsFormClosing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        unit: '',
        buyPrice: '',
        sellPrice: '',
        specialPrice: false,
    })

    const [formError, setFormError] = useState('')
    const [formLoading, setFormLoading] = useState(false)

    // =====================================================
    // CUSTOMER PRICE MODAL
    // =====================================================
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
    const [
        isPriceModalClosing,
        setIsPriceModalClosing,
    ] = useState(false)

    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [customerPrice, setCustomerPrice] = useState('')
    const [priceLoading, setPriceLoading] = useState(false)

    // =====================================================
    // DELETE STATE
    // =====================================================
    const [deleteLoading, setDeleteLoading] = useState(false)

    // =====================================================
    // RESET CUSTOMER PRICE STATE
    // =====================================================
    const [
        resetPriceLoading,
        setResetPriceLoading,
    ] = useState(false)

    // =====================================================
    // SWEETALERT
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
                confirmButton:
                    'rounded-lg px-5 py-2.5 font-medium',
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
                confirmButton:
                    'rounded-lg px-5 py-2.5 font-medium',
            },
        })
    }

    const showInfoAlert = (title, text) => {
        Swal.fire({
            icon: 'info',
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
        return new Intl.NumberFormat('id-ID').format(
            Number(price) || 0
        )
    }

    // =====================================================
    // MAP DEFAULT MATERIAL
    // =====================================================
    const mapMaterial = (material) => {
        return {
            id: material.id,
            code: material.kode,
            name: material.nama_barang,
            unit: material.satuan,

            buyPrice: Number(
                material.harga_beli ?? 0
            ),

            defaultPrice: Number(
                material.harga_jual ?? 0
            ),

            customerPrice: null,

            specialPrice:
                material.harga_khusus ?? false,
        }
    }

    // =====================================================
    // MAP CUSTOMER MATERIAL
    // =====================================================
    const mapCustomerMaterial = (
        material,
        defaultMaterial
    ) => {
        const defaultPrice =
            Number(
                defaultMaterial?.defaultPrice ??
                    material.harga_jual_default ??
                    material.harga_default ??
                    0
            )

        const customerPrice =
            material.harga_jual !== null &&
            material.harga_jual !== undefined
                ? Number(material.harga_jual)
                : null

        return {
            id:
                material.id ??
                defaultMaterial?.id,

            code:
                material.kode ??
                defaultMaterial?.code,

            name:
                material.nama_barang ??
                defaultMaterial?.name,

            unit:
                material.satuan ??
                defaultMaterial?.unit,

            buyPrice:
                Number(
                    material.harga_beli ??
                        defaultMaterial?.buyPrice ??
                        0
                ),

            defaultPrice,

            customerPrice,

            specialPrice:
                material.harga_khusus ??
                defaultMaterial?.specialPrice ??
                false,
        }
    }

    // =====================================================
    // GET ALL DEFAULT MATERIAL
    // =====================================================
    const fetchMaterials = async () => {
        try {
            setIsLoading(true)

            const response = await getMaterial()
            const items = response?.items || []

            const mappedMaterials =
                items.map(mapMaterial)

            setDefaultMaterials(mappedMaterials)

            if (!selectedCustomer) {
                setMaterials(mappedMaterials)
            }

            return mappedMaterials
        } catch (error) {
            console.error(
                'Gagal mengambil material:',
                error
            )

            showErrorAlert(
                'Gagal Memuat Data',
                error.message ||
                    'Data material tidak dapat dimuat.'
            )

            return []
        } finally {
            setIsLoading(false)
        }
    }

    // =====================================================
    // GET CUSTOMER
    // =====================================================
    const fetchCustomers = async () => {
        try {
            const response = await getCustomers()
            const items = response?.items || []

            setCustomers(items)
        } catch (error) {
            console.error(
                'Gagal mengambil customer:',
                error
            )

            showErrorAlert(
                'Gagal Memuat Customer',
                error.message ||
                    'Data customer tidak dapat dimuat.'
            )
        }
    }

    // =====================================================
    // INITIAL LOAD
    // =====================================================
    useEffect(() => {
        fetchMaterials()
        fetchCustomers()
    }, [])

    // =====================================================
    // SEARCH CUSTOMER
    // =====================================================
    const filteredCustomers =
        customers.filter((customer) => {
            const keyword =
                customerSearch
                    .toLowerCase()
                    .trim()

            if (!keyword) {
                return true
            }

            return (
                customer.nama_customer
                    ?.toLowerCase()
                    .includes(keyword) ||
                customer.kode
                    ?.toLowerCase()
                    .includes(keyword)
            )
        })

    // =====================================================
    // LOAD MATERIAL CUSTOMER
    // =====================================================
    const loadCustomerMaterials = async (
        customer,
        currentDefaultMaterials = defaultMaterials
    ) => {
        const response =
            await getMaterialCustomer(
                customer.id
            )

        const items =
            response?.items || []

        const mappedMaterials =
            items.map((material) => {
                const defaultMaterial =
                    currentDefaultMaterials.find(
                        (item) =>
                            item.id ===
                                material.id ||
                            item.code ===
                                material.kode
                    )

                return mapCustomerMaterial(
                    material,
                    defaultMaterial
                )
            })

        setMaterials(mappedMaterials)

        return mappedMaterials
    }

    // =====================================================
    // SELECT CUSTOMER
    // =====================================================
    const handleSelectCustomer = async (
        customer
    ) => {
        try {
            setIsCustomerDropdownOpen(false)
            setIsCustomerLoading(true)
            setSelectedCustomer(customer)

            setCustomerSearch(
                customer.nama_customer
            )

            let currentDefaultMaterials =
                defaultMaterials

            if (
                currentDefaultMaterials.length ===
                0
            ) {
                currentDefaultMaterials =
                    await fetchMaterials()
            }

            await loadCustomerMaterials(
                customer,
                currentDefaultMaterials
            )
        } catch (error) {
            console.error(
                'Gagal mengambil material customer:',
                error
            )

            showErrorAlert(
                'Gagal Memuat Material',
                error.message ||
                    'Data material customer tidak dapat dimuat.'
            )
        } finally {
            setIsCustomerLoading(false)
        }
    }

    // =====================================================
    // CLEAR CUSTOMER
    // =====================================================
    const handleClearCustomer = async () => {
        setSelectedCustomer(null)
        setCustomerSearch('')
        setIsCustomerDropdownOpen(false)

        if (defaultMaterials.length > 0) {
            setMaterials(defaultMaterials)
        } else {
            await fetchMaterials()
        }
    }

    // =====================================================
    // GENERATE CODE
    // =====================================================
    const generateNextCode = () => {
        if (defaultMaterials.length === 0) {
            return 'MTRL0001'
        }

        const numbers =
            defaultMaterials
                .map((material) => {
                    const match =
                        material.code?.match(
                            /^MTRL(\d+)$/
                        )

                    return match
                        ? Number(match[1])
                        : 0
                })
                .filter(
                    (number) =>
                        number > 0
                )

        const nextNumber =
            numbers.length > 0
                ? Math.max(...numbers) + 1
                : 1

        return `MTRL${String(
            nextNumber
        ).padStart(4, '0')}`
    }

    // =====================================================
    // EDIT MATERIAL
    // =====================================================
    const handleEdit = (id) => {
        const material =
            materials.find(
                (item) =>
                    item.id === id
            )

        if (!material) {
            return
        }

        setEditingId(material.id)

        setFormData({
            code:
                material.code || '',

            name:
                material.name || '',

            unit:
                material.unit || '',

            buyPrice: String(
                material.buyPrice ?? ''
            ),

            sellPrice: String(
                material.defaultPrice ?? ''
            ),

            specialPrice:
                Boolean(
                    material.specialPrice
                ),
        })

        setFormError('')
        setIsFormClosing(false)
        setIsFormOpen(true)
    }

    // =====================================================
    // FORM CHANGE
    // =====================================================
    const handleFormChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target

        setFormData(
            (currentData) => ({
                ...currentData,
                [name]: value,
            })
        )

        setFormError('')
    }

    // =====================================================
    // CLOSE MATERIAL FORM
    // =====================================================
    const closeForm = () => {
        if (formLoading) {
            return
        }

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
                specialPrice: false,
            })

            setFormError('')
        }, 360)
    }

    // =====================================================
    // ADD MATERIAL
    // =====================================================
    const handleAdd = () => {
        setEditingId(null)

        setFormData({
            code:
                generateNextCode(),
            name: '',
            unit: '',
            buyPrice: '',
            sellPrice: '',
            specialPrice: false,
        })

        setFormError('')
        setIsFormClosing(false)
        setIsFormOpen(true)
    }

    // =====================================================
    // REFRESH AFTER MATERIAL CRUD
    // =====================================================
    const refreshAfterMaterialChange =
        async () => {
            const newDefaultMaterials =
                await fetchMaterials()

            if (selectedCustomer) {
                await loadCustomerMaterials(
                    selectedCustomer,
                    newDefaultMaterials
                )
            }
        }

    // =====================================================
    // SUBMIT MATERIAL
    // =====================================================
    const handleSubmit = async (
        event
    ) => {
        event.preventDefault()

        if (
            !formData.name.trim() ||
            !formData.unit.trim() ||
            !formData.buyPrice.trim() ||
            !formData.sellPrice.trim()
        ) {
            setFormError(
                'Kolom tidak boleh kosong'
            )

            return
        }

        try {
            setFormError('')
            setFormLoading(true)

            const materialData = {
                kode:
                    formData.code,

                nama_barang:
                    formData.name.trim(),

                satuan:
                    formData.unit,

                harga_beli:
                    Number(
                        formData.buyPrice
                    ),

                harga_jual:
                    Number(
                        formData.sellPrice
                    ),

                harga_khusus:
                    formData.specialPrice,
            }

            if (
                editingId !== null
            ) {
                await updateMaterial(
                    editingId,
                    materialData
                )

                const materialName =
                    formData.name

                closeForm()

                await refreshAfterMaterialChange()

                showSuccessAlert(
                    'Berhasil Diperbarui',
                    `Material "${materialName}" berhasil diperbarui.`
                )

                return
            }

            await createMaterial(
                materialData
            )

            const createdName =
                formData.name

            closeForm()

            await refreshAfterMaterialChange()

            showSuccessAlert(
                'Berhasil Ditambahkan',
                `Material "${createdName}" berhasil ditambahkan.`
            )
        } catch (error) {
            console.error(
                'Gagal menyimpan material:',
                error
            )

            setFormError(
                error.message ||
                    'Gagal menyimpan data material'
            )

            showErrorAlert(
                'Gagal Menyimpan Data',
                error.message ||
                    'Data material gagal disimpan.'
            )
        } finally {
            setFormLoading(false)
        }
    }

    // =====================================================
    // DELETE MATERIAL
    // =====================================================
    const handleDelete = async (
        id
    ) => {
        const material =
            materials.find(
                (item) =>
                    item.id === id
            )

        if (!material) {
            return
        }

        const result =
            await Swal.fire({
                icon: 'warning',

                title:
                    'Hapus Material?',

                html: `
                    <p style="margin-bottom: 8px;">
                        Kamu akan menghapus material:
                    </p>

                    <strong style="color: #51448C;">
                        ${material.name}
                    </strong>

                    <p style="margin-top: 8px; font-size: 13px; color: #777;">
                        Data yang sudah dihapus tidak dapat dikembalikan.
                    </p>
                `,

                showCancelButton:
                    true,

                confirmButtonText:
                    'Ya, Hapus',

                cancelButtonText:
                    'Batal',

                confirmButtonColor:
                    '#dc3545',

                cancelButtonColor:
                    '#6c757d',

                reverseButtons:
                    true,

                focusCancel:
                    true,

                customClass: {
                    popup:
                        'rounded-2xl',
                },
            })

        if (
            !result.isConfirmed
        ) {
            return
        }

        try {
            setDeleteLoading(true)

            await deleteMaterial(
                id
            )

            await refreshAfterMaterialChange()

            showSuccessAlert(
                'Berhasil Dihapus',
                `Material "${material.name}" berhasil dihapus.`
            )
        } catch (error) {
            console.error(
                'Gagal menghapus material:',
                error
            )

            showErrorAlert(
                'Gagal Menghapus',
                error.message ||
                    'Material gagal dihapus.'
            )
        } finally {
            setDeleteLoading(
                false
            )
        }
    }

    // =====================================================
    // OPEN CUSTOMER PRICE MODAL
    // =====================================================
    const handleEditCustomerPrice =
        (material) => {
            if (!selectedCustomer) {
                showInfoAlert(
                    'Pilih Customer Terlebih Dahulu',
                    'Silakan pilih customer untuk mengatur harga khusus.'
                )

                return
            }

            setSelectedMaterial(
                material
            )

            setCustomerPrice(
                material.customerPrice !==
                    null &&
                    material.customerPrice !==
                        undefined
                    ? String(
                          material.customerPrice
                      )
                    : String(
                          material.defaultPrice
                      )
            )

            setIsPriceModalClosing(
                false
            )

            setIsPriceModalOpen(
                true
            )
        }

    // =====================================================
    // CLOSE CUSTOMER PRICE MODAL
    // =====================================================
    const closePriceModal = () => {
        if (priceLoading) {
            return
        }

        setIsPriceModalClosing(
            true
        )

        window.setTimeout(() => {
            setIsPriceModalOpen(
                false
            )

            setIsPriceModalClosing(
                false
            )

            setSelectedMaterial(
                null
            )

            setCustomerPrice('')
        }, 300)
    }

    // =====================================================
    // UPDATE CUSTOMER PRICE
    // =====================================================
    const handleUpdateCustomerPrice =
        async (event) => {
            event.preventDefault()

            if (
                !selectedCustomer
            ) {
                return
            }

            if (
                !customerPrice ||
                Number(customerPrice) <
                    0
            ) {
                showErrorAlert(
                    'Harga Tidak Valid',
                    'Harga customer harus diisi dengan benar.'
                )

                return
            }

            if (
                !selectedMaterial
            ) {
                return
            }

            try {
                setPriceLoading(
                    true
                )

                const priceData =
                    {
                        material_id:
                            selectedMaterial.id,

                        harga_jual:
                            Number(
                                customerPrice
                            ),
                    }

                await updateMaterialPriceCustomer(
                    selectedCustomer.id,
                    priceData
                )

                await loadCustomerMaterials(
                    selectedCustomer,
                    defaultMaterials
                )

                const materialName =
                    selectedMaterial.name

                const price =
                    Number(
                        customerPrice
                    )

                closePriceModal()

                showSuccessAlert(
                    'Harga Berhasil Diperbarui',
                    `Harga customer untuk "${materialName}" berhasil diubah menjadi Rp ${formatPrice(price)}.`
                )
            } catch (error) {
                console.error(
                    'Gagal memperbarui harga customer:',
                    error
                )

                showErrorAlert(
                    'Gagal Mengubah Harga',
                    error.message ||
                        'Harga customer gagal diperbarui.'
                )
            } finally {
                setPriceLoading(
                    false
                )
            }
        }

    // =====================================================
    // RESET / DELETE CUSTOMER PRICE
    // =====================================================
    const handleDeleteCustomerPrice =
        async (material) => {
            if (
                !selectedCustomer
            ) {
                showInfoAlert(
                    'Pilih Customer Terlebih Dahulu',
                    'Silakan pilih customer terlebih dahulu.'
                )

                return
            }

            const hasCustomPrice =
                material.customerPrice !==
                    null &&
                material.customerPrice !==
                    undefined &&
                Number(
                    material.customerPrice
                ) !==
                    Number(
                        material.defaultPrice
                    )

            if (!hasCustomPrice) {
                showInfoAlert(
                    'Harga Masih Default',
                    'Material ini belum memiliki harga khusus yang berbeda dari harga default.'
                )

                return
            }

            const result =
                await Swal.fire({
                    icon: 'warning',

                    title:
                        'Reset Harga Customer?',

                    html: `
                        <div style="font-size: 14px; line-height: 1.6;">
                            <p>
                                Harga khusus untuk
                                <strong style="color: #51448C;">
                                    ${material.name}
                                </strong>
                            </p>

                            <div style="
                                margin-top: 12px;
                                padding: 12px;
                                border-radius: 10px;
                                background: #f8f6ff;
                            ">
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    margin-bottom: 5px;
                                ">
                                    <span style="color: #777;">
                                        Harga saat ini
                                    </span>

                                    <strong style="color: #51448C;">
                                        Rp ${formatPrice(
                                            material.customerPrice
                                        )}
                                    </strong>
                                </div>

                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                ">
                                    <span style="color: #777;">
                                        Harga default
                                    </span>

                                    <strong style="color: #333;">
                                        Rp ${formatPrice(
                                            material.defaultPrice
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <p style="
                                margin-top: 12px;
                                color: #777;
                                font-size: 12px;
                            ">
                                Harga customer akan dihapus dan material akan kembali menggunakan harga default.
                            </p>
                        </div>
                    `,

                    showCancelButton:
                        true,

                    confirmButtonText:
                        'Ya, Reset Harga',

                    cancelButtonText:
                        'Batal',

                    confirmButtonColor:
                        '#dc3545',

                    cancelButtonColor:
                        '#6c757d',

                    reverseButtons:
                        true,

                    focusCancel:
                        true,

                    customClass: {
                        popup:
                            'rounded-2xl',
                    },
                })

            if (
                !result.isConfirmed
            ) {
                return
            }

            try {
                setResetPriceLoading(
                    true
                )

                await deleteMaterialPriceCustomer(
                    material.id,
                    selectedCustomer.id
                )

                await loadCustomerMaterials(
                    selectedCustomer,
                    defaultMaterials
                )

                showSuccessAlert(
                    'Harga Berhasil Direset',
                    `Harga khusus "${material.name}" untuk ${selectedCustomer.nama_customer} telah dihapus dan kembali ke harga default.`
                )
            } catch (error) {
                console.error(
                    'Gagal menghapus harga customer:',
                    error
                )

                showErrorAlert(
                    'Gagal Reset Harga',
                    error.message ||
                        'Harga khusus customer gagal dihapus.'
                )
            } finally {
                setResetPriceLoading(
                    false
                )
            }
        }

    // =====================================================
    // TABLE COLUMNS
    // =====================================================
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

            render: (row) =>
                `Rp ${formatPrice(
                    row.buyPrice
                )}`,
        },

        {
            key: 'defaultPrice',
            label: 'Harga Default',

            render: (row) =>
                `Rp ${formatPrice(
                    row.defaultPrice
                )}`,
        },

        {
            key: 'customerPrice',
            label: 'Harga Jual',

            render: (row) => {
                if (
                    !selectedCustomer
                ) {
                    return (
                        <span className="text-gray-400">
                            -
                        </span>
                    )
                }

                if (
                    row.customerPrice ===
                        null ||
                    row.customerPrice ===
                        undefined
                ) {
                    return (
                        <div className="min-w-[110px]">
                            <span className="font-medium text-gray-500">
                                Rp{' '}
                                {formatPrice(
                                    row.defaultPrice
                                )}
                            </span>

                            <p className="text-[9px] text-gray-400">
                                Mengikuti default
                            </p>
                        </div>
                    )
                }

                return (
                    <span
                        className={`font-semibold ${
                            Number(
                                row.customerPrice
                            ) !==
                            Number(
                                row.defaultPrice
                            )
                                ? 'text-[#51448C]'
                                : 'text-gray-500'
                        }`}
                    >
                        Rp{' '}
                        {formatPrice(
                            row.customerPrice
                        )}
                    </span>
                )
            },
        },

        {
            key: 'priceStatus',
            label: 'Status Harga',

            render: (row) => {
                if (
                    !selectedCustomer
                ) {
                    return (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                            Default
                        </span>
                    )
                }

                const isChanged =
                    row.customerPrice !==
                        null &&
                    row.customerPrice !==
                        undefined &&
                    Number(
                        row.customerPrice
                    ) !==
                        Number(
                            row.defaultPrice
                        )

                if (isChanged) {
                    return (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                            Sudah Diubah
                        </span>
                    )
                }

                return (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                        Default
                    </span>
                )
            },
        },
    ]

    // =====================================================
    // RETURN
    // =====================================================
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
                xl:px-10
            "
        >
            {/* =================================================
                HEADER
            ================================================= */}
            <div className="mb-5 flex min-w-0 items-center gap-2 sm:mb-6 sm:gap-3">
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

                <h1 className="truncate text-xl font-bold text-[#51448C] sm:text-2xl lg:text-3xl">
                    DATA MATERIAL
                </h1>
            </div>

            {/* =================================================
                TABLE CONTAINER
            ================================================= */}
            <section className="w-full min-w-0 overflow-hidden rounded-xl border border-[#d9d9df] bg-[#f5f5f6] p-3 shadow-sm sm:rounded-2xl sm:p-4">
                {/* =================================================
                    TOP TOOLBAR
                ================================================= */}
                <div className="mb-4 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* TAMBAH DATA */}
                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={isLoading}
                        className="inline-flex w-fit shrink-0 items-center rounded-md border border-[#e0e0e5] bg-white px-3 py-2 text-xs font-medium text-[#51448C] shadow-sm transition hover:bg-[#f8f6ff] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#51448C] text-xs font-bold text-white">
                            +
                        </span>

                        Tambah Data
                    </button>

                    {/* SEARCH CUSTOMER */}
                    <div className="relative w-full min-w-0 sm:w-[330px] sm:max-w-full">
                        <div
                            className={`flex h-10 min-w-0 items-center rounded-lg border bg-white transition ${
                                isCustomerDropdownOpen
                                    ? 'border-[#51448C] ring-2 ring-[#51448C]/10'
                                    : 'border-[#d9d9df]'
                            }`}
                        >
                            <span className="shrink-0 pl-3 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="8"
                                    />

                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </span>

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
                                className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-xs outline-none placeholder:text-gray-400"
                            />

                            {isCustomerLoading && (
                                <span className="mr-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-gray-200 border-t-[#51448C]" />
                            )}

                            {selectedCustomer &&
                                !isCustomerLoading && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleClearCustomer
                                        }
                                        className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                                        title="Tampilkan semua material"
                                    >
                                        ×
                                    </button>
                                )}
                        </div>

                        {/* CUSTOMER DROPDOWN */}
                        {isCustomerDropdownOpen && (
                            <div className="absolute left-0 right-0 top-[44px] z-[70] w-full overflow-hidden rounded-lg border border-[#dedee5] bg-white shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
                                <div className="max-h-[260px] overflow-y-auto">
                                    {filteredCustomers.length ===
                                    0 ? (
                                        <div className="px-4 py-5 text-center text-xs text-gray-500">
                                            Customer tidak
                                            ditemukan.
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
                                                    className="flex w-full min-w-0 items-center gap-3 border-b border-gray-50 px-3 py-2.5 text-left transition last:border-0 hover:bg-[#f7f5ff]"
                                                >
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eeeafd] text-xs font-bold text-[#51448C]">
                                                        {customer.nama_customer
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase() ||
                                                            'C'}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-semibold text-gray-700">
                                                            {
                                                                customer.nama_customer
                                                            }
                                                        </p>

                                                        <p className="truncate text-[10px] text-gray-400">
                                                            {
                                                                customer.kode
                                                            }
                                                        </p>
                                                    </div>

                                                    {selectedCustomer?.id ===
                                                        customer.id && (
                                                        <span className="shrink-0 text-[#51448C]">
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

                {/* =================================================
                    ACTIVE CUSTOMER
                ================================================= */}
                {selectedCustomer && (
                    <div className="mb-4 flex min-w-0 flex-col gap-2 rounded-lg border border-[#ddd8f4] bg-[#f8f6ff] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#51448C] text-[10px] font-bold text-white">
                                {selectedCustomer.nama_customer
                                    ?.charAt(
                                        0
                                    )
                                    ?.toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-500">
                                    Harga untuk customer
                                </p>

                                <p className="truncate text-xs font-bold text-[#51448C]">
                                    {
                                        selectedCustomer.nama_customer
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleClearCustomer
                            }
                            className="w-fit shrink-0 text-[10px] font-medium text-[#51448C] hover:underline"
                        >
                            Tampilkan semua material
                        </button>
                    </div>
                )}

                {/* =================================================
                    TABLE
                ================================================= */}
                <div className="w-full min-w-0 overflow-hidden rounded-lg">
                    {isLoading ||
                    isCustomerLoading ? (
                        <div className="py-10 text-center text-sm text-gray-500">
                            <div className="mb-3 flex justify-center">
                                <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#51448C]" />
                            </div>

                            {isCustomerLoading
                                ? 'Memuat harga material customer...'
                                : 'Memuat data material...'}
                        </div>
                    ) : materials.length ===
                      0 ? (
                        <div className="py-10 text-center text-sm text-gray-500">
                            Belum ada data material.
                        </div>
                    ) : (
                        <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden">
                            <DataTable
                                columns={columns}
                                data={materials}
                                actionLabel="Action"
                                tableClassName="text-xs sm:text-sm min-w-[1250px]"
                                actions={(
                                    row
                                ) => {
                                    const isCustomerPriceChanged =
                                        selectedCustomer &&
                                        row.customerPrice !==
                                            null &&
                                        row.customerPrice !==
                                            undefined &&
                                        Number(
                                            row.customerPrice
                                        ) !==
                                            Number(
                                                row.defaultPrice
                                            )

                                    return (
                                        <div className="flex min-w-max items-center gap-2">
                                            {/* EDIT DEFAULT MATERIAL */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        row.id
                                                    )
                                                }
                                                className="flex shrink-0 items-center whitespace-nowrap rounded-md bg-[#51448C] px-2 py-1 text-xs font-medium text-white transition hover:bg-[#433878]"
                                            >
                                                <img
                                                    src={
                                                        editIcon
                                                    }
                                                    alt=""
                                                    className="mr-2 h-3.5 w-3.5 object-contain"
                                                />

                                                Edit
                                            </button>

                                            {/* EDIT CUSTOMER PRICE */}
                                            {selectedCustomer && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditCustomerPrice(
                                                            row
                                                        )
                                                    }
                                                    disabled={
                                                        resetPriceLoading
                                                    }
                                                    className="shrink-0 whitespace-nowrap rounded-md border border-[#51448C] bg-white px-2 py-1 text-xs font-medium text-[#51448C] transition hover:bg-[#f2efff] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Harga Customer
                                                </button>
                                            )}

                                            {/* RESET CUSTOMER PRICE */}
                                            {selectedCustomer &&
                                                isCustomerPriceChanged && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteCustomerPrice(
                                                                row
                                                            )
                                                        }
                                                        disabled={
                                                            resetPriceLoading
                                                        }
                                                        className="shrink-0 whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {resetPriceLoading
                                                            ? 'Mereset...'
                                                            : 'Reset Harga'}
                                                    </button>
                                                )}

                                            {/* DELETE MATERIAL */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        row.id
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading
                                                }
                                                className="shrink-0 whitespace-nowrap rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* =====================================================
                MATERIAL FORM MODAL
            ===================================================== */}
            {isFormOpen && (
                <div
                    className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/20 px-3 py-4 sm:items-center sm:px-5 sm:py-6 ${
                        isFormClosing
                            ? 'modal-backdrop-closing'
                            : ''
                    }`}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="material-form-title"
                        className={`my-auto max-h-[calc(100vh-2rem)] w-full max-w-[480px] overflow-y-auto rounded-xl bg-[#f7f7f7] px-4 py-5 shadow-[0_5px_18px_rgba(0,0,0,0.18)] sm:max-h-[calc(100vh-3rem)] sm:px-5 ${
                            isFormClosing
                                ? 'modal-panel-closing'
                                : ''
                        }`}
                    >
                        {/* HEADER */}
                        <div className="mb-1 flex items-start justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    aria-hidden="true"
                                    className="h-7 w-7 shrink-0 bg-[#51448C]"
                                    style={{
                                        maskImage: `url(${materialIcon})`,
                                        maskPosition:
                                            'center',
                                        maskRepeat:
                                            'no-repeat',
                                        maskSize:
                                            'contain',
                                        WebkitMaskImage: `url(${materialIcon})`,
                                        WebkitMaskPosition:
                                            'center',
                                        WebkitMaskRepeat:
                                            'no-repeat',
                                        WebkitMaskSize:
                                            'contain',
                                    }}
                                />

                                <h2
                                    id="material-form-title"
                                    className="text-[14px] font-bold leading-tight text-[#51448C] sm:text-[15px]"
                                >
                                    INPUT &amp; EDIT
                                    DATA MATERIAL
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                disabled={
                                    formLoading
                                }
                                aria-label="Tutup form"
                                className="shrink-0 text-2xl leading-none text-[#51448C] transition hover:text-[#33295f] disabled:opacity-50"
                            >
                                ×
                            </button>
                        </div>

                        <p className="mb-3 text-[9px] text-black">
                            Silahkan masukkan data material
                        </p>

                        {/* FORM */}
                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            {/* KODE */}
                            <label
                                htmlFor="material-code"
                                className="mb-1 block text-xs text-black"
                            >
                                Kode Barang
                            </label>

                            <input
                                id="material-code"
                                name="code"
                                value={
                                    formData.code
                                }
                                readOnly
                                className="mb-2.5 h-10 w-full cursor-not-allowed rounded-md border-0 bg-[#b1adae] px-3 text-xs text-white outline-none"
                            />

                            {/* NAMA + SATUAN */}
                            <div className="mb-2.5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_80px]">
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
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Masukkan Nama Material"
                                        className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                                    />
                                </div>

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
                                        value={
                                            formData.unit
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        className="h-10 w-full rounded-md border-0 bg-white px-2 text-xs text-[#333] outline-none ring-[#51448C] focus:ring-2"
                                    >
                                        <option value="">
                                            -
                                        </option>

                                        <option value="M3">
                                            M3
                                        </option>

                                        <option value="Sak">
                                            Sak
                                        </option>

                                        <option value="Batang">
                                            Batang
                                        </option>

                                        <option value="Pcs">
                                            Pcs
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* HARGA */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                                        value={
                                            formData.buyPrice
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Masukkan Harga"
                                        className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                                    />
                                </div>

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
                                        value={
                                            formData.sellPrice
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                        placeholder="Masukkan Harga"
                                        className="h-10 w-full rounded-md border-0 bg-white px-3 text-xs outline-none ring-[#51448C] placeholder:text-[#c4c4c4] focus:ring-2"
                                    />
                                </div>
                            </div>

                            {/* ERROR */}
                            {formError && (
                                <p className="mt-1.5 break-words text-[9px] text-red-500">
                                    <span
                                        aria-hidden="true"
                                        className="mr-1"
                                    >
                                        ⚠
                                    </span>

                                    {formError}
                                </p>
                            )}

                            {/* SAVE */}
                            <button
                                type="submit"
                                disabled={
                                    formLoading
                                }
                                className="mt-3 flex items-center rounded-md bg-[#51448C] px-3 py-1.5 text-[9px] font-medium text-white transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <img
                                    src={
                                        saveIcon
                                    }
                                    alt=""
                                    className="mr-1.5 h-3 w-3 object-contain"
                                />

                                {formLoading
                                    ? 'Menyimpan...'
                                    : 'Simpan Data'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* =====================================================
                CUSTOMER PRICE MODAL
            ===================================================== */}
            {isPriceModalOpen && (
                <div
                    className={`fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/20 px-3 py-4 sm:items-center sm:px-5 sm:py-6 transition-opacity ${
                        isPriceModalClosing
                            ? 'opacity-0'
                            : 'opacity-100'
                    }`}
                >
                    <div
                        className={`my-auto max-h-[calc(100vh-2rem)] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all sm:max-h-[calc(100vh-3rem)] sm:p-5 ${
                            isPriceModalClosing
                                ? 'translate-y-4 scale-[0.98] opacity-0'
                                : 'translate-y-0 scale-100 opacity-100'
                        }`}
                    >
                        {/* HEADER */}
                        <div className="mb-5 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                    Harga Customer
                                </p>

                                <h3 className="mt-1 text-lg font-bold text-[#51448C]">
                                    Ubah Harga Jual
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closePriceModal
                                }
                                disabled={
                                    priceLoading
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500 transition hover:bg-gray-200 disabled:opacity-50"
                            >
                                ×
                            </button>
                        </div>

                        {/* CUSTOMER INFO */}
                        <div className="mb-4 rounded-xl bg-[#f8f6ff] p-3">
                            <p className="text-[10px] text-gray-400">
                                Customer
                            </p>

                            <p className="mt-0.5 break-words text-sm font-bold text-[#51448C]">
                                {
                                    selectedCustomer?.nama_customer
                                }
                            </p>

                            <p className="mt-0.5 text-[10px] text-gray-400">
                                {
                                    selectedCustomer?.kode
                                }
                            </p>
                        </div>

                        {/* MATERIAL INFO */}
                        <div className="mb-4 min-w-0">
                            <p className="text-[10px] text-gray-400">
                                Material
                            </p>

                            <p className="break-words text-sm font-semibold text-gray-700">
                                {
                                    selectedMaterial?.name
                                }
                            </p>

                            <p className="text-[10px] text-gray-400">
                                {
                                    selectedMaterial?.code
                                }
                            </p>
                        </div>

                        {/* DEFAULT PRICE */}
                        <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-gray-500">
                                    Harga Default
                                </span>

                                <span className="whitespace-nowrap text-xs font-semibold text-gray-700">
                                    Rp{' '}
                                    {formatPrice(
                                        selectedMaterial?.defaultPrice
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* CURRENT CUSTOMER PRICE */}
                        {selectedMaterial?.customerPrice !==
                            null &&
                            selectedMaterial?.customerPrice !==
                                undefined && (
                                <div className="mb-3 rounded-lg border border-[#ddd8f4] bg-[#f8f6ff] px-3 py-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs text-gray-500">
                                            Harga Saat Ini
                                        </span>

                                        <span className="whitespace-nowrap text-xs font-semibold text-[#51448C]">
                                            Rp{' '}
                                            {formatPrice(
                                                selectedMaterial.customerPrice
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}

                        {/* PRICE FORM */}
                        <form
                            onSubmit={
                                handleUpdateCustomerPrice
                            }
                        >
                            <label
                                htmlFor="customer-price"
                                className="mb-1.5 block text-xs font-medium text-gray-700"
                            >
                                Harga Jual Customer
                            </label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                                    Rp
                                </span>

                                <input
                                    id="customer-price"
                                    type="number"
                                    min="0"
                                    value={
                                        customerPrice
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCustomerPrice(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#51448C] focus:ring-2 focus:ring-[#51448C]/10"
                                    placeholder="Masukkan harga customer"
                                    autoFocus
                                />
                            </div>

                            {/* BUTTONS */}
                            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closePriceModal
                                    }
                                    disabled={
                                        priceLoading
                                    }
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        priceLoading
                                    }
                                    className="w-full rounded-lg bg-[#51448C] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-[#433878] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {priceLoading
                                        ? 'Menyimpan...'
                                        : 'Simpan Harga'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default MaterialPage