import Link from 'next/link'

const Nav = () => (
  <nav className="h-14 bg-rose-50 z-10 sticky top-0 text-xl w-full  gap-6 flex items-center p-4 border-b border-black">
    <Link href="/">Home</Link>
    <Link href="/note/Definitions%2FThe%20Fractional%20Quantum%20Hall%20Effect%20(FQHE)">
      Notes
    </Link>
    <Link href="note/Chapters%2FI.%20Introduction%2FIntro">Thesis</Link>
  </nav>
)
export default Nav
