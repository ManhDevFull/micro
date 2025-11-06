import { useState } from "react";
import { VscAdd, VscChromeMinimize } from "react-icons/vsc";
import { motion, AnimatePresence } from "framer-motion";
// type categoryProps = {
//     _id: number;
//     name_category: string;
// }
type AccordionProps = {
    title: string;
    children: React.ReactNode;
    // category: categoryProps;
}
export default function AccordionItem({ title, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="pr-10">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between py-2 border-b-[1px] border-[#0000001F] cursor-pointer"
            >
                <p className="text-[20px] font-bold">{title}</p>
                <span className="relative w-[20px] h-[20px] flex items-center justify-center">
                    <span
                        className={`absolute transition-all duration-300 transform ${isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                            }`}
                    >
                        <VscAdd />
                    </span>

                    <span
                        className={`absolute transition-all duration-300 transform ${isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                            }`}
                    >
                        <VscChromeMinimize />
                    </span>
                </span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}