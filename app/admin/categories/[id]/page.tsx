'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { CategoryShowResponse, UpdateCategoryRequestBody } from '@/app/api/admin/categories/[id]/route'

export default function Page() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const body: UpdateCategoryRequestBody = { name }

      // カテゴリーを更新します。
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      alert('カテゴリーを更新しました。')
    } catch (error) {
      console.error('カテゴリーの更新に失敗しました:', error)
      alert('カテゴリーの更新に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return

    try {
      setIsSubmitting(true)

      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      alert('カテゴリーを削除しました。')

      router.push('/admin/categories')
    } catch (error) {
      console.error('カテゴリーの削除に失敗しました:', error)
      alert('カテゴリーの削除に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`)
      const { category }: CategoryShowResponse = await res.json()
      setName(category.name)
    }

    fetcher()
  }, [id])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        disabled={isSubmitting}
      />
    </div>
  )
}
