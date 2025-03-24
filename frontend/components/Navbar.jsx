import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl font-extrabold">
          BestBank
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/register" className="font-bold">
              Create an Account
            </Link>
          </li>
          <li>
            <Link href="/login" className="font-bold">
              Log In
            </Link>
          </li>
        </ul>
      </div>
    </div>
  
  )
}
