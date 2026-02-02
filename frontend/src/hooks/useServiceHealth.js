/**
 * useServiceHealth Hook
 * 
 * Custom React hook for monitoring external service health
 * Provides automatic retry logic with configurable intervals
 * 
 * Usage:
 * const { isHealthy, isChecking, error, retry } = useServiceHealth('http://localhost:5002');
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { checkServiceHealth } from '../utils/serviceHealth.js';

export function useServiceHealth(
  serviceUrl = 'http://localhost:5002',
  checkInterval = 3000,
  timeout = 3000
) {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [checkCount, setCheckCount] = useState(0);
  const intervalRef = useRef(null);

  // Check health function
  const performHealthCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const { healthy, status, error: checkError } = await checkServiceHealth(
        serviceUrl,
        timeout
      );

      if (healthy) {
        setIsHealthy(true);
        setError(null);
      } else {
        setIsHealthy(false);
        setError(checkError);
      }

      setLastChecked(new Date());
      setCheckCount((prev) => prev + 1);
    } catch (err) {
      setIsHealthy(false);
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  }, [serviceUrl, timeout]);

  // Initial check and setup interval
  useEffect(() => {
    // Perform first check immediately
    performHealthCheck();

    // Setup interval for periodic checks
    intervalRef.current = setInterval(performHealthCheck, checkInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [performHealthCheck, checkInterval]);

  // Manual retry function
  const retry = useCallback(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  // Reset state
  const reset = useCallback(() => {
    setIsHealthy(false);
    setIsChecking(true);
    setError(null);
    setCheckCount(0);
    performHealthCheck();
  }, [performHealthCheck]);

  return {
    isHealthy,
    isChecking,
    error,
    lastChecked,
    checkCount,
    retry,
    reset,
  };
}

export default useServiceHealth;
