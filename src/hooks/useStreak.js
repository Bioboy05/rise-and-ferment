import useActiveStarter from "./useActiveStarter";
import { calculateStreak } from "../utils/starterHelpers";

/**
 * Hook that calculates the feeding streak for the active starter.
 * Streak is derived from history dates — no separate counter needed.
 *
 * @returns {number} Current consecutive-day streak
 */
export default function useStreak() {
  const starter = useActiveStarter();
  return calculateStreak(starter.history);
}
