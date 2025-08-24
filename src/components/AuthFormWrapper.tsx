import React from 'react';
import { AuthForm } from './AuthForm';
import { signUpAction, signInAction } from '../lib/auth/actions';
import type { AuthFormData } from './AuthFormClient';

interface AuthFormWrapperProps {
  type: 'signin' | 'signup';
}

export function AuthFormWrapper({ type }: AuthFormWrapperProps) {
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const name = formData.get('fullName')?.toString();

    const data: AuthFormData = {
      email,
      password,
      ...(type === 'signup' && name ? { name } : {}),
    } as AuthFormData;

    if (type === 'signup') {
      await signUpAction(data);
    } else {
      await signInAction(data);
    }
  };

  return <AuthForm type={type} onSubmit={handleSubmit} />;
}
