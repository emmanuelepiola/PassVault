'use client'

import Button from "./Button";
import Label from "./Label";

{/* Section for the buttons in the sidebar */}

type Button = {
  label: string;
  icon: string;
};

type Props = {
  label: string;
  buttons: Button[];
};

export default function Section({ label, buttons }: Props) {
  return (
    <div className="w-full text-l pt-[1rem] md:pt-0">
      <Label label={label} />
      {buttons.map((btn,i) => (
        <Button
          key={i}
          label={btn.label}
          icon={btn.icon}
        />
      ))}
    </div>
  );
}
