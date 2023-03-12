import themeMap from '@/theme';
import { DoubleContainer, HomeContainer, InnerWrapper } from './Home.styled';
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
        <DoubleContainer>
          <div className="rightBorder">
            <h2>Upload your data</h2>
            <h3>Description</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Similique recusandae voluptas earum! Fugiat, quos aut provident
              aspernatur et veniam asperiores! Iusto necessitatibus distinctio
              suscipit quod rerum reprehenderit voluptatem consectetur itaque?
            </p>
          </div>
          <div className="leftBorder">
            <h2>How to use</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Similique recusandae voluptas earum! Fugiat, quos aut provident
              aspernatur et veniam asperiores! Iusto necessitatibus distinctio
              suscipit quod rerum reprehenderit voluptatem consectetur itaque?
              <br />
              <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Similique recusandae voluptas earum! Fugiat, quos aut provident
              aspernatur et veniam asperiores! Iusto necessitatibus distinctio
              suscipit quod rerum reprehenderit voluptatem consectetur itaque?
            </p>
          </div>
        </DoubleContainer>
      </InnerWrapper>
      <InnerWrapper>
        <Upload theme={theme} />
      </InnerWrapper>
      <InnerWrapper></InnerWrapper>
      <FooterWrap />
    </HomeContainer>
  );
}
