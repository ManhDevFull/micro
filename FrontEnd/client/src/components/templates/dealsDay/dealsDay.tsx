import BtnBuyNow from "@/components/ui/BtnBuyNow";
import FlashDealBar from "@/components/ui/FlashDealBar";
import Product from "@/components/ui/Product";
import { link } from "fs";
import { Flash } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parse } from "date-fns";
import DealTime from "@/components/ui/DealTime";
import { BtnViewAll } from "@/components/ui/BtnViewAll";
export default function DealsDay() {
    const products = [
        {
            name: 'abc',
            endTime: parse("10/09/2025 23:59:59", "dd/MM/yyyy HH:mm:ss", new Date()),
            img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
            price: 800
        },
        {
            name: 'bcd',
            endTime: parse("12-09-2025 21:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
            img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
            price: 300
        },
        {
            name: 'abc',
            endTime: parse("13-09-2025 2 3:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
            img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
            price: 400
        },
        {
            name: 'abc',
            endTime: parse("14-09-2025 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date()),
            img: 'https://res.cloudinary.com/do0im8hgv/image/upload/v1756557032/0f6678f8-f18d-4b7c-a79a-1c18e2828f05.png',
            price: 400
        }

    ]
    const router = useRouter();
    return (
        <div className="w-ful px-4 sm:px-16 py-4">
            <div className="w-full sm:flex sm:justify-between sm:items-center gap-2">
                <div className="flex items-center">
                    <h2 className="sm:text-[18px] md:text-[24px] font-bold">TODAY'S DEALS OF THE DAY</h2>
                </div>
                <div className="sm:flex sm:pt-0 sm:gap-2 sm:justify-between items-center">
                    <p className="font-medium hidden lg:block">Deals ends in</p>
                    <div className=" flex justify-between items-center gap-1 lg:gap-4">
                        <DealTime unit={{ day: 'd', hour: 'h', min: 'm', sec: 's' }} endTime={parse("2025-11-07 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date())} />
                        <BtnViewAll className={'sm:px-6 !p-2'} />
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 justify-items-center gap-1 sm:grid-cols-2 sm:gap-2 sm:items-center lg:flex lg:gap-4 lg:justify-around lg:flex-nowrap pt-8">
                {
                    products.map((product, index) => (
                        <div key={index}
                            className={`cursor-pointer w-[160px] sm:w-[250px] md:w-[300px]`}
                            onClick={() => router.push('')}
                        >
                            <Product img={product.img} isNew={true} />
                            <FlashDealBar endTime={product.endTime} />
                            <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold">{product.name}</p>
                            <BtnBuyNow price={product.price} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

