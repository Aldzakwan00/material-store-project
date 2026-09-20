import { NavLink } from 'react-router-dom'

const SidebarButton = ({ to, icon, children, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `flex min-h-12 w-full items-center gap-4 rounded-lg px-4 py-3 text-base transition-colors ${
        isActive
          ? 'bg-[#7000ff] text-white shadow-[0_8px_20px_rgba(112,0,255,0.25)]'
          : 'text-[#c6a2f3] hover:bg-[#26004c] hover:text-white'
      }`}
    >
      <span aria-hidden="true" className="flex h-7 w-7 shrink-0 justify-center">
        {icon && <img src={icon} alt="" className="h-full w-full object-contain" />}
      </span>
      <span>{children}</span>
    </NavLink>
  )
}

export default SidebarButton
