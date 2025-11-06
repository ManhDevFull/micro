"use client";
import Back from "@/components/ui/Back";
import BackNavigation from "@/components/ui/BackNavigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdGrid } from "react-icons/io";
import { MdViewList } from "react-icons/md";

export default function ShowItems() {
    const [showing, setShowing] = useState('grid');
    const [quantity, setQuantity] = useState(0);
    useEffect(()=>{
        const fetchQuantity = async ()=>{
            const quanRes = await axios.get('http://localhost:5000/product/1');  
            setQuantity(quanRes.data);       
        }
        fetchQuantity();
    })
    return (
        <div className="w-full px-4 sm:px-16 py-10">
            <div className="flex items-center gap-28">
                <div className="flex items-center gap-4">
                    <Back/>
                    <p className="text-[18px] font-bold inline-block">All Products</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2">
                        <IoMdGrid onClick={() => setShowing('grid')} className={`${showing === 'grid' ? 'text-[#1B4B66]' : 'text-[#BBBBBB]'}`} size={showing === 'grid' ? 30 : 28} />
                        <MdViewList onClick={() => setShowing('short')} className={`${showing === 'short' ? 'text-[#1B4B66]' : 'text-[#BBBBBB]'}`} size={showing === 'short' ? 30 : 28} />
                    </div>
                    <p>
                        Showing 1 - 40 of {quantity} items
                    </p>
                </div>
            </div>
            
        </div>
    )
}