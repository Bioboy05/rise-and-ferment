import useStarterStore from "../store/useStarterStore";

/**
 * Shortcut hook to get the active starter object.
 * Usage: const starter = useActiveStarter();
 *
 * @returns {Object} The active starter
 */
export default function useActiveStarter() {
  return useStarterStore((state) => {
    const active = state.starters.find((starter) => starter.id === state.activeStarterId);
    return active || state.starters[0];
  });
}
