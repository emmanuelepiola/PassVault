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
  const { selection, ID, setID, getItems, items, searchTerm } = useSelection();

  const matchesSearch = (item: any) =>
    item.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase());

    // Aggiorna ID in base a selection
    useEffect(() => {
    if (selection === "All Items" || selection === "Password Health") {
      setID("0"); // Imposta ID su "0" per "All Items" o "Password Health"
    } else {
      setID(selection); // Imposta ID uguale a selection quando è un ID di cartella
    }
    }, [selection]);
  
  // Filtra i dati in base a selection e ID
  const filteredBySelection =
    selection === "All Items"
      ? items
      : selection === "Password Health"
      ? [...items].sort((a, b) => securityOrder[a.securityLevel] - securityOrder[b.securityLevel])
      : selection === "Folder"
      ? items.filter(item => String(item.folderID) === String(ID)) // Filtra per ID della cartella
      : selection === "Shared Folder"
      ? items.filter(item => item.sharedFolder === true) // Filtra per cartelle condivise
      : [];
  
  const filteredItems = filteredBySelection.filter(matchesSearch);
    console.log("Filtered Items:", filteredItems); // Log degli elementi filtrati

  return (
    <div className="px-0 md:px-0 flex flex-col gap-5">
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
