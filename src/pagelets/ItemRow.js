export default function ItemRow ({item}) 
{
    return (
        <tr className="list">
            <td>{item.id}</td>
            <td>{item.name}</td>
        </tr>
    )
}