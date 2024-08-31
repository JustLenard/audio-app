/* eslint-disable react-hooks/exhaustive-deps */
import './styles/App.scss';

// Utils
import i18next from 'i18next';
import { FC, Suspense, lazy, memo, useEffect, useRef } from 'react';
import { getFromLocalStorageWithExpiry } from './utils/localstorage';

// Components
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/Layout';
import { Spinner } from './components/spinner/spinner';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { uiActions } from './store/slices/ui';
import { PersistGate } from 'redux-persist/integration/react';
import { authActions, fetchUser, loginToSpotify } from './store/slices/auth';
import { persistor, store, useAppDispatch, useAppSelector } from './store/store';

// Spotify
import WebPlayback, { WebPlaybackProps } from './utils/spotify/webPlayback';

// Pages
import SearchContainer from './pages/Search/Container';

const Home = lazy(() => import('./pages/Home'));
const Page404 = lazy(() => import('./pages/404'));
const Profile = lazy(() => import('./pages/Profile'));
const AlbumView = lazy(() => import('./pages/Album'));
const GenrePage = lazy(() => import('./pages/Genre'));
const BrowsePage = lazy(() => import('./pages/Browse'));
const ArtistPage = lazy(() => import('./pages/Artist'));
const PlaylistView = lazy(() => import('./pages/Playlist'));
const ArtistDiscographyPage = lazy(() => import('./pages/Discography'));

const SearchPage = lazy(() => import('./pages/Search/Home'));
const SearchTracks = lazy(() => import('./pages/Search/Songs'));
const LikedSongsPage = lazy(() => import('./pages/LikedSongs'));
const SearchAlbums = lazy(() => import('./pages/Search/Albums'));
const SearchPlaylist = lazy(() => import('./pages/Search/Playlists'));
const SearchPageArtists = lazy(() => import('./pages/Search/Artists'));
const RecentlySearched = lazy(() => import('./pages/Search/RecentlySearched'));

window.addEventListener('resize', () => {
  const vh = window.innerWidth;
  if (vh < 950) {
    store.dispatch(uiActions.collapseLibrary());
  }
});

const SpotifyContainer: FC<{ children: any }> = memo(({ children }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const token = getFromLocalStorageWithExpiry('access_token');
    if (!token) {
      dispatch(loginToSpotify());
    } else {
      dispatch(authActions.setToken({ token }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

  if (!token) return <Spinner loading />;

  const webPlaybackSdkProps: WebPlaybackProps = {
    playerAutoConnect: true,
    playerInitialVolume: 1.0,
    playerRefreshRateMs: 1000,
    playerName: 'Spotify React Player',
    onPlayerRequestAccessToken: () => Promise.resolve(token!),
    onPlayerLoading: () => {},
    onPlayerWaitingForDevice: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
      dispatch(authActions.fetchUser());
    },
    onPlayerError: (e) => {
      dispatch(loginToSpotify());
    },
    onPlayerDeviceSelected: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
    },
  };

  return <WebPlayback {...webPlaybackSdkProps}>{children}</WebPlayback>;
});

const RootComponent = () => {
  const container = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.language.language);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    i18next.changeLanguage(language);
  }, [language]);

  const routes = [
    { path: '', element: <Home container={container} /> },
    { path: '/collection/tracks', element: <LikedSongsPage container={container} /> },
    { path: '/playlist/:playlistId', element: <PlaylistView container={container} /> },
    { path: '/album/:albumId', element: <AlbumView container={container} /> },
    {
      path: '/artist/:artistId/discography',
      element: <ArtistDiscographyPage container={container} />,
    },
    { path: '/artist/:artistId', element: <ArtistPage container={container} /> },
    { path: '/profile', element: <Profile /> },
    { path: '/genre/:genreId', element: <GenrePage /> },
    { path: '/search', element: <BrowsePage /> },
    { path: '/recent-searches', element: <RecentlySearched /> },
    {
      path: '/search/:search',
      element: <SearchContainer container={container} />,
      children: [
        {
          path: 'artists',
          element: <SearchPageArtists container={container} />,
        },
        {
          path: 'albums',
          element: <SearchAlbums container={container} />,
        },
        {
          path: 'playlists',
          element: <SearchPlaylist container={container} />,
        },
        {
          path: 'tracks',
          element: <SearchTracks container={container} />,
        },
        {
          path: '',
          element: <SearchPage container={container} />,
        },
      ],
    },
    { path: '*', element: <Page404 /> },
  ];

  return (
    <Spinner loading={!user}>
      <Router>
        <AppLayout>
          <div className='Main-section' ref={container}>
            <div style={{ minHeight: 'calc(100vh - 230px)', width: '100%' }}>
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Suspense>{route.element}</Suspense>}
                  >
                    {route?.children
                      ? route.children.map((child) => (
                          <Route
                            key={child.path}
                            path={child.path}
                            element={<Suspense>{child.element}</Suspense>}
                          />
                        ))
                      : undefined}
                  </Route>
                ))}
              </Routes>
            </div>
          </div>
        </AppLayout>
      </Router>
    </Spinner>
  );
};

function App() {
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'SpotifyMixUI' } }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SpotifyContainer>
            <RootComponent />
          </SpotifyContainer>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
