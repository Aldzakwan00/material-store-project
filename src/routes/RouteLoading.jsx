
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loading from '../components/loading/Loading'

const RouteLoading = () => {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!loading) {
    return null
  }

  return <Loading />
}

export default RouteLoading;
