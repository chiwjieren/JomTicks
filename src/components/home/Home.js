import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      
      // Sort events by date
      const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingEvents(sortedEvents);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-gray-300 mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-400 mt-8">{error}</div>;

  // Get the next upcoming event
  const featuredEvent = upcomingEvents[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Event */}
      {featuredEvent && (
        <div className="relative h-[500px] mb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black">
            <img
              src={featuredEvent.imageUrl}
              alt={featuredEvent.title}
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x500?text=Featured+Event';
              }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/70 to-transparent">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 bg-indigo-900/70 text-indigo-300 text-sm font-semibold rounded-full border border-indigo-500/30 mb-4">
                Featured Event
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {featuredEvent.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-2xl">
                {featuredEvent.description}
              </p>
              <Link
                to={`/events`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
              >
                View All Events
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Event Categories */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['concert', 'sports', 'theatre'].map(category => {
            const categoryEvents = upcomingEvents.filter(event => event.category === category);
            const upcomingCount = categoryEvents.length;
            
            return (
              <Link
                key={category}
                to={`/events?category=${category}`}
                className="group relative h-48 rounded-2xl overflow-hidden backdrop-blur-lg bg-white/10 border border-white/20 transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                  <p className="text-gray-300">
                    {upcomingCount} Upcoming {upcomingCount === 1 ? 'Event' : 'Events'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events Feed */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map(event => (
            <div key={event.id} className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300">
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
                <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(event.date).toLocaleDateString('en-MY', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Venue:</span> {event.venue}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Starting from:</span> RM
                    {Math.min(...Object.values(event.prices))}
                  </p>
                </div>
                <Link
                  to={`/events`}
                  className="block w-full text-center mt-4 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="backdrop-blur-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Miss Out on Amazing Events!
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get ready for an unforgettable experience. Browse our selection of events and secure your tickets today.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Explore All Events
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 