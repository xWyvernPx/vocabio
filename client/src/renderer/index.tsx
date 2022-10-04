import { createRoot } from 'react-dom/client';
import App from './App';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
const container = document.getElementById('root')!;
const root = createRoot(container);
import store from './redux/store/redux-store';
import Loading from './_components/common/loading/Loading';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  uri: 'https://flyby-gateway.herokuapp.com/',

  cache: new InMemoryCache(),
});

root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </Provider>
  </ApolloProvider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
