const DataTable = ({ columns, data, actions, actionLabel = 'Aksi', tableClassName = 'text-left text-sm' }) => {
  return (
    <div className="overflow-x-auto rounded-md border border-[#e1e1e5] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
      <table className={`min-w-full text-left ${tableClassName}`}>
        <thead className="bg-[#51448C] text-white">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-2.5 py-2.5 font-semibold">
                {column.label}
              </th>
            ))}
            {actions && <th className="whitespace-nowrap px-2.5 py-2.5 font-semibold">{actionLabel}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e8e8eb] text-[#707070]">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-[#faf9ff]">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-2.5 py-2">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && <td className="px-2.5 py-2">{actions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-5 py-10 text-center text-[#907ca2]"
              >
                Belum ada data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
