import React from "react";
import { Link } from "react-router-dom";

export default function MenuItemLeft({itemName, itemText, selectedItemName, setSelectedItemName}) 
{
    const handleSelection = (event) =>
    {
        let newItem = itemName;
        selectedItemName = newItem;
        setSelectedItemName(selectedItemName);
        sessionStorage.setItem("itemname", newItem);
    }

    if (itemName === sessionStorage.getItem("itemname"))
        return <td className="navigationSelected">{itemText}</td>
    else 
        return <td className="navigation"><Link onClick={handleSelection} className="navigation" to={itemName}>{itemText}</Link></td>
}