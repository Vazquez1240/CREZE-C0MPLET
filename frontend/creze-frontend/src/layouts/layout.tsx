import { useLocation } from 'react-router-dom';
import Navbar from "../components/dashboard/Navbar.tsx";
import React from "react";

export default function NavbarWrapper() {
  const location = useLocation();
  const excludedPaths = ['/', '/register'];

  const shouldShowNavbar = !excludedPaths.includes(location.pathname);

  return shouldShowNavbar ? <Navbar /> : null;
}
