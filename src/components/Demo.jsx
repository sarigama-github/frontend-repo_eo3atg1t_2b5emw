import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, CheckCircle2, Loader2 } from 'lucide-react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Demo() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [updates, setUpdates] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [c, p, u] = await Promise.all([
          fetch(`${baseUrl}/api/clients`).then(r => r.json()),
          fetch(`${baseUrl}/api/projects`).then(r => r.json()),
          fetch(`${baseUrl}/api/updates`).then(r => r.json()),
        ])
        setClients(c)
        setProjects(p)
        setUpdates(u)
      } catch (e) {
        setError('Could not reach the API. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <section id="demo" className="relative py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Live Client Portal Demo</h2>
          <a href="/test" className="text-blue-300 hover:text-blue-200 text-sm">Backend status →</a>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-blue-200">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading demo data...
          </div>
        ) : error ? (
          <div className="text-red-300">{error}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6">
              <h3 className="text-white font-semibold mb-2">Clients</h3>
              <div className="space-y-3">
                {clients.length === 0 ? (
                  <p className="text-blue-200/70 text-sm">No clients yet. Use the API to create some.</p>
                ) : clients.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                    <p className="text-white font-medium">{c.name}</p>
                    <p className="text-blue-200/70 text-xs">{c.company} • {c.email}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6">
              <h3 className="text-white font-semibold mb-2">Projects</h3>
              <div className="space-y-3">
                {projects.length === 0 ? (
                  <p className="text-blue-200/70 text-sm">No projects yet. Create one linked to a client.</p>
                ) : projects.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-900/60 border border-white/5">
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-blue-200/70 text-xs">Status: {p.status} • Sentiment: {(p.sentiment*100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">Celebrations <Trophy className="w-5 h-5 text-yellow-300"/></h3>
              <div className="space-y-3">
                {updates.length === 0 ? (
                  <p className="text-blue-200/70 text-sm">Ship something and we’ll celebrate it here.</p>
                ) : updates.map(u => (
                  <div key={u.id} className="p-3 rounded-lg bg-slate-900/60 border border-yellow-500/20">
                    <p className="text-white font-medium flex items-center gap-2">
                      {u.celebrate ? <CheckCircle2 className="w-4 h-4 text-green-400"/> : null}
                      {u.title}
                    </p>
                    <p className="text-blue-200/70 text-xs">{u.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
