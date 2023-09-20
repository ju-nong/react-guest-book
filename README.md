# react-guest-book

React와 Firebase를 이용한 방명록 사이트

## 알게된 점

-   Vercel에서 환경변수를 추가할 수 있다.
    (Dashboard -> Settings > Environment Variables)
    env에 등록되어 있는 환경변수명과 똑같이 등록하면 된다.
-   Authentication 카테고리에서 소셜 로그인 기능을 등록하여 사용할 수 있다.
    Github을 사용하려면, 클라이언트 ID와 보안 비밀번호가 필요하다.
    (Github Profile -> Settings -> Developer settings -> OAuth Apps)
-   조합문자를 입력하고 KeyDown Event에서 Enter 입력시에 함수를 호출하게 하면, 두 번 호출된다.
    macOS에서만 발생하는 거로 유추됨.
    event.nativeEvent.isComposing 값이 true일 때만 호출하게 하면 해결된다.

## 남은 작업

-   [알림](https://developer.mozilla.org/ko/docs/Web/API/Notification)

## 참고

-   [Firebase 소셜 로그인](https://healingprocess.tistory.com/44)
-   [KeyDown 조합문자](https://velog.io/@corinthionia/JS-keydown%EC%97%90%EC%84%9C-%ED%95%9C%EA%B8%80-%EC%9E%85%EB%A0%A5-%EC%8B%9C-%EB%A7%88%EC%A7%80%EB%A7%89-%EC%9D%8C%EC%A0%88%EC%9D%B4-%EC%A4%91%EB%B3%B5-%EC%9E%85%EB%A0%A5%EB%90%98%EB%8A%94-%EA%B2%BD%EC%9A%B0-%ED%95%A8%EC%88%98%EA%B0%80-%EB%91%90-%EB%B2%88-%EC%8B%A4%ED%96%89%EB%90%98%EB%8A%94-%EA%B2%BD%EC%9A%B0)
