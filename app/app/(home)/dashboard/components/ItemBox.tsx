'use client';

import Item from "./Item";
import { useSelection } from "../../context";
import { useEffect } from "react";

type SecurityLevel = 'low' | 'medium' | 'high';

const securityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

export default function ItemBox() {
  const { selection, ID, setID, getItems, items, folders, searchTerm } = useSelection();

  const matchesSearch = (item: any) =>
    item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase());

    useEffect(() => {
    if (selection === "All Items" || selection === "Password Health") {
      setID("0"); 
    } else {
      setID(selection); 
    }
    }, [selection, items]);

    let filteredBySelection = [];
    if (selection === "All Items") {
      filteredBySelection = items;
    } else if (selection === "Password Health") {
      filteredBySelection = [...items].sort(
        (a, b) => securityOrder[a.securityLevel as keyof typeof securityOrder] - securityOrder[b.securityLevel as keyof typeof securityOrder]
      );
    } else {
      const selectedFolder = folders.find(folder => folder.id === selection);
      if (selectedFolder?.shared) {
        filteredBySelection = items.filter(item => item.folderID === selection && selectedFolder.shared);
      } else {
        filteredBySelection = items.filter(item => item.folderID === selection && !selectedFolder?.shared);
      }
    }
  
  const filteredItems = filteredBySelection.filter(matchesSearch);

  return (
    <div className="px-0 md:px-0 flex flex-col">
      {filteredItems.map((item, index) => (
        <Item
          id={item.id}
          key={index}
          tag={item.tag}
          website={item.website}
          securityLevel={item.securityLevel as SecurityLevel}
          folderID={item.folderID}
          password={item.password}
          username={item.username}
          ownerEmail={item.ownerEmail}
        />
      ))}
    </div>
  );
}
