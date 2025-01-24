<template>
  <div id="room">
    <h1>This is room id: {{ roomId }}</h1>
    <VideoView :stream="localStream" />
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { Peer } from 'peerjs'
import { v4 as uuidv4 } from 'uuid'

import VideoView from './VideoView.vue'

import { useRoomStore } from '@/stores/room'
import useReducer from '@/hooks/useReducer'
import { peerReducer } from '@/hooks/peerReducer'
import { addPeerAction, removePeerAction } from '@/hooks/peerActions'

interface IUser {
  peerId: string
  name: string
  instantiate: Peer,
  length?: 0
}

const roomStore = useRoomStore()

const roomId = roomStore.getCurrentRoomId
const peerId = uuidv4()
const myVideo = useTemplateRef<HTMLVideoElement>('myVideo')

const peer = new Peer(peerId)

const user: IUser = {
  peerId: peerId,
  name: 'test',
  instantiate: peer,
}

const [state, dispatch] = useReducer(peerReducer, {})

roomStore.setUser(user)

window.scoket.emit('joinRoom', {
  roomId,
  users: {
    peerId: user.peerId,
    name: user.name,
  },
})

const localStream = ref<MediaStream>()

const flag = ref(false)

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  localStream.value = stream
  flag.value = true
})

window.scoket.on('userJoined', (user: IUser) => {
  // console.log(user)
  // console.log(roomStore.roomList)

  // if (localStream.value && peer) {
  //   debugger
  // }
})

peer.on('call', function (call) {
  call.answer(localStream.value)
  call.on('stream', (peerStream) => {
    dispatch(addPeerAction(call.peer, peerStream))
  })
})

watch(
  () => flag,
  () => {
    if (flag && localStream.value) {
      const call = peer.call(user.peerId, localStream.value)
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(user.peerId, peerStream))
      })
    }
  },
)
</script>

<style scoped lang="scss">
#room {
  display: flex;
  align-items: center;
}
</style>
