'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/app/api/admin/posts/[id]/route'
import { CreatePostRequestBody } from '@/app/api/admin/posts/route'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    if (!token) return;

    try {
      setIsSubmitting(true)

      const body: CreatePostRequestBody = { title, content, thumbnailImageKey, categories }

      // 記事を作成します。
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body),
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
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  )
}
