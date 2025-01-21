<template>
  <el-form ref="myForm" :model="form" :rules="rules" label-width="auto" style="max-width: 600px">
    <el-form-item label="my id" prop="myId">
      <el-input v-model="form.myId" />
    </el-form-item>
    <el-form-item label="other id" prop="otherId">
      <el-input v-model="form.otherId" />
    </el-form-item>
    <el-form-item v-if="form.otherId">
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="onReset(myForm)">Reset</el-button>
    </el-form-item>
  </el-form>
  <div class="container">
    <video ref="myVideo" width="100%" height="100%"></video>
    <video ref="otherVideo" width="100%" height="100%"></video>
  </div>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { Peer } from 'peerjs'

const peer = new Peer('myapp', {
  host: 'localhost',
  port: 9000,
  path: '/myapp',
})

peer.on('open', (id) => {
  console.log('My peer ID is: ' + id)
  form.myId = id
})

const form = reactive({
  myId: '',
  otherId: '',
})

const rules = reactive({
  myId: [
    {
      required: true,
      trigger: 'change',
    },
  ],
  otherId: [
    {
      required: true,
      trigger: 'change',
    },
  ],
})

const myForm = ref<FormInstance>()
const myVideo = useTemplateRef<HTMLVideoElement>('myVideo')
const otherVideo = useTemplateRef<HTMLVideoElement>('otherVideo')

let localStream: MediaStream

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  if (myVideo.value) {
    myVideo.value.srcObject = stream
    myVideo.value.autoplay = true
    myVideo.value.play()
    localStream = stream
  }
})

const onSubmit = () => {
  console.log('submit!')
  const call = peer.call(form.otherId, localStream)
  call.on('stream', function (remoteStream) {
    if (otherVideo.value) {
      otherVideo.value.srcObject = remoteStream
      otherVideo.value.autoplay = true
    }
  })
}

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

peer.on('call', function (call) {
  call.answer(localStream)
  call.on('stream', function (remoteStream) {
    if (otherVideo.value) {
      otherVideo.value.srcObject = remoteStream
      otherVideo.value.autoplay = true
    }
  })
})

peer.on('connection', function (conn) {
  debugger
  conn.on('data', function (data) {
    debugger
    console.log('Received', data)
  })
})
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 800px;
  height: 600px;
}
</style>
