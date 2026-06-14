function classify(question){

    const q =
        question.toLowerCase();

    if(
        q.includes("nav") ||
        q.includes("pricing") ||
        q.includes("fund") ||
        q.includes("accrual") ||
        q.includes("corporate action") ||
        q.includes("cash")
    ){
        return "fundAccounting";
    }

    if(
        q.includes("trade") ||
        q.includes("allocation") ||
        q.includes("settlement") ||
        q.includes("execution")
        ){
        return "trading";
        }

    if(
        q.includes("dividend") ||
        q.includes("split") ||
        q.includes("corporate action") ||
        q.includes("rights")
        ){
        return "corporateActions";
        }

    if(
        q.includes("report") ||
        q.includes("factsheet") ||
        q.includes("statement") ||
        q.includes("commentary")
        ){
        return "clientReporting";
        }

    if(
        q.includes("mifid") ||
        q.includes("fatca") ||
        q.includes("crs") ||
        q.includes("aifmd") ||
        q.includes("ucits")
    ){
        return "regulatory";
    }    

    if(
        q.includes("performance") ||
        q.includes("attribution") ||
        q.includes("sector allocation") ||
        q.includes("portfolio")
        ){
        return "portfolioManager";
        }

    return "general";
}

module.exports = {
    classify
};