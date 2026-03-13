import { useEffect, useState } from 'react'

function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          'https://picsum.photos/v2/list?limit=30',
        )

        if (!response.ok) {
          throw new Error('Failed to fetch photos')
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Photo Gallery
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Picsum Photos API • 30 random photos
            </p>
          </div>
        </header>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="flex items-center gap-3 text-slate-300">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
              <span className="text-sm">Loading photos…</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p className="font-medium">Failed to load photos</p>
            <p className="mt-1 text-red-200/80">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <main>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {photos.map((photo) => (
                <article
                  key={photo.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm transition hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.download_url}
                      alt={`Photo by ${photo.author}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-2 px-3 py-3">
                    <div>
                      <p className="truncate text-sm font-medium text-slate-100">
                        {photo.author}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        ID: {photo.id}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-pink-500 hover:bg-pink-500/20"
                      >
                        <span className="text-pink-400">♥</span>
                        <span>Favourite</span>
                      </button>

                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
                      >
                        View source
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {photos.length === 0 && (
              <p className="mt-8 text-center text-sm text-slate-400">
                No photos to display.
              </p>
            )}
          </main>
        )}
      </div>
    </div>
  )
}

export default App
