'use client'

import Item from "./Item";
import { useSelection } from "../../context";

type SecurityLevel = 'low' | 'medium' | 'high';

type ItemType = {
  id: string;
  tag: string;
  website: string;
  securityLevel: SecurityLevel;
  folderID: string;
  password: string;
  username: string;
};

const securityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function ItemBox() {
  const { selection , ID , items} = useSelection();

  const sortedItems = selection === "All Items"
  ? items 
  : selection === "Password Health"
  ? [...items].sort((a, b) => securityOrder[a.securityLevel] - securityOrder[b.securityLevel])
  : ID === "0" 
  ? []
  : items.filter(item => item.folderID === selection);

  return (
    <div className="w-full h-full pr-[2rem] pl-[2rem] flex flex-col gap-4">
      {sortedItems.map((item, index) => (
        <Item
          id={item.id}
          key={index}
          tag={item.tag}
          website={item.website}
          securityLevel={item.securityLevel}
          folderID={item.folderID}
          password={item.password}
          username={item.username}
        />
      ))}
    </div>
  );
}
