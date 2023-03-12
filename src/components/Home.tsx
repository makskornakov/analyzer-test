import themeMap from '@/theme';
import { DoubleContainer, HomeContainer, InnerWrapper } from './Home.styled';
import HeaderWrapper from '@/components/Header';
import { Upload } from '@/components/Uploader';
import FooterWrap from './Footer';
import SettingsSection from './SettingsSection';
import { useRef, useState } from 'react';

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
  const [json, setJson] = useState<UploadedFile | null>(null);

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
        <h2>Data Clusturizer is a tool to help you analyze your data sets.</h2>
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
        <h2>Upload your data</h2>
        <Upload theme={theme} json={json} setJson={setJson} />
      </InnerWrapper>
      <InnerWrapper ref={SettingSection}>
        <h2>Set your settings</h2>
        <SettingsSection json={json} scrollFunction={scrollToSettings} />
      </InnerWrapper>
      <FooterWrap />
    </HomeContainer>
  );
}
