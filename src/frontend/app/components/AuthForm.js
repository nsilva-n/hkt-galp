// components/AuthForm.js
'use client';

import { useState } from 'react';
import Button from './ui/Button';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full mt-1 p-2 border rounded"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>

      <Button
        onClick={() => setIsLogin(!isLogin)}
        variant="outline"
        size="sm"
        className="mt-4 text-sm"
      >
        {isLogin
          ? "Don't have an account? Sign up"
          : 'Already have an account? Login'}
      </Button>
    </div>
  );
}
