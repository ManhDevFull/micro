import { IoHomeOutline } from "react-icons/io5";
import { GrPrevious } from "react-icons/gr";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function NavigationPath() {
    const navs = [
        {
            key: 'Home',
            name: 'Home',
            link: '/'
        },
        {
            key: 'Cart',
            name: 'Cart',
            link: '/Cart'
        },
        {
            key: 'Info',
            name: 'Customer Info',
            link: '/Customer-Info'
        },
        {
            key: 'Pay',
            name: 'Shippng & Payments',
            link: '/Shippng-Payments'
        },
        {
            key: 'Confirm',
            name: 'Product Confirmation',
            link: '/track-order'
        }
    ]
    const path = usePathname();
    console.log(path)
    return (
        <div className="w-full flex items-center border-b-2 border-gray-100 !px-10 lg:!px-40 py-2 ">
            <div className="flex gap-2 items-center ">
                <div className="">
                    <IoHomeOutline size={20} />
                </div>
                {
                    navs.map((nav, index) => (
                        <div key={nav.key} className="flex items-center">
                            {index > 0 && <GrPrevious className="hidden sm:block" />}
                            <Link
                                href={nav.link}
                                className={nav.link === path ? '!text-blue-700' : ''}
                            >
                                {nav.name}
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}