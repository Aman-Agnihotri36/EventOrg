import {
    Sheet,
    SheetContent,

    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import Navitems from "./Navitems"





function MobileNav() {
    return (
        <nav className=" md:hidden ">
            <Sheet>
                <SheetTrigger className="align-middle">
                    <Image src='/assets/icons/menu.svg' alt="menu" width={24} height={24} className="cursor-pointer" />
                </SheetTrigger>
                <SheetContent className="flex flex-col gap  bg-white md:hidden">
                    <Image src='/assets/images/logo.svg' alt="logo" width={128} height={38} />
                    <Separator className="border-gray-50" />
                    <Navitems />
                </SheetContent>
            </Sheet>

        </nav>
    )
}

export default MobileNav
