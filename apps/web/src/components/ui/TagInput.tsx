'use client'

import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  disabled?: boolean
}

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
  'bg-cyan-100 text-cyan-700',
]

export function TagInput({
  tags,
  onTagsChange,
  placeholder = 'Ajouter un tag',
  maxTags = 10,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length]
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (!trimmedTag) return
    if (tags.includes(trimmedTag)) return
    if (tags.length >= maxTags) return

    onTagsChange([...tags, trimmedTag])
    setInputValue('')
  }

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === ',' || e.key === 'Tab') {
      if (inputValue.trim()) {
        e.preventDefault()
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    const newTags = pastedText
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag && !tags.includes(tag))
      .slice(0, maxTags - tags.length)

    if (newTags.length > 0) {
      onTagsChange([...tags, ...newTags])
    }
  }

  const isAtLimit = tags.length >= maxTags

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${getTagColor(index)}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                disabled={disabled}
                className="ml-1 rounded-full hover:bg-black/10 disabled:opacity-50"
                aria-label={`Supprimer ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={isAtLimit ? `Maximum ${maxTags} tags atteint` : placeholder}
        disabled={disabled || isAtLimit}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chartreuse focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
      />
    </div>
  )
}
