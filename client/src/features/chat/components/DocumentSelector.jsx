import { Check, ChevronDown, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function DocumentSelector({ documents = [], selectedDocument, onSelect }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape) }
  }, [])

  const selectDocument = (documentItem) => { onSelect(documentItem); setOpen(false) }
  const selectedName = selectedDocument?.originalName || 'Select a document'

  return <div className={open ? 'document-selector-container is-open' : 'document-selector-container'} ref={containerRef}><button className="document-selector-box" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}><span className="selector-icon"><FileText size={15} /></span><span className="selector-value" title={selectedName}>{selectedName}</span><span className="selector-chevron"><ChevronDown size={14} /></span></button>{open && <div className="document-selector-menu" role="listbox" aria-label="Select current document">{documents.map((documentItem) => { const selected = documentItem.id === selectedDocument?.id; return <button className={selected ? 'document-option selected' : 'document-option'} key={documentItem.id} type="button" role="option" aria-selected={selected} onClick={() => selectDocument(documentItem)}><span className="option-file-icon"><FileText size={14} /></span><span className="option-name" title={documentItem.originalName}>{documentItem.originalName}</span>{selected && <Check className="option-check" size={15} />}</button> })}</div>}</div>
}
