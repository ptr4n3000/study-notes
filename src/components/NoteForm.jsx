import { useEffect, useState } from 'react'

export default function NoteForm({ note, onSave, onCancel, saving }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
  }, [note])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim()) return
    const saved = await onSave({ title: title.trim(), content: content.trim() })
    if (saved && !note) {
      setTitle('')
      setContent('')
    }
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{note ? 'Make a revision' : 'Capture an idea'}</p>
          <h2>{note ? 'Edit note' : 'New note'}</h2>
        </div>
        {note && (
          <button type="button" className="text-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <label htmlFor="note-title">Title</label>
      <input
        id="note-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        maxLength="120"
        placeholder="e.g. Signals and Systems review"
        required
      />

      <label htmlFor="note-content">Notes</label>
      <textarea
        id="note-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows="7"
        placeholder="Write the key idea in your own words…"
      />

      <button className="primary" disabled={saving}>
        {saving ? 'Saving…' : note ? 'Save changes' : 'Add note'}
      </button>
    </form>
  )
}
