import React from "react";
import { mount } from "cypress/react18";
import App from "./App.jsx";

describe("App", () => {
  it("muestra el título principal", () => {
    mount(<App />);
    cy.contains("Escribir mi Reseña").should("be.visible");
  });
});