import React from "react";
import Item from "../items/Item";
const ItemRow = require("../pagelets/ItemRow").default;

export default function ArticleCategories() {

    document.title = "Dagligvare - varegrupper";

    const [categories, setCategories] = React.useState(null);

    React.useEffect(() => {
        fetch("/varegrupper")
          .then((res) => res.json())
          .then((data) => setCategories(data.message));
      }, []);

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
