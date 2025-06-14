import React, { useState } from 'react';
import { Card, CardBody, Input, ButtonGroup, Button } from '@heroui/react';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import Logo from "@/assets/powertein-logo.png";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [activeForm, setActiveForm] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ username: '', email: '', phone: '', password: '', confirmPassword: '' });
        console.log('Registration successful:', data);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardBody className="p-6 text-center">
          <div className="text-green-600 mb-4">
            <UserPlus className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">
            Your account has been created successfully. You will be redirected to the login page.
          </p>
          <Button
            color="primary"
            onClick={() => window.location.href = '/login'}
          >
            Go to Login
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className=''>
      <div className='flex justify-center mb-4'>
        <img
          src={Logo}
          alt="Powertein Logo"
          className="w-[40%] hover:opacity-80 transition-opacity"
        />
      </div>

      <Card className="w-full max-w-md mx-auto border-black rounded-[30px]">
        <CardBody className="p-6">
          <div className="text-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Sign Up</h2>
          </div>

          <ButtonGroup className='mb-3'>
            <Button
              type="button"
              className={`w-full ${activeForm === 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              size="md"
              onClick={() => {
                setActiveForm(1);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}>
              <Mail className="w-4 h-4" /> <p className='text-tiny'>Email Address</p>
            </Button>

            <Button
              type="button"
              className={`w-full ${activeForm === 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              size="md"
              onClick={() => {
                setActiveForm(2);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                setError('');
              }}>
              <Phone className="w-4 h-4" /> <p className='text-tiny'>Phone Number</p>
            </Button>
          </ButtonGroup>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {activeForm === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                startContent={<User className="w-4 h-4 text-gray-400" />}
                isRequired
                variant="bordered"
              />

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                startContent={<Mail className="w-4 h-4 text-gray-400" />}
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

              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
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
                startContent={!loading && <UserPlus className="w-4 h-4" />}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>)}

          {activeForm === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                startContent={<User className="w-4 h-4 text-gray-400" />}
                isRequired
                variant="bordered"
              />

              <Input
                type="tel"
                name="email"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.email}
                onChange={handleChange}
                startContent={<Phone className="w-4 h-4 text-gray-400" />}
                isRequired
                variant="bordered"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete',
                  ];
                  if (
                    !/[0-9]/.test(e.key) &&
                    !allowedKeys.includes(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />

              < Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                startContent={< Lock className="w-4 h-4 text-gray-400" />}
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

              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
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
                startContent={!loading && <UserPlus className="w-4 h-4" />}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>)}

          <div className="text-center mt-2">
            <p className="text-gray-600  text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignupForm;