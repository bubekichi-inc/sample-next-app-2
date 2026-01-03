import React, { ComponentProps } from 'react'

type Props = Omit<ComponentProps<'textarea'>, 'onChange'> & {
  onChange: (value: string) => void
}

export const Textarea: React.FC<Props> = ({ onChange, ...props }) => {
  return (
    <textarea
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-4"
    />
  )
}
