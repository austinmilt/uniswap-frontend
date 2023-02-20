import { NextPage } from 'next';
import { Swaps } from '../components/Swaps';
import { Center, Stack, Tabs, Title, Text, createStyles } from '@mantine/core';
import { Pools } from '../components/Pools';
import { Tokens } from '../components/Tokens';

enum Tab {
  POOLS = "pools",
  SWAPS = "swaps",
  TOKENS = "tokens"
}

const IndexPage: NextPage = () => {
  const { classes } = useStyles();

  return (<main className={classes.main}>
    <Stack align='center'>
      <section id="overview">
        <Stack align='center'>
          <Title>Uniswap UI</Title>
          <Stack align='left'>
            <Text>
              Uniswap is a decentralized cryptocurrency
              exchange that uses a set of smart contracts
              to execute trades on its exchange.
            </Text>
            <Text size="sm" color='dimmed'>
              This site gives a minimal view into the status of
              Uniswap v3. It was developed as part of a coding
              challenge and should not be used to inform financial
              decisions.
            </Text>
          </Stack>
        </Stack>
      </section>
      <section id="tables">
        <Stack align='center' spacing="lg">
          <Tabs defaultValue={Tab.POOLS}>
            <Center>
              <Tabs.List>
                <Tabs.Tab value={Tab.POOLS}>Pools</Tabs.Tab>
                <Tabs.Tab value={Tab.SWAPS}>Swaps</Tabs.Tab>
                <Tabs.Tab value={Tab.TOKENS}>Tokens</Tabs.Tab>
              </Tabs.List>
            </Center>

            <Tabs.Panel value={Tab.POOLS}><Pools /></Tabs.Panel>
            <Tabs.Panel value={Tab.SWAPS}><Swaps /></Tabs.Panel>
            <Tabs.Panel value={Tab.TOKENS}><Tokens /></Tabs.Panel>
          </Tabs>
        </Stack>
      </section>
    </Stack>
  </main>
  );
};

export default IndexPage;


//TODO responsive
const useStyles = createStyles(() => ({
  main: {
    width: "60vw",
    marginLeft: "20vw",
    marginTop: "2vh",
    marginBottom: "2vh",
  }
}));
