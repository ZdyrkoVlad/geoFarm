import { useEffect } from 'react';
import MainMap from '../components/MainMap/MainMap';
import ActivityPanel from '../components/ActivityPanel/ActivityPanel';
import InfoCard from '../components/InfoCard/InfoCard';
import PointsList from '../components/PointsList/PointsList';
import SearchBar from '../components/SearchBar/SearchBar';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import MGRSToggle from '../components/MGRSToggle/MGRSToggle';
import { mockData } from '../../mockData/fields';
import { useMapStore } from '../stores/MapStore';
import { DeletePointConfirm } from '../components/MainMap/DeletePointConfirm';

export default function MapScreen() {
  const addActiveItems = useMapStore((s) => s.addActiveItems);
  
  const pointToDelete = useMapStore((s) => s.pointToDelete);
  const setPointToDelete = useMapStore((s) => s.setPointToDelete);
  const removeActiveItems = useMapStore((s) => s.removeActiveItems);

  //init start data
  useEffect(() => {
    addActiveItems(mockData.features);
  }, [addActiveItems]);

  const handleDeleteConfirm = () => {
    if (pointToDelete) {
      removeActiveItems([pointToDelete.properties.id]);
      setPointToDelete(null);
    }
  };

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-farm-bg">
      {/*<SidePanel />*/}

      <main className="relative flex-1 min-h-0 min-w-0">
        <SearchBar />
        
        <div className="absolute top-16 left-3 z-10 flex flex-col gap-3 max-h-[calc(100vh-5rem)] pointer-events-none">
            <div className="pointer-events-auto shrink-0">
                <InfoCard />
            </div>
            <div className="pointer-events-auto flex min-h-0">
                <PointsList />
            </div>
        </div>

        <div className="absolute top-3 right-3 z-10 flex gap-2">
            <MGRSToggle />
            <ThemeToggle />
        </div>
        <ActivityPanel />
        <MainMap />
        
        {pointToDelete && (
          <DeletePointConfirm 
            point={pointToDelete} 
            onConfirm={handleDeleteConfirm} 
            onCancel={() => setPointToDelete(null)} 
          />
        )}
      </main>
    </div>
  );
}
