import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

const isValidObjectId = (id) => {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
};

export const useCauseProgress = (causeId) => {
  return useQuery({
    queryKey: ['causeProgress', causeId],
    queryFn: async () => {
      if (!causeId) {
        return { currentAmount: 0, targetAmount: 0 };
      }

      if (!isValidObjectId(causeId)) {
        console.error(`Invalid cause ID format: ${causeId}`);
        return {
          currentAmount: 0,
          targetAmount: 0,
          error: true,
          errorMessage: 'Invalid cause ID format'
        };
      }
      
      try {
        const response = await axios.get(`http://localhost:5001/api/causes/${causeId}/progress`, {
          withCredentials: true,
          timeout: 5000,
          // Add cache-busting parameter
          params: { _t: Date.now() }
        });
        
        console.log('Progress API response:', response.data);
        
        const { currentAmount, targetAmount } = response.data;
        
        return {
          currentAmount: Number(currentAmount) || 0,
          targetAmount: Number(targetAmount) || 0,
          progress: targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0,
          success: true
        };
      } catch (error) {
        // Handle specific error cases
        if (error.response) {
          switch (error.response.status) {
            case 404:
              console.warn(`Cause ${causeId} not found`);
              toast.error("Cause not found");
              break;
            case 400:
              console.warn(`Invalid cause ID format: ${causeId}`);
              toast.error("Invalid cause ID format");
              break;
            case 500:
              console.error(`Server error while fetching progress for cause ${causeId}`, error.response.data);
              toast.error("Failed to load progress. Please try again later.");
              break;
            default:
              console.error(`Unexpected error (${error.response.status}) while fetching progress`, error);
              toast.error("An unexpected error occurred");
          }
        } else if (error.code === 'ECONNABORTED') {
          console.error('Request timeout while fetching progress');
          toast.error("Request timeout. Please try again.");
        } else if (error.request) {
          console.error('Network error while fetching progress');
          toast.error("Network error. Please check your connection.");
        } else {
          console.error('Error setting up progress request:', error);
          toast.error("Failed to process request");
        }

        return {
          currentAmount: 0,
          targetAmount: 0,
          error: true,
          errorMessage: error.response?.data?.message || error.message,
          errorCode: error.response?.status || error.code
        };
      }
    },
    enabled: !!causeId,
    // Change refetch interval to 30 minutes (in milliseconds)
    refetchInterval: 30 * 60 * 1000,
    // Disable automatic background refetching on window focus
    refetchOnWindowFocus: false,
    // Increase stale time to 30 minutes
    staleTime: 30 * 60 * 1000,
    // Keep previous data while fetching
    keepPreviousData: true,
    // Modify retry configuration
    retry: (failureCount, error) => {
      // Only retry once for network errors
      return failureCount < 1 && (error.code === 'ECONNABORTED' || error.response?.status === 500);
    },
    retryDelay: 5000, // Wait 5 seconds before retrying
  });
};
