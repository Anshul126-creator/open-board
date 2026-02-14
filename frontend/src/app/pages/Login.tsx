import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [pendingForm, setPendingForm] = useState<'login' | 'signup' | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [signupRole, setSignupRole] = useState<'student' | 'center'>('student');
  const [signupCenterId, setSignupCenterId] = useState('');

  const { login, register } = useData();
  const navigate = useNavigate();

  const routeAfterAuth = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user?.role) {
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'center') {
      navigate('/center');
    } else if (user.role === 'student') {
      navigate('/student');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setPendingForm('login');
      const success = await login(loginEmail, loginPassword);
      if (success) {
        toast.success('Login successful!');
        routeAfterAuth();
      }
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setPendingForm(null);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupPasswordConfirm) {
      toast.error('Passwords do not match.');
      return;
    }

    if (signupRole === 'student' && !signupCenterId.trim()) {
      toast.error('Center ID is required for student accounts.');
      return;
    }

    try {
      setPendingForm('signup');
      const success = await register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        passwordConfirmation: signupPasswordConfirm,
        role: signupRole,
        centerId: signupRole === 'student' ? signupCenterId.trim() : undefined,
        
      });

      if (success) {
        toast.success('Account created! You are now signed in.');
        routeAfterAuth();
      }
    } catch (err) {
      toast.error('Sign up failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setPendingForm(null);
    }
  };

  const isSubmitting = (form: 'login' | 'signup') => pendingForm === form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Education Management System</CardTitle>
          <CardDescription>Access all panels with a single account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
            <TabsList className="mx-auto mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting('login')}>
                  {isSubmitting('login') ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Jane Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password-confirm">Confirm Password</Label>
                    <Input
                      id="signup-password-confirm"
                      type="password"
                      placeholder="Confirm password"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select value={signupRole} onValueChange={(value: 'student' | 'center') => setSignupRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="center">Center Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {signupRole === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="signup-center-id">Center ID</Label>
                    <Input
                      id="signup-center-id"
                      placeholder="Enter the ID provided by your center"
                      value={signupCenterId}
                      onChange={(e) => setSignupCenterId(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Ask your center administrator for this ID. It links your student account to the right campus.
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting('signup')}>
                  {isSubmitting('signup') ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          
        </CardContent>
      </Card>
    </div>
  );
}
