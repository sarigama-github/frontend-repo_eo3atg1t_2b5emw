import { motion } from 'framer-motion'
import { Heart, PartyPopper, ShieldCheck, Sparkles, GaugeCircle, Smile } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Emotional Experience Design',
    desc: 'Craft updates that build pride and trust — not just progress bars.'
  },
  {
    icon: GaugeCircle,
    title: 'Transparent Momentum',
    desc: 'Real-time milestones, risks, and next steps — presented clearly.'
  },
  {
    icon: PartyPopper,
    title: 'Built-in Celebrations',
    desc: 'Auto-trigger celebrations for shipped milestones and wins.'
  },
  {
    icon: Heart,
    title: 'Human Touch',
    desc: 'Personalized notes, shoutouts, and client sentiment tracking.'
  },
  {
    icon: ShieldCheck,
    title: 'Safe & Secure',
    desc: 'Private, invite-only space with role-aware views.'
  },
  {
    icon: Smile,
    title: 'Client Sentiment',
    desc: 'A simple pulse meter that turns feelings into signal.'
  }
]

export default function Features() {
  return (
    <section id="about" className="relative py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why clients love it</h2>
          <p className="mt-3 text-blue-200/80">Designed to make progress feel personal and worth celebrating.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6 backdrop-blur hover:bg-slate-800/60 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg">{f.title}</h3>
              <p className="text-blue-200/80 mt-2 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
