export default class Item
{
    constructor(id, name, isDeletable)
    {
        this._id = id;
        this._name = name;
        this._isDeletable = isDeletable;
    }

    get id()
    {
        return this._id;
    }

    get name()
    {
        return this._name;
    }

    get isDeletable()
    {
        return this._isDeletable;
    }
}