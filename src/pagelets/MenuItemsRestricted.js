import React from "react";
import MenuItemLeft from "./MenuItemLeft";

export default function Restricted({usertypename, selectedItemName, setSelectedItemName}) 
{
  if (usertypename === 'Administrator')
        return (
            <>
                <tr><MenuItemLeft itemName="/municipalities" itemText="Kommuner" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
            </>
        )
  else
        return <></>    
}