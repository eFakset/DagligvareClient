import React from "react";

export default function Stores() 
{
    document.title = "Dagligvare - butikker";

    const [stores, setStores] = React.useState(null);

    React.useEffect(() => {
        fetch("/butikker")
          .then((res) => res.json())
          .then((data) => setStores(data.message));
      }, []);

    return (
        <div>
            <h2 align="center">Butikker</h2> {!stores ? "Loading..." : <StoreTable stores={stores} />}
        </div>
    )
}

function StoreTable({ stores }) 
{
    const rows = [];
    stores.forEach((Store) =>
    {
        rows.push(<StoreRow store={Store} key={Store.id} />);
    });

    return (
        <table cellPadding="5" align="center">
        <thead>
            <tr>
            <th>Fylke</th>
            <th>Kommune</th>
            <th>ButikkNr</th>
            <th>Butikk</th>
            </tr>
        </thead>
        <tbody>{rows}</tbody>
        </table>
    );
}

function StoreRow ({store})
{
    return (
        <tr className="list">
            <td>{store.countyName}</td>
            <td>{store.municipalityName}</td>
            <td>{store.id}</td>
            <td>{store.name}</td>
        </tr>
    )
}