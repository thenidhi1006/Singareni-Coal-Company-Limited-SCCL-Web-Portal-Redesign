import SCCLHome from "./SCCLHome";
import Energy from "./pages/Energy";
import OpenCast from "./pages/OpenCast";
import Underground from "./pages/Underground";
import OutputTarget from "./pages/OutputTarget";
import EfficiencyMetrics from "./pages/EfficiencyMetrics";

export default function App() {
  const page = window.location.pathname.replace(/\/$/, "");

  if (page === "/underground") return <Underground />;
  if (page === "/opencast") return <OpenCast />;
  if (page === "/energy") return <Energy />;

  // NEW ROUTES ADDED
  if (page === "/output-target") return <OutputTarget />;
  if (page === "/efficiency-metrics") return <EfficiencyMetrics />;

  return <SCCLHome />;
}