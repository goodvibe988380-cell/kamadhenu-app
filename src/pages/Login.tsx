import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Milk, Phone, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { generateOTP, login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    const result = await generateOTP(phone);
    setLoading(false);

    if (result.success) {
      setGeneratedOTP(result.otp || null);
      setStep('otp');
    } else {
      setError(result.message);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    const result = await login(phone, otp);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp('');
    setGeneratedOTP(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4 shadow-lg">
            <Milk className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Kamadhenu Junnu</h1>
          <p className="text-gray-600 mt-1">Order Management System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {step === 'phone' ? 'Welcome Back' : 'Verify OTP'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'phone' 
                ? 'Enter your phone number to continue' 
                : `Enter the 6-digit code sent to +91 ${phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="pl-10 h-12 text-lg"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Get OTP'}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                {/* Demo OTP Display */}
                {generatedOTP && (
                  <Alert className="mb-4 bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Demo OTP: <strong>{generatedOTP}</strong>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP Code</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 h-12 text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleBack}
                >
                  Back to Phone Number
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Restricted Access Only</p>
              <p className="mt-1">Contact admin for account approval</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Kamadhenu Junnu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
