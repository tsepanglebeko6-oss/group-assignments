import { Outlet } from "react-router-dom";

// Parent route for nested routing: renders ServiceList or ServiceDetails
export default function Services() {
  return <div className="page"><Outlet /></div>;
}
