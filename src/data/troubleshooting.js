/**
 * Troubleshooting data — structured from existing i18n keys.
 *
 * Categories:
 * - checks: first things to verify (temp, water, flour, patience)
 * - common: common issues (hooch, smells, not doubling)
 * - serious: serious issues (mold)
 * - normal: what's normal timeline (day ranges)
 */

const troubleshooting = {
  introKey: "troubleIntro",

  checks: [
    {
      id: "temp",
      iconName: "thermometer",
      titleKey: "troubleTemp",
      descKey: "troubleTempDesc",
    },
    {
      id: "water",
      iconName: "droplet",
      titleKey: "troubleWater",
      descKey: "troubleWaterDesc",
    },
    {
      id: "flour",
      iconName: "sprout",
      titleKey: "troubleFlour",
      descKey: "troubleFlourDesc",
    },
    {
      id: "patience",
      iconName: "hourglass",
      titleKey: "troublePatience",
      descKey: "troublePatienceDesc",
    },
  ],

  common: [
    {
      id: "hooch",
      iconName: "flask",
      titleKey: "troubleHooch",
      descKey: "troubleHoochDesc",
      severity: "info",
    },
    {
      id: "acetone",
      iconName: "alert",
      titleKey: "troubleSmellAcetone",
      descKey: "troubleSmellAcetoneDesc",
      severity: "warning",
    },
    {
      id: "sour",
      iconName: "info",
      titleKey: "troubleSmellStrong",
      descKey: "troubleSmellStrongDesc",
      severity: "warning",
    },
    {
      id: "notDoubling",
      iconName: "trending-up",
      titleKey: "troubleNotDoubling",
      descKey: "troubleNotDoublingDesc",
      severity: "info",
    },
  ],

  serious: [
    {
      id: "mold",
      iconName: "alert",
      titleKey: "troubleMold",
      descKey: "troubleMoldDesc",
      severity: "danger",
    },
  ],

  normal: [
    { id: "day1", descKey: "normalDay1" },
    { id: "day3", descKey: "normalDay3" },
    { id: "day5", descKey: "normalDay5" },
    { id: "day7", descKey: "normalDay7" },
  ],
};

export default troubleshooting;
