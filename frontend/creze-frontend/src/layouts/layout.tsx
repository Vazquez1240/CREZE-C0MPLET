import { useLocation } from 'react-router-dom';
import Navbar from "../components/dashboard/Navbar.tsx";
import React from "react";

export default function NavbarWrapper() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return showNavbar ? <Navbar /> : null;
}

