'use client'

type props = {
    label : string;
};

export default function Label({ label } : props){
    return(
        <div className="w-full flex pl-[1rem] pr-[1rem]">
            <label className="w-full border-b-1 text-xl border-gray-500">
                {label}
            </label>
        </div>
    );
}