import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { verifyResetOtpApi } from '../../lib/api';

interface VerifyResetOtpProps {
  email: string;
  onVerified: (resetToken: string) => void;
  onBack: () => void;
}

export function VerifyResetOtp({
  email,
  onVerified,
  onBack,
}: VerifyResetOtpProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyResetOtpApi(email, otp);

      onVerified(result.resetToken);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired OTP.',
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
          Back
        </button>

        <div className="bg-card border rounded-xl p-6">

          <h1 className="text-2xl font-semibold mb-2">
            Verify OTP
          </h1>

          <p className="text-muted-foreground mb-6">
            Enter the 6-digit OTP sent to {email}.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 6-digit OTP"
                required
                className="w-full border rounded-md px-3 py-2 bg-background"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && (
                <Loader2 size={18} className="animate-spin" />
              )}

              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}