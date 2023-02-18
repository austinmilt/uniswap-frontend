import { NextPage } from 'next';
import { useApolloClient } from '@apollo/client';
import { Demo } from '../components/Table';

const IndexPage: NextPage = () => {
  const apolloClient = useApolloClient();

  return (
    <section>
      <Demo />
    </section>
  );
};

export default IndexPage;
