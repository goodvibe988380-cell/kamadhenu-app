import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LoginProps {
  onBackToHome?: () => void;
}

const Login: React.FC<LoginProps> = ({ onBackToHome }) => {
  const { verifyPhone, login } = useAuth();
  const [step, setStep] = useState<'phone' | 'password'>('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // STEP 1: Phone Number Verification
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{10}$/.test(phone)) {
      setError('Invalid mobile number.');
      setLoading(false);
      return;
    }

    const result = await verifyPhone(phone);
    setLoading(false);

    if (result.success) {
      setStep('password');
      setError('');
    } else {
      setError(result.message || 'Invalid mobile number.');
    }
  };

  // STEP 2: Masked Password Verification
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{5}$/.test(password)) {
      setError('Invalid login credentials.');
      setPassword('');
      setLoading(false);
      return;
    }

    const result = await login(phone, password);
    setLoading(false);

    // Clear password from component memory immediately after submission
    setPassword('');

    if (!result.success) {
      setError(result.message || 'Invalid login credentials.');
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPassword('');
    setError('');
  };

  const handleReturnToHome = () => {
    setPassword('');
    if (onBackToHome) {
      onBackToHome();
    } else if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.location.pathname = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-3 sm:p-6 lg:p-8 relative">
      {/* Subtle organic dairy background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(184, 139, 67, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(35, 70, 49, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Main Login Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#F5EBD7] grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10">
        
        {/* ──────────────── LEFT SIDE: BRAND & HERITAGE ──────────────── */}
        <div className="lg:col-span-5 bg-[#234631] relative overflow-hidden flex flex-col justify-between p-6 sm:p-8 lg:p-10 text-[#F5EBD7]">
          {/* Background image with cinematic film overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: "url('/landing/cow/indigenous-cow.jpg')" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(35, 70, 49, 0.95) 0%, rgba(26, 58, 40, 0.92) 50%, rgba(18, 40, 28, 0.98) 100%)',
            }}
          />

          {/* Decorative ambient glow */}
          <div
            className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, #B88B43 0%, transparent 70%)' }}
          />

          {/* Top: Return to website navigation */}
          <div className="relative z-10">
            <button
              onClick={handleReturnToHome}
              type="button"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#F5EBD7]/80 hover:text-[#B88B43] transition-colors py-1.5 px-3 rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Brand Website</span>
            </button>
          </div>

          {/* Middle: Brand Story & Headline */}
          <div className="relative z-10 my-8 lg:my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B88B43]/20 border border-[#B88B43]/40 text-[#D4A95A] text-xs font-semibold tracking-wider uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Traditional South Indian Dairy</span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FBF7F0] leading-tight mb-4"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Welcome to the
              <span className="block text-[#D4A95A] mt-1">Kamadhenu Family</span>
            </h1>

            <div className="w-16 h-0.5 bg-[#B88B43] mb-5" />

            <p className="text-sm sm:text-base text-[#F5EBD7]/85 leading-relaxed mb-6">
              Tradition, trust and quality — your Kamadhenu experience starts here.
            </p>

            {/* Value Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F5EBD7]/90">
                <CheckCircle2 className="w-4 h-4 text-[#B88B43] flex-shrink-0" />
                <span>Indigenous cow dairy heritage & care</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F5EBD7]/90">
                <CheckCircle2 className="w-4 h-4 text-[#B88B43] flex-shrink-0" />
                <span>Authentic Colostrum Milk Junnu Powder</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F5EBD7]/90">
                <ShieldCheck className="w-4 h-4 text-[#B88B43] flex-shrink-0" />
                <span>Secure Order & Wholesale Distribution</span>
              </div>
            </div>
          </div>

          {/* Bottom Hallmarks */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#F5EBD7]/60">
            <span>Kamadhenu Junnu &copy; {new Date().getFullYear()}</span>
            <span>Pure &bull; Authentic &bull; Natural</span>
          </div>
        </div>

        {/* ──────────────── RIGHT SIDE: SECURE AUTHENTICATION ──────────────── */}
        <div className="lg:col-span-7 bg-[#FCFAF6] flex flex-col justify-between p-6 sm:p-8 lg:p-12">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0E6D2]">
              <div>
                <span className="text-xs font-semibold tracking-widest uppercase text-[#B88B43]">
                  KAMADHENU JUNNU
                </span>
                <h2
                  className="text-xl sm:text-2xl font-bold text-[#234631] mt-0.5"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  Secure Account Access
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#234631]/10 border border-[#B88B43]/30 flex items-center justify-center text-[#234631]">
                <ShieldCheck className="w-6 h-6 text-[#234631]" />
              </div>
            </div>

            {/* Step Explanation */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#2A2A2A]">
                {step === 'phone' ? 'Step 1: Mobile Number' : 'Step 2: Account Password'}
              </h3>
              <p className="text-sm text-[#5A5A5A] mt-1">
                {step === 'phone'
                  ? 'Enter your registered 10-digit mobile number to proceed.'
                  : `Enter your 5-digit account password for +91 ${phone}`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-5 bg-red-50 border-red-200 text-red-800 rounded-lg"
              >
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {/* ── STEP 1: PHONE FORM ── */}
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-[#234631]">
                    Registered Mobile Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-500 font-medium text-sm pointer-events-none">
                      <Phone className="w-4 h-4 text-[#B88B43]" />
                      <span>+91</span>
                      <span className="text-gray-300">|</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-20 h-13 text-base sm:text-lg tracking-wide rounded-lg border-[#D8CEBA] bg-white focus-visible:ring-2 focus-visible:ring-[#B88B43] focus-visible:border-[#234631]"
                      maxLength={10}
                      autoComplete="tel"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-[#7A7A7A]">
                    Enter your registered 10-digit mobile number
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-13 bg-[#234631] hover:bg-[#1A3726] text-[#F5EBD7] font-semibold text-sm sm:text-base tracking-wider uppercase rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                  disabled={loading || phone.length < 10}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#F5EBD7] border-t-transparent rounded-full animate-spin" />
                      Checking Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              /* ── STEP 2: MASKED PASSWORD FORM ── */
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-[#234631]">
                      Account Password
                    </Label>
                    <span className="text-xs text-[#7A7A7A]">5 digits required</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B88B43]" />
                    <Input
                      id="password"
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="current-password"
                      placeholder="•••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      className="pl-11 h-13 text-center text-xl sm:text-2xl font-bold tracking-widest rounded-lg border-[#D8CEBA] bg-white focus-visible:ring-2 focus-visible:ring-[#B88B43] focus-visible:border-[#234631]"
                      maxLength={5}
                      autoFocus
                      required
                    />
                  </div>
                  <p className="text-xs text-[#7A7A7A]">
                    Enter your 5-digit account password
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-13 bg-[#234631] hover:bg-[#1A3726] text-[#F5EBD7] font-semibold text-sm sm:text-base tracking-wider uppercase rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60"
                  disabled={loading || password.length < 5}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#F5EBD7] border-t-transparent rounded-full animate-spin" />
                      Verifying Password...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm font-medium text-[#5A5A5A] hover:text-[#234631] hover:bg-[#F3EDE0]/60"
                  onClick={handleBackToPhone}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Mobile Number
                </Button>
              </form>
            )}
          </div>

          {/* Footer Security Notice */}
          <div className="mt-8 pt-6 border-t border-[#F0E6D2] text-xs text-[#7A7A7A] space-y-2">
            <div className="flex items-center gap-1.5 text-[#234631] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#B88B43]" />
              <span>Restricted Access & Enterprise Protection</span>
            </div>
            <p>
              Only registered wholesale buyers, verified retail partners, and authorized staff may
              access the ordering portal. For access approval or password assistance, contact
              admin support.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
