
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const LinkInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  color: white;

  
  margin: 10px auto;
  border: none;

  padding-left: 45px;
  background: url("https://rotony.com.br/wp-content/uploads/2021/09/free-youtube-logo-icon-2431-thumb.png") no-repeat left;
  background-size: 20px;
  background-color: #161622;
  background-position: 15px;

  :hover::-webkit-input-placeholder {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #E9BC1B;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #DD972B;
  }
`;

export const Content = styled.div`
  width: 50%;
  margin-top: 20px;
  padding: 20px;
  background-color: #f9c901;
  border-radius: 5px;
  color: black;
  font-family: 'Arial';
`;

export const StringLength = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-family: 'Arial';
  color: white;
`;


export const LoadingImage = styled.img`
  width: 40px;
  height: 40px;
`;

export const TopNavbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1080px;
  max-width: 90vw;
  height: 50px;
  margin: auto;
`;

export const Logo = styled.h1`
  font-size: 24px;
  font-family: 'Arial';
  color: white;
`;

export const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #E9BC1B;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:not(:disabled):hover {
    background-color: #DD972B;
  }
`;

export const NavbarLine = styled.hr`
  width: 1080px;
  max-width: 90vw;
  height: 1px;
  background-color: #E9BC1B;
  border: none;
  margin: auto;
`;


export const MainContainer = styled.div`
  display: flex;
  width: 680px;
  max-width: 90vw;
  flex-direction: column;
  margin:  auto;
  margin-top: 150px;
  

  h2 { 
    font-weight: 800;
    font-size: 28px;
    color: white;
  }
`;


export const InputContainer = styled.div`
  background-color: #000;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  padding: 10px 30px;

  h4 { 
    font-weight: 800;
    font-size: 14px;
    color: white;
  }
`;

export const Disclaimer = styled.p`
  font-size: 12px;
  color: white;
  margin-top: 10px;
  margin: auto;
  width: 500px;
  max-width: 90vw;
  text-align: center;
  margin-top: 20px;
  line-height: 1.5;
  margin-bottom: 50px;
`;


export default Container;