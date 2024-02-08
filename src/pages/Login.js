import React from "react";
import { Link } from "react-router-dom";

export default function Login() 
{
  document.title = "Dagligvare - logg inn";

  return (
    <>
      <h2 align="center">Logg inn</h2>

      <form >
        <table align="center">
          <tbody>
            <tr>
              <td><label htmlFor="user">Brukernavn</label></td>
              <td><input type="text" id="user" autoFocus></input></td>
            </tr>
            <tr>
              <td><label htmlFor="pwd">Passord</label></td>
              <td><input type="password" id="pwd"></input></td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td><LoginBn/>   
              <CancelBn/></td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td>Ingen bruker?<br/><Link to="/NewUser">Registrer deg her</Link></td>
            </tr>
          </tbody>
        </table>
      </form> 
    </> 
  )
};

function LoginBn()
{
    var handleLogin = (event) =>
    {
        event.preventDefault();

        let username = document.getElementById("user").value;
        let password = document.getElementById("pwd").value;
    
        if (username.length === 0 || password.length === 0)
        {
            alert("Brukernavn og passord må oppgis");
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

        fetch("/login?username=" + username + "&password=" + password,
        { 
            method: "GET",
            headers: {
                "accept":"application/json"
                }
        })
        .then(status)
        .then(json)
        .then(data =>
        {
            document.cookie = "username=" + username + "; expires=; path=/";
            document.cookie = "usertype=" + data.message[0].usertype + "; expires=; path=/";
            document.cookie = "usertypename=" + data.message[0].usertypename + "; expires=; path=/";
            window.location.replace("/");
        }
        )
        .catch(error => {alert("Pålogging for bruker " + username + " mislyktes. Prøv på nytt!")})
        ; 
    }
    return <button onClick={handleLogin}>Logg inn</button>
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