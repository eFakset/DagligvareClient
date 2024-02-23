import React from "react";
const Item = require("../items/Item.js").default;


export default function Customers() 
{
    document.title = "Dagligvare - kunder";

    const [changeflg, setChangedflg] = React.useState(0);
    const [customers, setCustomers] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);

    const status = response =>
    {
        if (response.status >= 200 && response.status < 300)
        {
            return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText + ", http error " + response.status))
    }

    React.useEffect(() =>
	{
        fetch("/kunder")
            .then(status)
            .then((res) => res.json())
            .then((data) => setCustomers(data.message)) 
            .catch(error => setErrorMsg(error.message))
        }, [changeflg]);

    if (errorMsg)
        return <h3>Error: {errorMsg}</h3>
    else
        return (    
            <div>
                <h2 align="center">Kunder</h2>
                {!customers ? "Loading..." : <CustomerTable customers={customers} changeflg={changeflg} setChangedflg={setChangedflg}/>}
            </div>
        )
}  

function CustomerTable({ customers, changeflg, setChangedflg})
{
    var isAdministrator = false;
    let currentCookie = document.cookie;
    let cookievalues = currentCookie.split(";");
  
    if (cookievalues.length === 3)
    {
        let usertypename = cookievalues[2].substring(14);
        if (usertypename === 'Administrator')
            isAdministrator = true;
    }

    const [disabled, setDisabled] = React.useState(true);

    var rows = [];
    customers.forEach((customer) => 
	{
        rows.push(<CustomerRow isAdministrator={isAdministrator} customer={customer} key={customer.id} disabled={disabled} setDisabled={setDisabled} changeflg={changeflg} setChangedflg={setChangedflg}/>);
    });
  
    return (
        <form>
            <EditRow isAdministrator={isAdministrator} disabled={disabled} setDisabled={setDisabled} changeflg={changeflg} setChangedflg={setChangedflg}/>
            <p></p>
            <table cellPadding="5" align="center">
                <thead>
                    <tr>
                        <th>Fylke</th>
                        <th>Kommune</th>
                        <th>Kunde</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </form>
    );
}

function EditRow({isAdministrator, disabled, setDisabled, changeflg, setChangedflg})
{
    const [data, setData] = React.useState(null);

    React.useEffect(() =>
	{
        fetch("/kommuner")
          .then((res) => res.json())
          .then((data) => setData(data.message)); 
    }, []);

    if (isAdministrator) 
        return (
            <div align="center">
                <NewBn disabled={disabled} setDisabled={setDisabled}/>
                <input type="hidden" id="custid"/>
                <label htmlFor="custname">   Kundenavn: </label> 
                <input id="custname" name="custname" type="text" disabled={disabled}/>
                {!data ? "Loading..." : <MunicipalityCb municipalities={data} disabled={disabled} />}
                <OKBn disabled={disabled} setDisabled={setDisabled} changeflg={changeflg} setChangedflg={setChangedflg}/>
                <CancelBn disabled={disabled} setDisabled={setDisabled}/>
            </div>
        )
        else
            return <></>
}

function MunicipalityCb({municipalities, disabled})
{
    const options = [];
    municipalities.forEach((JSONMunicipality) =>
    {
        let municipality = new Item(JSONMunicipality.id, JSONMunicipality.name);
        options.push(<MunicipalityOption municipality={municipality} key={municipality.id}/>);   
    });

    return (
        <span> 
            <label htmlFor="municb">  Kommune:  </label>
            <select id="municb" disabled={disabled}>
                {options}
            </select>
        </span>
    )
}
 
function MunicipalityOption({municipality})
{
    return <option id={municipality.id}>{municipality.name}</option>
}

function NewBn({disabled, setDisabled})
{
    var handleNew = (event) =>
    {
        event.preventDefault(); 
        document.getElementById("custid").value = -1;
        setDisabled(!disabled);
    }

    let newDisabled = !disabled;

    return (
        <button id="newBn" onClick={handleNew} disabled={newDisabled}>
            <img src="../NewData.gif" alt="Ny kunde" width="15" height="15"/>
        </button>
    )
}

function OKBn({disabled, setDisabled, changeflg, setChangedflg})
{
    var handleOK = (event) =>
    {
        event.preventDefault(); 

        let customerId = document.getElementById("custid").value;
        let action = customerId < 0 ? "/nykunde" : "/oppdaterkunde";

        let customerName = document.getElementById("custname").value;
        let selMunicipality = document.getElementById("municb");
        let municipalityIdx = selMunicipality.selectedIndex;

        if (customerName == null || customerName === "")
        {
            alert("Kundenavn må fylles ut!");
            return;
        }

        if (municipalityIdx < 1)
        {
            alert("Kommune må velges!");
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

        var params = '{"Customer":{"customerId":"' + customerId + '", "customerName":"' + customerName + '", "municipalityNo":"' + selMunicipality.options[municipalityIdx].id + '"}}';

//        document.getElementById("debug").value = params;

        fetch(action,
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
                let newChangeFlag = changeflg + 1;
                changeflg = newChangeFlag;
                setChangedflg(changeflg);
                document.getElementById("custname").value = "";
                document.getElementById("municb").selectedIndex = 0;
            })
           .catch(error => {alert("Feil ved ny kunde: " + error)})
  
        setDisabled(!disabled);
    }

    return (
        <span>
            <button id="okBn" onClick={handleOK} disabled={disabled}>
                Lagre
            </button>
            <input type="hidden" width="150" id="debug" readOnly/>
        </span>
    )
}

function CancelBn({disabled, setDisabled})
{
    var handleCancel = (event) =>
    {
        event.preventDefault(); 

        document.getElementById("custname").value = "";
        document.getElementById("municb").selectedIndex = 0;

        setDisabled(!disabled);
    }

    return (
        <span>
            <button id="cancelBn" onClick={handleCancel} disabled={disabled}>
                Avbryt
            </button>
        </span>
    )
}

function EditBn({customer, disabled, setDisabled})
{
    var handleEdit = (event) =>
    {
        event.preventDefault();

        if (!disabled)
            return;

        document.getElementById("custid").value = customer.id;
        document.getElementById("custname").value = customer.name;
        document.getElementById("municb").value = customer.municipalityName;

        setDisabled(!disabled);
    }   

    return (
        <button id="editBn" type="button" onClick={handleEdit}>
            <img src="../Draw.gif" alt="Oppdaterer" width="15" height="15"/>
        </button>
    )
}

function DeleteBn({customer, changeflg, setChangedflg})
{
    const status = response => 
    {
        if (response.status >= 200 && response.status < 300) 
        {
          return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
      }
      
    const json = response => response.json()

    var handleDelete = (event) =>
    {
        event.preventDefault();

        var params = '{"custid":"' + customer.id + '"}';

        fetch('/slettkunde', 
            { 
                method: "DELETE",
                headers: {
                        "content-type":"application/json"
                        ,"accept":"application/json"
                        },
                body: params
            })
           .then(status) 
           .then(json)
           .then(data => {
                let newChangeFlag = changeflg + 1;
                changeflg = newChangeFlag;
                setChangedflg(changeflg);
            })
           .catch(error => {alert("Feil ved sletting: " + error)}) 
           ;
    }   
    let disabled = !customer.isDeletable;

    return (
        <button id="deleteBn" type="button" onClick={handleDelete} disabled={disabled}>
            <img src="../delete.gif" alt="Sletter" width="15" height="15"/>
        </button>
    )
}

function CustomerRow ({isAdministrator, customer, disabled, setDisabled, changeflg, setChangedflg})
{
    if (isAdministrator)
        return (
            <tr className="list">
                <td>{customer.countyName}</td>
                <td>{customer.municipalityName}</td>
                <td>{customer.name}</td>
                <td align="center"><DeleteBn customer={customer} changeflg={changeflg} setChangedflg={setChangedflg}/></td>
                <td align="center"><EditBn customer={customer} disabled={disabled} setDisabled={setDisabled}/></td>
            </tr>
        )
    else
        return (
            <tr className="list">
                <td>{customer.countyName}</td>
                <td>{customer.municipalityName}</td>
                <td>{customer.name}</td>
            </tr>
        )
    }