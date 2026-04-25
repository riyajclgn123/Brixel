import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import BrailleExport from "./pages/BrailleExport";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050810]">
        <Navbar />
        <main className="pt-[60px]">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/braille" element={<BrailleExport />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}