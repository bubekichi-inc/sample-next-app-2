import React from 'react'

interface Props {
  message: string
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  if (!message) return null

  return <p className="text-sm text-red-700">{message}</p>
}
