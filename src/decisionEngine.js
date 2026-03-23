function classifyThreshold(input) {
  if (input.nativeCover < 5 && input.acaciaCover > 70) return "T3";
  if (input.nativeCover < 10 && input.acaciaCover > 50) return "T2";
  if (input.nativeCover < 30) return "T1";
  return "T0";
}

function buildPractitionerOutput(input) {
  const threshold = classifyThreshold(input);

  const summary = threshold === "T2"
    ? "Passive recovery is unlikely. Active restoration is needed."
    : "Site may recover with appropriate follow-up.";

  return {
    threshold,
    thresholdSummary: summary,
    pathwayLabel: threshold === "T2" ? "Active restoration" : "Assisted recovery",
    trajectoryLabel: "Needs close watching",
    realisticTarget: "Rebuild native structure and function",
    barrierMessages: [
      "Seed bank likely limited",
      "Secondary invasion risk present"
    ],
    actions: [
      {
        title: "Follow-up clearing",
        timing: "Immediate",
        why: "Prevent reinvasion",
        steps: ["Remove regrowth early"]
      }
    ],
    monitoring: {
      reviewWindow: "6–12 months",
      focus: ["Native cover", "Weed cover"]
    }
  };
}

module.exports = { buildPractitionerOutput };
