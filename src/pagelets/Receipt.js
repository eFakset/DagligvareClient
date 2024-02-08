import React from "react";

export default function Receipt({saleData})
{
    if (saleData)
    {
        return (
            <>
            {!saleData ? "Loading..." : <><SaleHeader sale={saleData}/><ArticleTable sale={saleData}/><SaleBonus sale={saleData}/></>}
            </>
        )
    }
    else
    {
        return <></>;    
    }
}

function SaleHeader({sale})
{
    if (!sale)
        return <></>;

    let saleTs = new Date(sale.ts);
    let customerName = "Kunde: " + sale.customerName;
    if (sale.customerId === 0)
        customerName = "Kontantkunde";
    let receiptText = "";
    if (sale.id !== 0)
        receiptText = "Salgskvittering " + sale.id + "  " + saleTs.toLocaleString("no-NO"); 

    return (
        <>
			<h3 align="center">{sale.chainName}</h3>
			<h3 align="center">{sale.storeName}</h3>
			<h4 align="center">{receiptText}</h4>
			<h4 align="center">{customerName}</h4>
        </>
    )
}

function ArticleTable({sale})
{
    let rows = [];

    if (sale)
    {
        if (sale.articleLines)
        {
            sale.articleLines.forEach((articleLine) =>  
            {
                rows.push(<ArticleRow articleLine={articleLine} key={articleLine.id} />);    
            });
        }
        rows.push(<TotalRow sale={sale} key="99999" />); 
    }

    return (
        <>
        <table cellPadding="3">
            <tbody>
            {rows}
            </tbody>
        </table>
        </>
    )
}

function ArticleRow({articleLine})
{
    return (
    <tr>
        <td width="200">{articleLine.articleName}</td>
        <td align="right" width="70">{articleLine.unitCount.toLocaleString("no-NO", {minimumFractionDigits:"3", maximumFractionDigits:"3"})}</td>
        <td align="right" width="70">{articleLine.amount.toLocaleString("no-NO", {minimumFractionDigits:"2", maximumFractionDigits:"2"})}</td>
    </tr>
    )
}

function SaleBonus({sale})
{
    if (sale && sale.bonus)
        return <BonusTable bonuslines={sale.bonus}/>
    else
        return <></>;
}


function BonusTable({bonuslines})
{
    let rows = [];

    bonuslines.forEach((bonus) =>  
    {
        let bonusId = bonus.id;
        if (bonusId === 0)
        {
            bonusId = bonusId * 10002;
            bonus.name = "Bonus handel";
        }
        else
        {
            bonusId = bonusId * 10003;
//            bonus.name = "Bonus " + bonus.name;
        }

        rows.push(<BonusRow bonus={bonus} key={bonusId} />);    
    });

    return (
        <>
        <table cellPadding="3">
            <tbody>
            {rows}
            </tbody>
        </table>
        </>
    )
}

function BonusRow({bonus})
{
    return (
        <tr>
            <td width="200">{bonus.name}</td>
            <td>&nbsp;</td>
            <td align="right" width="70">{bonus.amount.toLocaleString("no-NO", {minimumFractionDigits:"2", maximumFractionDigits:"2"})}</td>
        </tr>
        )
}

function TotalRow({sale})
{
    return (
    <tr>
        <td width="200">Total:</td>
        <td>&nbsp;</td>
        <td align="right" width="70">{sale.amount.toLocaleString("no-NO", {minimumFractionDigits:"2", maximumFractionDigits:"2"})}</td>
    </tr>
    )
}