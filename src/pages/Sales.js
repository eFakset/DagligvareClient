import React from "react";
const Item = require("../items/Item.js").default;
const Receipt = require("../pagelets/Receipt.js").default;

export default function SalePage()
{
    document.title = "Dagligvare - gjennomførte salg";
    
    return <div><h2 align="center">Gjennomførte salg</h2>{<Sales/>}</div>    
}

function Sales()
{
    const [selectionChangedFlg, selectionChanged] = React.useState(false);

    return (
        <div>
            <table align="center">
                <tbody>
                <tr><td><SelectionHeader selectionChangedFlg={selectionChangedFlg} selectionChanged={selectionChanged}/></td></tr>
                <tr><td><OuterTable selectionChangedFlg={selectionChangedFlg} selectionChanged={selectionChanged}/></td></tr>
                </tbody>
            </table>
        </div>
        )
}

function SelectionHeader({selectionChangedFlg, selectionChanged})
{
    const [storeData, setStoreData] = React.useState(null);

    React.useEffect(() =>
	{
        fetch("/butikker")
          .then((res) => res.json())
          .then((data) => setStoreData(data.message)); 
    }, []);

    const [customerData, setCustomerData] = React.useState(null);

    React.useEffect(() =>
	{
        fetch("/kunder")
          .then((res) => res.json())
          .then((data) => setCustomerData(data.message)); 
    }, []);

    const [periodData, setPeriodData] = React.useState(null);

    React.useEffect(() =>
	{
        fetch("/perioder")
          .then((res) => res.json())
          .then((data) => setPeriodData(data.message)); 
    }, []);

    return (
        <>
        {!storeData ? "Loading..." : <StoreCb stores={storeData} selectionChangedFlg={selectionChangedFlg} selectionChanged={selectionChanged}/>}
        {!customerData ? "Loading..." : <CustomerCb customers={customerData} selectionChangedFlg={selectionChangedFlg} selectionChanged={selectionChanged}/>}
        {!periodData ? "Loading..." : <PeriodCb periods={periodData} selectionChangedFlg={selectionChangedFlg} selectionChanged={selectionChanged}/>}
        </>
    )
}

function OuterTable({selectionChangedFlg, selectionChanged})
{
    const [data, setData] = React.useState(null);

    const [selectedSaleId, setSelectedSaleId] = React.useState(null);
    const [saleData, setSaleData] = React.useState(null);
    const [articleLineData, setArticleLineData] = React.useState(null);
    const [bonusData, setBonusData] = React.useState(null);

    React.useEffect(() =>
	{
        var query = "";
        let storeCb = document.getElementById("storecb");
        if (storeCb)
        {
            let storeId = storeCb.options[storeCb.selectedIndex].id;
            let periodCb = document.getElementById("periodcb");
            let periodId = periodCb.options[periodCb.selectedIndex].id;
            let custCb = document.getElementById("custcb");
            let custId = custCb.options[custCb.selectedIndex].id;
        
            query = "?storeid=" + (storeId === "0" ? "" : storeId) +
                        "&period=" + (periodId === "0" ? "" : periodId) +
                        "&customerid=" + (custId === "-1" ? "" : custId);
        }

        fetch("/handler" + query)
          .then((res) => res.json())
          .then((data) => setData(data.message)); 
    }, [selectionChangedFlg]);

    React.useEffect(() =>
	  {
        var query = "?saleid=";
        if (selectedSaleId)
            query = query + selectedSaleId;
        else
            query = query + "0";

        fetch("/bong" + query)
          .then((res) => res.json())
          .then((data) => setSaleData(data.message[0]));

        fetch("/varelinjer" + query)
        .then((res) => res.json())
        .then((data) => setArticleLineData(data.message)); 

        fetch("/bonus" + query)
        .then((res) => res.json())
        .then((data) => setBonusData(data.message)); 
        
    }, [selectedSaleId]);

    if (saleData)
    {
        if (articleLineData)
            saleData.articleLines = articleLineData;        
        if (bonusData)
            saleData.bonus = bonusData;        
    }    

    return (    
        <table>
            <tbody>
            <tr>
                <td>
                <div>
                    {!data ? "Loading..." : 
                        <SaleTable sales={data} selectedSaleId={selectedSaleId} setSelectedSaleId={setSelectedSaleId}/>
                    }
                </div>
                </td>
                <td valign="top" width="300"><Receipt saleData={saleData}/></td>
            </tr>
            </tbody>
        </table>
    )
}

function SaleTable({sales, selectedSaleId, setSelectedSaleId})
{
    var rows = [];
    sales.forEach((sale) => 
	{
        rows.push(<SaleRow sale={sale} selectedSaleId={selectedSaleId} setSelectedSaleId={setSelectedSaleId} key={sale.id}/>);
    });

//    <thead className="sales"><tr><th>Butikk</th><th>Kunde</th><th>Handel</th><th>Tidspunkt</th><th>Beløp</th></tr></thead>


    return (
        <table cellPadding="2">
            <tbody className="sales">{rows}</tbody>
        </table>
    )
}

function SaleRow({sale, selectedSaleId, setSelectedSaleId})
{
    var handleMouseOver = (event) =>
    {
        event.preventDefault();

        let newSelectedSaleId = event.target.id;
        selectedSaleId = newSelectedSaleId;
        setSelectedSaleId(selectedSaleId);    
    }

    let saleTs = new Date(sale.ts);

    return (
        <>
            <tr className="list">
                <td width="200">{sale.storeName}</td>
                <td>{sale.customerName}</td>
                <td className="selectinrow" id={sale.id} onClick={handleMouseOver}>{sale.id}</td>
                <td>{saleTs.toLocaleString("no-NO")}</td>
                <td width="50" align="right">{sale.amount.toLocaleString("no-NO", {minimumFractionDigits:"2", maximumFractionDigits:"2"})}</td>
            </tr>
        </>
    )
}

function CustomerCb({customers, selectionChangedFlg, selectionChanged})
{
    const handleChange = (event) =>
    {
        event.preventDefault();
        selectionChanged(!selectionChangedFlg);
    }

    const options = [];

    let defaultItem = new Item(-1, "...", false);
    options.push(<ItemOption item={defaultItem} key={defaultItem.id}/>);   
    let zeroItem = new Item(0, "Ukjent kunde", false);
    options.push(<ItemOption item={zeroItem} key={zeroItem.id}/>);   

    customers.forEach((JSONcustomer) =>
    {
        let customer = new Item(JSONcustomer.id, JSONcustomer.name, false);
        options.push(<ItemOption item={customer} key={customer.id}/>);   
    });

    return (
        <span> 
            <label htmlFor="custcb">  Kunde:  </label>
            <select id="custcb" onChange={handleChange}>
                {options}
            </select>
        </span>
    )
}

function StoreCb({stores, selectionChangedFlg, selectionChanged})
{
    const handleChange = (event) =>
    {
        event.preventDefault();
        selectionChanged(!selectionChangedFlg);
    }

    const options = [];

    let defaultItem = new Item(0, "...", false);
    options.push(<ItemOption item={defaultItem} key={defaultItem.id}/>);   

    stores.forEach((JSONStore) =>
    {
        let store = new Item(JSONStore.id, JSONStore.name, false);
        options.push(<ItemOption item={store} key={store.id}/>);   
    });

    return (
        <span> 
            <label htmlFor="storecb">  Butikk:  </label>
            <select id="storecb" onChange={handleChange}>
                {options}
            </select>
        </span>
    )
}

function PeriodCb({periods, selectionChangedFlg, selectionChanged})
{
    const handleChange = (event) =>
    {
        event.preventDefault();
        selectionChanged(!selectionChangedFlg);
    }

    const monthNames = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

    const options = [];

    let defaultItem = new Item(0, "...", false);
    options.push(<ItemOption item={defaultItem} key={defaultItem.id}/>);   

    periods.forEach((JSONPeriod) =>
    {
        const toDay = new Date(JSONPeriod.firstsale.substring(0, 10));
        const periodName = monthNames[toDay.getMonth()] + " " + toDay.getFullYear();

        let period = new Item(JSONPeriod.id, periodName, false);
        options.push(<ItemOption item={period} key={period.id}/>);   
    });

    return (
        <span> 
            <label htmlFor="periodcb">  Periode:  </label>
            <select id="periodcb" onChange={handleChange}>
                {options}
            </select>
        </span>
    )
}
 
function ItemOption({item})
{
    return <option id={item.id}>{item.name}</option>
}