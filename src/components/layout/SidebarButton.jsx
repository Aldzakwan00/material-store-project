import { NavLink } from 'react-router-dom'

const SidebarButton = ({ to, icon, children, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `mx-32 my-1 flex min-h-12 items-center gap-4 rounded-lg px-4 py-3 text-base transition-colors ${
        isActive
          ? 'bg-[#7000ff] text-white shadow-[0_8px_20px_rgba(112,0,255,0.25)]'
          : 'text-[#c6a2f3] hover:bg-[#26004c] hover:text-white'
      }`}
    >
      <span aria-hidden="true" className="flex w-8 shrink-0 justify-center text-lg leading-none">
        {icon}
      </span>
      <span>{children}</span>
    </NavLink>
  )
}

export default SidebarButton
