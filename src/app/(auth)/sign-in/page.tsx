import Link from 'next/link';
import { SocialProviders } from '@/components/SocialProviders';
import { AuthFormClient } from '@/components/AuthFormClient';
import { signInAction } from '@/lib/auth/actions';

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-body text-dark-700 mb-2">
          Already have an account? <Link href="/sign-up" className="text-dark-900 font-medium hover:underline">Sign Up</Link>
        </p>
        <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
          Welcome Back!
        </h1>
        <p className="text-body text-dark-700">
          Sign in to your account to continue your fitness journey
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-light-100 px-2 text-dark-700">Or sign in with</span>
        </div>
      </div>

      <AuthFormClient type="signin" onSubmit={signInAction} />

      <p className="text-center text-caption text-dark-700">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-dark-900 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
