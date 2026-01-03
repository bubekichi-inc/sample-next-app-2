'use client'

import { useState } from 'react'
import { FormGroup } from '../_components/FormGroup'
import { Label } from '../_components/Label'
import { Input } from '../_components/Input'
import { ErrorMessage } from '../_components/ErrorMessage'
import { Textarea } from '../_components/Textarea'
import { API_BASE_URL } from '../constants'

export default function Page() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [messageErrorMessage, setMessageErrorMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  /** バリデーション */
  const valid = () => {
    let isValid = true
    let nameError = ''
    let emailError = ''
    let messageError = ''

    if (!name) {
      nameError = 'お名前は必須です。'
      isValid = false
    } else if (name.length > 30) {
      nameError = 'お名前は30文字以内で入力してください。'
      isValid = false
    }

    if (!email) {
      emailError = 'メールアドレスは必須です。'
      isValid = false
    } else if (!email.match(/.+@.+\..+/)) {
      emailError = 'メールアドレスの形式が正しくありません。'
      isValid = false
    }

    if (!message) {
      messageError = '本文は必須です。'
      isValid = false
    } else if (message.length > 500) {
      messageError = '本文は500文字以内で入力してください。'
      isValid = false
    }

    setNameErrorMessage(nameError)
    setEmailErrorMessage(emailError)
    setMessageErrorMessage(messageError)

    return isValid
  }

  /** フォームの送信 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valid()) return;

    try {
      setIsSubmitting(true)

      await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      alert('送信しました。')

      handleClear()
    } catch {
      alert('送信に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }

  }

  /** フォームのクリア */
  const handleClear = () => {
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div>
      <div className="max-w-200 mx-auto py-10">
        <h1 className="text-xl font-bold mb-10">問合わせフォーム</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label text="お名前" htmlFor="name" />
            <div className="w-full">
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(value) => setName(value)}
                disabled={isSubmitting}
              />
              <ErrorMessage message={nameErrorMessage} />
            </div>
          </FormGroup>
          <FormGroup>
            <Label text="メールアドレス" htmlFor="email" />
            <div className="w-full">
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(value) => setEmail(value)}
                disabled={isSubmitting}
              />
              <ErrorMessage message={emailErrorMessage} />
            </div>
          </FormGroup>
          <FormGroup>
            <Label text="本文" htmlFor="message" />
            <div className="w-full">
              <Textarea
                id="message"
                value={message}
                onChange={(value) => setMessage(value)}
                disabled={isSubmitting}
                rows={8}
              />
              <ErrorMessage message={messageErrorMessage} />
            </div>
          </FormGroup>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg mr-4"
              disabled={isSubmitting}
            >
              送信
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-200 font-bold py-2 px-4 rounded-lg"
              disabled={isSubmitting}
            >
              クリア
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
