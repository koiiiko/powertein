import React from 'react';
import SignupForm from '../components/SignupForm';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-white to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;