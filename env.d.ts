/// <reference types="vite/client" />
/// <reference types="typewriter-effect" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_DATABASE_URL: string
}
