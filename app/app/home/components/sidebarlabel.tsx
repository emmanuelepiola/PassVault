
type props = {
    label : string;
};

export default function SideBarLabel({ label } : props){
    return(
        <div className="w-full flex pl-[1rem] pr-[1rem]">
            <label className="w-full border-b-2 border-black">
                {label}
            </label>
        </div>
    );
}