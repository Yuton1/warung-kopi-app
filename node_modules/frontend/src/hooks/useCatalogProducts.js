import { useEffect, useState } from 'react'
import { coffeeSeed } from '../data/menuSeed'

export const useCatalogProducts = () => {
  const [products, setProducts] = useState(coffeeSeed)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`)
        }

        if (!cancelled) {
          setProducts(Array.isArray(data) && data.length ? data : coffeeSeed)
        }
      } catch (error) {
        console.error('Gagal ambil data produk:', error)
        if (!cancelled) {
          setProducts(coffeeSeed)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading }
}
