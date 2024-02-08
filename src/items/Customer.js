import Item from "../items/Item";

export default class Customer extends Item
{
    constructor(id, name, isDeletable, municipalityName, countyName)
    {
        super(id, name, isDeletable);

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
