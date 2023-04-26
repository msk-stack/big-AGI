import * as React from 'react';

import { Container, useTheme } from '@mui/joy';

import { Chat } from '@/apps/chat/Chat';
import { NoSSR } from '@/common/components/NoSSR';
import { SettingsModal } from '@/apps/settings/SettingsModal';
import { isValidOpenAIApiKey } from '@/modules/openai/openai.client';
import { useSettingsStore } from '@/common/state/store-settings';


export default function Home() {
  // state
  const [settingsShown, setSettingsShown] = React.useState(false);

  // external state
  const theme = useTheme();
  const apiKey = useSettingsStore(state => state.apiKey);
  const centerMode = useSettingsStore(state => state.centerMode);


  // show the Settings Dialog at startup if the API key is required but not set
  React.useEffect(() => {
    if (!process.env.HAS_SERVER_KEY_OPENAI && !isValidOpenAIApiKey(apiKey))
      setSettingsShown(true);
  }, [apiKey]);


  return (
    /**
     * Note the global NoSSR wrapper
     *  - Even the overall container could have hydration issues when using localStorage and non-default maxWidth
     */
    <NoSSR>

      <Container maxWidth={centerMode === 'full' ? false : centerMode === 'narrow' ? 'md' : 'xl'} disableGutters sx={{
        boxShadow: {
          xs: 'none',
          md: centerMode === 'narrow' ? theme.vars.shadow.md : 'none',
          xl: centerMode !== 'full' ? theme.vars.shadow.lg : 'none',
        },
      }}>

        <Chat onShowSettings={() => setSettingsShown(true)} />

        <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />

      </Container>

    </NoSSR>
  );
}