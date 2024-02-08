export default class ArticleLine
{
    constructor(iId, iArticleId, iArticleName, iUnitPrice, iUnitCount, iAmount)
    {
        this.id = iId;

        this.articleId = iArticleId;
        this.articleName = iArticleName;
        this.unitPrice = iUnitPrice;
        this.unitCount = iUnitCount;
        this.amount = iAmount;
    }
}