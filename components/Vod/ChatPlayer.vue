<template>
  <div class="vod-chat-player">
    <video id="chatPlayer" class="w-full h-fit" controls></video>
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
});

const playerOptions = {
  controls: ["play-large", "play", "progress"],
  autoplay: false,
};

const playerSources = {
  type: "video",
  title: "Ganymede VOD Video",
  sources: [],
  poster: "",
  tracks: [],
};

onMounted(async () => {
  const Plyr = await import("plyr");

  setTimeout(() => {
    const vodChatPlayer = new Plyr.default("#chatPlayer", playerOptions);

    // Set player sources
    playerSources.title = "Ganymede VOD Video Chat";

    playerSources.sources = [
      {
        src: `${config.cdnURL}/${props.vod.chat_video_path}`,
        type: "video/mp4",
      },
    ];
    vodChatPlayer.source = playerSources;

    // Event Bus
    $bus.$on("vod-player-play", () => {
      console.debug("[VOD Chat Player] Received play event");
      vodChatPlayer.play();
    });
    $bus.$on("vod-player-pause", () => {
      console.debug("[VOD Chat Player] Received pause event");
      vodChatPlayer.pause();
    });
    $bus.$on("vod-player-seek", (time) => {
      console.debug("[VOD Chat Player] Received seek event:", time);
      vodChatPlayer.currentTime = time;
    });
    $bus.$on("vod-player-ratechange", (speed) => {
      console.debug("[VOD Chat Player] Received ratechange event:", speed);
      vodChatPlayer.speed = speed;
    });
  }, 50);
});
</script>

<style lang="scss" scoped>
.vod-chat-player {
  width: 100%;
  height: 100%;
}
::v-deep(.plyr) {
  width: 100%;
  height: 100%;
  --plyr-color-main: #6d28d9;
  video {
    bottom: 0;
    position: absolute;
    height: auto !important;
  }
}
</style>
