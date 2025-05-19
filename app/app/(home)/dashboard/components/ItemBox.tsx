'use client'

import Item from "./Item";
import { useSelection } from "../../context";

type SecurityLevel = 'low' | 'medium' | 'high';

type ItemType = {
  tag: string;
  website: string;
  type: string;
  securityLevel: SecurityLevel;
  folderID: number;
};

const items: ItemType[] = [
  { tag: "Amazon", website: "Amazon.com", type: "Shopping", securityLevel: "medium", folderID: 1 },
  { tag: "Facebook", website: "Fecebook.com", type: "Social", securityLevel: "low", folderID: 0 },
  { tag: "GitHub", website: "GitHub.com", type: "Dev", securityLevel: "high", folderID: 2 },
  { tag: "Netflix", website: "Netflix.com", type: "Entertainment", securityLevel: "medium", folderID: 1 },
];

// Mappa per ordine di sicurezza dal più basso (1) al più alto (3)
const securityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function ItemBox() {
  const { selection , ID } = useSelection();

  const sortedItems = selection === "All Items"
  ? items 
  : selection === "Password Health"
  ? [...items].sort((a, b) => securityOrder[a.securityLevel] - securityOrder[b.securityLevel])
  : ID === "0" 
  ? []
  : items.filter(item => item.folderID.toString() === selection);



  return (
    <div className="w-full h-full pr-[2rem] pl-[2rem] flex flex-col gap-4">
      {sortedItems.map((item, index) => (
        <Item
          key={index}
          tag={item.tag}
          website={item.website}
          type={item.type}
          securityLevel={item.securityLevel}
          folderID={item.folderID}
        />
      ))}
    </div>
  );
}
