import React from "react";
import { Link } from "react-router-dom";

export default function MenuItemLeft({itemName, itemText, selectedItemName, setSelectedItemName}) 
{
    const handleSelection = (event) =>
    {
        let newItem = itemName;
        selectedItemName = newItem;
        setSelectedItemName(selectedItemName);
    }

    if (itemName === selectedItemName)
        return <td className="navigationSelected">{itemText}</td>
    else 
        return <td className="navigation"><Link onClick={handleSelection} className="navigation" to={itemName}>{itemText}</Link></td>
}