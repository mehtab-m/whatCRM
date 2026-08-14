import { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { forgotPasswordApi } from '../../lib/api';

interface ForgotPasswordProps {
  onBack: () => void;
  onOtpSent: (email: string) => void;
}

export function ForgotPassword({ onBack, onOtpSent, }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const result = await forgotPasswordApi(email);

      setMessage(result.message);
      onOtpSent(email);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-6 text-primary hover:opacity-80"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>

        <div className="bg-card border rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-2">
            Forgot Password?
          </h1>

          <p className="text-muted-foreground mb-6">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border rounded-md pl-10 pr-3 py-2 bg-background"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-green-600">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}