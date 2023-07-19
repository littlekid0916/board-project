import React, { useState, useEffect } from 'react'
import './style.css';
import Top3ListItem from 'src/components/Top3ListItem';
import { CurrentListResponseDto, Top3ListResponseDto } from 'src/interfaces/response';
import { currentBoardListMock, popularWordListMock, top3ListMock } from 'src/mocks';
import BoardListItem from 'src/components/BoardListItem';
import { useNavigate } from 'react-router-dom';

export default function Main() {

  const navigator = useNavigate();

  const [top3List, setTop3List] = useState<Top3ListResponseDto[]>([]);

  useEffect(() => {
    if (!top3List.length) setTop3List(top3ListMock);
  }, []);

  const MainTop = () => {
    return (
      <div className='main-top'>
        <div className='main-top-text-container'>
          <div className='main-top-text'>Hoons board에서</div>
          <div className='main-top-text'>다양한 이야기를 나눠보세요</div>
        </div>
        <div className='main-top-3-container'>
          <div className='main-top-3-text'>주간 TOP 3 게시글</div>
          <div className='main-top-3-list'>
            {top3List.map((item) => (<Top3ListItem item={item} />))}
          </div>
        </div>
      </div>
    )
  }

  const MainBottom = () => {

    const [currentList, setCurrentList] = useState<CurrentListResponseDto[]>([]);
    const [popularList, setPopularList] = useState<string[]>([]);

    const onPopularClickHandler = (word: string) => {
      navigator(`/search/${word}`);
    }

    useEffect(() => {
      if (!currentList.length) setCurrentList(currentBoardListMock);
    }, []);

    useEffect(() => {
      if (!popularList.length) setPopularList(popularWordListMock);
    }, []);

    return (
      <div className='main-bottom'>
        <div className='main-bottom-text'>최신 게시물</div>
        <div className='main-bottom-container'>
          <div className='main-bottom-board-list'>
            {currentList.map((item) => (<BoardListItem item={item} />))}
          </div>
          <div className='main-bottom-popular-box'>
            <div className='main-bottom-popular-card'>
              <div className='main-bottom-popular-text'>인기 검색어</div>
              <div className='main-bottom-popular-list'>
                {popularList.map((item) => (<span className='popular-chip' onClick={() => onPopularClickHandler(item)}>{item}</span>))}
              </div>
            </div>
          </div>
        </div>
        <div className='main-bottom-pagination'></div>
      </div>
    )
  }

  return (
    <div id='main-wrapper'>
      <MainTop />
      <MainBottom />
    </div>
  )
}