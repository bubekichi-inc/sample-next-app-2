import { prisma } from '@/app/_libs/prisma'
import { NextResponse } from 'next/server'

export type PostIndexResponse = {
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

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ posts }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// 投稿作成時に送られてくるリクエストのbodyの型
export type CreatePostRequestBody = {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}

// 投稿作成APIのレスポンスの型
export type CreatePostResponse = {
  id: number
}

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: Request) => {
  try {
    // リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json()

    // bodyの中からtitle, content, categories, thumbnailUrlを取り出す
    const { title, content, categories, thumbnailUrl } = body

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

    // レスポンスを返す
    return NextResponse.json<CreatePostResponse>({
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}
