export default class Sale
{
    constructor(iId, iStoreId, iStoreName, iRegisterNo, iChainName, iCustomerId, iCustomerName, iTs, iAmount)
    {
        this.id = iId;

        this.storeId = iStoreId;
        this.storeName = iStoreName;
        this.registerNo = iRegisterNo;
        this.chainName = iChainName;
        this.customerId = iCustomerId;
        this.customerName = iCustomerName;
        this.ts = iTs;
        this.amount = iAmount;
    }
}