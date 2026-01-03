import React, { ComponentProps } from 'react'

type Props = Omit<ComponentProps<'input'>, 'onChange'> & {
  onChange: (value: string) => void
}

export const Input: React.FC<Props> = ({ onChange, ...props }) => {
  return (
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg p-4 w-full"
    />
  )
}
