import React, { useState } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Logo from "@/assets/powertein-logo.png";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Success - redirect or handle success
        console.log('Login successful:', data);
        window.location.href = '/';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-center mb-4'>
        <img
          src={Logo}
          alt="Powertein Logo"
          className="w-[40%] hover:opacity-80 transition-opacity"
        />
      </div>
      <Card className="w-full max-w-md mx-auto border-black rounded-[30px]">
        <CardBody className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Sign In</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="email"
              label="Email Address or Phone Number"
              placeholder="Enter your email or phone number"
              value={formData.email}
              onChange={handleChange}
              startContent={<User className="w-4 h-4 text-gray-400" />}
              isRequired
              variant="bordered"
            />

            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              startContent={<Lock className="w-4 h-4 text-gray-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              }
              isRequired
              variant="bordered"
            />

            <Button
              type="submit"
              className="w-full bg-primary-600 text-white"
              size="lg"
              isLoading={loading}
              startContent={!loading && <LogIn className="w-4 h-4" />}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-2">
            <p className="text-gray-600  text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginForm;