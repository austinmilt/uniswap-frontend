import { NextPage } from 'next';
import { Swaps } from '../components/Swaps';
import { Tabs } from '@mantine/core';
import { Pools } from '../components/Pools';
import { Tokens } from '../components/Tokens';

enum Tab {
  POOLS = "pools",
  SWAPS = "swaps",
  TOKENS = "tokens"
}

const IndexPage: NextPage = () => {
  return (
    <section>
      <Tabs keepMounted={false} defaultValue="first">
        <Tabs.List>
          <Tabs.Tab value={Tab.POOLS}>Pools</Tabs.Tab>
          <Tabs.Tab value={Tab.SWAPS}>Swaps</Tabs.Tab>
          <Tabs.Tab value={Tab.TOKENS}>Tokens</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={Tab.POOLS}><Pools /></Tabs.Panel>
        <Tabs.Panel value={Tab.SWAPS}><Swaps /></Tabs.Panel>
        <Tabs.Panel value={Tab.TOKENS}><Tokens /></Tabs.Panel>
      </Tabs>
    </section>
  );
};

export default IndexPage;
