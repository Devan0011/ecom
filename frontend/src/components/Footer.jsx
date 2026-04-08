import { Link } from 'react-router-dom'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react'

const footerCategories = ['Phones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Cameras']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-[#0d172a] text-slate-300 dark:border-slate-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white">E</div>
            <h3 className="text-lg font-semibold text-white">ElectroHub</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            A modern electronics marketplace with trusted delivery, smart filters, and a full admin dashboard.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-teal-300">Home</Link></li>
            <li><Link to="/products" className="hover:text-teal-300">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-teal-300">Wishlist</Link></li>
            <li><Link to="/orders" className="hover:text-teal-300">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Categories</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {footerCategories.map((category) => (
              <li key={category}>
                <Link to={`/products?category=${encodeURIComponent(category)}`} className="hover:text-teal-300">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={14} /> hello@electrohub.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Bengaluru, India</li>
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 bg-white/5 p-2 hover:border-teal-400/50 hover:text-teal-300"><Twitter size={14} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 bg-white/5 p-2 hover:border-teal-400/50 hover:text-teal-300"><Facebook size={14} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 bg-white/5 p-2 hover:border-teal-400/50 hover:text-teal-300"><Instagram size={14} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-lg border border-white/15 bg-white/5 p-2 hover:border-teal-400/50 hover:text-teal-300"><Linkedin size={14} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        <p>© {year} ElectroHub. All rights reserved.</p>
      </div>
    </footer>
  )
}
