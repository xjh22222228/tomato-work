


interface Window {
  readonly window: Window;
  axiosCancelTokenStore: { cancel: () => void; pathname: string; [propName: string]: any }[];
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BASE_URL: string;
    readonly REACT_APP_GITHUB_CLIENT_ID: string;
  }
}

declare let window: Window;
