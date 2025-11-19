import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, PlusCircle } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Manage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // For selects
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])

  const [clientForm, setClientForm] = useState({ name: '', company: '', email: '' })
  const [projectForm, setProjectForm] = useState({ name: '', client_id: '', status: 'planning', sentiment: 0.7 })
  const [updateForm, setUpdateForm] = useState({ title: '', message: '', project_id: '', celebrate: true })

  const resetMessages = () => { setMessage(''); setError('') }

  const fetchRefs = async () => {
    try {
      const [c, p] = await Promise.all([
        fetch(`${baseUrl}/api/clients`).then(r => r.json()),
        fetch(`${baseUrl}/api/projects`).then(r => r.json()),
      ])
      setClients(c)
      setProjects(p)
    } catch (e) {
      // silently ignore; selects will be empty
    }
  }

  useEffect(() => { fetchRefs() }, [])

  const handleCreate = async (type) => {
    resetMessages()
    setLoading(true)
    try {
      let endpoint = ''
      let payload = {}
      if (type === 'client') {
        endpoint = '/api/clients'
        payload = clientForm
      } else if (type === 'project') {
        endpoint = '/api/projects'
        payload = { ...projectForm, sentiment: Number(projectForm.sentiment) }
      } else if (type === 'update') {
        endpoint = '/api/updates'
        payload = updateForm
      }

      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setMessage('Saved successfully')
      // Refresh selects and notify other widgets
      fetchRefs()
      window.dispatchEvent(new CustomEvent('xh:data-changed'))
      // Reset forms lightly
      if (type === 'client') setClientForm({ name: '', company: '', email: '' })
      if (type === 'project') setProjectForm(p => ({ ...p, name: '' }))
      if (type === 'update') setUpdateForm(u => ({ ...u, title: '', message: '' }))
    } catch (e) {
      setError('Something went wrong while saving. Ensure backend is reachable.')
    } finally {
      setLoading(false)
      setTimeout(() => { setMessage(''); setError('') }, 2500)
    }
  }

  const Section = ({ title, children, accent }) => (
    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className={`rounded-2xl border ${accent} bg-slate-800/40 p-6`}>{children}</motion.div>
  )

  return (
    <section id="manage" className="relative py-16 bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Add Data</h2>
          <p className="text-blue-200/70 text-sm">Create clients, projects, and celebrations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Create Client */}
          <Section accent="border-emerald-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-emerald-400"/> New Client</h3>
            <div className="space-y-3">
              <input className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Name" value={clientForm.name} onChange={e=>setClientForm(v=>({...v,name:e.target.value}))}/>
              <input className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Company" value={clientForm.company} onChange={e=>setClientForm(v=>({...v,company:e.target.value}))}/>
              <input className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Email" value={clientForm.email} onChange={e=>setClientForm(v=>({...v,email:e.target.value}))}/>
              <button onClick={()=>handleCreate('client')} disabled={loading} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-3 py-2 rounded-lg transition">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>} Save Client
              </button>
            </div>
          </Section>

          {/* Create Project */}
          <Section accent="border-blue-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-blue-400"/> New Project</h3>
            <div className="space-y-3">
              <input className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Project name" value={projectForm.name} onChange={e=>setProjectForm(v=>({...v,name:e.target.value}))}/>
              <select className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" value={projectForm.client_id} onChange={e=>setProjectForm(v=>({...v,client_id:e.target.value}))}>
                <option value="">Select client</option>
                {clients.map(c=> <option key={c.id} value={c.id}>{c.name} • {c.company}</option>)}
              </select>
              <div className="flex items-center gap-3">
                <select className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" value={projectForm.status} onChange={e=>setProjectForm(v=>({...v,status:e.target.value}))}>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="done">Done</option>
                </select>
                <div className="flex items-center gap-2 text-blue-200/70 text-xs">
                  <span>Sentiment</span>
                  <input type="range" min="0" max="1" step="0.01" value={projectForm.sentiment} onChange={e=>setProjectForm(v=>({...v,sentiment:e.target.value}))}/>
                  <span className="tabular-nums">{Math.round(projectForm.sentiment*100)}%</span>
                </div>
              </div>
              <button onClick={()=>handleCreate('project')} disabled={loading} className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-900 font-semibold px-3 py-2 rounded-lg transition">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>} Save Project
              </button>
            </div>
          </Section>

          {/* Create Update */}
          <Section accent="border-yellow-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-yellow-300"/> New Celebration</h3>
            <div className="space-y-3">
              <input className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Title" value={updateForm.title} onChange={e=>setUpdateForm(v=>({...v,title:e.target.value}))}/>
              <textarea className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" rows={3} placeholder="Message" value={updateForm.message} onChange={e=>setUpdateForm(v=>({...v,message:e.target.value}))}></textarea>
              <select className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 text-sm" value={updateForm.project_id} onChange={e=>setUpdateForm(v=>({...v,project_id:e.target.value}))}>
                <option value="">Select project</option>
                {projects.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <label className="flex items-center gap-2 text-xs text-blue-200/80">
                <input type="checkbox" checked={updateForm.celebrate} onChange={e=>setUpdateForm(v=>({...v,celebrate:e.target.checked}))}/> Mark as celebration
              </label>
              <button onClick={()=>handleCreate('update')} disabled={loading} className="inline-flex items-center gap-2 bg-yellow-300 hover:bg-yellow-200 text-slate-900 font-semibold px-3 py-2 rounded-lg transition">
                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>} Save Update
              </button>
            </div>
          </Section>
        </div>

        {(message || error) && (
          <div className="mt-6">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${message ? 'bg-emerald-500 text-slate-900' : 'bg-red-500 text-white'}`}>
              {message ? <CheckCircle2 className="w-4 h-4"/> : <Loader2 className="w-4 h-4"/>}
              {message || error}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
