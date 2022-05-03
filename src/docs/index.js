import { Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Navigation from './components/navigation';
import Demo from './pages/demo';
import Usage from './pages/usage';
import './styles.less';
import { theme } from './theme';

const App = () => {
  const [state, setState] = useState('demo');

  const appendPage = () => {
    switch (state) {
      default:
      case 'demo':
        return <Demo />;

      case 'usage':
        return (
          <Container style={{ paddingTop: '70px' }}>
            <Usage />
          </Container>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navigation setState={setState} state={state} />
      {appendPage()}
    </ThemeProvider>
  );
};

createRoot(document.getElementById('app')).render(<App />);
