import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/home/Home';
import EventList from './components/events/EventList';
import PurchaseTicket from './components/tickets/PurchaseTicket';
import MyTickets from './components/tickets/MyTickets';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <EventList />
                </PrivateRoute>
              }
            />
            <Route
              path="/purchase/:eventId"
              element={
                <PrivateRoute>
                  <PurchaseTicket />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <PrivateRoute>
                  <MyTickets />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App; 