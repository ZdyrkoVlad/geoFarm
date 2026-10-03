import MainMap from '../components/MainMap/MainMap';
import SidePanel from '../components/SidePanel/SidePanel';

export default function MapScreen() {
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-farm-bg">
      <SidePanel />

      <main className="relative flex-1 min-h-0 min-w-0">
        <MainMap />
      </main>
    </div>
  );
}
