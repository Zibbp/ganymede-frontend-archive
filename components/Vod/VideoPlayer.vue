<template>
  <div class="vod-video-player">
    <video
      id="videoPlayer"
      ref="videoPlayer"
      class="vod-video-player"
      playsinline
      controls
      crossorigin=""
    ></video>
  </div>
</template>

<script setup>
const config = useRuntimeConfig().public;
const { $bus } = useNuxtApp();

const props = defineProps({
  vod: {
    type: Object,
    required: true,
  },
  progress: {
    type: Object,
    required: false,
  },
});

const playerOptions = {
  controls: [
    "rewind",
    "play-large",
    "play",
    "fast-forward",
    "progress",
    "current-time",
    "mute",
    "volume",
    "captions",
    "settings",
    "download",
    "pip",
    "airplay",
    "fullscreen",
  ],
  settings: ["captions", "quality", "speed", "loop"],
  autoplay: false,
  keyboard: { focused: true, global: false },
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
  debug: false,
};

const playerSources = {
  type: "video",
  title: "Ganymede VOD Video",
  sources: [],
  poster: "",
  tracks: [],
};

const timer = ref();

onMounted(async () => {
  const Plyr = await import("plyr");

  // https://github.com/nuxt/framework/discussions/2654
  // Hacky workaround to access the player element
  setTimeout(() => {
    const vodVideoPlayer = new Plyr.default("#videoPlayer", playerOptions);

    // Set player sources
    playerSources.title = props.vod.title;
    playerSources.sources = [
      {
        src: `${config.cdnURL}/${props.vod.video_path}`,
        type: "video/mp4",
      },
    ];
    playerSources.poster = `${config.cdnURL}/${props.vod.thumbnail_path}`;

    // Set player sources
    vodVideoPlayer.source = playerSources;

    // Player API
    vodVideoPlayer.on("playing", (event) => {
      console.debug("[VOD Video Player] Sending Play Event");
      $bus.$emit("vod-player-play");
    });
    vodVideoPlayer.on("pause", (event) => {
      console.debug("[VOD Video Player] Sending Pause Event");
      $bus.$emit("vod-player-pause");
    });
    vodVideoPlayer.on("seeking", (event) => {
      console.debug(
        "[VOD Video Player] Sending Seek Event:",
        vodVideoPlayer.currentTime
      );
      $bus.$emit("vod-player-seek", vodVideoPlayer.currentTime);
    });
    vodVideoPlayer.on("ratechange", (event) => {
      console.debug(
        "[VOD Video Player] Sending Rate Change Event:",
        vodVideoPlayer.speed
      );
      $bus.$emit("vod-player-ratechange", vodVideoPlayer.speed);
    });

    // Set progress if it exists
    if (props.progress) {
      // timeout of player init
      setTimeout(() => {
        console.log(props.progress.time);
        vodVideoPlayer.currentTime = props.progress.time;
        // emit to chat player
        $bus.$emit("vod-player-seek", props.progress.time);
      }, 250);
    }

    // Playback progress API
    timer.value = window.setInterval(() => {
      // Update video playback progress
      // every 30 seconds
      // only when playing
      if (vodVideoPlayer.playing) {
        try {
          const currentTime = parseInt(vodVideoPlayer.currentTime);
          useApi(`/api/v1/playback/progress`, {
            method: "POST",
            body: {
              vod_id: props.vod.id,
              time: currentTime,
            },
            credentials: "include",
          });
        } catch (error) {
          console.error("Error sending playback progress:", error);
        }
        // Check if over 90% complete - set to complete if so
        const rawPercent =
          (vodVideoPlayer.currentTime / vodVideoPlayer.duration) * 100;
        const percent = parseInt(rawPercent);
        if (percent >= 90) {
          try {
            useApi(`/api/v1/playback/status`, {
              method: "POST",
              body: {
                vod_id: props.vod.id,
                status: "finished",
              },
              credentials: "include",
            });
          } catch (error) {
            console.error("Error updating playback status");
            console.error(error);
          }
        }
      }
    }, 20000);
  }, 50);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="scss" scoped>
.vod-video-player {
  width: 100%;
  height: 100%;
}
::v-deep(.plyr) {
  width: 100%;
  height: 100%;

  --plyr-color-main: #6d28d9;
}
</style>
