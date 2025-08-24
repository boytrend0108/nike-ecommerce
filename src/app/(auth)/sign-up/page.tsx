import Link from 'next/link';
import { SocialProviders } from '@/components/SocialProviders';
import { signUpAction } from '@/lib/auth/actions';

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

      <form action={signUpAction} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-body-medium text-dark-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-body-medium text-dark-900 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            className="w-full px-4 py-3 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-body-medium text-dark-900 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="minimum 8 characters"
            className="w-full px-4 py-3 border border-light-300 rounded-lg text-body text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-dark-900 text-light-100 py-3 px-4 rounded-full text-body-medium font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
        >
          Sign Up
        </button>
      </form>

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
