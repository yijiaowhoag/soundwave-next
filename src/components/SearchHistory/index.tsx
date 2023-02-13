import styled from 'styled-components';
import { TiDelete } from 'react-icons/ti';
import {
  useRemoveSearchMutation,
  Search,
  SelfQuery,
  SelfDocument,
} from '../../__generated__/types';

const SearchHistoryDiv = styled.div`
  padding: 1rem 1.5rem 1rem 2.5rem;

  h2 {
    margin: 0;
    font-weight: 400;
    font-size: 20px;
    text-shadow: 3px 3px 2px ${({ theme }) => theme.colors.darkest};
  }
`;

const RecentSearches = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem 0;
  list-style: none;
`;

const Card = styled.div`
  position: relative;
  width: 175px;
  height: 220px;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  box-shadow: 10px 5px 10px 5px ${({ theme }) => theme.shadow.darkest};
`;

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 5px 0 5px 5px;
  background: ${({ theme }) =>
    `linear-gradient(45deg, ${theme.colors.spotifyGreen}, ${theme.colors.lightGreen10})`};
  opacity: 0.7;
`;

const Info = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-shadow: 3px 3px 2px ${({ theme }) => theme.shadow.dark};

  h4 {
    color: ${({ theme }) => theme.colors.spotifyGreen};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const DeleteIcon = styled.span`
  position: absolute;
  top: -15px;
  right: -15px;
  width: 34px;
  height: 34px;
  cursor: pointer;

  .icon {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.spotifyGreen};
    filter: ${({ theme }) =>
      `drop-shadow(3px 5px 3px ${theme.shadow.darkest})`};
  }
`;

interface SearchHistoryProps {
  recentSearches: Search[];
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ recentSearches }) => {
  const [removeSearch] = useRemoveSearchMutation();

  const handleRemove = (searchId: string) => {
    removeSearch({
      variables: { searchId },
      update(cache, { data }) {
        const x = cache.readQuery<SelfQuery>({
          query: SelfDocument,
        });

        if (!x) return;

        cache.writeQuery({
          query: SelfDocument,
          data: {
            currUser: {
              ...x.currUser,
              searches: x.currUser.searches.filter(
                (search) => search.id !== searchId
              ),
            },
          },
        });
      },
    });
  };

  return (
    <SearchHistoryDiv>
      <h2>Recent Searches</h2>
      <RecentSearches>
        {recentSearches.map((search) => (
          <li key={search.id}>
            <Card>
              <DeleteIcon onClick={() => handleRemove(search.id)}>
                <TiDelete className="icon" />
              </DeleteIcon>
              <ImageOverlay />
              <Image src={search.imageUrl} />
              <Info>
                <h4>{search.name}</h4>
              </Info>
            </Card>
          </li>
        ))}
      </RecentSearches>
    </SearchHistoryDiv>
  );
};

export default SearchHistory;
