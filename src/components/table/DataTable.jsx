import { useState } from 'react'

const DataTable = ({
  columns,
  data = [],
  actions,
  actionLabel = 'Aksi',
  tableClassName = 'text-left text-sm',
}) => {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = Math.ceil(data.length / pageSize)
  const lastPage = Math.max(pageCount - 1, 0)
  const visiblePage = Math.min(currentPage, lastPage)
  const startIndex = visiblePage * pageSize
  const visibleData = data.slice(startIndex, startIndex + pageSize)

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setCurrentPage(0)
  }

  const firstVisibleRow = data.length === 0 ? 0 : startIndex + 1
  const lastVisibleRow = Math.min(startIndex + pageSize, data.length)

  return (
    <div className="overflow-hidden rounded-md border border-[#e1e1e5] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <div className="overflow-x-auto">
        <table className={`min-w-full text-left ${tableClassName}`}>
          <thead className="bg-[#51448C] text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-2.5 py-2.5 font-semibold"
                >
                  {column.label}
                </th>
              ))}

              {actions && (
                <th className="whitespace-nowrap px-2.5 py-2.5 font-semibold">
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e8e8eb] text-[#707070]">
            {data.length > 0 ? (
              visibleData.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[#faf9ff]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-2.5 py-2"
                    >
                      {column.render
                        ? column.render(row, startIndex + rowIndex)
                        : row[column.key] ?? '-'}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-2.5 py-2">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (actions ? 1 : 0)
                  }
                  className="px-5 py-10 text-center text-[#907ca2]"
                >
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 border-t border-[#e8e8eb] px-3 py-2 text-[11px] text-[#333333]">
        <label className="flex items-center gap-2 whitespace-nowrap">
          Rows per page
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            aria-label="Rows per page"
            className="cursor-pointer bg-transparent text-[11px] outline-none"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <span className="whitespace-nowrap tabular-nums">
          {firstVisibleRow}-{lastVisibleRow} of {data.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
            disabled={visiblePage === 0}
            aria-label="Previous page"
            className="flex h-6 w-6 items-center justify-center rounded text-[#51448C] transition hover:bg-[#f1effa] disabled:cursor-not-allowed disabled:text-[#b8b5bf] disabled:hover:bg-transparent"
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
                d="M12.79 5.23a.75.75 0 0 1-.02 1.06L9.06 10l3.71 3.71a.75.75 0 1 1-1.06 1.06l-4.24-4.24a.75.75 0 0 1 0-1.06l4.24-4.24a.75.75 0 0 1 1.08 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, lastPage))
            }
            disabled={visiblePage >= lastPage}
            aria-label="Next page"
            className="flex h-6 w-6 items-center justify-center rounded text-[#51448C] transition hover:bg-[#f1effa] disabled:cursor-not-allowed disabled:text-[#b8b5bf] disabled:hover:bg-transparent"
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
                d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable