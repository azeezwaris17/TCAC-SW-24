import Head from "next/head";
import "@/styles/globals.css";
import "@/styles/paymentslip.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
// -----------------------------------------------------------

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import { wrapper } from "../store";
import { setUser } from "../store/slices/auth/user/userAuthSlice";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

function InnerApp({ Component, pageProps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check sessionStorage for user data on client-side
    if (typeof window !== 'undefined') {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        try {
          const { user, token } = JSON.parse(userData);
          dispatch(setUser({ user, token }));
        } catch (error) {
          console.error("Failed to parse userData from session:", error);
        }
      }
    }
  }, [dispatch]);

  return (
    <>
      <Head>
        {/* Fixed the apostrophe entity and updated description */}
        <title>TCAC&apos;25</title>
        <meta name="description" content="TCAC'25 - Connecting the Community" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/timsan-logo.png" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <InnerApp Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default App;