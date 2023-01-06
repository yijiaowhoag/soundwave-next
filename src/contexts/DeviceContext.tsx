import { createContext, useContext, useEffect, useState } from 'react';
import { usePlayer } from './PlayerContext';

interface Device {
  id: string;
  ready: boolean;
}

const DeviceContext = createContext<Device | undefined>(undefined);

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider: React.FC = ({ children }) => {
  const player = usePlayer();

  const [device, setDevice] = useState<Device | undefined>();

  useEffect(() => {
    if (!player) return;

    player.addListener('ready', ready);

    player.addListener('not_ready', notReady);

    return () => {
      player.removeListener('ready', ready);
      player.removeListener('not_ready', notReady);
    };
  }, [player]);

  const ready = ({ device_id }: Spotify.WebPlaybackInstance) => {
    console.log('Ready with Device ID', device_id);
    setDevice({ id: device_id, ready: true });
  };

  const notReady = ({ device_id }: Spotify.WebPlaybackInstance) => {
    console.log('Device ID has gone offline', device_id);
    setDevice({ id: device_id, ready: false });
  };

  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
};
