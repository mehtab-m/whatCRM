import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { resetPasswordApi } from '../../lib/api';

interface ResetPasswordProps {
  resetToken: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPassword({
  resetToken,
  onSuccess,
  onBack,
}: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPasswordApi(
        resetToken,
        newPassword,
        confirmPassword,
      );

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reset password.',
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
            Reset Password
          </h1>

          <p className="text-muted-foreground mb-6">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                minLength={8}
                required
                className="w-full border rounded-md px-3 py-2 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                minLength={8}
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
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground rounded-md py-2 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && (
                <Loader2 size={18} className="animate-spin" />
              )}

              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
