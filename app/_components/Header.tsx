'use client'

import Link from 'next/link'
import React from 'react'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '../_libs/supabase'
import { useRouter } from 'next/navigation'

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/')
  }

  const { session, isLoading } = useSupabaseSession()

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="header-link">
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin" className="header-link">
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/sign_in" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
