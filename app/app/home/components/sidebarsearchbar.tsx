export default function SideBarSearchBar(){
    return(
        <div className="h-[4rem] w-full pl-[1rem] pr-[1rem] pt-[1rem] pb-[1rem]">
            <div className="h-full w-full relative">
                <span className="material-symbols-outlined absolute top-1 left-2">search</span>
                <form action="" className="h-full w-full">
                    <input className="border-2 border-black h-full w-full rounded-3xl pl-[2rem] outline-none" type="text" placeholder="Search"/>
                </form>
            </div>
        </div>
    );
}