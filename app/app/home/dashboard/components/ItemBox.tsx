import PasswordItem from "./Item";

type SecurityLevel = 'low' | 'medium' | 'high';

type Item = {
  tag: string;
  type: string;
  folder: string;
  securityLevel: SecurityLevel;
};

export default function ItemBox() {
  const items: Item[] = [
    { tag: "Amazon", type: "Password", folder: "Shopping", securityLevel: "medium" },
    { tag: "0871", type: "Credit Card", folder: "", securityLevel: "high" },
    { tag: "Facebook", type: "Password", folder: "Social", securityLevel: "low" },
    { tag: "GitHub", type: "Password", folder: "Dev", securityLevel: "high" },
    { tag: "Netflix", type: "Password", folder: "Entertainment", securityLevel: "medium" },
  ];

  return (
    <div className="w-full h-full pr-[2rem] pl-[2rem] flex flex-col gap-4">
      {items.map((item, index) => (
        <PasswordItem
          key={index}
          tag={item.tag}
          type={item.type}
          folder={item.folder}
          securityLevel={item.securityLevel}
        />
      ))}
    </div>
  );
}
