'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { CreateCategoryRequestBody } from '@/app/api/admin/categories/route'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    if (!token) return;

    try {
      setIsSubmitting(true)

      const body: CreateCategoryRequestBody = { name }

      // カテゴリーを作成します。
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body),
      })

      // レスポンスから作成したカテゴリーのIDを取得します。
      const { id } = await res.json()

      // 作成したカテゴリーの詳細ページに遷移します。
      router.push(`/admin/categories/${id}`)

      alert('カテゴリーを作成しました。')
    } catch (error) {
      console.error('カテゴリーの作成に失敗しました:', error)
      alert('カテゴリーの作成に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>

      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  )
}
