import { useContext, useRef, useEffect, useState } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'
import Image from 'next/image'

import style from './style.module.scss'
import 'rc-slider/assets/index.css'
import { convertDurantionToTimeString } from '../../util/convertDurantionToTimeString'


export function Player(){
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    tooglePlay,
    toogleLoop,
    toogleShuffle,
    playNext,
    playPrevius,
    hasNext,
    isLooping,
    isShuffling,
    hasPrevius,
    clearPlayerState,
    setPlayingState} = usePlayer();
  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [progress, setProgress] = useState(0);

  function setupProgressListener(){
    audioRef.current.currentTime =0;

    audioRef.current.addEventListener('timeupdate', event =>{
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }
  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else{
      clearPlayerState();
    }
  }

  useEffect(()=>{
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }

  }, [isPlaying])

  return (
    <div className={style.playerContainer}>
      <header>
        <img src="playing.svg" alt="Tocando agora" />
        <strong>Tocando agora </strong>
      </header>
      {episode?(
        <div className={style.currentEpisode}>
          <Image width={592} height={592}
            src={episode.thumbnail} objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ):(
        <div className={style.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}
      <footer className={!episode?style.empty:''}>
        <div className={style.progress}>
          <span>{convertDurantionToTimeString(progress)}</span>
          <div className={style.slider}>
           {episode?(
             <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor:'#04d361'}}
                railStyle={{backgroundColor:'#9f75ff'}}
                handleStyle={{borderColor:'#04d361', borderWidth: 4}}
             />
           ):(
             <div className={style.emptySlider} />
           )}
           </div>
          <span>{convertDurantionToTimeString(episode?.duration ?? 0)}</span>
        </div>
        {episode && (
          <audio src={episode.url} 
          ref={audioRef}
          loop={isLooping}
          autoPlay
          onPlay={()=>setPlayingState(true)}
          onPause={()=>setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleEpisodeEnded}
          />
        )}
        <div className={style.buttons}>
          <button type="button" disabled={!episode || episodeList.length ===1} 
           onClick={toogleShuffle} className={isShuffling?style.isActive: ''}>
            <img src="shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevius} disabled={!episode|| !hasPrevius}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button type="button" 
          className={style.playButton} 
          disabled={!episode}
          onClick={tooglePlay}
          >
            {isPlaying?(
              <img src="/pause.svg" alt="Pausar" />
            ):(
              <img src="/play.svg" alt="Tocar" />
            )

            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode|| !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button type="button" onClick={toogleLoop} 
          disabled={!episode} className={isLooping?style.isActive: ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}