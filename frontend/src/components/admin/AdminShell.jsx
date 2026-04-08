import { Link, useLocation } from 'react-router-dom'
import { Boxes, Image, LayoutDashboard, Receipt, Settings, Users } from 'lucide-react'

const adminTabs = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Boxes },
  { label: 'Orders', path: '/admin/orders', icon: Receipt },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Banners', path: '/admin/banners', icon: Image },
  { label: 'Home Content', path: '/admin/home-content', icon: Settings },
]

export default function AdminShell({ title, subtitle, action, children }) {
  const { pathname } = useLocation()

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="glass-surface mb-4 overflow-auto rounded-2xl p-2">
          <div className="flex min-w-max gap-2">
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.path
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'brand-gradient text-white shadow'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={15} /> {tab.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <header className="glass-surface mb-4 rounded-2xl p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
