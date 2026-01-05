import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'

// 投稿一覧APIのレスポンスの型
export type PostsIndexResponse = {
  posts: {
    id: number
    title: string
    content: string
    thumbnailUrl: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }[]
}

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async () => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy: {
        createdAt: 'desc',
      },
    })

    // レスポンスを返す
    return NextResponse.json<PostsIndexResponse>({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
