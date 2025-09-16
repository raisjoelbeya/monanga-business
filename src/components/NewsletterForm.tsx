'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Merci pour votre inscription à notre newsletter !');
      setEmail('');
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-3xl mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          className="py-4 px-6 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`py-4 px-6 ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold rounded-r-lg transition-all duration-300`}
        >
          {isSubmitting ? 'Envoi en cours...' : "S'abonner"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-green-400">
          {message}
        </p>
      )}
    </>
  );
}
