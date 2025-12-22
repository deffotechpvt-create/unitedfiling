import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ExpertRequestData {
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
}

export const useExpertRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendExpertRequest = async (data: ExpertRequestData) => {
    setIsLoading(true);   
  };

  return { sendExpertRequest, isLoading };
};