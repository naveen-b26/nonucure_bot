import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./form"; // Import the Form component
import Recommendation from "./recommadation"; // Import the Recommendation page
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} /> {/* Route for the form page */}
        <Route path="/recommendation" element={<Recommendation />} /> {/* Route for recommendation page */}
      </Routes>
    </Router>
  );
}

export default App;
