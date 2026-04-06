'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { Product, School } from '@/lib/supabase/types'
import { CATEGORIES } from '@/lib/constants/categories'
import { PRICE_RANGES } from '@/lib/constants/price-ranges'
import ProductGrid from '@/components/products/ProductGrid'

interface SchoolShopClientProps {
  initialProducts: Product[]
  totalCount: number
  schoolSlug: string
  schoolColor: string
  school: School
}

export default function SchoolShopClient({
  initialProducts,
  totalCount,
  schoolSlug,
  schoolColor,
  school,
}: SchoolShopClientProps) {
  const [products, setProducts] = useState(initialProducts)
  const [total, setTotal] = useState(totalCount)
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(initialProducts.length)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activePriceRange, setActivePriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const fetchProducts = useCallback(async (params: {
    category?: string
    priceRange?: string
    sort?: string
    q?: string
    appendOffset?: number
  }) => {
    setLoading(true)
    const searchParams = new URLSearchParams({ school: schoolSlug })
    if (params.category && params.category !== 'all') searchParams.set('category', params.category)
    if (params.priceRange && params.priceRange !== 'all') searchParams.set('priceRange', params.priceRange)
    if (params.sort) searchParams.set('sortBy', params.sort)
    if (params.q) searchParams.set('q', params.q)
    if (params.appendOffset) searchParams.set('offset', String(params.appendOffset))

    try {
      const res = await fetch(`/api/products?${searchParams}`)
      const data = await res.json()
      if (params.appendOffset) {
        setProducts(prev => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }
      setTotal(data.total)
      setOffset(params.appendOffset ? params.appendOffset + data.products.length : data.products.length)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [schoolSlug])

  function handleFilterChange(cat: string, pr: string, sort: string) {
    setActiveCategory(cat)
    setActivePriceRange(pr)
    setSortBy(sort)
    fetchProducts({ category: cat, priceRange: pr, sort, q: searchQuery })
  }

  function handleLoadMore() {
    fetchProducts({
      category: activeCategory,
      priceRange: activePriceRange,
      sort: sortBy,
      q: searchQuery,
      appendOffset: offset,
    })
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (searchQuery.length > 0 || searchQuery === '') {
        fetchProducts({
          category: activeCategory,
          priceRange: activePriceRange,
          sort: sortBy,
          q: searchQuery,
        })
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const pillStyle = (active: boolean) => ({
    background: active ? schoolColor : 'var(--surface)',
    color: active ? 'white' : 'var(--text-secondary)',
    border: active ? 'none' : '1px solid var(--border)',
    fontSize: 12,
    fontWeight: 600 as const,
    padding: '6px 14px',
    borderRadius: 20,
    cursor: 'pointer' as const,
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s',
  })

  return (
    <>
      {/* Search + filters */}
      <section style={{
        background: 'white',
        padding: '24px 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <input
            type="text"
            placeholder={`Search ${school.nickname} gear...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '10px 16px',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              marginBottom: 16,
              outline: 'none',
            }}
          />

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              onClick={() => handleFilterChange('all', activePriceRange, sortBy)}
              style={pillStyle(activeCategory === 'all')}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => handleFilterChange(cat.slug, activePriceRange, sortBy)}
                style={pillStyle(activeCategory === cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price range pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => handleFilterChange(activeCategory, 'all', sortBy)}
              style={pillStyle(activePriceRange === 'all')}
            >
              Any Price
            </button>
            {PRICE_RANGES.map(pr => (
              <button
                key={pr.slug}
                onClick={() => handleFilterChange(activeCategory, pr.slug, sortBy)}
                style={pillStyle(activePriceRange === pr.slug)}
              >
                {pr.label}
              </button>
            ))}

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => handleFilterChange(activeCategory, activePriceRange, e.target.value)}
              style={{
                marginLeft: 'auto',
                padding: '6px 12px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="container" style={{ padding: '24px 20px 48px' }}>
        <ProductGrid
          products={products}
          schoolColor={schoolColor}
          loading={loading && products.length === 0}
          totalCount={total}
          hasMore={offset < total}
          onLoadMore={handleLoadMore}
        />
      </section>
    </>
  )
}
