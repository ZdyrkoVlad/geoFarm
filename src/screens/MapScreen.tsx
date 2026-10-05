import { useEffect } from 'react';
import MainMap from '../components/MainMap/MainMap';
import ActivityPanel from '../components/ActivityPanel/ActivityPanel';
import InfoCard from '../components/InfoCard/InfoCard';
import SearchBar from '../components/SearchBar/SearchBar';
import SidePanel from '../components/SidePanel/SidePanel';
import { fieldsData } from '../../mockData/fields';
import { useMapStore } from '../stores/MapStore';

export default function MapScreen() {
  const addItems = useMapStore((s) => s.addItems);
  const addActiveItems = useMapStore((s) => s.addActiveItems);

  //init start data
  useEffect(() => {
    addItems(fieldsData.features);
    addActiveItems(fieldsData.features);
  }, [addItems, addActiveItems]);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden bg-farm-bg">
      <SidePanel />

      <main className="relative flex-1 min-h-0 min-w-0">
        <SearchBar />
        <InfoCard field={{ id: '1', name: 'Поле #1', crop: 'Пшениця', area: 120 }} />
        <ActivityPanel />
        <MainMap />
      </main>
    </div>
  );
}

