import { useState } from 'react';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin({ name, title });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f2ef] p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#0a66c2] mb-2">LinkedOut</h1>
          <p className="text-gray-600">The Professional Parody Network</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              placeholder="E.g. Corporate Chad"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Buzzword Title</label>
            <input 
              type="text" 
              placeholder="E.g. Chief Synergy Officer"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#0a66c2] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#004182] transition-colors mt-6 shadow-sm"
          >
            Agree & Join
          </button>
        </form>
        
        <p className="text-xs text-center text-gray-500 mt-6 leading-relaxed">
          By clicking Agree & Join, you agree to the LinkedOut User Agreement, Privacy Policy, and Cookie Policy. You also commit to using the word "synergy" at least 3 times a day.
        </p>
      </div>
    </div>
  );
}
