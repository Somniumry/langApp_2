import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Animated, PanResponder, Text, View } from 'react-native'
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
  z-index: 10; // 아이콘이 글씨보다 상위
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

  // Interpolation : 입력값(input)을 받아서 output값으로 변환
  const scaleOne = position.y.interpolate({ // y위치를 기준
    inputRange: [-300, -80], // 코드 해석 : 아이콘의 y위치가 -300 ~ -80 위치라면
    outputRange: [2, 1], // scale이 2, 1
    extrapolate: "clamp"
  });

  // 하단(몰라) 부분
  const scaleTwo = position.y.interpolate({ // y위치를 기준
    inputRange: [80, 300],
    outputRange: [1, 2],
    extrapolate: "clamp"
  });

  // Animations
  // PanResponderGrant
  const onPressIn = Animated.spring(scale, {
    toValue: 0.8,
    useNativeDriver: true,
  })

  // PanResponderRelease
  // 터치가 끝났을 때 아이콘 크기를 1로
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true
  })

  // PanResponderRelease
  // 터치 끝났을 때 아이콘의 위치를 0으로
  const goHome = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true
  })

  // drop
  const onDrop = Animated.timing(scale, {
    toValue: 0,
    useNativeDriver: true
  })

  // Pan Responder
  const panResponder = useRef(PanResponder.create({
    // 손가락 이벤트를 감지할 것인가, 말 것인가
    onStartShouldSetPanResponder: () => true,
    // 움직임 감지
    onPanResponderMove: (_, { dx, dy }) => {
      position.setValue({ x: dx, y: dy });
    },
    // scale을 위한 애니메이션 만듬 = 유저에게 아이콘 눌렀음을 보여주기 위해
    onPanResponderGrant: () => {
      onPressIn.start()
    },
    // 터치가 끝났을 때
    onPanResponderRelease: (_, { dy }) => {
      // 아이콘 y축이 -250이면 0으로 돌아가지 않고 drop
      if (dy < -250) {
        // drop
        onDrop.start() // drop으로 아이콘 크기 0으로
        Animated.timing(position, { // '알아' 컨테이너 크기를 원래대로 돌아가게
          // toValue: 0과 같은거임
          // toValue: {
          //   x: 0,
          //   y: 0
          // }
          toValue: 0,
          useNativeDriver: true
        }).start()
      } else if (dy > 250) {
        // drop
      } else {
        Animated.parallel([onPressOut, goHome]).start()
      }
    }
  })).current

  return (
    <Container>
      <Edge>
        {/* scale크기를 scaleOne으로 적용 : 아이콘의 y축이 scaleOne > inputRange 위치에 오면 WordContainer의 scale이 scaleOne > output사이즈로 변환됨 */}
        <WordContainer style={{ transform: [{ scale: scaleOne}]}}>
          <Word color={GREEN}>알아</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          // panResponder를 이용하기 위해
          {...panResponder.panHandlers}
          style={{
            transform: [
              ...position.getTranslateTransform(), // x,y 값 받아서 x,y를 css로 변환?
              { scale: scale }
            ]
          }}>
          <Icon2 name="at" size={76} color={GREY} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
          <Word color={RED}>몰라</Word>
        </WordContainer>
      </Edge>
    </Container >
  )
}

export default App;
