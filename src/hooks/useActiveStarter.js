import useStarterStore from "../store/useStarterStore";

/**
 * Shortcut hook to get the active starter object.
 * Usage: const starter = useActiveStarter();
 *
 * @returns {Object} The active starter
 */
export default function useActiveStarter() {
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  return getActiveStarter();
}
