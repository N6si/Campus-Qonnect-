export default function Card({ children, className = "", title, footer }) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-slate-700">{title}</div>
        </div>
      )}

      <div>{children}</div>

      {footer && <div className="mt-3 text-sm text-slate-500">{footer}</div>}
    </div>
  );
}
