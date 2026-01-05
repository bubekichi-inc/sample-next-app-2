'use client'

import { useEffect, useState } from 'react'
import classes from '@/app/_styles/Detail.module.scss'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { PostShowResponse } from '@/app/api/posts/[id]/route'

export default function Page() {
  // react-routerのuseParamsを使うと、URLのパラメータを取得できます。
  const { id } = useParams()
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null)
  const [loading, setLoading] = useState(true)

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        `api/posts/${id}`,
      )
      const { post } = await res.json()
      setPost(post)
      setLoading(false)
    }

    fetcher()
  }, [id])

  // 記事取得中は、読み込み中であることを表示します。
  if (loading) return <div>読み込み中...</div>

  // 記事が見つからなかった場合は、記事が見つからないことを表示します。
  if (!post) return <div>記事が見つかりません</div>

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        <div className={classes.postImage}>
          <Image src={post.thumbnailUrl} alt="thumbnail" height={1000} width={1000} />
        </div>
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.postCategories.map((postCategory) => {
                return (
                  <div key={postCategory.category.id} className={classes.postCategory}>
                    {postCategory.category.name}
                  </div>
                )
              })}
            </div>
          </div>
          <div className={classes.postTitle}>{post.title}</div>
          <div
            className={classes.postBody}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  )
}
