export default function FieldsLabels(){
    return(
        <div className="pl-0 pr-0 md:pl-[1.5rem] md:pr-[1.5rem]">
            <div className="flex justify-between px-8 pb-4 w-full h-[2rem] border-b border-gray-200">
                <div className="flex justify-between w-full">
                    <label className="text-gray-600 font-medium w-1/4 text-sm uppercase tracking-wider">Tag</label>
                    <label className="hidden md:block text-gray-600 font-medium w-1/4 text-sm uppercase tracking-wider">
                        Website
                    </label>
                    <label className="text-gray-600 font-medium w-1/4 text-sm uppercase tracking-wider">Security</label>
                    <span className="material-symbols-outlined md:ml-0 ml-6">
                        arrow_drop_down
                    </span>
                </div>
            </div>
        </div>
    );
}
