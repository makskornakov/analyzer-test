import themeMap from '@/theme';
import { DoubleContainer, HomeContainer, InnerWrapper } from './Home.styled';
import HeaderWrapper from '@/components/Header';
import { Upload } from '@/components/Uploader';
import FooterWrap from './Footer';
import SettingsSection from './SettingsSection';
import { useRef, useState } from 'react';
import productsJson from '../jsonExamples/products.json';
import Board from './Board/Board';
import { exampleBoardContent, exampleCalculator } from './Board/example';
import type { BoardContent } from './Board/Board';

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
  const [calcRes, setCalcRes] = useState<number | null>(null);
  const [boardContent, setBoardContent] = useState<BoardContent>(exampleCalculator);

  const SettingSection = useRef<HTMLDivElement>(null);

  const scrollToSettings = () => {
    if (SettingSection.current) {
      SettingSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // interface calcArray {
  //   [key: string]: number | null;
  // }

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
      {/* <InnerWrapper ref={SettingSection}> */}
      <InnerWrapper>
        <h2>Set your settings</h2>
        <SettingsSection json={json} scrollFunction={scrollToSettings} />
      </InnerWrapper>
      {/* <InnerWrapper> */}
      <InnerWrapper ref={SettingSection}>
        <div
          style={{
            width: '70%',
            height: '80%',
            outline: '1px solid #f55500',
          }}
        >
          <Board
            initialBoardContent={boardContent}
            setNewBoardContent={setBoardContent}
            listWidth={'250px'}
            itemHeight={'3em'}
            itemGap={'1em'}
            listPadding={'1em'}
            // transitionDuration={400}
            itemStyle={{
              borderRadius: '0.5em',
              // border: '2px solid grey',
              background: '#252525',
              display: 'flex',
              gap: '1em',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            listStyle={{
              borderRadius: '0.5em',
              border: '1.5px solid grey',
            }}
            itemActiveStyle={{
              background: '#f55500',
            }}
            listActiveStyle={{
              background: 'rgba(104, 61, 173, 0.15)',
              border: '1.5px solid #a5a5a5',
            }}
          />
        </div>
        <p>{calcRes ? `Result: ${calcRes}` : 'No result yet'}</p>
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
