export default function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-gold/20 rounded-2xl p-6 ${className || ''}`}>
      {children}
    </div>
  )
}