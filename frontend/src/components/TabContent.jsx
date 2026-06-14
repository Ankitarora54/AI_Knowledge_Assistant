
import ExplainPanel from "./ExplainPanel";
import TraceabilityPanel from "./TraceabilityPanel";
import ArchitectureReviewPanel from "./ArchitectureReviewPanel";
import CapabilityPanel from "./CapabilityPanel";
import ReleaseNotesPanel from "./ReleaseNotesPanel";
import ReleaseReadinessPanel from "./ReleaseReadinessPanel";
import CoveragePanel from "./CoveragePanel";
import RootCausePanel from "./RootCausePanel";
import TestImpactPanel from "./TestImpactPanel";

export default function TabContent({tab}){

 switch(tab){
  case 1: return <ExplainPanel/>;
  case 2: return <TraceabilityPanel/>;
  case 3: return <ArchitectureReviewPanel/>;
  case 4: return <ReleaseNotesPanel/>;
  case 5: return <ReleaseReadinessPanel/>;
  case 6: return <CoveragePanel/>;
  case 7: return <RootCausePanel/>;
  case 8: return <TestImpactPanel/>;
  case 9: return <CapabilityPanel/>;
  default: return null;
 }
}
