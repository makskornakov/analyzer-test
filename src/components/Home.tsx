import themeMap from '@/theme';
import { DoubleContainer, HomeContainer, InnerWrapper } from './Home.styled';
import HeaderWrapper from '@/components/Header';
import { Upload } from '@/components/Uploader';
import FooterWrap from './Footer';
import SettingsSection from './SettingsSection';
import { useEffect, useRef, useState } from 'react';
import productsJson from '../jsonExamples/products.json';
import Board, { BoardItem } from './Board/Board';
import {
  // exampleBoardContent,
  exampleCalculator,
} from './Board/example';
import type { BoardContent } from './Board/Board';
import { calculateExact } from '@/helpers/calculateExact';

interface UploadedFile {
  data: Object[];
}
const calculateListResult = function (list: BoardItem[]) {
  let listString = '';
  let errorFound = false;

  list.map((item) => {
    const prev = list[list.indexOf(item) - 1];

    if (item.content) {
      listString += ` ${Number(item.content)}`;
      if (prev && prev.content) errorFound = true;
    } else {
      listString += ` ${item.title}`;
      if (!prev?.content) errorFound = true;
    }
  });

  if (list.length < 3 || errorFound) return listString;

  try {
    const result = calculateExact(listString);
    return Math.round(result * 100000) / 100000;
  } catch (e) {
    console.log(e);
    return listString;
  }
};

export default function HomeWrapper({
  theme,
  setTheme,
}: {
  theme: keyof typeof themeMap;
  setTheme: (newTheme: keyof typeof themeMap) => void;
}) {
  const [json, setJson] = useState<UploadedFile | null>(productsJson);
  const [calcRes, setCalcRes] = useState<number | string | null>(null);
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

  useEffect(() => {
    if (boardContent) {
      const list = boardContent.get('Calculate');
      if (list) {
        setCalcRes(calculateListResult(list.items));
      }
    }
  }, [boardContent]);

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
            borderTop: '2px dashed #f55500',
            borderBottom: '2px dashed #f55500',
            overflowY: 'scroll',
            paddingBottom: '1.5em',
          }}
        >
          <Board
            initialBoardContent={boardContent}
            setNewBoardContent={setBoardContent}
            listWidth={'10em'}
            itemHeight={'3em'}
            listPadding={'1em'}
            // transitionDuration={400}
            // sensitivityPercentage={80}
            itemStyle={{
              borderRadius: '0.5em',
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
            // ? Comment to see default component render
            ItemComponent={ItemComponent}
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
function ItemComponent({ item }: { item: BoardItem }) {
  return (
    <>
      <h4>{item.title}</h4>
      {item.content && (
        <>
          <span
            style={{
              color: '#b74000',
            }}
          >
            =
          </span>
          <p
            style={{
              color: '#7a7a7a',
            }}
          >
            {item.content}
          </p>
        </>
      )}
    </>
  );
}
