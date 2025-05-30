'use client'


type Props = {
  label: string;
};

export default function Label({ label }: Props) {
  const handleClose = () => {
    window.dispatchEvent(new Event('hide-sidebar'));
  };

  return (
    <div className="w-full border-0 h-[3rem] flex items-center py-[1rem] pl-[1rem] pr-[1rem] relative">
      <label className="w-full px-0 border-b-1 text-xl border-gray-500">
        {label}
      </label>
    </div>
  );
}