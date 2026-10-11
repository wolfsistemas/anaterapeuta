import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './lib/auth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import AppLayout from './pages/app/AppLayout'
import Overview from './pages/app/Overview'
import Courses from './pages/app/Courses'
import CoursePlayer from './pages/app/CoursePlayer'
import Sessions from './pages/app/Sessions'
import Inbox from './pages/app/Inbox'
import Notices from './pages/app/Notices'
import Account from './pages/app/Account'
import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPlans from './pages/admin/AdminPlans'
import AdminContent from './pages/admin/AdminContent'
import AdminNotices from './pages/admin/AdminNotices'
import AdminPayments from './pages/admin/AdminPayments'
import AdminLogs from './pages/admin/AdminLogs'
import AdminSettings from './pages/admin/AdminSettings'

function Guard({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/entrar" replace />
  if (role === 'superadmin' && user.role !== 'superadmin') return <Navigate to="/app" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/criar-conta" element={<Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
      <Route path="/termos" element={<Terms />} />
      <Route path="/privacidade" element={<Privacy />} />

      <Route
        path="/app"
        element={
          <Guard>
            <AppLayout />
          </Guard>
        }
      >
        <Route index element={<Overview />} />
        <Route path="cursos" element={<Courses />} />
        <Route path="cursos/:id" element={<CoursePlayer />} />
        <Route path="sessoes" element={<Sessions />} />
        <Route path="avisos" element={<Notices />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="conta" element={<Account />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Guard role="superadmin">
            <AdminLayout />
          </Guard>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="planos" element={<AdminPlans />} />
        <Route path="conteudo" element={<AdminContent />} />
        <Route path="avisos" element={<AdminNotices />} />
        <Route path="pagamentos" element={<AdminPayments />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="ajustes" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
