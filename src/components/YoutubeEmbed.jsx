export default function YoutubeEmbed({ id, title }) {
  const isSlot = !id || id.startsWith('SLOT_')
  if (isSlot) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-sage-50 text-center text-sm text-sage-700">
        <div>
          <p className="font-semibold">{title || 'Video'}</p>
          <p className="mt-1 text-xs">Cole o ID do YouTube neste slot: {id || 'vazio'}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
