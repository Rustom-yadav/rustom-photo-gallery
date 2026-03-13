import { useEffect, useState } from 'react'

export function useFetchPhotos() {
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

  return { photos, loading, error }
}

