"use client"
interface Props {
  className?: string;
}
export default function RevenueComponent({ className }: Props) {
  return (
    <div className={`${className} p-4 pr-10`}>
      <div className="bg-[#F7F7F7] h-full w-full shadow-[0px_2px_4px_rgba(0,0,0,0.25)] px-2 py-4 rounded-lg">
        <div className="pb-2 border-b border-[#adadad]">
          <h2 className="font-medium text-[20px] ">Revenue</h2>
          <div>Function under development</div>
        </div>
        <div className="pt-2">
          <h2 className="font-medium text-[20px] ">Notification</h2>
          <div>Function under development</div>
        </div>
      </div>
    </div>
  );
}
