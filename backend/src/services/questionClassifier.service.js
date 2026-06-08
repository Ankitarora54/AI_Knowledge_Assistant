async function classify(
question
){
    

    if(
        question.includes("NAV")
    ){
        return "fundAccounting";
    }

    if(
        question.includes("trade")
    ){
        return "trading";
    }

    return "general";
}

module.exports = {
    classify
};