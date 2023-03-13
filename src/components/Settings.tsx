import { CustomUl, FuncUL } from './Settings.styled';

export default function Settings() {
  return (
    <>
      <h2>Settings</h2>
      <div
        style={{
          outline: '1px solid red',
          width: '90%',
          height: '80%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            outline: '1px solid blue',
            width: '30%',
          }}
        >
          <h3>Keys</h3>
          <CustomUl>
            <li>Price</li>
            <li>Discount</li>
            <li>discountPercentage</li>
          </CustomUl>
        </div>
        <div
          style={{
            outline: '1px solid pink',
            width: '45%',
          }}
        ></div>
        <div
          style={{
            outline: '1px solid blue',
            width: '25%',
          }}
        >
          <h3>Funcs</h3>
          <FuncUL>
            <li>+</li>
            <li>-</li>
            <li>*</li>
            <li>/</li>
          </FuncUL>
        </div>
      </div>
    </>
  );
}
