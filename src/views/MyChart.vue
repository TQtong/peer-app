<template>
  <el-form ref="myForm" :model="form" :rules="rules" label-width="auto" style="max-width: 600px">
    <el-form-item label="my id" prop="myId">
      <el-input v-model="form.myId" />
    </el-form-item>
    <el-form-item label="other id" prop="otherId">
      <el-input v-model="form.otherId" />
    </el-form-item>
    <el-form-item label="my message" prop="myMessage">
      <el-input v-model="form.myMessage" />
      <el-button type="primary" @click="onSend(form.myMessage)">Send</el-button>
    </el-form-item>
    <el-form-item label="other message" prop="othermessage">
      <el-input v-model="form.otherMessage" />
      <el-button type="primary" @click="onSend(form.otherMessage)">Send</el-button>
    </el-form-item>
    <el-form-item v-if="form.otherId">
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="onReset(myForm)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { Peer, DataConnection } from 'peerjs'

const peer = new Peer('myAppMessage', {
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
  myMessage: '',
  otherMessage: '',
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

let con: DataConnection

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

  if (con) {
    con.close()
  }

  con = peer.connect(form.otherId, {
    reliable: true,
  })
}

const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const onSend = (message: string) => {
  con.send(message)
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
  con = conn
  con.on('open', function () {
    console.log('Connected to: ' + con.peer)

    // Check URL params for comamnds that should be sent immediately
    const command = getUrlParam('command')
    if (command) con.send(command)
  })
  // Handle incoming data (messages only since this is the signal sender)
  con.on('data', function (data) {
    form.otherMessage = data
  })
  con.on('close', function () {
    console.log('Connected closed: ')
  })
})

/**
 * Get first "GET style" parameter from href.
 * This enables delivering an initial command upon page load.
 *
 * Would have been easier to use location.hash.
 */
const getUrlParam = (name: string) => {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
  const regexS = '[\\?&]' + name + '=([^&#]*)'
  const regex = new RegExp(regexS)
  const results = regex.exec(window.location.href)
  if (results == null) return null
  else return results[1]
}
</script>

<style scoped lang="scss"></style>
