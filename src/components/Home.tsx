import themeMap from '@/theme';
import { HomeContainer, InnerWrapper } from './Home.styled';
import HeaderWrapper from '@/components/Header';
import { Upload } from '@/components/Uploader';
import FooterWrap from './Footer';

export default function HomeWrapper({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  return (
    <HomeContainer>
      <HeaderWrapper theme={theme} setTheme={setTheme} />
      <InnerWrapper>
        <Upload theme={theme} />
      </InnerWrapper>
      <InnerWrapper></InnerWrapper>
      <FooterWrap />
    </HomeContainer>
  );
}
