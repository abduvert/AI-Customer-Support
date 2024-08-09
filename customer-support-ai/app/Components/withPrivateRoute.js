// components/withPrivateRoute.js
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Adjust the import path as needed

const withPrivateRoute = (WrappedComponent) => {
  const Wrapper = (props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push('/sign-in'); // Redirect to sign-in page
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <div>Loading...</div>; // Optional loading state
    }

    return authenticated ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default withPrivateRoute;