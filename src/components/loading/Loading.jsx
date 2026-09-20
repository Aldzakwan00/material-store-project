
const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative h-16 w-16">
        {/* Lingkaran luar */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#E4D0FF] border-t-[#6F00FF]"></div>

        {/* Lingkaran dalam */}
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-[#F0E8FF] border-b-[#8B3DFF] [animation-duration:1.2s] [animation-direction:reverse]"></div>

        {/* Titik tengah */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6F00FF] animate-pulse"></div>
      </div>
    </div>
  )
}

export default Loading;
