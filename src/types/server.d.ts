import { Store } from "vuex"
import { MyStore } from "../app/store/store";

interface VueError extends Error {
  url?: string
  code?: number
}

interface Map {
  version: number
  sources: string[]
  names: string[]
  mappings: string
  file: string
  sourceContent: string[]
  sourceRoot: string
}

export interface DevServerOut {
  bundle: Bundle | undefined
  template: string
  clientManifest: ClientManifest | undefined
}

export interface Bundle {
  entry: string
  files: Record<string, string>
  maps: Record<string, Map>
}

export interface ClientManifest {
  publicPath: string
  all: string[]
  initial: string[]
  async: string[]
  modules: Record<string, number[]>
}

export interface VueContext {
  title: string
  url: string
  _registeredComponents: Set<string>
  rendered: () => void
  state: MyStore
}

export interface CallbackOptions {
  template: string
  clientManifest: ClientManifest
}
