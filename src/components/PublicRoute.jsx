// src/components/PublicRoute.jsx
// import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, children, redirectPath = "/" }) => {
  // If the user is authenticated, redirect them away from the login/signup page
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  // Otherwise, show the children (login/signup component)
  return children;
};

export default PublicRoute;
