import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageSkeleton from './PageSkeleton';

const PageTransitionLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // small delay for smooth UX

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading) {
    return <PageSkeleton />;
  }

  return children;
};

export default PageTransitionLoader;
