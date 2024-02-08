import React from "react";
const Item = require("../items/Item.js").default;
const Sale = require("../items/Sale.js").default;
const ArticleLine = require("../items/ArticleLine.js").default;
const Receipt = require("../pagelets/Receipt.js").default;

export default function Register()
{
    document.title = "Dagligvare - kasseløsning";
    
    return <div><h2 align="center">Kasseløsning</h2>{<RegisterPage/>}</div>    
}

function RegisterPage()
{
    let currentCookie = document.cookie;
    let cookievalues = currentCookie.split(";");
    let username = cookievalues[0].substring(9);

    const [register4User, setRegister4User] = React.useState(null);

    React.useEffect(() =>
	{
        fetch("/kasse4bruker?username=" + username)
            .then((res) => res.json())
            .then((data) => 
            {
                if (data.message[0])
                    setRegister4User(data.message[0]);
            }); 
    }, [username]);

    if (register4User)
        return ( 
            <table width="1200">
                <thead>
                    <tr>
                        <RegisterHeading register4User={register4User} username={username}/>    
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <OuterTable register4User={register4User}/>    
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    else
        return <></>
}

function RegisterHeading({register4User, username})
{
    return (<th align="left">
                <table>
                    <tr>
                        <td width="175">Butikk:  {register4User.storeName}</td>
                        <td width="75">Kasse:  {register4User.registerNo}</td>
                        <td width="175">Operatør:  {username}</td>
                        <td><GeneratePn register4User={register4User}/></td>
                    </tr>
                </table>
            </th>   
    )
}

function GeneratePn({register4User})
{
    const [limit, setLimit] = React.useState(0);
    const [articleData, setArticleData] = React.useState(0);
    const [selectionData, setSelectionData] = React.useState(null);

    const status = response =>
    {
        if (response.status >= 200 && response.status < 300) 
        {
          return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.statusText))
      }
      
    const json = response => response.json()

    React.useEffect(() =>
    {
        fetch("/varer4generering?chainid=" + register4User.chainId)
            .then((res) => res.json())
            .then((data) => 
            {
                setArticleData(data.message);
            });
    }, []);

    React.useEffect(() =>
    {
        fetch("/grunnlag?limit=" + limit)
            .then((res) => res.json())
            .then((data) => 
            {
                if (data.message)
                    setSelectionData(data.message);
                if (selectionData)
                {
                    selectionData.forEach((saleCandidate) =>
                    {
                        let total = 0.0;
                        let newSale = new Sale(0, saleCandidate.storeId, "N/A", 
                                                saleCandidate.registerNo, "N/A", 
                                                saleCandidate.customerId, "N/A", 
                                                "1970-01-01", 0);

                        let articleLineCount = Math.round(Math.random() * 10);
                        let articleLines = [articleLineCount];

                        for (let i = 0; i < articleLineCount; i++)
                        {
                            let articleIdx = Math.round(Math.random() * articleData.length);                  
                            let lineAmount = articleData[articleIdx].unitPrice * articleData[articleIdx].unitCount;
    
                            articleLines[i] = new ArticleLine(i, articleData[articleIdx].id,
                                "N/A", articleData[articleIdx].unitPrice, articleData[articleIdx].unitCount,
                                lineAmount
                                )
                            total = total + lineAmount;
                        }
                        newSale.amount = total;
                        newSale.articleLines = articleLines;

                        fetch("/nyhandel",
                        { 
                            method: "PUT",
                            headers: {
                                    "content-type":"application/json"
                                    ,"accept":"application/json"
                                    },
                            body: JSON.stringify(newSale)
                        })
                        .then(status)
                        .then(json)
                        .then(data => {
            
                        })
                        .catch(error => {alert("Feil ved ny handel: " + error)})
                    });
                }                
            }); 
    }, [limit]);

    const handleGenerateSales = (event) =>
    {
        event.preventDefault();
        let saleCountCb = document.getElementById("saleCountCb");
        setLimit(saleCountCb.value);
    }

    return (<>
        <label htmlFor="saleCountCb">Antall handler</label>
        <select id="saleCountCb">
            <option>1</option>
            <option>5</option>
            <option>50</option>
            <option>500</option>
        </select>   
        <button onClick={handleGenerateSales}>Generer handler</button>
        </>)
}

function OuterTable({register4User})
{
    const [saleData, setSaleData] = React.useState(null);

    return (
        <table cellPadding="10" border="1">
            <tbody>
                <tr>
                    <SelectionCells register4User={register4User} saleData={saleData} setSaleData={setSaleData}/>
                    <td valign="top" width="40%"><Receipt saleData={saleData}/></td>
                </tr>
            </tbody>
        </table>
    )
}

function SelectionCells({register4User, saleData, setSaleData})
{
    const [articleId, setArticleId] = React.useState(null);

    return (
        <>
            <td width="35%"><SelectionTable register4User={register4User}  setArticleId={setArticleId} saleData={saleData} setSaleData={setSaleData}/></td>
            <td width="25%"><PriceDialog register4User={register4User} articleId={articleId} saleData={saleData} setSaleData={setSaleData}/></td>
        </>
    )
}

function SelectionTable({register4User, setArticleId, saleData, setSaleData})
{
    const [customerData, setCustomerData] = React.useState(null);
    const [customerId, setCustomerId] = React.useState(null); 

    React.useEffect(() =>
	{
        if (customerId && saleData)
        {
            let custCb = document.getElementById("custcb");
            let oldTotal = saleData.amount;
            let newArticlesLines = [...saleData.articleLines];
            let newSaleData = new Sale(0, register4User.storeId, register4User.storeName, register4User.registerNo, register4User.chainName, customerId, custCb.value, "1970-01-01 12:00:00", 0);
            newSaleData.amount = oldTotal;
            newSaleData.articleLines = newArticlesLines;
            newSaleData.customerId = customerId;
            newSaleData.customerName = custCb.value;
            setSaleData(newSaleData);
        }
    }, [customerId]);

    React.useEffect(() =>
	{
        fetch("/kunder")
          .then((res) => res.json())
          .then((customerData) => setCustomerData(customerData.message)); 
    }, []);

    return (
        <table cellSpacing="5">
            <tbody>
                <tr> 
                    <td><label htmlFor="custcb">  Kunde:  </label></td>
                    <td>{!customerData ? "Loading..." : <CustomerCb customers={customerData} setCustomerId={setCustomerId}/>}</td>
                </tr>

                <ArticleSearch setArticleId={setArticleId}/>

                <tr>
                    <td>&nbsp;</td>
                    <td>
                        <FinalizePurchaseBn saleData={saleData}/>
                    </td>
                </tr>
            </tbody>
        </table>    
    )
}

function CustomerCb({customers, setCustomerId})
{
    const handleChange = (event) =>
    {
        event.preventDefault();
        let custCb = document.getElementById("custcb");
        let newCustomerId = custCb.options[custCb.selectedIndex].id;

        setCustomerId(newCustomerId);
    }

    const options = [];

    let defaultItem = new Item(0, "Kontantkunde", false);
    options.push(<ItemOption item={defaultItem} key={defaultItem.id}/>);   

    customers.forEach((customer) =>
    {
        options.push(<ItemOption item={customer} key={customer.id}/>);   
    });

    return (
        <select id="custcb" onChange={handleChange}>
            {options}
        </select>
    )
}
 
function ItemOption({item})
{
    return <option id={item.id}>{item.name}</option>
}

function ArticleSearch({setArticleId})
{
    const [articleNameChunk, setArticleNameChunk] = React.useState(null);

    var handleChange = (event) =>
    {
        let newChunk = document.getElementById("articleSearch").value;
        setArticleNameChunk(newChunk);        
    }

    return (
        <>
            <tr>
                <td><label htmlFor="articleSearch">Søk etter vare</label></td>
                <td>
                    <input type="text" id="articleSearch" placeholder="Varenavn" onChange={handleChange} size="30"/>
                </td>
            </tr>
            <ArticleList articleNameChunk={articleNameChunk} setArticleId={setArticleId}/>
        </>
    )
}

function ArticleList({articleNameChunk, setArticleId})
{
    const [articles, setArticles] = React.useState(null);

    let query = "?chunk=" + articleNameChunk;

    React.useEffect(() =>
	{
        fetch("/varer4kasse" + query)
          .then((res) => res.json())
          .then((data) => setArticles(data.message)); 
    }, [query]);

    return (
        <tr> 
            <td>&nbsp;</td>
            <td>
                {!articles ? "Loading..." : <ArticleCb articles={articles} setArticleId={setArticleId}/>}
            </td>
        </tr>
    )
}

function ArticleCb({articles, setArticleId})
{
    const options = [];

    var handleChange = (event) =>
    {
        let cb = document.getElementById("articlecb");
        let newArticleId = cb.options[cb.selectedIndex].id;
        setArticleId(newArticleId);
    }    

    articles.forEach((article) =>
    {
        options.push(<ArticleItem article={article} key={article.id}/>);   
    });

    return (
        <select id="articlecb" size="25" onChange={handleChange}>
            {options}
        </select>
    )
}

function ArticleItem({article})
{
    return <option id={article.id}>{article.name}</option>    
}

function PriceDialog({register4User, articleId, saleData, setSaleData})
{
    const [article, setArticle] = React.useState(null);
    const [initValue, setInitValue] = React.useState(null);

    let query = "?articleid=" + articleId + "&chainid=" + register4User.chainId;

    React.useEffect(() =>
	{
        fetch("/vare4kasse" + query)
            .then((res) => res.json())
            .then((data) => 
            {
                if (data.message[0])
                {
                    setArticle(data.message[0])
                    if (data.message[0].amountType === 1)
                    {
                        let newInitValue = 1;
                        setInitValue(newInitValue);
                    }
                    else
                    {
                        let newInitValue = 50;
                        setInitValue(newInitValue);
                    }
                }
                else
                    setArticle(null);        
            }
          ); 
    }, [query]);

    if (article == null)
        return <></>

    return (
        <table width="300" border="1">
            <thead>
            <tr>
                <th width="70">
                    Varenr: {article.id}
                </th>
                <th width="200">
                    {article.name}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td width="70" align="right">
                    {article.unitPrice.toLocaleString("no-NO", {minimumFractionDigits:"2", maximumFractionDigits:"2"})} 
                </td>
                <td width="200">
                    / {article.amountTypeName}
                </td>
            </tr>
            
            <AmountSp amountType={article.amountType} initValue={initValue} setInitValue={setInitValue}/>

            <tr>
                <td align="center" colSpan={2}><AddArticleBn article={article} register4User={register4User} saleData={saleData} setSaleData={setSaleData}/></td>
            </tr>
            </tbody>
        </table>)
}

function AmountSp({amountType, initValue, setInitValue})
{
    var handleChange = (event) =>
    {
        event.preventDefault();
        setInitValue(event.target.value);
    }

    if (amountType === 1)
    {
        return (
            <tr>
                <td><input type="number" value={initValue} id="amountSp" onChange={handleChange} min="1" max="12" size="10"/></td>
                <td><label htmlFor="amountSp">stk</label></td>
            </tr>
        )
    }
    else
    {
        return (
            <tr>
                <td><input type="number" value={initValue} id="amountSp" onChange={handleChange} min="50" max="2500" step="50" size="10"/></td>
                <td><label htmlFor="amountSp">gram</label></td>
            </tr>
        )
    }
}

function AddArticleBn({article, register4User, saleData, setSaleData})
{
    var handleAddArticle = (event) =>
    {
        let custCb = document.getElementById("custcb");
        let customerId = custCb.options[custCb.selectedIndex].id;

        let unitCount = document.getElementById("amountSp").value / (article.amountTypeName === "Kg" ? 1000 : 1);
        let lineAmount = article.unitPrice * unitCount;

        if (!saleData)
        {
            let initSale = new Sale(0, register4User.storeId, register4User.storeName, register4User.registerNo, register4User.chainName, customerId, custCb.value, "1970-01-01 12:00:00", 0);

            let articleLines = [];
            articleLines[0] = new ArticleLine(0, article.id, article.name, article.unitPrice, unitCount, lineAmount);

            initSale.amount = lineAmount;
            initSale.articleLines = articleLines;
            setSaleData(initSale);
        }
        else
        { // todo Må både Sale og ArticleLines bygges på nytt?
            let oldTotal = saleData.amount;
            let newArticlesLines = [...saleData.articleLines];
            let newSaleData = new Sale(0, register4User.storeId, register4User.storeName, register4User.registerNo, register4User.chainName, customerId, custCb.value, "1970-01-01 12:00:00", 0);
            newSaleData.amount = oldTotal + lineAmount;

            newArticlesLines.push(new ArticleLine(newArticlesLines.length, article.id, article.name, article.unitPrice, unitCount, lineAmount));   
            newSaleData.articleLines = newArticlesLines;
            setSaleData(newSaleData);
        }
    }

    return <button id="addarticlebn" onClick={handleAddArticle}>Legg til</button>
}

function FinalizePurchaseBn({saleData})
{
    var handleFinalizePurchase = (event) =>
    {
        event.preventDefault(); 

        const status = response => 
        {
            if (response.status >= 200 && response.status < 300) 
            {
              return Promise.resolve(response)
            }
            return Promise.reject(new Error(response.statusText))
          }
          
        const json = response => response.json()

        let custCb = document.getElementById("custcb");
        let customerId = custCb.options[custCb.selectedIndex].id;
        saleData.customerId = customerId;   

        fetch("/nyhandel",
            { 
                method: "PUT",
                headers: {
                        "content-type":"application/json"
                        ,"accept":"application/json"
                        },
                body: JSON.stringify(saleData)
            })
           .then(status)
           .then(json)
           .then(data => {

// todo Vise Receipt etter handelen            
            
            })
           .catch(error => {alert("Feil ved ny handel: " + error)})
    }

    let isEnabled = (saleData && saleData.articleLines && saleData.articleLines.length > 0)

    return <button onClick={handleFinalizePurchase} disabled={!isEnabled}>Fullfør handel</button>
}