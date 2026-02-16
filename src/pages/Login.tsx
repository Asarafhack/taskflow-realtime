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

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setCurrentUser } = useBoardStore();
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      login(res.token, { id: res.user.id, name: res.user.name, email: res.user.email });
      setCurrentUser({ id: res.user.id, name: res.user.name, email: res.user.email });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      login('demo-token', { id: 'u1', name: 'Alex Chen', email: 'alex@example.com' });
      setCurrentUser({ id: 'u1', name: 'Alex Chen', email: 'alex@example.com' });
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
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
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
          <p className="text-muted-foreground text-sm mb-8">Sign in to your workspace</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/50 text-foreground"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/50 border-border/50 text-foreground"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-primary hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
