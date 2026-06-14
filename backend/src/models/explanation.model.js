class Explanation {

  constructor(data){

    this.businessPurpose =
      data.businessPurpose;

    this.technicalSummary =
      data.technicalSummary;

    this.historicalEvolution =
      data.historicalEvolution;

    this.relatedChanges =
      data.relatedChanges || [];

    this.risks =
      data.risks || [];

    this.futureEnhancements =
      data.futureEnhancements || [];
  }
}

module.exports = Explanation;