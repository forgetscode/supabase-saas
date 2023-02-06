import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabase';
import { UserProfileContextProvider } from '../hooks/use-profile';
import Nav from '../components/Nav';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <SessionContextProvider supabaseClient={ supabase } initialSession={ pageProps.initialSession }>
      <UserProfileContextProvider>
        <Nav/>
        <Component {...pageProps} />
      </UserProfileContextProvider>
    </SessionContextProvider>
  );
}

export default MyApp
