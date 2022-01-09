import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Animated, Text, View } from 'react-native'
import Icon2 from 'react-native-vector-icons/dist/FontAwesome5';
import icons from './icons'

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`

const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

// 글자 컨테이너 (동그라미)가 애니메이션 효과 가지기 원하니 Animated 연결
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`

const Word = styled.Text`
  font-size: 38px;
  font-weight: bold;
  color: ${props => props.color};
`
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`

// Animated.View에 value 연결
// 카드 크기가 터치되면 크게 되기를 바라니까 Animated 연결
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 10px 10px;
  border-radius: 10px;
`


const App = () => {

  // Values
  // 사용자가 클릭했을 때 아이콘에 부여하기 위한 값
  const scale = useRef(new Animated.Value(1)).current; // 크기 기본 1
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current; // 위치 기본 x,y

  return (
    <Container>
      <Edge>
        <WordContainer>
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard style={{
          transform: [
            ...position.getTranslateTransform(),
            {scale: scale}
          ]
        }}>
          <Icon2 name="at" size={76} color={GREY} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container >
  )
}

export default App;
