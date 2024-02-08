export default function SaleHeader({sale})
{
    if (!sale)
        return <></>;

    let saleTs = new Date(sale.ts);
    let customerName = "Kunde: " + sale.customerName;
    if (sale.customerId === 0)
        customerName = "Kontantkunde";

    return (
        <>
			<h3 align="center">{sale.chainName}</h3>
			<h3 align="center">{sale.storeName}</h3>
			<h4 align="center">Salgskvittering {sale.id} {saleTs.toLocaleString("no-NO")}</h4>
			<h4 align="center">{customerName}</h4>
        </>
    )
}
