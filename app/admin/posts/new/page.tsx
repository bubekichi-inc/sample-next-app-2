'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/app/generated/prisma/client'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://placehold.jp/800x400.png',
  ) // 画像URLは、一旦このURL固定でお願いします。後ほど画像アップロード処理を実装します。
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // 記事を作成します。
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      })

      // レスポンスから作成した記事のIDを取得します。
      const { id } = await res.json()

      // 作成した記事の詳細ページに遷移します。
      router.push(`/admin/posts/${id}`)

      alert('記事を作成しました。')
    } catch (error) {
      console.error('記事の作成に失敗しました:', error)
      alert('記事の作成に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  )
}
