export default function SaleBonus({sale})
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
