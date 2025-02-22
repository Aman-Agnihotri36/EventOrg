'use client'

import { headerLinks } from "@/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"


function Navitems() {

    const pathname = usePathname()
    return (
        <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
            {headerLinks.map((link) => {
                const isActive = pathname === link.route
                return (
                    <li key={link.route} className={`${isActive && 'text-primary-500'} flex-center font-medium text-[16px] whitespace-nowrap`}>
                        <Link href={link.route}>{link.label}</Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default Navitems
