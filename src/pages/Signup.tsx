import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useBoardStore } from '@/store/boardStore';
import { api } from '@/services/api';
import { toast } from 'sonner';
import bgAuth from '@/assets/bg-auth.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setCurrentUser } = useBoardStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('All fields are required');
      return;
    }
    setLoading(true);

    try {
      const res = await api.auth.register(name, email, password);
      login(res.token, { id: res.user.id, name: res.user.name, email: res.user.email });
      setCurrentUser({ id: res.user.id, name: res.user.name, email: res.user.email });
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      login('demo-token', { id: 'u1', name: name || 'Demo User', email: email || 'demo@example.com' });
      setCurrentUser({ id: 'u1', name: name || 'Demo User', email: email || 'demo@example.com' });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <img src={bgAuth} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">TaskFlow</span>
          </div>
          <p className="text-muted-foreground text-sm mb-8">Create your account</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border/50 text-foreground" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-border/50 text-foreground" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50 border-border/50 text-foreground" placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
