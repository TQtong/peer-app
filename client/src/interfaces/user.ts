import { Peer } from 'peerjs'

export interface IUser {
    roomId: string
    name: string
    status: boolean
    peerId: string
    instantiate: Peer | null
}