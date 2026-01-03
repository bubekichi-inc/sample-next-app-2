import Link from 'next/link'
import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="bg-[#333333] text-white p-4 flex justify-between items-center">
      <Link href="/" className="header-link">
        Blog
      </Link>
      <Link href="/contact" className="header-link">
        お問い合わせ
      </Link>
    </header>
  )
}
