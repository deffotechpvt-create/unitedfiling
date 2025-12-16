// src/contexts/utils/authErrorHandler.ts
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

/**
 * Creates an auth error handler function for context providers
 * Handles authentication errors and redirects to login page
 */
export const createAuthErrorHandler = (
  navigate: ReturnType<typeof useNavigate>,
  logout: ReturnType<typeof useUser>['logout']
) => {
  return (error: any): boolean => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (
      status === 401 ||
      status === 403 ||
      message?.toLowerCase().includes('token') ||
      message?.toLowerCase().includes('unauthorized') ||
      message?.toLowerCase().includes('not authorized')
    ) {
      logout();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      toast({
        title: 'Session Expired',
        description: 'Please login again to continue',
        variant: 'destructive',
      });

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);

      return true; // Auth error was handled
    }
    return false; // Not an auth error
  };
};
