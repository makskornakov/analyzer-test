const mainDarkColors = {
  absolute: '#000',
  text: '#fff',
  background: '#121213',
  // background: 'green',
  gray: {
    a: '#d9d9d9',
    b: '#a9a9a9',
    c: '#7c7c7c',
  },
};
const mainLightColors = {
  absolute: '#fff',
  text: '#121213',
  background: '#f4f4f4',
  // background: 'pink',
  gray: {
    a: '#303030',
    b: '#7c7c7c',
    c: '#c5c5c5',
  },
};

const theme1 = {
  primary: '#f55500',
  secondary: '#f5d800',
  candleGreen: '#6bc800',
  candleRed: '#ff0037',
  buttons: '#6bc800',
};

const themeMap = {
  dark: {
    colors: {
      ...mainDarkColors,
      ...theme1,
      // icons: darkIcons,
    },
  },
  light: {
    colors: {
      ...mainLightColors,
      ...theme1,
      // icons: lightIcons,
    },
  },
  // dark2: {
  //   colors: {
  //     ...mainDarkColors,
  //     ...theme2,
  //     // icons: darkIcons,
  //   },
  // },
  // light2: {
  //   colors: {
  //     ...mainLightColors,
  //     ...theme2,
  //     // icons: lightIcons,
  //   },
  // },
};

export default themeMap;
