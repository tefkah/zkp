import Link from 'next/link'

const Nav = () => (
  <nav className="h-14 flex items-center z-10 bg-white border-b border-black sticky top-0 text-xl p-4">
    <Link href="/">Home</Link>
  </nav>
)
export default Nav
