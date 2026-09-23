import { useCallback, useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import NoteForm from './components/NoteForm'
import NotesList from './components/NotesList'
import { supabase } from './lib/supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [notes, setNotes] = useState([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const loadNotes = useCallback(async () => {
    setNotesLoading(true)
    setError('')
    const { data, error: queryError } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (queryError) setError(queryError.message)
    else setNotes(data ?? [])
    setNotesLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setAuthLoading(false)
      if (!newSession) {
        setNotes([])
        setEditingNote(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) loadNotes()
  }, [session, loadNotes])

  async function saveNote(values) {
    setSaving(true)
    setError('')

    const query = editingNote
      ? supabase.from('notes').update(values).eq('id', editingNote.id)
      : supabase.from('notes').insert({
          ...values,
          user_id: session.user.id,
        })

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return false
    }

    setEditingNote(null)
    await loadNotes()
    return true
  }

  async function deleteNote(id) {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    setDeletingId(id)
    setError('')
    const { error: deleteError } = await supabase.from('notes').delete().eq('id', id)

    if (deleteError) setError(deleteError.message)
    else {
      if (editingNote?.id === id) setEditingNote(null)
      await loadNotes()
    }
    setDeletingId(null)
  }

  async function logOut() {
    setError('')
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError.message)
  }

  if (authLoading) {
    return <main className="loading-screen">Opening your notebook…</main>
  }

  if (!session) return <AuthForm />

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Study Notes home">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>Study Notes</span>
        </a>
        <div className="account">
          <span>{session.user.email}</span>
          <button type="button" className="secondary" onClick={logOut}>Log out</button>
        </div>
      </header>

      <main id="top" className="workspace">
        <section className="hero">
          <p className="eyebrow">Private workspace</p>
          <h1>Make the idea stick.</h1>
          <p>Capture the insight now. Find it when you need it.</p>
        </section>

        {error && <p className="status error global-error" role="alert">{error}</p>}

        <div className="workspace-grid">
          <aside>
            <NoteForm
              note={editingNote}
              onSave={saveNote}
              onCancel={() => setEditingNote(null)}
              saving={saving}
            />
          </aside>

          <section className="notes-panel" aria-labelledby="notes-title">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your collection</p>
                <h2 id="notes-title">My notes</h2>
              </div>
              <span className="note-count">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
            <NotesList
              notes={notes}
              loading={notesLoading}
              onEdit={setEditingNote}
              onDelete={deleteNote}
              deletingId={deletingId}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
