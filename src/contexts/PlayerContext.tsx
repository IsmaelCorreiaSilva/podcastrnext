import id from 'date-fns/esm/locale/id/index.js';
import {createContext, useContext, ReactNode, useState} from 'react';
import Episode from '../pages/episodes/[slug]';

type Episode={
  id: string; 
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string
}
type PlayerContextData={
  episodeList: Episode[],
  currentEpisodeIndex:number,
  isPlaying: boolean,
  play:(episode:Episode)=> void;
  tooglePlay:()=>void;
  setPlayingState:(state: boolean)=>void;
  playList:(list:Episode[], index: number) => void;
  playNext:()=>void;
  playPrevius:()=>void;
  toogleLoop:()=>void;
  toogleShuffle:()=>void;
  clearPlayerState:()=>void;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevius:boolean;
  hasNext:boolean;
}
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps={
  children: ReactNode;
}
export function PlayerContextProvider({children}:PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlayind] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlayind(true)
  }
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlayind(true);
  }
  const hasNext= isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevius= currentEpisodeIndex>0;

  function playNext(){
    //const nextEpisode = currentEpisodeIndex + 1;
    if(isShuffling){
      const nextRandom = Math.floor(Math.random()* episodeList.length)
      setCurrentEpisodeIndex(nextRandom);
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPrevius(){
    if(hasPrevius){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  function tooglePlay(){
    setIsPlayind(!isPlaying);
  }
  function toogleLoop(){
    setIsLooping(!isLooping);
  }
  function toogleShuffle(){
    setIsShuffling(!isShuffling)
  }
  function setPlayingState(state:boolean){
    setIsPlayind(state)
  }
  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value={{
      episodeList, 
      currentEpisodeIndex,
      playList,
      playNext,
      playPrevius,
      hasNext, hasPrevius,
       play, isPlaying, 
       tooglePlay, setPlayingState,
       isLooping,
       toogleLoop,
       isShuffling,
       toogleShuffle,
       clearPlayerState,
       }}>
      {children}
    </PlayerContext.Provider>
   )
}
export const usePlayer = () =>{
  return useContext(PlayerContext);
}