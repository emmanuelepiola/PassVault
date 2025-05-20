'use client';

import Item from "./Item";
import { useSelection } from "../../context";

type SecurityLevel = 'low' | 'medium' | 'high';

const securityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function ItemBox() {
  const { selection, ID, items, searchTerm } = useSelection();

  const matchesSearch = (item: any) =>
    item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredBySelection = selection === "All Items"
    ? items
    : selection === "Password Health"
    ? [...items].sort((a, b) => securityOrder[a.securityLevel] - securityOrder[b.securityLevel])
    : ID === "0"
    ? []
    : items.filter(item => item.folderID === selection);

  const filteredItems = filteredBySelection.filter(matchesSearch);

  return (
    <div className="w-full h-full pr-[2rem] pl-[2rem] flex flex-col gap-4">
      {filteredItems.map((item, index) => (
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
