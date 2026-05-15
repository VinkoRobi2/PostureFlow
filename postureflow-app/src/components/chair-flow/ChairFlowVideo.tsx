import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import YoutubePlayer, {
  PLAYER_STATES,
  YoutubeIframeRef,
} from "react-native-youtube-iframe";

type ChairFlowVideoProps = {
  endTime: number;
  height: number;
  isPlaying: boolean;
  startTime: number;
  videoId: string;
  width: number;
  viewContainerStyle?: StyleProp<ViewStyle>;
  webViewStyle?: StyleProp<ViewStyle>;
};

export function ChairFlowVideo({
  endTime,
  height,
  isPlaying,
  startTime,
  videoId,
  width,
  viewContainerStyle,
  webViewStyle,
}: ChairFlowVideoProps) {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [isReady, setReady] = useState(false);
  const segmentEndTime = Math.max(endTime, startTime + 1);

  const playVars = useMemo(
    () => ({
      controls: true,
      end: segmentEndTime,
      preventFullScreen: false,
      rel: false,
      start: startTime,
    }),
    [segmentEndTime, startTime],
  );

  const restartSegment = useCallback(() => {
    playerRef.current?.seekTo(startTime, true);
  }, [startTime]);

  useEffect(() => {
    setReady(false);
  }, [videoId, startTime, segmentEndTime]);

  useEffect(() => {
    if (isReady && isPlaying) {
      restartSegment();
    }
  }, [isPlaying, isReady, restartSegment]);

  useEffect(() => {
    if (!isReady || !isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      void playerRef.current?.getCurrentTime().then((currentTime) => {
        if (currentTime >= segmentEndTime - 0.25) {
          restartSegment();
        }
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isPlaying, isReady, restartSegment, segmentEndTime]);

  return (
    <View style={[styles.container, { height, width }, viewContainerStyle]}>
      <YoutubePlayer
        ref={playerRef}
        height={height}
        width={width}
        play={isPlaying}
        videoId={videoId}
        initialPlayerParams={playVars}
        onReady={() => setReady(true)}
        onChangeState={(state: PLAYER_STATES) => {
          if (state === PLAYER_STATES.ENDED) {
            restartSegment();
          }
        }}
        webViewStyle={[styles.webView, webViewStyle]}
      />
      <View pointerEvents="none" style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(226, 114, 91, 0.15)",
  },
  webView: {
    opacity: 0.98,
  },
});
