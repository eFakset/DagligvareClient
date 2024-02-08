import React from "react";
import { Outlet } from "react-router-dom";
import MenuItemLeft from "../pagelets/MenuItemLeft";
import MenuItemLoginOut from "../pagelets/MenuItemLoginOut";
import MenuItemRegister from "../pagelets/MenuItemRegister";
import MenuItemsRestricted from "../pagelets/MenuItemsRestricted";

export default function Layout()
{
    const [selectedItemName, setSelectedItemName] = React.useState("/");

    let currentCookie = document.cookie;
    let cookievalues = currentCookie.split(";");

    let username = "Gjest";
    let usertypename = "Gjest";

    if (cookievalues.length === 3)
    {
        username = cookievalues[0].substring(9);
        usertypename = cookievalues[2].substring(14);
    }

  return (
    <>
        <table>
            <tbody>
            <tr>
                <td valign="top">
                    <nav>
                        <table cellPadding="5">
                            <tbody>
                                <tr><MenuItemLeft itemName="/" itemText="Hjem" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <tr><MenuItemLeft itemName="/stores" itemText="Butikker" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <tr><MenuItemLeft itemName="/articlecategories" itemText="Varegrupper" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <tr><MenuItemLeft itemName="/items" itemText="Varer" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <tr><MenuItemLeft itemName="/customers" itemText="Kunder" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <tr><MenuItemLeft itemName="/sales" itemText="Gjennomførte salg" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
                                <MenuItemRegister username={username} usertypename={usertypename} selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/>
                                <MenuItemsRestricted usertypename={usertypename} selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/>
                                <MenuItemLoginOut username={username} usertypename={usertypename} selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/>
                            </tbody>  
                        </table>
                    </nav>
                </td>
                <td width="1200" valign="top">
                    <Outlet />
                </td>

            </tr>
            </tbody>
        </table>
    </>
    )
}