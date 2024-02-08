import React from "react";
import MenuItemLeft from "./MenuItemLeft";

export default function MenuItemRegister({username, usertypename, selectedItemName, setSelectedItemName}) 
{
    const [storeId, setStoreId] = React.useState(-1);
    const [registerId, setRegisterId] = React.useState(-1);

    React.useEffect(() =>
	{
        fetch("/kasse4bruker?username=" + username)
          .then((res) => res.json())
          .then((data) => 
          {
            if (data.message[0])
            {
                setStoreId(data.message[0].storeId);
                setRegisterId(data.message[0].registerId);
            }
          }); 
    }, [username]);

    if (storeId < 0 || registerId < 0)
        return <></>
    else
        return <tr><MenuItemLeft itemName="/register" itemText="Kasse" selectedItemName={selectedItemName} setSelectedItemName={setSelectedItemName}/></tr>
}