import React from "react";
import { Link } from "react-router-dom";
import MenuItemLeft from "./MenuItemLeft";

export default function MenuItemLoginOut({username, usertypename, selectedItemName, setSelectedItemName}) 
{
    var handleLogout = (event) =>
    {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "usertype=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "usertypename=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
        window.location.replace("/");
    }

    if (usertypename === "Gjest")
        return <tr><MenuItemLeft itemName="/login" itemText="Logg inn" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
    else
        return (
            <tr>
                <td>
                    {username} ({usertypename})<br/>
                    <Link className="auth" onClick={handleLogout}>Logg ut</Link>
                </td>
            </tr>
        )
}