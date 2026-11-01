'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import {
  Check,
  Download,
  Printer,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react'
import {
  checklistTasks,
  emptyChecklistState,
  type ChecklistState,
} from '@/lib/checklist-data'

const storageKey = 'pipr-checklist-v1'

type MetaField = keyof ChecklistState['meta']

function parseChecklist(value: unknown): ChecklistState | null {
  if (typeof value !== 'object' || value === null) return null

  const candidate = value as Partial<ChecklistState>
  if (typeof candidate.meta !== 'object' || candidate.meta === null) return null
  if (typeof candidate.checks !== 'object' || candidate.checks === null) return null
  if (typeof candidate.notes !== 'object' || candidate.notes === null) return null

  const meta = {
    date: typeof candidate.meta.date === 'string' ? candidate.meta.date : '',
    responsavel:
      typeof candidate.meta.responsavel === 'string'
        ? candidate.meta.responsavel
        : '',
    culto: typeof candidate.meta.culto === 'string' ? candidate.meta.culto : '',
  }
  const checks = Object.fromEntries(
    Object.entries(candidate.checks).filter(
      ([key, checked]) =>
        Number.isInteger(Number(key)) &&
        Number(key) >= 0 &&
        Number(key) < checklistTasks.length &&
        typeof checked === 'boolean',
    ),
  ) as Record<string, boolean>
  const notes = Object.fromEntries(
    Object.entries(candidate.notes).filter(
      ([key, note]) =>
        Number.isInteger(Number(key)) &&
        Number(key) >= 0 &&
        Number(key) < checklistTasks.length &&
        typeof note === 'string',
    ),
  ) as Record<string, string>

  return { meta, checks, notes }
}

function groupTasks() {
  return checklistTasks.reduce<Array<{ name: string; indexes: number[] }>>(
    (groups, item, index) => {
      const current = groups.at(-1)
      if (current?.name === item.group) current.indexes.push(index)
      else groups.push({ name: item.group, indexes: [index] })
      return groups
    },
    [],
  )
}

const taskGroups = groupTasks()

export function TransmissionChecklist() {
  const [state, setState] = useState<ChecklistState>(emptyChecklistState)
  const [isLoaded, setIsLoaded] = useState(false)
  const [status, setStatus] = useState('Carregando checklist salvo neste dispositivo…')
  const importInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = parseChecklist(JSON.parse(saved))
        if (parsed) {
          setState(parsed)
          setStatus('Checklist carregado deste dispositivo.')
        } else {
          setStatus('Os dados salvos estão inválidos. Você pode importar um arquivo JSON válido.')
        }
      } else {
        setStatus('Pronto para uso. As alterações serão salvas neste dispositivo.')
      }
    } catch {
      setStatus('Não foi possível ler os dados salvos neste dispositivo.')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const persist = (next: ChecklistState, message: string) => {
    setState(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setStatus(message)
    } catch {
      setStatus('Não foi possível salvar. Verifique as configurações do navegador.')
    }
  }

  const updateMeta = (field: MetaField, value: string) => {
    persist(
      { ...state, meta: { ...state.meta, [field]: value } },
      'Alterações salvas neste dispositivo.',
    )
  }

  const toggleTask = (index: number, checked: boolean) => {
    persist(
      { ...state, checks: { ...state.checks, [index]: checked } },
      'Alterações salvas neste dispositivo.',
    )
  }

  const updateNote = (index: number, note: string) => {
    persist(
      { ...state, notes: { ...state.notes, [index]: note } },
      'Alterações salvas neste dispositivo.',
    )
  }

  const completed = checklistTasks.reduce(
    (total, _task, index) => total + (state.checks[index] ? 1 : 0),
    0,
  )

  const saveNow = () => {
    persist(state, 'Checklist salvo neste dispositivo.')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pipr-checklist-dados.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('Arquivo de dados exportado.')
  }

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const imported = parseChecklist(JSON.parse(await file.text()))
      if (!imported) throw new Error('invalid-checklist')
      persist(imported, 'Checklist importado e salvo neste dispositivo.')
    } catch {
      setStatus('Arquivo inválido. Escolha um JSON exportado deste checklist.')
    }
  }

  const resetChecklist = () => {
    if (!window.confirm('Tem certeza de que deseja limpar as marcações e observações?')) {
      return
    }

    persist(
      { ...state, checks: {}, notes: {} },
      'Marcações e observações removidas.',
    )
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src="/pipr-brand.png"
            alt="Logotipo da PIPR"
            width={76}
            height={76}
          />
          <div className="brand-copy">
            <span className="eyebrow">PIPR · EQUIPE DE MÍDIA</span>
            <h1>Checklist de transmissão</h1>
            <p>Uma transmissão tranquila começa com uma boa preparação.</p>
          </div>
        </div>
      </header>

      <main className="page-content">
        <section className="panel overview-panel" aria-labelledby="service-details-title">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">ANTES DE COMEÇAR</span>
              <h2 id="service-details-title">Dados da transmissão</h2>
            </div>
            <span className="autosave-badge">
              <Check aria-hidden="true" />
              Salvamento automático
            </span>
          </div>

          <div className="metadata-grid">
            <div className="field">
              <label htmlFor="service-date">Data</label>
              <input
                id="service-date"
                type="date"
                value={state.meta.date}
                onChange={(event) => updateMeta('date', event.target.value)}
                disabled={!isLoaded}
              />
            </div>
            <div className="field">
              <label htmlFor="responsavel">Responsável</label>
              <input
                id="responsavel"
                type="text"
                placeholder="Nome do responsável"
                value={state.meta.responsavel}
                onChange={(event) => updateMeta('responsavel', event.target.value)}
                disabled={!isLoaded}
              />
            </div>
            <div className="field">
              <label htmlFor="culto">Culto</label>
              <input
                id="culto"
                type="text"
                placeholder="Ex.: Culto da manhã"
                value={state.meta.culto}
                onChange={(event) => updateMeta('culto', event.target.value)}
                disabled={!isLoaded}
              />
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-labels">
              <span id="progress-description">Progresso do checklist</span>
              <strong aria-live="polite" aria-atomic="true">
                {completed} de {checklistTasks.length} concluídos
              </strong>
            </div>
            <progress
              className="progress-track"
              value={completed}
              max={checklistTasks.length}
              aria-labelledby="progress-description"
            />
          </div>

          <div className="actions" aria-label="Ações do checklist">
            <button className="action-button primary-action" type="button" onClick={saveNow} disabled={!isLoaded}>
              <Save aria-hidden="true" />
              Salvar agora
            </button>
            <button className="action-button" type="button" onClick={() => window.print()}>
              <Printer aria-hidden="true" />
              Imprimir / PDF
            </button>
            <button className="action-button" type="button" onClick={exportData} disabled={!isLoaded}>
              <Download aria-hidden="true" />
              Exportar dados
            </button>
            <button
              className="action-button"
              type="button"
              onClick={() => importInputRef.current?.click()}
              disabled={!isLoaded}
              aria-controls="import-file"
            >
              <Upload aria-hidden="true" />
              Importar dados
            </button>
            <input
              ref={importInputRef}
              className="visually-hidden"
              hidden
              id="import-file"
              type="file"
              accept="application/json,.json"
              aria-label="Selecionar arquivo JSON para importar"
              onChange={importData}
            />
            <button className="action-button reset-action" type="button" onClick={resetChecklist} disabled={!isLoaded}>
              <RotateCcw aria-hidden="true" />
              Limpar checklist
            </button>
          </div>

          <p className="storage-note">
            Os dados ficam salvos neste navegador e dispositivo. Para compartilhar
            atualizações entre pessoas e dispositivos, é necessário conectar o
            checklist a um banco de dados online.
          </p>
          <p className="status-message" role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </section>

        <section className="panel checklist-panel" aria-labelledby="checklist-title">
          <div className="list-heading">
            <div>
              <span className="eyebrow">ROTEIRO COMPLETO</span>
              <h2 id="checklist-title">Etapas da transmissão</h2>
            </div>
            <span className="task-total">{checklistTasks.length} itens</span>
          </div>

          {taskGroups.map((group) => (
            <fieldset className="task-group" key={group.name}>
              <legend>{group.name}</legend>
              <div className="task-list">
                {group.indexes.map((index) => {
                  const item = checklistTasks[index]
                  const checkboxId = `task-${index}`
                  const noteId = `note-${index}`
                  const isChecked = Boolean(state.checks[index])

                  return (
                    <div className={`task-row${isChecked ? ' is-complete' : ''}`} key={checkboxId}>
                      <input
                        className="task-checkbox"
                        id={checkboxId}
                        type="checkbox"
                        checked={isChecked}
                        onChange={(event) => toggleTask(index, event.target.checked)}
                        disabled={!isLoaded}
                      />
                      <label className="task-label" htmlFor={checkboxId}>
                        {item.task}
                      </label>
                      <label className="visually-hidden" htmlFor={noteId}>
                        Observações para: {item.task}
                      </label>
                      <textarea
                        className="task-note"
                        id={noteId}
                        rows={2}
                        placeholder="Observações (opcional)"
                        value={state.notes[index] ?? ''}
                        onChange={(event) => updateNote(index, event.target.value)}
                        disabled={!isLoaded}
                      />
                    </div>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </section>

        <footer className="page-footer">
          <span>PIPR · Checklist de Transmissão</span>
          <span>Preparar bem também faz parte do culto.</span>
        </footer>
      </main>
    </div>
  )
}
