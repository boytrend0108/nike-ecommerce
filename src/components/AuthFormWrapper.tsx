import React from 'react';
import { AuthForm } from './AuthForm';
import { signUpAction, signInAction } from '../lib/auth/actions';

interface AuthFormWrapperProps {
  type: 'signin' | 'signup';
}

export function AuthFormWrapper({ type }: AuthFormWrapperProps) {
  const handleSubmit = async (formData: FormData) => {
    if (type === 'signup') {
      return await signUpAction(formData);
    } else {
      return await signInAction(formData);
    }
  };

  return <AuthForm type={type} onSubmit={handleSubmit} />;
}
