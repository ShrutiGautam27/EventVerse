import { useToast } from '../context/ToastContext'

export default function Toast() {
  const { toast } = useToast()
  return (
    <div id="toast" className={`toast ${toast.show ? 'show' : ''}`} role="status" aria-live="polite">
      <i className="fa-solid fa-check"></i>
      <span>{toast.message}</span>
    </div>
  )
}
