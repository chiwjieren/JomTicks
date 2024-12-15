import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token));
      
      // Fetch user's purchases
      const purchasesResponse = await fetch(`${API_URL}/purchases?userId=${tokenData.userId}`);
      const purchases = await purchasesResponse.json();

      // Fetch event details for each purchase
      const ticketsWithDetails = await Promise.all(
        purchases.map(async (purchase) => {
          const eventResponse = await fetch(`${API_URL}/events/${purchase.eventId}`);
          const event = await eventResponse.json();
          return {
            ...purchase,
            event
          };
        })
      );

      setTickets(ticketsWithDetails);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300 mt-8">Loading your tickets...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">My Tickets</h1>
      
      {tickets.length === 0 ? (
        <div className="text-center py-12 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20">
          <h2 className="text-xl font-medium text-white mb-2">No Tickets Yet</h2>
          <p className="text-gray-300 mb-4">You haven't purchased any tickets yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 overflow-hidden"
            >
              <img
                src={ticket.event.imageUrl}
                alt={ticket.event.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{ticket.event.title}</h3>
                  <span className="px-2 py-1 bg-green-900/50 text-green-300 text-xs font-semibold rounded-lg border border-green-500/30">
                    {ticket.status}
                  </span>
                </div>
                
                <div className="space-y-3 text-gray-300">
                  <p>
                    <span className="font-semibold">Category:</span> {ticket.category}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {ticket.quantity} tickets
                  </p>
                  <p>
                    <span className="font-semibold">Total Price:</span> RM{ticket.totalPrice}
                  </p>
                  <p>
                    <span className="font-semibold">Purchase Date:</span>{' '}
                    {new Date(ticket.purchaseDate).toLocaleDateString('en-MY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">Event Date:</span>{' '}
                    {new Date(ticket.event.date).toLocaleDateString('en-MY', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p>
                    <span className="font-semibold">Venue:</span> {ticket.event.venue}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400">
                    Order ID: #{ticket.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets; 