import { Store } from "vuex"
import { Route } from "vue-router"
import Vue from "vue"
import { ComponentOptions } from "vue/types/options"

import { MyStore } from "../app/store/store"

import { VueContext } from "./server"

declare module "vue/types/vue" {
  interface Vue {
    ssrOptions?: VueContext
  }
}

// ComponentOptions is declared in types/options.d.ts
declare module "vue/types/options" {
  export interface CustomProps {
    route: Route
    store: Store<MyStore>
  }

  export interface ComponentOptions<V extends Vue> {
    ssrOptions?: VueContext
    asyncData?: (context: CustomProps) => Promise<any>
  }
}

// export type NonNullable<T> = Exclude<T, null | undefined>

type NonNullableField<T> = { [P in keyof T]-?: NonNullable<T[P]> }

export type MyComponentOptions = NonNullableField<ComponentOptions<Vue>>
