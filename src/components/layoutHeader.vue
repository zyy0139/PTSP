<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function handleBackLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div id="header">
    <div id="back-icon">
      <slot name="backIcon" />
    </div>
    <div id="icon-logo" class="slot">
<!--      <img src="../assets/logo.png" alt="logo" height="48" width="78" @click="handleBackLogin">-->
    </div>
    <div id="avatar" class="slot">
      <slot name="avatar" />
    </div>
  </div>
</template>

<style scoped>
#header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fefefe;
  box-shadow: #b2b2b2 0 3px 10px;
  position: sticky;
  top: 0;
  z-index: 999;
}
#back-icon {
  margin-left: 2em;
  width: 92px;
}
#icon-logo {
  margin-right: auto;
  margin-left: 3%;
  background-color: #0093E9;
  background-image: linear-gradient(151deg, #0093E9 0%, #80D0C7 68%);
  border-radius: 10px;
}
#avatar {
  margin-right: 3em;
}
.slot {
  margin-top: 3px;
  margin-bottom: 3px;
  cursor: pointer;
}
</style>