import { FC, memo, useMemo } from 'react';

import { AlbumIcon, ArtistIcon, DeleteIcon, AddToPlaylist, AddToQueueIcon } from '../Icons';
import { Dropdown, MenuProps, message } from 'antd';

// Services
import { playerService } from '../../services/player';
import { playlistService } from '../../services/playlists';

// Utils
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Interface
import type { Track } from '../../interfaces/track';
import type { Album } from '../../interfaces/albums';
import type { Playlist } from '../../interfaces/playlists';

// Redux
import { fetchQueue } from '../../store/slices/queue';
import { playlistActions } from '../../store/slices/playlist';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  fetchMyPlaylists,
  getUserPlaylists,
  yourLibraryActions,
} from '../../store/slices/yourLibrary';

interface TrackActionsWrapperProps {
  canEdit?: boolean;
  saved?: boolean;
  album?: Album | null;
  playlist?: Playlist | null;
  track: Track | Spotify.Track;
  trigger?: ('contextMenu' | 'click')[];
  children: React.ReactNode | React.ReactNode[];
}

export const TrackActionsWrapper: FC<TrackActionsWrapperProps> = memo((props) => {
  const { children, track, playlist, canEdit, album } = props;

  const { t } = useTranslation(['playlist']);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const myPlaylists = useAppSelector(getUserPlaylists);
  const user = useAppSelector((state) => state.auth.user);

  const options = useMemo(() => {
    return myPlaylists
      .filter((p) => p.id !== playlist?.id)
      .map((p) => {
        return {
          key: p.id,
          label: p.name,
          onClick: () => {
            playlistService.addPlaylistItems(p!.id, [track.uri], p?.snapshot_id!).then(() => {
              dispatch(playlistActions.refreshTracks(playlist!.id));
              message.open({
                type: 'success',
                content: t('Added to playlist'),
              });
            });
          },
        };
      });
  }, [dispatch, myPlaylists, playlist, track.uri, t]);

  const items = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: t('Add to playlist'),
        icon: <AddToPlaylist />,
        key: '1',
        children: [
          {
            label: t('New playlist'),
            key: 'new',
            onClick: () => {
              playlistService.createPlaylist(user?.id!, { name: track.name }).then((response) => {
                const playlist = response.data;
                playlistService
                  .addPlaylistItems(playlist.id, [track.uri], playlist.snapshot_id!)
                  .then(() => {
                    dispatch(fetchMyPlaylists());
                    message.success(t('Added to playlist'));
                  });
              });
            },
          },
          { type: 'divider' },
          ...options,
        ],
      },
    ];

    if (canEdit && playlist) {
      items.push({
        label: t('Remove from this playlist'),
        key: '2',
        icon: <DeleteIcon />,
        onClick: () => {
          playlistService
            .removePlaylistItems(playlist!.id, [track.uri], playlist?.snapshot_id!)
            .then(() => {
              dispatch(playlistActions.refreshPlaylist(playlist!.id));
              dispatch(playlistActions.refreshTracks(playlist!.id));
              dispatch(yourLibraryActions.fetchMyPlaylists());
              message.open({
                type: 'success',
                content: t('Removed from playlist'),
              });
            });
        },
      });
    }

    items.push(
      {
        label: t('Add to queue'),
        key: '3',
        icon: <AddToQueueIcon />,
        onClick: () => {
          playerService.addToQueue(track.uri).then(() => {
            dispatch(fetchQueue());
            message.open({
              type: 'success',
              content: t('Added to queue'),
            });
          });
        },
      },
      { type: 'divider' },
      {
        label: t('Go to artist'),
        key: '5',
        icon: <ArtistIcon />,
        onClick: () => {
          navigate(
            // @ts-ignore
            `/artist/${track.artists[0]?.id || track.artists[0].uri.split(':').reverse()[0]}`
          );
        },
      }
    );

    if (!album) {
      items.push({
        label: t('Go to album'),
        key: '6',
        icon: <AlbumIcon />,
        onClick: () => {
          // @ts-ignore
          navigate(`/album/${track.album?.id || track.album.uri.split(':').reverse()[0]}`);
        },
      });
    }

    return items;
  }, [
    t,
    options,
    canEdit,
    playlist,
    album,
    user?.id,
    track.name,
    track.uri,
    track.artists,
    track.album,
    dispatch,
    navigate,
  ]);

  return (
    <>
      <Dropdown menu={{ items }} trigger={props.trigger}>
        {children}
      </Dropdown>
    </>
  );
});
