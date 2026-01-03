'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import classes from '@/app/_styles/Home.module.scss'
import { API_BASE_URL } from './constants'
import { Post } from './_types/Post'


export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`${API_BASE_URL}/posts`)
      const { posts } = await res.json()
      setPosts(posts)
      setIsLoading(false)
    }

    fetcher()
  }, [])

  if (isLoading) return <div>読み込み中...</div>

  return (
    <div className="">
      <div className={classes.container}>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id} className={classes.list}>
                <Link href={`/posts/${post.id}`} className={classes.link}>
                  <div className={classes.post}>
                    <div className={classes.postContent}>
                      <div className={classes.postInfo}>
                        <div className={classes.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className={classes.postCategories}>
                          {post.categories.map((category) => {
                            return (
                              <div
                                key={category}
                                className={classes.postCategory}
                              >
                                {category}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <p className={classes.postTitle}>{post.title}</p>
                      <div
                        className={classes.postBody}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
