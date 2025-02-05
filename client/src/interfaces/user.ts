import { ref, useTemplateRef, watch } from 'vue'
import { Peer } from 'peerjs'

export interface IUser {
    userId: string
    name: string
    status: boolean
    peerId: string
    instantiate: Peer | null,
}