import { useEvent } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { trainingTheme } from "../../theme/training";

type VideoPlayerProps = {
  videoUrl: string;
  shouldPlay?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function VideoPlayer({
  videoUrl,
  shouldPlay = true,
  style,
}: VideoPlayerProps) {
  const player = useVideoPlayer({ uri: videoUrl }, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.timeUpdateEventInterval = 0.9;

    if (shouldPlay) {
      videoPlayer.play();
    }
  });
  const statusChange = useEvent(player, "statusChange", {
    status: player.status,
  });
  const hasError = statusChange.status === "error";
  const isReady = statusChange.status === "readyToPlay";

  useEffect(() => {
    if (hasError) {
      return;
    }

    if (shouldPlay) {
      player.play();
      return;
    }

    player.pause();
  }, [hasError, player, shouldPlay]);

  return (
    <View style={[styles.container, style]}>
      {!hasError ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
        />
      ) : null}

      {!isReady || hasError ? (
        <View style={styles.loadingLayer}>
          <ActivityIndicator color={trainingTheme.cream} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: trainingTheme.backgroundDeep,
    overflow: "hidden",
  },
  loadingLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: trainingTheme.surface,
    justifyContent: "center",
  },
});
