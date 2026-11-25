import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting to dashboard...'
      });

      navigate('/student');
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive'
      });
      return { data: null, error };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/student`,
          data: {
            full_name: name
          }
        }
      });

      if (error) throw error;

      // Supabase returns an obfuscated user with no identities for an already-registered email
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // No session means email confirmation is required
      if (!data.session) {
        toast({
          title: 'Check Your Email',
          description: 'We sent a confirmation link. Confirm your email, then sign in.'
        });
        navigate('/login');
        return { data, error: null };
      }

      toast({
        title: 'Account Created Successfully!',
        description: 'Welcome to OMR Checker! Redirecting to dashboard...'
      });

      navigate('/student');
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive'
      });
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.'
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return { login, signup, logout };
};
