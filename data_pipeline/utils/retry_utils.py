import time
import functools
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RetryUtils")

def retry(max_retries=3, initial_delay=1, backoff_factor=2, exceptions=(Exception,)):
    """
    Decorator for exponential backoff retry logic.
    
    :param max_retries: Maximum number of retries before giving up.
    :param initial_delay: Initial delay in seconds.
    :param backoff_factor: Multiplier for the delay after each failure.
    :param exceptions: Tuple of exceptions to catch and retry on.
    """
    def decorator_retry(func):
        @functools.wraps(func)
        def wrapper_retry(*args, **kwargs):
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        logger.warning(f"⚠️ Action failed: {func.__name__} (Attempt {attempt + 1}/{max_retries + 1}). Retrying in {delay}s... Error: {e}")
                        time.sleep(delay)
                        delay *= backoff_factor
                    else:
                        logger.error(f"❌ Action failed: {func.__name__} after {max_retries + 1} attempts. Error: {e}")
            
            # If we reach here, it failed all attempts
            raise last_exception
            
        return wrapper_retry
    return decorator_retry
