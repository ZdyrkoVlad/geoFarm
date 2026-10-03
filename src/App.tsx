import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapScreen from './screens/MapScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/map" element={<MapScreen />} />
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
