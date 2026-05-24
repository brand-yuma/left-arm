import { Routes, Route, NavLink } from 'react-router-dom'
import { Receipt, FileText, BookOpen, LayoutDashboard } from 'lucide-react'
import DashboardPage from './pages/DashboardPage'
import ReceiptsPage from './pages/ReceiptsPage'
import InvoicesPage from './pages/InvoicesPage'
import JournalPage from './pages/JournalPage'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'ダッシュボード', shortLabel: 'ホーム' },
  { to: '/receipts', icon: Receipt, label: '領収書', shortLabel: '領収書' },
  { to: '/invoices', icon: FileText, label: '請求書', shortLabel: '請求書' },
  { to: '/journal', icon: BookOpen, label: '仕訳帳', shortLabel: '仕訳帳' },
]

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex w-56 bg-gray-900 text-white flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">左腕 経理</h1>
          <p className="text-xs text-gray-400 mt-1">会計管理システム</p>
        </div>
        <ul className="flex-1 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white border-l-2 border-blue-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          freee代替 v0.1
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/journal" element={<JournalPage />} />
        </Routes>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <ul className="flex justify-around">
          {navItems.map(({ to, icon: Icon, shortLabel }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center py-2 text-[10px] transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`
                }
              >
                <Icon size={20} />
                <span className="mt-0.5">{shortLabel}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
