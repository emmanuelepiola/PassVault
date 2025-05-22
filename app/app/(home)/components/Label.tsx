'use client'

type props = {
    label : string;
};

export default function Label({ label } : props){
    return(
        <div className="w-full md:h-auto md:border-0 border-b-1 border-gray-500 h-[3rem] flex items-center py-[2rem] md:py-0 md:pl-[1rem] md:pr-[1rem]">
            <label className="w-full md:px-0 px-4 md:border-b-1 md:text-xl text-3xl md:border-gray-500">
                {label}
            </label>
        </div>
    );
}