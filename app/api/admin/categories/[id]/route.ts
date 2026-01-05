import { prisma } from '@/app/_libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

// カテゴリーの更新時に送られてくるリクエストのbodyの型
interface UpdateCategoryRequestBody {
  name: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json()

  try {
    // idを指定して、Categoryを更新
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK', category }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params

  try {
    // idを指定して、Categoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
