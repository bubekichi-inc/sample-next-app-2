
import { Category } from '@/app/api/admin/posts/[id]/route'
import * as React from 'react'
import { useEffect } from 'react'

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
  disabled: boolean
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
  disabled
}) => {
  const [categories, setCategories] = React.useState<Category[]>([])

  const toggleCategory = (id: number) => {
    if (disabled) return;

    const exists = selectedCategories.some((category) => category.id === id)

    if (exists) {
      setSelectedCategories(
        selectedCategories.filter((category) => category.id !== id)
      )
      return
    }

    const category = categories.find((c) => c.id === id)
    if (!category) return
    setSelectedCategories([...selectedCategories, category])
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
    }

    fetcher()
  }, [])

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.some(
            (selected) => selected.id === category.id
          )
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={[
                'rounded-full border px-3 py-1 text-sm',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800',
              ].join(' ')}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
