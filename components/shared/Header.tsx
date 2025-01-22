import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import Navitems from "./Navitems"
import MobileNav from "./MobileNav"


function Header() {
    return (
        <div>
            <header className="w-full border-b">
                <div className="wrapper flex items-center justify-between">
                    <Link href='/' className="w-36">
                        <Image src='/assets/images/logo.svg' width={128} height={38} alt="Evently logo" />
                    </Link>

                    <SignedIn>
                        <nav className="md:flex-between hidden w-full max-w-xs">
                            <Navitems />
                        </nav>

                    </SignedIn>

                    <div className="flex w-32 justify-end gpa-3">
                        <SignedIn>
                            <UserButton signInUrl='/' />
                            <MobileNav />
                        </SignedIn>

                        <SignedOut>
                            <Button asChild className="rounded-full size='lg">
                                <Link href='/sign-in'>
                                    Login
                                </Link>
                            </Button>
                        </SignedOut>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header
