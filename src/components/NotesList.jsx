import NoteCard from './NoteCard'

export default function NotesList({ notes, loading, onEdit, onDelete, deletingId }) {
  if (loading) return <p className="empty-state">Loading your notes…</p>

  if (!notes.length) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">✦</span>
        <h3>Your notebook is ready</h3>
        <p>Add your first note using the form.</p>
      </div>
    )
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deletingId === note.id}
        />
      ))}
    </div>
  )
}
