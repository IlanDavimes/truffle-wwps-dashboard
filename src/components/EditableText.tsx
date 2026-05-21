interface EditableTextProps {
  value: string
  editable: boolean
  multiline?: boolean
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  onChange?: (next: string) => void
}

export default function EditableText({
  value,
  editable,
  multiline,
  placeholder,
  className,
  style,
  onChange,
}: EditableTextProps) {
  if (!editable) {
    return (
      <span className={className} style={style}>
        {value}
      </span>
    )
  }

  return (
    <span
      role="textbox"
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={`editable-text ${className ?? ''}`}
      style={style}
      onBlur={(e) => {
        const next = e.currentTarget.textContent ?? ''
        if (onChange && next !== value) onChange(next)
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).blur()
        }
      }}
    >
      {value}
    </span>
  )
}
