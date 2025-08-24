import { AuthFormClient } from '@/components/AuthFormClient';
import { SocialProviders } from '@/components/SocialProviders';
import { signUpAction } from '@/lib/auth/actions';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-body text-dark-700 mb-2">
          Already have an account? <Link href="/sign-in" className="text-dark-900 font-medium hover:underline">Sign In</Link>
        </p>
        <h1 className="text-heading-2 font-bold text-dark-900 mb-2">
          Join Nike Today!
        </h1>
        <p className="text-body text-dark-700">
          Create your account to start your fitness journey
        </p>
      </div>

      <SocialProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-light-100 px-2 text-dark-700">Or sign up with</span>
        </div>
      </div>

      <AuthFormClient type="signup"  onSubmit={signUpAction} />

      <p className="text-center text-caption text-dark-700">
        By signing up, you agree to our{' '}
        <Link href="#" className="text-dark-900 font-medium hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="text-dark-900 font-medium hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
