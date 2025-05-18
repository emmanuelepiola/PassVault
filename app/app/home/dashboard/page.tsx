import Label from "./components/Label"
import ItemBox from "./components/ItemBox";
import FieldsLabels from "./components/FieldsLabels"

export default function Dashboard(){
    return(
        <div className="h-full w-full">
            <Label label="Dashboard"/>
            <FieldsLabels/>
            <ItemBox/>
        </div>
    );
}