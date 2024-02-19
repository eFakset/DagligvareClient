import React from "react";
import Item from "../items/Item";
const ItemRow = require("../pagelets/ItemRow").default;

export default function ArticleCategories() {

    document.title = "Dagligvare - varegrupper";

    const [categories, setCategories] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);

    const status = response =>
    {
        if (response.status >= 200 && response.status < 300)
        {
            return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText + ", http error " + response.status))
    }

    React.useEffect(() => {
        fetch("/varegrupper")
            .then(status)
            .then((res) => res.json())
            .then((data) => setCategories(data.message))
            .catch(error => setErrorMsg(error.message))
        }, []);

    if (errorMsg)
        return <h3>Error: {errorMsg}</h3>
    else
        return (
            <div><h2 align="center">Varegrupper</h2> {!categories ? "Loading..." : <ArticleCategoryTable categories={categories} />}</div>
        )
}

function ArticleCategoryTable({ categories }) 
{
    const rows = [];

    for (let i = 0; i < categories.length; i++)
    {
        let category = categories[i];
        if (category.id === 0) 
            continue;
        rows.push(<ItemRow item={category} key={category.id} />);
        }

    return (
        <table cellPadding="5" align="center">
            <thead>
                <tr>
                <th>VaregruppeNr</th>
                <th>Varegruppe</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}
