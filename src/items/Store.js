import Item from "../items/Item";

export default class Store extends Item
{
    constructor(id, name, municipalityName, countyName)
    {
        super(id, name, false);

        this._municipalityName = municipalityName;
        this._countyName = countyName;
    }

    get municipalityName()
    {
        return this._municipalityName;
    }

    get countyName()
    {
        return this._countyName;
    }
}