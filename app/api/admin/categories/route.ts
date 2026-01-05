
import { prisma } from '@/app/_libs/prisma'
import { supabase } from '@/app/_libs/supabase'
import { NextRequest, NextResponse } from 'next/server'

// カテゴリー一覧APIのレスポンスの型
export type CategoriesIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }[]
}

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc', // 作成日時の降順で取得
      },
    })

    // レスポンスを返す
    return NextResponse.json<CategoriesIndexResponse>({ categories }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

// カテゴリーの作成時に送られてくるリクエストのbodyの型
export type CreateCategoryRequestBody = {
  name: string
}

// カテゴリー作成APIのレスポンスの型
export type CreateCategoryResponse = {
  id: number
}

export const POST = async (request: Request) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token)

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からnameを取り出す
    const { name }: CreateCategoryRequestBody = body

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    })

    // レスポンスを返す
    return NextResponse.json<CreateCategoryResponse>({
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
  }
}
