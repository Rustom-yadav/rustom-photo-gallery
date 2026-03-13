import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useFetchPhotos } from './useFetchPhotos'

// Key used to save/load favourites in browser localStorage
const FAVOURITES_STORAGE_KEY = 'photo-gallery:favourites'

// favorite toggle function
function favouritesReducer(state, action) {
  if (action.type === 'TOGGLE') {
    const photoId = action.payload
    const isAlreadyFavourite = state.includes(photoId)
    if (isAlreadyFavourite) {
      return state.filter((id) => id !== photoId)
    }
    return [...state, photoId]
  }
  return state
}

/* Reads saved favourite IDs from localStorage. 
and returned the parsed json. */
function getInitialFavourites() {
  if (typeof window === 'undefined') return []
  try {
    const json = window.localStorage.getItem(FAVOURITES_STORAGE_KEY)
    if (!json) return []
    const list = JSON.parse(json)
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function App() {
  // my custom hook imported
  const { photos, loading, error } = useFetchPhotos()

  // Search input value; we filter photos by author name (Requirement 4)
  const [searchTerm, setSearchTerm] = useState('')

  // Requirement 5: Favourites state with useReducer. Third argument = initializer (run once).
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    getInitialFavourites,
  )

  // Requirement 5: Whenever favourites change, save to localStorage so they persist on refresh
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(favourites),
      )
    } catch {
      // ignore if localStorage is full or disabled
    }
  }, [favourites])

  // Requirement 7: useCallback — same function reference so children don't re-render unnecessarily
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  // Requirement 7: useCallback — stable reference for the favourite toggle handler
  const handleToggleFavourite = useCallback((id) => {
    dispatch({ type: 'TOGGLE', payload: id })
  }, [])

  // Requirement 7: useMemo — we only recompute this Set when favourites array changes
  const favouriteSet = useMemo(() => new Set(favourites), [favourites])

  // Requirement 7: useMemo — filtered list only recomputes when photos or searchTerm change
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (query === '') return photos
    const result = photos.filter((photo) =>
      photo.author.toLowerCase().includes(query),
    )
    return result
  }, [photos, searchTerm])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Photo Gallery
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Picsum Photos API • 30 random photos
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by author…"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40"
            />
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredPhotos.map((photo) => {
                const isFavourite = favouriteSet.has(photo.id)

                return (
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
                      <p className="truncate text-sm font-medium text-slate-100">
                        {photo.author}
                      </p>

                      <div className="mt-2 flex items-center justify-start">
                        <button
                          type="button"
                          onClick={() => handleToggleFavourite(photo.id)}
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
                            isFavourite
                              ? 'border-pink-500 bg-pink-500/20 text-pink-200'
                              : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-pink-500 hover:bg-pink-500/20'
                          }`}
                        >
                          <span
                            className={
                              isFavourite ? 'text-pink-300' : 'text-pink-400'
                            }
                          >
                            {isFavourite ? '♥' : '♡'}
                          </span>
                          <span>{isFavourite ? 'Favourited' : 'Favourite'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {filteredPhotos.length === 0 && (
              <p className="mt-8 text-center text-sm text-slate-400">
                No photos match your search.
              </p>
            )}
          </main>
        )}
      </div>
    </div>
  )
}

export default App
