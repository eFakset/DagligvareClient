import React from "react";
const ItemRow = require("../pagelets/ItemRow").default;

export default  function Municipalities() {

    document.title = "Dagligvare - kommuner";

    let currentCookie = document.cookie;
    let cookievalues = currentCookie.split(";");
  
    if (cookievalues.length === 3)
    {
        let usertypename = cookievalues[2].substring(14);
        if (usertypename !== 'Administrator')
            window.location.replace("/");
    }
    else
        window.location.replace("/");

    const [municipalities, setMunicipalities] = React.useState(null);

    React.useEffect(() => {
        fetch("/kommuner")
          .then((res) => res.json())
          .then((data) => setMunicipalities(data.message));
      }, []);

    return (
        <div>
            <h2 align="center">Kommuner</h2> 
            {!municipalities ? "Loading..." : <MunicipalityTable municipalities={municipalities} />}
        </div>
    )
}

function MunicipalityTable({ municipalities }) 
{
    const rows = [];

    municipalities.forEach((municipality) => 
    {
        rows.push(<ItemRow item={municipality} key={municipality.id} />);
    });

    return (
        <table cellPadding="5" align="center">
        <thead>
            <tr>
            <th>KommuneNr</th>
            <th>Kommune</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
        </table>
    );
}