import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import ServiceList from "./pages/ServiceList.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";
import RequestPage from "./pages/RequestPage.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Requests from "./pages/Requests.jsx";
import Document from "./pages/Document.jsx";
import VirtualCard from "./pages/VirtualCard.jsx";
import Verify from "./pages/Verify.jsx";
import Track from "./pages/Track.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* Nested routing: /services (list) and /services/:serviceId (dynamic details) */}
        <Route path="services" element={<Services />}>
          <Route index element={<ServiceList />} />
          <Route path=":serviceId" element={<ServiceDetails />} />
        </Route>
        <Route path="request" element={<RequestPage />} />
        <Route path="confirmation/:requestId" element={<Confirmation />} />
        <Route path="requests" element={<Requests />} />
        <Route path="track" element={<Track />} />
        <Route path="document/:requestId" element={<Document />} />
        <Route path="card/:requestId" element={<VirtualCard />} />
        <Route path="verify" element={<Verify />} />
        <Route path="verify/:code" element={<Verify />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
