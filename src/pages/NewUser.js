import React from "react";
import Item from "../items/Item.js";

export default function NewUser() 
{
    document.title = "Dagligvare Ny bruker";

    const [userTypes, setUserTypes] = React.useState(null);
 
    React.useEffect(() => {
        fetch("/brukertyper")
          .then((res) => res.json())
          .then((data) => setUserTypes(data.message));
      }, []);

    

    return (
      <>
        <h2 align="center">Registrer ny bruker</h2>

        <form>
            <table align="center">
                <tbody>
                <tr>
                    <td><label htmlFor="user">Brukernavn</label></td>
                    <td><input id="user" autoFocus></input></td>
                </tr>
                <tr>
                    <td><label htmlFor="pwd">Passord</label></td>
                    <td><input type="password" id="pwd"></input></td>
                </tr>
                <tr>
                    <td><label htmlFor="pwd2">Gjenta passord</label></td>
                    <td><input type="password" id="pwd2"></input></td>
                </tr>
                {!userTypes ? "Loading..." : <UserTypeCb userTypes={userTypes}/>}
                <tr>
                    <td>&nbsp;</td>
                    <td><RegisterBn />
                    <CancelBn/></td>
                </tr>
                </tbody>
            </table>
        </form> 
      </> 
    )
};

function UserTypeCb({userTypes})
{
    const options = [];

    let defaultUserType = new Item(0, "...", false);
    options.push(<ItemOption item={defaultUserType} key={defaultUserType.id}/>);   
    for (let i = 0; i < userTypes.length; i++) 
    {
        let userType = userTypes[i];
        if (userType.id === "A" || userType.id === "G")
            continue;
        options.push(<ItemOption item={userType} key={userType.id}/>);   
    };

    return (
        <tr> 
        <td>
            <label htmlFor="usertypecb">Brukertype</label></td><td>
            <select id="usertypecb">
                {options}
            </select>
        </td>
        </tr>
    )
}

function ItemOption({item})
{
    return <option id={item.id}>{item.name}</option>
}

function RegisterBn()
{
  var handleRegister = (event) =>
  {
        event.preventDefault();

        let username = document.getElementById("user").value;
        let password = document.getElementById("pwd").value;
        let password2 = document.getElementById("pwd2").value;
        let selUsertype = document.getElementById("usertypecb");
        let userTypeIdx = selUsertype.selectedIndex;

        if (username.length === 0 || password.length === 0 || password2.length === 0)
        {
            alert("Brukernavn og passord må oppgis");
            return;
        }

        if (password !== password2)
        {
            alert("Passord må oppgis 2 ganger");
            return;
        }

        if (userTypeIdx < 1)
        {
            alert("Brukertype må velges!");
            return;
        }

        const status = response => 
        {
            if (response.status >= 200 && response.status < 300) 
            {
                return Promise.resolve(response)
            }
            return Promise.reject(new Error(response.statusText))
        }
        
        const json = response => response.json()

        let usertype = selUsertype.options[userTypeIdx].id;

        var params = '{"User":{"userName":"' + username + '", "password":"' + password + '", "userType":"' + usertype + '"}}';

        fetch("/nybruker",
        { 
            method: "PUT",
            headers: {
                    "content-type":"application/json"
                    ,"accept":"application/json"
                    },
            body: params
        })
        .then(status)
        .then(json)
        .then(data => {
            document.cookie = "username=" + username + "; expires=; path=/";
            document.cookie = "usertype=" + usertype + "; expires=; path=/";
            document.cookie = "usertypename=" + selUsertype.options[userTypeIdx].value + "; expires=; path=/";
            window.location.replace("/");
        })
        .catch(error => {alert("Feil ved ny bruker: " + error)})
        }

    return (
        <button onClick={handleRegister}>Registrer</button>
    )
}

function CancelBn()
{
    var handleCancel = (event) =>
    {
        event.preventDefault();
        window.location.replace("/");
    }

    return <button onClick={handleCancel}>Avbryt</button>
}