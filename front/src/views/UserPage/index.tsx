import { ChangeEvent, useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MyPageListResponseDto } from 'src/interfaces/response';
import { usePagination } from 'src/hooks';
import { useUserStore } from 'src/stores';
import BoardListItem from 'src/components/BoardListItem';
import Pagination from 'src/components/Pagination';
import { myPageBoardListMock } from 'src/mocks';
import { AUTH_PATH, BOARD_WRITE_RATH, COUNT_BY_PAGE, MAIN_PATH, USER_PAGE_PATH } from 'src/constants';
import './style.css';
import DefaultProflie from './asset/my_page_profile_default.png';

//        component       //
// description: 유저페이지 화면 //
export default function UserPage() {
  //        state       //
  // description: 유저 이메일 상태 //
  const {userEmail} = useParams();
  // description: 로그인한 사용자의 정보 상태 //
  const { user } = useUserStore();
  // description: 마이페이지 여부 상태 //
  const [myPage, setMyPage] = useState<boolean>(false);

  //        function       //
  // description: 화면 이동을 위한 네비게이트 함수 //
  const navigator = useNavigate();

  //        event handler       //

  //        component       //
  // description: 마이페이지 상단 //
  const MyPageTop = () => {

    //        state       //
    // description: input 요소에 대한 참조용 상태 //
    const fileInputRef = useRef<HTMLInputElement>(null);
    // description: 사용자 프로필 사진 URL 상태 //
    const [profileImageUrl, setProfileImageUrl] = useState<string>(DefaultProflie);
    // description: 사용자 닉네임 상태 //
    const [nickname, setNickname] = useState<string>('야호무야호');
    // description: 닉네임 변경 버튼 상태 //
    const [nicknameChange, setNicknameChange] = useState<boolean>(false);

    //        function       //

    //        event handler       //
    // description: 파일 인풋 변경 시 이미지 미리보기 //
    const onImageInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if(!event.target.files || !event.target.files.length) return;
      // description: 입력 받은 이미지 파일을 URL 형태로 변경해주는 구문 //
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setProfileImageUrl(imageUrl);
    }
    // description: 닉네임 변경 이벤트 //
    const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setNickname(event.target.value);
    }
    // description: 프로필 이미지 선택 시 파일 인풋창 열림 이벤트 //
    const onProfileClickHandler = () => {
      fileInputRef.current?.click();
    }
    // description: 닉네임 변경 버튼 클릭 이벤트 //
    const onNicknameButtonHandler = () => {
      setNicknameChange(!nicknameChange);
    }

    //        component       //

    //        effect        //
    // description: 유저 이메일 상태가 바뀔 때마다 실행 //
    useEffect(() => {
      if (!user) return;
      const isMyPage = user?.email === userEmail;
      if (isMyPage) {
        if (user.profileImage) setProfileImageUrl(user?.profileImage);
        setNickname(user?.nickname);
      }
    }, [userEmail]);

    //        render        //
    return (
      <div className='my-page-top'>
        <div className='my-page-top-container'>
          <div className='my-page-top-profile-box'>
            <div className='my-page-top-profile' style={{ backgroundImage: `url(${profileImageUrl})` }} onClick={onProfileClickHandler}></div>
            <input type='file' style={{ display: 'none' }} ref={fileInputRef} accept='image/*' onChange={onImageInputChangeHandler} />
          </div>
          <div className='my-page-top-info-box'>
            <div className='my-page-info-nickname-container'>
              {nicknameChange ? (
                <input className='my-page-info-nickname-input' type="text" value={nickname} onChange={onNicknameChangeHandler} size={nickname.length} />
              ) : (
                <div className='my-page-info-nickname'>{nickname}</div>
              )}
              {myPage && (
                <div className='my-page-info-nickname-button' onClick={onNicknameButtonHandler}>
                  <div className='my-page-edit-icon'></div>
                </div>
              )}
            </div>
            <div className='my-page-info-email'>{userEmail}</div>
          </div>
        </div>
      </div>
    );
  }

  //        component       //
  // description: 마이페이지 하단 //
  const MyPageBottom = () => {
    //        state       //
    // description: 페이지네이션과 관련된 상태 및 함수 //
    const { totalPage, currentPage, currentSection, onPageClickHandler, onPreviousClickHandler, onNextClickHandler, changeSection } = usePagination();
    // description: 전체 게시물 리스트 상태 //
    const [myPageBoardList, setMyPageBoardList] = useState<MyPageListResponseDto[]>([]);
    // description: 전체 게시물 갯수 상태 //
    const [boardCount, setBoardCount] = useState<number>(0);
    // description: 현재 페이지에서 보여줄 게시물 리스트 상태 //
    const [pageBoardList, setPageBoardList] = useState<MyPageListResponseDto[]>([]);

    //        function       //
    // description: 현재 페이지의 게시물 리스트 분류 함수 //
    const getPageBoardList = (boardCount: number) => {
      const startIndex = COUNT_BY_PAGE * (currentPage - 1);
      const lastIndex = boardCount > COUNT_BY_PAGE * currentPage ? 
        COUNT_BY_PAGE * currentPage : boardCount;
      const pageBoardList = myPageBoardListMock.slice(startIndex, lastIndex);

      setPageBoardList(pageBoardList);
    }

    //        event handler       //
    // description: 글쓰기 버튼 클릭 이벤트 //
    const onWriteButtonClickHandler = () => {
      navigator(BOARD_WRITE_RATH());
    }
    // description: 내 게시물로 가기 버튼 클릭 이벤트 //
    const onMoveMyPageButtonClickHandler = () => {
      if (!user) {
        alert('로그인이 필요합니다.');
        navigator(AUTH_PATH);
        return;
      }
      if (!userEmail) return;
      navigator(USER_PAGE_PATH(userEmail));
    }

    //        component       //

    //        effect        //
    // description: 화면 첫 로드시 게시물 리스트 불러오기 //
    useEffect(() => {
      setMyPageBoardList(myPageBoardListMock);
      setBoardCount(myPageBoardListMock.length);
    }, []);

    // description: 현재 페이지가 바뀔 때마다 마이페이지 게시물 분류하기 //
    useEffect(() => {
      getPageBoardList(myPageBoardListMock.length);
    }, [currentPage]);

    // description: 현재 섹션이 바뀔 때마다 페이지 리스트 변경 //
    useEffect(() => {
      changeSection(myPageBoardListMock.length ,COUNT_BY_PAGE);
    }, [currentSection]);

    //        render        //
    return (
      <div className='my-page-bottom'>
        <div className='my-page-bottom-text'>내 게시물 <span className='my-page-bottom-text-emphsis'>{boardCount}</span></div>
        <div className='my-page-bottom-container'>
          {boardCount ? (
            <div className='my-page-bottom-board-list'>
              {pageBoardList.map((item) => (<BoardListItem item={item} />))}
            </div>
          ) : (
            <div className='my-page-bottom-board-list-nothing'>게시물이 없습니다.</div>
          )}
          <div className='my-page-bottom-write-box'>
            {myPage ? (
              <div className='user-page-bottom-button' onClick={onWriteButtonClickHandler}>
                <div className='my-page-edit-icon'></div>
                <div className='user-page-bottom-button-text'>글쓰기</div>
              </div>
            ) : (
              <div className='user-page-bottom-button'>
                <div className='user-page-bottom-button-text' onClick={onMoveMyPageButtonClickHandler}>내 게시물로 가기</div>
                <div className='user-page-right-arrow-icon'></div>
              </div>
            )}
          </div>
        </div>
        { boardCount !== 0 && (
          <Pagination 
            totalPage={totalPage} 
            currentPage={currentPage} 
            onPageClickHandler={onPageClickHandler} 
            onPreviousClickHandler={onPreviousClickHandler} 
            onNextClickHandler={onNextClickHandler} 
          />
        ) }
      </div>
    );
  }

  //        effect        //
  // description: 유저 이메일 상태가 바뀔 때마다 실행 //
  useEffect(() => {
    if (!userEmail) navigator(MAIN_PATH);
    const isMyPage = user?.email === userEmail;
    setMyPage(isMyPage);
  }, [userEmail]);

  //        render        //
  return (
    <div id='my-page-wrapper'>
      <MyPageTop />
      <MyPageBottom />
    </div>
  )
}
