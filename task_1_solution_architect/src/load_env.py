import os
import logging

logger = logging.getLogger(__name__)

def load_env_file():
    """Load environment variables from env or .env file if they exist."""
    # Check parent directory (task_1_solution_architect) and current directory
    possible_dirs = [
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),  # parent dir
        os.path.dirname(os.path.abspath(__file__))  # current dir (src)
    ]
    
    # Try env first, then .env for compatibility
    env_filenames = ['env', '.env']
    
    for base_dir in possible_dirs:
        for env_filename in env_filenames:
            env_path = os.path.join(base_dir, env_filename)
            if os.path.exists(env_path):
                logger.info(f"Loading environment variables from {env_path}")
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            key = key.strip()
                            value = value.strip().strip('"').strip("'")
                            # Only set if not already in environment
                            if key not in os.environ:
                                os.environ[key] = value
                return  # Stop after loading the first found file
    
    logger.debug("No env or .env file found, using system environment variables only")

# Load env file when module is imported
load_env_file()