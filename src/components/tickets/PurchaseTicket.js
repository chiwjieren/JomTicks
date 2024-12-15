import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001';

const PurchaseTicket = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize with the first available category
  const [formData, setFormData] = useState({
    category: '',
    quantity: 1
  });

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event && !formData.category) {
      // Set initial category to the first available category
      const categories = Object.keys(event.prices);
      if (categories.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: categories[0]
        }));
      }
    }
  }, [event]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const tokenData = JSON.parse(atob(token));
      
      const purchase = {
        eventId: event.id,
        userId: tokenData.userId,
        category: formData.category,
        quantity: formData.quantity,
        totalPrice: event.prices[formData.category] * formData.quantity,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed'
      };

      const response = await fetch(`${API_URL}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(purchase),
      });

      if (response.ok) {
        // Update available seats
        const updatedEvent = {
          ...event,
          availableSeats: {
            ...event.availableSeats,
            [formData.category]: event.availableSeats[formData.category] - formData.quantity
          }
        };

        await fetch(`${API_URL}/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedEvent),
        });

        navigate('/my-tickets');
      } else {
        setError('Failed to purchase tickets');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('An error occurred while purchasing tickets');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300 mt-8">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center text-red-400 mt-8">Event not found</div>;
  }

  if (!event.saleStarted) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">{event.title}</h2>
        <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
          Ticket sales have not started yet.
        </div>
      </div>
    );
  }

  const maxQuantity = Math.min(4, event.availableSeats[formData.category] || 0);
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">{event.title}</h2>
      <div className="mb-6">
        <p className="text-gray-300">{event.description}</p>
        <p className="mt-2 text-gray-300">
          <span className="font-semibold">Date:</span>{' '}
          {new Date(event.date).toLocaleString()}
        </p>
        <p className="mt-1 text-gray-300">
          <span className="font-semibold">Venue:</span> {event.venue}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Ticket Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {Object.entries(event.prices).map(([category, price]) => (
              <option key={category} value={category} disabled={event.availableSeats[category] < 1}>
                {category} - RM{price} ({event.availableSeats[category]} seats left)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Quantity
          </label>
          <select
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {quantityOptions.map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Total Price:</span>
            <span className="text-xl font-bold text-white">
              RM{(event.prices[formData.category] * formData.quantity).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
        >
          {isSubmitting ? 'Processing...' : 'Purchase Tickets'}
        </button>
      </form>
    </div>
  );
};

export default PurchaseTicket; 