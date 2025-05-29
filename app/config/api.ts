// Environment variable will be injected at build time
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export { API_BASE_URL }; 