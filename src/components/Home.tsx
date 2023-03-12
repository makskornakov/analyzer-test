import themeMap from '@/theme';
import { DoubleContainer, HomeContainer, InnerWrapper } from './Home.styled';
import HeaderWrapper from '@/components/Header';
import { Upload } from '@/components/Uploader';
import FooterWrap from './Footer';
import SettingsSection from './SettingsSection';
import { useRef, useState } from 'react';
import productsJson from '../jsonExamples/products.json';

interface UploadedFile {
  data: Object[];
}

export default function HomeWrapper({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  const [json, setJson] = useState<UploadedFile | null>(productsJson);

  const SettingSection = useRef<HTMLDivElement>(null);

  const scrollToSettings = () => {
    if (SettingSection.current) {
      SettingSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <HomeContainer>
      <HeaderWrapper theme={theme} setTheme={setTheme} />
      <InnerWrapper>
        <h2
          style={{
            top: '1.5em',
          }}
        >
          Some Introduction
        </h2>
        <DoubleContainer>
          <div className="rightBorder">
            <h2>Upload your data</h2>
            <h3>Description</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique recusandae
              voluptas earum! Fugiat, quos aut provident aspernatur et veniam asperiores! Iusto
              necessitatibus distinctio suscipit quod rerum reprehenderit voluptatem consectetur
              itaque?
            </p>
          </div>
          <div className="leftBorder">
            <h2>How to use</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique recusandae
              voluptas earum! Fugiat, quos aut provident aspernatur et veniam asperiores! Iusto
              necessitatibus distinctio suscipit quod rerum reprehenderit voluptatem consectetur
              itaque?
              <br />
              <br />
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique recusandae
              voluptas earum! Fugiat, quos aut provident aspernatur et veniam asperiores! Iusto
              necessitatibus distinctio suscipit quod rerum reprehenderit voluptatem consectetur
              itaque?
            </p>
          </div>
        </DoubleContainer>
      </InnerWrapper>
      <InnerWrapper>
        <h2>Upload your data</h2>
        <Upload theme={theme} json={json} setJson={setJson} />
      </InnerWrapper>
      <InnerWrapper ref={SettingSection}>
        <h2>Set your settings</h2>
        <SettingsSection json={json} scrollFunction={scrollToSettings} />
      </InnerWrapper>
      <InnerWrapper>
        <h2>Clusters on the Canvas</h2>
        <canvas
          style={{
            outline: '1px solid #f55500',

            width: '95%',
            height: '85%',
          }}
        ></canvas>
      </InnerWrapper>
      <FooterWrap />
    </HomeContainer>
  );
}
