export default function NoteCard({ note, onEdit, onDelete, deleting }) {
  const updated = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(note.updated_at))

  return (
    <article className="note-card">
      <div className="note-copy">
        <p className="note-date">Updated {updated}</p>
        <h3>{note.title}</h3>
        <p className={note.content ? '' : 'muted'}>
          {note.content || 'No additional details.'}
        </p>
      </div>
      <div className="note-actions">
        <button type="button" className="secondary" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => onDelete(note.id)}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </article>
  )
}
