import AddButton from "./AddButton";

type props = {
    label: string;
};

export default function Label({ label }: props){
    return(
        <div className="ml-[2rem] mr-[2rem] pt-[1.8rem] pb-[1rem] relative">
            <AddButton label="Item"/>
            <label className="w-full block pb-0 text-4xl">{label}</label>
        </div>
    );
}