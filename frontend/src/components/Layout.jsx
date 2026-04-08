// Layout Component - Wrapper for all pages
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, isDark, setIsDark }) {
  return (
    <div className={isDark ? 'dark' : ''}>
      <Header isDark={isDark} setIsDark={setIsDark} />
      <main className="app-main-bg min-h-screen transition-colors">
        {children}
      </main>
      <Footer />
    </div>
  )
}
