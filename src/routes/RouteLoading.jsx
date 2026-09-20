
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const RouteLoading = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 180)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!loading) {
    return null
  }

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 overflow-hidden bg-purple-100">
      <div className="h-full w-1/3 animate-pulse bg-[#7000ff]" />
    </div>
  )
}

export default RouteLoading
