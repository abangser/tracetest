import {useState} from 'react';
import SearchInput from '../../components/SearchInput';
import * as S from './Home.styled';
import HomeActions from './HomeActions';
import TestList from './TestList';

const HomeContent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  return (
    <S.Wrapper>
      <S.TitleText>All Tests</S.TitleText>
      <S.PageHeader>
        <SearchInput onSearch={value => setQuery(value)} placeholder="Search test" />
        <HomeActions />
      </S.PageHeader>
      <TestList query={query} />
    </S.Wrapper>
  );
};

export default HomeContent;
