import React, { useState } from "react";
import Hero from "./components/Hero";
import Message from "./components/Message";
import Gallery from "./components/Gallery";
import Surprise from "./components/Surprise";
import "./App.css"; // optional extra styling

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app-root">
      <div className="card">
        {page === "home" && <Hero onNext={() => setPage("message")} />}
        {page === "message" && <Message onNext={() => setPage("gallery")} />}
        {page === "gallery" && <Gallery onNext={() => setPage("surprise")} />}
        {page === "surprise" && <Surprise onRestart={() => setPage("home")} />}
      </div>
    </div>
  );
}
