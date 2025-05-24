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

    // Aggiorna ID in base a selection
    useEffect(() => {
    if (selection === "All Items" || selection === "Password Health") {
      setID("0"); // Imposta ID su "0" per "All Items" o "Password Health"
    } else {
      setID(selection); // Imposta ID uguale a selection quando è un ID di cartella
    }
    }, [selection]);
    
    // Filtra gli elementi in base alla selezione
    let filteredBySelection = [];
    if (selection === "All Items") {
      filteredBySelection = items;
    } else if (selection === "Password Health") {
      filteredBySelection = [...items].sort(
        (a, b) => securityOrder[a.securityLevel] - securityOrder[b.securityLevel]
      );
    } else {
      // Controlla se la selezione è una cartella condivisa o normale
      const selectedFolder = folders.find(folder => folder.id === selection);
      if (selectedFolder?.shared) {
        // Filtra gli elementi per cartelle condivise
        filteredBySelection = items.filter(item => item.folderID === selection && selectedFolder.shared);
      } else {
        // Filtra gli elementi per cartelle normali
        filteredBySelection = items.filter(item => item.folderID === selection && !selectedFolder?.shared);
      }
    }
  
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
