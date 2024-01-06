import React, { useState } from 'react'

export const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setValue(e.target.value)
  }
  return { value, onChange, setValue }
}
