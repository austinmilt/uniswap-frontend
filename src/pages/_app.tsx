import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';

import 'normalize.css/normalize.css';
import { useApollo } from '../lib/apollo';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <NotificationsProvider>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;
