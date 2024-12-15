import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saleStatus, setSaleStatus] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [sellOutTimers, setSellOutTimers] = useState({});
  const [soldOut, setSoldOut] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      
      // Update all events to have saleStarted: false initially
      const updatedData = data.map(event => ({
        ...event,
        saleStarted: false
      }));
      
      setEvents(updatedData);
      
      // Initialize states for each event
      const initialSaleStatus = {};
      const initialCountdowns = {};
      const initialSellOutTimers = {};
      const initialSoldOut = {};
      updatedData.forEach(event => {
        initialSaleStatus[event.id] = false;
        initialCountdowns[event.id] = null;
        initialSellOutTimers[event.id] = null;
        initialSoldOut[event.id] = false;
      });
      setSaleStatus(initialSaleStatus);
      setCountdowns(initialCountdowns);
      setSellOutTimers(initialSellOutTimers);
      setSoldOut(initialSoldOut);
      
      // Update all events in the database to have saleStarted: false
      await Promise.all(updatedData.map(event =>
        fetch(`${API_URL}/events/${event.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ saleStarted: false })
        })
      ));
      
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const startSaleCountdown = async (eventId) => {
    // Reset sold out state when starting new sale
    setSoldOut(prev => ({ ...prev, [eventId]: false }));
    
    // Set 5 second countdown
    let timeLeft = 5;
    setSaleStatus(prev => ({ ...prev, [eventId]: 'countdown' }));
    
    const countdownInterval = setInterval(() => {
      timeLeft -= 1;
      setCountdowns(prev => ({ ...prev, [eventId]: timeLeft }));
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        setSaleStatus(prev => ({ ...prev, [eventId]: true }));
        setCountdowns(prev => ({ ...prev, [eventId]: null }));
        
        // Update the event sale status in the database
        updateEventSaleStatus(eventId, true);
        
        // Start the 3-second sell-out timer
        startSellOutTimer(eventId);
      }
    }, 1000);
  };

  const startSellOutTimer = (eventId) => {
    let sellOutTime = 3;
    setSellOutTimers(prev => ({ ...prev, [eventId]: sellOutTime }));

    const sellOutInterval = setInterval(() => {
      sellOutTime -= 1;
      setSellOutTimers(prev => ({ ...prev, [eventId]: sellOutTime }));

      if (sellOutTime <= 0) {
        clearInterval(sellOutInterval);
        setSellOutTimers(prev => ({ ...prev, [eventId]: null }));
        simulateSellOut(eventId);
      }
    }, 1000);
  };

  const simulateSellOut = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const updatedEvent = {
      ...event,
      availableSeats: Object.keys(event.availableSeats).reduce((acc, category) => {
        acc[category] = 0;
        return acc;
      }, {}),
      saleStarted: false
    };

    try {
      await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });

      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      setSaleStatus(prev => ({ ...prev, [eventId]: false }));
      setSoldOut(prev => ({ ...prev, [eventId]: true }));
    } catch (err) {
      console.error('Failed to simulate sell-out:', err);
    }
  };

  const resetEvent = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    // Reset available seats to original quantities based on event category
    const originalSeats = {
      VIP: event.category === 'sports' ? 500 : 1000,
      CAT1: event.category === 'sports' ? 1000 : 2000,
      CAT2: event.category === 'sports' ? 1500 : 3000,
      CAT3: event.category === 'sports' ? 2000 : 4000
    };

    const updatedEvent = {
      ...event,
      availableSeats: originalSeats,
      saleStarted: false
    };

    try {
      // Update event
      await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });

      // Delete all purchases for this event
      const purchasesResponse = await fetch(`${API_URL}/purchases?eventId=${eventId}`);
      const purchases = await purchasesResponse.json();
      
      // Delete each purchase
      await Promise.all(purchases.map(purchase => 
        fetch(`${API_URL}/purchases/${purchase.id}`, {
          method: 'DELETE'
        })
      ));

      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      setSaleStatus(prev => ({ ...prev, [eventId]: false }));
      setCountdowns(prev => ({ ...prev, [eventId]: null }));
      setSellOutTimers(prev => ({ ...prev, [eventId]: null }));
      setSoldOut(prev => ({ ...prev, [eventId]: false }));
    } catch (err) {
      console.error('Failed to reset event:', err);
    }
  };

  const updateEventSaleStatus = async (eventId, started) => {
    try {
      await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          saleStarted: started
        })
      });
    } catch (err) {
      console.error('Failed to update sale status:', err);
    }
  };

  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  if (loading) return <div className="text-center text-gray-300 mt-8">Loading events...</div>;
  if (error) return <div className="text-center text-red-400 mt-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg backdrop-blur-lg bg-white/5 p-1 border border-white/10">
          {['all', 'concert', 'sports', 'theatre'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
              }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                <span className="px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{event.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString('en-MY', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Venue:</span> {event.venue}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Price:</span> From RM
                  {Math.min(...Object.values(event.prices))}
                </p>
              </div>

              {/* Sale Status and Actions */}
              <div className="space-y-3">
                {soldOut[event.id] ? (
                  <div className="text-center">
                    <div className="py-3 px-4 bg-red-900/50 text-red-200 rounded-lg border border-red-500/30 animate-pulse">
                      SOLD OUT!
                      <p className="text-sm mt-1 text-red-300/80">
                        You didn't make it in time. Try again in the next sale!
                      </p>
                    </div>
                    <button
                      onClick={() => resetEvent(event.id)}
                      className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 border border-gray-600"
                    >
                      Reset Tickets
                    </button>
                  </div>
                ) : saleStatus[event.id] === true ? (
                  <div className="space-y-2">
                    {sellOutTimers[event.id] !== null && (
                      <div className="text-center bg-red-900/50 text-red-300 py-1 px-2 rounded-lg border border-red-500/30 mb-2 animate-pulse">
                        ⚠️ Hurry! Selling out in: {sellOutTimers[event.id]}s
                      </div>
                    )}
                    <Link
                      to={`/purchase/${event.id}`}
                      className="block w-full text-center py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 animate-pulse"
                    >
                      Get Tickets Now!
                    </Link>
                  </div>
                ) : saleStatus[event.id] === 'countdown' ? (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400 mb-2">
                      Sale starts in: {countdowns[event.id]}s
                    </div>
                    <div className="py-2 px-4 bg-gray-800/50 text-gray-400 rounded-lg">
                      Preparing Sale...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => startSaleCountdown(event.id)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-300"
                    >
                      Start Sale Countdown
                    </button>
                    <button
                      onClick={() => resetEvent(event.id)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 border border-gray-600"
                    >
                      Reset Tickets
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 