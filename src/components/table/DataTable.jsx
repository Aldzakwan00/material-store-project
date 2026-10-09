import { useEffect, useRef, useState } from 'react'

const DataTable = ({
  columns,
  data = [],
  actions,
  actionLabel = 'Aksi',
  tableClassName = 'text-left text-sm',
  footer,
  loading = false,
  loadingText = 'Memuat data...',
  emptyText = 'Belum ada data.',
}) => {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  const tableContainerRef = useRef(null)
  const customScrollbarRef = useRef(null)
  const customScrollbarContentRef = useRef(null)

  const pageCount = Math.ceil(data.length / pageSize)

  const lastPage = Math.max(pageCount - 1, 0)

  const visiblePage = Math.min(
    currentPage,
    lastPage
  )

  const startIndex = visiblePage * pageSize

  const visibleData = data.slice(
    startIndex,
    startIndex + pageSize
  )

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(0)
  }

  const firstVisibleRow =
    data.length === 0
      ? 0
      : startIndex + 1

  const lastVisibleRow = Math.min(
    startIndex + pageSize,
    data.length
  )

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE KETIKA DATA BERUBAH
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setCurrentPage(0)
  }, [data])

  /*
  |--------------------------------------------------------------------------
  | CUSTOM SCROLLBAR
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const updateScrollbar = () => {
      const tableContainer =
        tableContainerRef.current

      const scrollbarContent =
        customScrollbarContentRef.current

      if (
        !tableContainer ||
        !scrollbarContent
      ) {
        return
      }

      const tableWidth =
        tableContainer.scrollWidth

      scrollbarContent.style.width = `${Math.max(
        tableWidth,
        tableContainer.clientWidth + 150
      )}px`
    }

    updateScrollbar()

    const resizeObserver =
      new ResizeObserver(updateScrollbar)

    if (tableContainerRef.current) {
      resizeObserver.observe(
        tableContainerRef.current
      )
    }

    window.addEventListener(
      'resize',
      updateScrollbar
    )

    return () => {
      resizeObserver.disconnect()

      window.removeEventListener(
        'resize',
        updateScrollbar
      )
    }
  }, [
    columns,
    data,
    tableClassName,
  ])

  /*
  |--------------------------------------------------------------------------
  | TABLE -> CUSTOM SCROLLBAR
  |--------------------------------------------------------------------------
  */

  const handleTableScroll = () => {
    if (
      tableContainerRef.current &&
      customScrollbarRef.current
    ) {
      customScrollbarRef.current.scrollLeft =
        tableContainerRef.current.scrollLeft
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CUSTOM SCROLLBAR -> TABLE
  |--------------------------------------------------------------------------
  */

  const handleCustomScroll = () => {
    if (
      tableContainerRef.current &&
      customScrollbarRef.current
    ) {
      tableContainerRef.current.scrollLeft =
        customScrollbarRef.current.scrollLeft
    }
  }

  const columnCount =
    columns.length + (actions ? 1 : 0)

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#e5e2ed] bg-white shadow-[0_4px_18px_rgba(45,35,80,0.07)]">

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        ref={tableContainerRef}
        onScroll={handleTableScroll}
        className="w-full min-w-0 overflow-x-auto overflow-y-hidden"
      >
        <table
          className={`
            w-full
            min-w-[1120px]
            text-left
            ${tableClassName}
          `}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <thead className="bg-[#51448C] text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    whitespace-nowrap
                    border-r
                    border-white/10
                    px-3
                    py-3
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    last:border-r-0
                  "
                >
                  {column.label}
                </th>
              ))}

              {actions && (
                <th
                  className="
                    whitespace-nowrap
                    px-3
                    py-3
                    text-center
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                  "
                >
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody className="divide-y divide-[#eeeaf3] text-[#5f5b68]">

            {loading ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-14 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">

                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#e4e0ef] border-t-[#51448C]" />

                    <span className="text-[11px] text-[#77717f]">
                      {loadingText}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              visibleData.map(
                (row, rowIndex) => (
                  <tr
                    key={
                      row.id ??
                      rowIndex
                    }
                    className="
                      group
                      transition
                      duration-150
                      hover:bg-[#faf9ff]
                    "
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={column.key}
                          className="
                            whitespace-nowrap
                            px-3
                            py-2.5
                            text-[10px]
                          "
                        >
                          {column.render
                            ? column.render(
                                row,
                                startIndex +
                                  rowIndex
                              )
                            : row[
                                column.key
                              ] ?? '-'}
                        </td>
                      )
                    )}

                    {actions && (
                      <td
                        className="
                          whitespace-nowrap
                          px-3
                          py-2.5
                          text-center
                        "
                      >
                        <div className="flex w-full items-center justify-center">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f0fa] text-[#51448C]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h4M7 4h7l4 4v12H7V4z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 4v4h4"
                        />
                      </svg>
                    </div>

                    <span className="text-[11px] font-medium text-[#77717f]">
                      {emptyText}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>

          {/* =================================================
              FOOTER
          ================================================= */}

          {footer && (
            <tfoot>
              {footer}
            </tfoot>
          )}
        </table>
      </div>

      {/* =====================================================
          CUSTOM HORIZONTAL SCROLLBAR
      ===================================================== */}

      <div
        ref={customScrollbarRef}
        onScroll={handleCustomScroll}
        className="
          mx-2
          my-1
          h-2.5
          overflow-x-scroll
          overflow-y-hidden
          rounded-full
          bg-[#f0eef4]
        "
        style={{
          scrollbarColor:
            '#51448C #f0eef4',
          scrollbarWidth: 'auto',
        }}
      >
        <div
          ref={customScrollbarContentRef}
          className="h-1"
        />
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-[#eeeaf3]
          bg-[#fcfbfe]
          px-4
          py-3
        "
      >

        {/* LEFT */}

        <div className="text-[10px] text-[#8a8492]">
          {data.length > 0 ? (
            <>
              Menampilkan{' '}
              <span className="font-semibold text-[#51448C]">
                {firstVisibleRow}
              </span>
              -
              <span className="font-semibold text-[#51448C]">
                {lastVisibleRow}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-[#51448C]">
                {data.length}
              </span>{' '}
              data
            </>
          ) : (
            'Tidak ada data'
          )}
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          {/* ROWS */}

          <label className="flex items-center gap-2 text-[10px] text-[#77717f]">
            Baris

            <select
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
              className="
                h-7
                cursor-pointer
                rounded-md
                border
                border-[#e3dfeb]
                bg-white
                px-2
                text-[10px]
                font-medium
                text-[#51448C]
                outline-none
                focus:border-[#51448C]
              "
            >
              {[10, 25, 50, 100].map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>
                )
              )}
            </select>
          </label>

          {/* PAGE */}

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      page - 1,
                      0
                    )
                )
              }
              disabled={
                visiblePage === 0
              }
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-[#e3dfeb]
                bg-white
                text-[#51448C]
                transition
                hover:bg-[#f4f1fb]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L9.06 10l3.71 3.71a.75.75 0 11-1.06 1.06l-4.24-4.24a.75.75 0 010-1.06l4.24-4.24a.75.75 0 011.08 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div
              className="
                flex
                h-7
                min-w-7
                items-center
                justify-center
                rounded-md
                bg-[#51448C]
                px-2
                text-[10px]
                font-semibold
                text-white
              "
            >
              {visiblePage + 1}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      page + 1,
                      lastPage
                    )
                )
              }
              disabled={
                visiblePage >= lastPage
              }
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-[#e3dfeb]
                bg-white
                text-[#51448C]
                transition
                hover:bg-[#f4f1fb]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01-.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.08 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable