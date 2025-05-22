import AddButton from "./AddButton";
import { useSelection } from '../../context'

type props = {
    label: string;
};

export default function Label({ label }: props){
    return(
        <div className="mr-[2rem] ml-4 md:ml-[2rem] pt-[1.8rem] pb-[2rem] relative">
            <AddButton/>
            <label className="w-full block pb-0 text-4xl">{label}</label>
        </div>
    );
}
