import useStarterStore from "../store/useStarterStore";

function HomePage() {
  const getActiveStarter = useStarterStore((state) => state.getActiveStarter);
  const starter = getActiveStarter();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">{starter.name}</h2>
        <p className="mt-2 opacity-70">Ziua {starter.currentDay}</p>
        <p className="mt-1 text-sm opacity-50">
          Hidratare: {starter.hydration}% • Făină: {starter.flourType}
        </p>
      </div>
    </div>
  );
}

export default HomePage;
