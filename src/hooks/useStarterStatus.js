import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import useActiveStarter from "./useActiveStarter";
import useSettingsStore from "../store/useSettingsStore";

/**
 * Hook that computes the current status of the active starter.
 *
 * Single source of truth for starter status thresholds:
 *   growing:   0–4 hours after last feeding
 *   peak:      4–8 hours (PMC — Peak Maturity Culture)
 *   postPeak:  8–10 hours
 *   hungry:    >10 hours
 *   welcome:   never fed
 *
 * Also supports beginnerMode simplified text.
 *
 * @param {number} nowMs - current timestamp in ms (should be state/effect driven for reactivity)
 * @returns {{ main: string, sub: string, cls: string }}
 */
export default function useStarterStatus(nowMs) {
    const { t } = useTranslation();
    const starter = useActiveStarter();
    const beginnerMode = useSettingsStore((s) => s.beginnerMode);

    const hoursSince = starter.lastFed
        ? Math.floor((nowMs - starter.lastFed) / (1000 * 60 * 60))
        : null;

    return useMemo(() => {
        if (hoursSince === null) {
            return { main: t("statusWelcome"), sub: t("statusWelcomeSub"), cls: "good" };
        }
        if (hoursSince >= 4 && hoursSince <= 8) {
            return beginnerMode
                ? { main: t("pmcSimple"), sub: t("pmcSimpleDesc"), cls: "good" }
                : { main: t("statusPMC"), sub: t("statusPMCSub"), cls: "good" };
        }
        if (hoursSince > 8 && hoursSince <= 10) {
            return { main: t("statusPostPeak"), sub: t("statusPostPeakSub"), cls: "good" };
        }
        if (hoursSince < 4) {
            const remaining = Math.max(0, 6 - hoursSince);
            return { main: t("statusGrowing"), sub: t("statusGrowingSub", { h: remaining }), cls: "" };
        }
        return { main: t("statusHungry"), sub: t("statusHungrySub"), cls: "urgent" };
    }, [hoursSince, beginnerMode, t]);
}
