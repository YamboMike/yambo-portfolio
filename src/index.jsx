import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Portfolio from "./Portfolio";
import InvestigationsPage from "./InvestigationsPage";

function App() {
  const [page, setPage] = useState(window.location.hash === "#investigations" ? "investigations" : "home");
  const [dark, setDark] = useState(window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false);

  useEffect(() => {
    const onHash = () => setPage(window.location.hash === "#investigations" ? "investigations" : "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const goHome = () => {
    window.location.hash = "";
    window.scrollTo(0, 0);
    setPage("home");
  };

  const goInvestigations = () => {
    window.location.hash = "investigations";
    setPage("investigations");
  };

  if (page === "investigations") {
    return <InvestigationsPage dark={dark} setDark={setDark} onGoHome={goHome} />;
  }

  return <Portfolio dark={dark} setDark={setDark} onGoInvestigations={goInvestigations} />;
}

createRoot(document.getElementById("root")).render(<App />);
