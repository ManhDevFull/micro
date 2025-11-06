import NewLabel from "./NewLabel";

type productProps = {
    img: string;
    isNew: boolean;
}

export default function Product({
    img,
    isNew }: productProps) {
    return (
        <div className="w-auto p-2 bg-[#FAFAFA] h-auto flex justify-center items-center rounded-3xl">
            <div className=" bg-[#ECEDEF] rounded-3xl p-6 sm:p-14 lg:p-10 relative">
                <img className="w-[150px] h-[160px] sm:w-[150px] sm:h-[200px] md:w-[180px] md:h-[200px] lg:w-[200px] lg:h-[160px] xl:w-[300px] xl:h-[250px]" src={img} alt="" />
                {
                    isNew && <NewLabel className="absolute top-0 left-0" />
                }
            </div>
        </div>
    )
}