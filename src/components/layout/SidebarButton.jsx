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
      {({ isActive }) => (
        <>
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 shrink-0 justify-center ${isActive ? 'text-white' : 'text-gray-300'}`}
          >
            {icon && (
              <span
                className="block h-full w-full bg-current"
                style={{
                  maskImage: `url(${icon})`,
                  maskPosition: 'center',
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  WebkitMaskImage: `url(${icon})`,
                  WebkitMaskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                }}
              />
            )}
          </span>
          <span className={isActive ? 'text-white' : 'text-gray-300'}>{children}</span>
        </>
      )}
    </NavLink>
  )
}

export default SidebarButton
