import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MapScreen from './screens/MapScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
