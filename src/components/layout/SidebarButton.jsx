import { NavLink } from 'react-router-dom'

const SidebarButton = ({ to, icon, children, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `flex min-h-12 w-full items-center gap-4 rounded-lg px-4 py-3 text-base transition-all ${
        isActive
          ? '-translate-x-2 bg-[#51448C] text-white'
          : 'text-[#c6a2f3] hover:bg-[#51448C] hover:text-white opacity-50'
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
