import { useUserTopItemsQuery } from '../../__generated__/types';
import LoadingSpinner from '../shared/LoadingSpinner';
import Error from '../shared/Error';
import UserTopTracks from './Tracks';
import UserTopArtists from '../Artists';

interface UserTopItemsProps {
  handlePlayQueue: (uris: string[], offset: number) => void;
}

const UserTopItems: React.FC<UserTopItemsProps> = ({ handlePlayQueue }) => {
  const { data, loading, error } = useUserTopItemsQuery({
    variables: {
      offset: 0,
      limit: 20,
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <Error error={error} />;

  return (
    <>
      <UserTopTracks
        heading="Weekly Top Tracks"
        tracks={data?.userTopItems.topTracks}
        handlePlayQueue={handlePlayQueue}
      />
      <UserTopArtists
        heading="Recent Artists"
        artists={data?.userTopItems.topArtists}
      />
    </>
  );
};

export default UserTopItems;
