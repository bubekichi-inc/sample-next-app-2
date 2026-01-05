'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category, PostShowResponse, UpdatePostRequestBody } from '@/app/api/admin/posts/[id]/route'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()

  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    if (!token) return;

    try {
      setIsSubmitting(true)

      const body: UpdatePostRequestBody = { title, content, thumbnailUrl, categories }

      await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(body),
      })

      alert('記事を更新しました。')
    } catch (error) {
      console.error('記事の更新に失敗しました:', error)
      alert('記事の更新に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  const handleDeletePost = async () => {
    if (!token) return;

    if (!confirm('記事を削除しますか？')) return

    try {
      setIsSubmitting(true)
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      })

      alert('記事を削除しました。')

      router.push('/admin/posts')
    } catch (error) {
      console.error('記事の削除に失敗しました:', error)
      alert('記事の削除に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
      })
      const { post }: { post: PostShowResponse["post"] } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      setCategories(post.postCategories.map((pc) => pc.category))
    }

    fetcher()
  }, [id, token])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        disabled={isSubmitting}
      />
    </div>
  )
}
