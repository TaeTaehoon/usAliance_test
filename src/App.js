import styled from "styled-components";
import { useMemo, useRef, useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BsFullscreen, BsPlayCircle, BsStopCircle } from "react-icons/bs";
import { MdForward10, MdReplay10 } from "react-icons/md";

function App() {
  const [videoInfo, setVideoInfo] = useState({
    currTime: 0,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const PLAYBACKLIST = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"];
  const controlRef = useRef();
  const videoRef = useRef();
  const videoLength = useMemo(() => {
    if (videoRef.current) return Math.floor(videoRef.current.duration);
  }, [videoRef.current]);
  const dropdownRef = useRef();
  const fullScreenHandler = useFullScreenHandle();
  const onMouseEnterHandler = () => {
    controlRef.current.classList.remove("hide_control_panel");
  };
  const onMouseOutHandler = () => {
    controlRef.current.classList.add("hide_control_panel");
  };

  const detectMobileDevice = (agent) => {
    const mobileRegex = [
      /Android/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return mobileRegex.some((mobile) => agent.match(mobile));
  };
  const isMobile = detectMobileDevice(window.navigator.userAgent);

  const onClickMobile = useCallback(() => {
    if (isMobile) {
      if (controlRef.current.classList.contains("hide_control_panel")) {
        controlRef.current.classList.remove("hide_control_panel");
        setTimeout(() => {
          controlRef.current.classList.add("hide_control_panel");
        }, 2000);
      } else {
        controlRef.current.classList.add("hide_control_panel");
      }
    }
  }, []);
  const handleClickPlayPauseBtn = () => {
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleClickBackwardBtn = () => {
    if (videoRef.current.currentTime > 0) {
      videoRef.current.currentTime -= 10;
      setVideoInfo({
        ...videoInfo,
        currTime: videoInfo.currTime - 10 > 0 ? videoInfo.currTime - 10 : 0,
      });
    }
  };

  const handleClickForwardBtn = () => {
    if (videoRef.current.currentTime < videoRef.current.duration) {
      videoRef.current.currentTime += 10;
      setVideoInfo({
        ...videoInfo,
        currTime:
          videoInfo.currTime + 10 < videoRef.current.duration
            ? videoInfo.currTime + 10
            : videoRef.current.duration,
      });
    }
  };

  // const onClickVideoBtn = (e) => {
  //   console.log(e.target);
  //   const btnID = e.target.id;
  //   switch (btnID) {
  //     case "play_pause_btn": {
  //       if (videoRef.current.paused) {
  //         videoRef.current.play();
  //       } else {
  //         videoRef.current.pause();
  //       }
  //       return;
  //     }
  //     case "10s_backward_btn": {
  //       if (videoRef.current.currentTime > 0) {
  //         videoRef.current.currentTime -= 10;
  //         setVideoInfo({
  //           ...videoInfo,
  //           currTime: videoInfo.currTime - 10 > 0 ? videoInfo.currTime - 10 : 0,
  //         });
  //       }

  //       return;
  //     }
  //     case "10s_forward_btn": {
  //       if (videoRef.current.currentTime < videoRef.current.duration) {
  //         videoRef.current.currentTime += 10;
  //         setVideoInfo({
  //           ...videoInfo,
  //           currTime:
  //             videoInfo.currTime + 10 < videoRef.current.duration
  //               ? videoInfo.currTime + 10
  //               : videoRef.current.duration,
  //         });
  //       }

  //       return;
  //     }
  //   }
  // };
  console.log(videoLength);
  const handleClickPlayBackBtn = (e) => {
    console.log(e.target);
    console.log(e.target.innerHTML);
    const targetRate = Number(e.target.innerHTML.slice(0, -1));
    console.log(targetRate);
    videoRef.current.playbackRate = targetRate;
    dropdownRef.current.classList.add("hidden");
  };

  setInterval(() => {
    if (videoRef.current && !videoRef.current.paused) {
      setVideoInfo({
        ...videoInfo,
        currTime: Math.floor(videoRef.current.currentTime),
      });
    }
  }, 1000);

  useEffect(() => {
    console.log(videoRef.current);
    if (videoRef.current && videoRef.current.duration > 0) {
      setVideoInfo({
        ...videoInfo,
        currTime: Math.floor(videoRef.current.currentTime),
      });
    }
  }, [videoRef.current?.duration]);
  useEffect(() => {}, []);
  return (
    <FullScreen handle={fullScreenHandler}>
      <StContentsWrapper
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseOutHandler}
        onClick={onClickMobile}
      >
        <StVideoSection autoPlay muted ref={videoRef}>
          <source src="https://chinatan.smilecast.co.kr/video/us-alliance/us-alliance_master_interview.mp4" />
        </StVideoSection>
        {/* className="hide_control_panel" */}
        <StControlSection ref={controlRef} className="hide_control_panel">
          <div className="on_video_controls">
            <button id="10s_backward_btn" onClick={handleClickBackwardBtn}>
              <MdReplay10 color="white" />
            </button>
            <button id="play_pause_btn" onClick={handleClickPlayPauseBtn}>
              {!isPlaying ? (
                <BsPlayCircle color="white" />
              ) : (
                <BsStopCircle color="white" />
              )}
            </button>
            <button id="10s_forward_btn" onClick={handleClickForwardBtn}>
              <MdForward10 color="white" />
            </button>
          </div>
          <div className="footer_control_panel">
            <div className="progress_container">
              <span className="current_video_timeStamp">
                {`${
                  Math.floor(videoInfo.currTime / 60) > 9
                    ? Math.floor(videoInfo.currTime / 60)
                    : "0" + Math.floor(videoInfo.currTime / 60)
                }:${
                  videoInfo.currTime -
                    Math.floor(videoInfo.currTime / 60) * 60 >
                  9
                    ? videoInfo.currTime -
                      Math.floor(videoInfo.currTime / 60) * 60
                    : "0" +
                      (videoInfo.currTime -
                        Math.floor(videoInfo.currTime / 60) * 60)
                }`}
              </span>
              <input
                type="range"
                min={0}
                max={videoLength}
                value={videoInfo.currTime}
                step={1}
                onMouseDown={() => {
                  videoRef.current.pause();
                }}
                onMouseUp={(e) => {
                  videoRef.current.play();
                }}
                onChange={(e) => {
                  console.log(e.target.value);
                  videoRef.current.currentTime = e.target.value;
                  setVideoInfo({ ...videoInfo, currTime: e.target.value });
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              {/* <progress defaultValue={0} max={videoInfo.fullTime}></progress> */}
              <span className="full_video_timeStamp">{`${
                Math.floor(videoLength / 60) > 9
                  ? Math.floor(videoLength / 60)
                  : "0" + Math.floor(videoLength / 60)
              }:${videoLength - Math.floor(videoLength / 60) * 60}`}</span>
            </div>
            <div className="video_speed_dropdown">
              <button
                onClick={() => {
                  if (dropdownRef.current.classList.contains("hidden")) {
                    dropdownRef.current.classList.remove("hidden");
                  } else {
                    dropdownRef.current.classList.add("hidden");
                  }
                }}
              >
                {videoRef.current && videoRef.current.playbackRate}x
              </button>
              <ul
                className="dropdown_contents hidden"
                ref={dropdownRef}
                onClick={handleClickPlayBackBtn}
              >
                {videoRef.current &&
                  PLAYBACKLIST.map((el) => {
                    if (
                      el.slice(0, -1) === String(videoRef.current.playbackRate)
                    ) {
                      return (
                        <li key={`rate=${el}`}>
                          <span className="checked_rate_icon">✔️</span>
                          <span className="target_rate">{el}</span>
                        </li>
                      );
                    } else {
                      return (
                        <li key={`rate=${el}`}>
                          <span className="target_rate">{el}</span>
                        </li>
                      );
                    }
                  })}
              </ul>
            </div>

            <button
              onClick={() => {
                if (
                  window.innerHeight === window.screen.height &&
                  window.innerWidth === window.screen.width
                ) {
                  fullScreenHandler.exit();
                } else {
                  fullScreenHandler.enter();
                }
              }}
              className="fullScreen_handle_btn"
            >
              <BsFullscreen color="white" />
            </button>
          </div>
        </StControlSection>
        <StTopLabel>LIVE</StTopLabel>
      </StContentsWrapper>
    </FullScreen>
  );
}

const StContentsWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: black;
  .hide_control_panel {
    display: none;
  }
`;

const StVideoSection = styled.video`
  width: 100%;
  max-height: 100%;
`;

const StControlSection = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  .on_video_controls {
    position: absolute;
    top: calc(65% / 2);
    left: calc(25% / 2);
    width: 75%;
    height: 35%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      font-size: 10rem;
      background: none;
      border: none;
    }
  }
  .footer_control_panel {
    width: 100%;
    height: 3.5rem;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    .progress_container {
      width: 65%;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      font-weight: 600;
      color: white;
      span {
        width: 50px;
      }

      input[type="range"] {
        font-size: 1.5rem;
        width: 80%;
      }

      input[type="range"] {
        color: #ef233c;
        --thumb-height: 1.3rem;
        --track-height: 0.5rem;
        --track-color: #e0e0e0;
        --brightness-hover: 110%;
        --brightness-down: 80%;
        --clip-edges: 0.125em;
      }
      input[type="range"] {
        position: relative;
        background: #fff0;
        overflow: hidden;
      }

      input[type="range"]:active {
        cursor: grabbing;
      }

      input[type="range"],
      input[type="range"]::-moz-range-track,
      input[type="range"]::-moz-range-thumb {
        appearance: none;
        transition: all ease 100ms;
        height: var(--thumb-height);
      }

      input[type="range"]::-moz-range-track,
      input[type="range"]::-moz-range-thumb,
      input[type="range"]::-moz-range-progress {
        background: #fff0;
      }

      input[type="range"]::-moz-range-thumb {
        background: #60c777;
        border: 0;
        width: var(--thumb-width, var(--thumb-height));
        border-radius: var(--thumb-width, var(--thumb-height));
        cursor: grab;
      }

      input[type="range"]:active::-moz-range-thumb {
        cursor: grabbing;
      }

      input[type="range"]::-moz-range-track {
        width: 100%;
        background: var(--track-color);
      }

      input[type="range"]::-moz-range-progress {
        appearance: none;
        background: #60c777;
        transition-delay: 30ms;
      }

      input[type="range"]::-moz-range-track,
      input[type="range"]::-moz-range-progress {
        height: calc(var(--track-height) + 1px);
      }

      input[type="range"]::-moz-range-thumb,
      input[type="range"]::-moz-range-progress {
        filter: brightness(100%);
      }

      input[type="range"]:hover::-moz-range-thumb,
      input[type="range"]:hover::-moz-range-progress {
        filter: brightness(var(--brightness-hover));
      }

      input[type="range"]:active::-moz-range-thumb,
      input[type="range"]:active::-moz-range-progress {
        filter: brightness(var(--brightness-down));
      }
      progress {
        width: 90%;
        height: 0.4rem;
        margin: 0 0.7%;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        ::-webkit-progress-value {
          border-radius: 1rem;
          background: rgb(96, 199, 119);
        }
        ::-webkit-progress-bar {
          background-color: #e0e0e0;
          border-radius: 1rem;
          box-shadow: inset 3px 3px 10px #ccc;
        }
        background-color: #e0e0e0;
        border-radius: 1rem;
        ::-moz-progress-bar {
          background: rgb(96, 199, 119);
          border-radius: 1rem;
          ::after {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background-color: rgb(96, 199, 119);
          }
        }
      }
    }
  }
  .video_speed_dropdown {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-size: 1.2rem;
    button {
      width: 5rem;
      color: white;
      display: flex;
      justify-content: flex-start;
      padding-left: 1.5rem;
      align-items: center;
      background: none;
      border: none;
      font-size: 1.2rem;
    }
    .dropdown_contents {
      padding-left: 0;
      list-style: none;
      position: absolute;
      z-index: 1;
      bottom: 0.5rem;
      left: 0;
      li {
        width: 5rem;
        background-color: white;
        position: relative;
        padding: 0.3rem;
        .checked_rate_icon {
          position: absolute;
          left: 0;
        }
        .target_rate {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          padding-left: 1.5rem;
          align-items: center;
        }
      }
    }
  }
  .fullScreen_handle_btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
`;

const StTopLabel = styled.div`
  width: 6rem;
  height: 2.5rem;
  border: none;
  font-size: 1.5rem;
  color: white;
  background-color: #c03a26;
  border-radius: 0.3rem;
  text-align: center;
  padding-top: 0.4rem;
  position: absolute;
  top: 2rem;
  left: 2rem;
`;

export default App;
