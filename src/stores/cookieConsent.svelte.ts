let _settingsOpen = $state(false)
let _adStorage = $state(false)

export const cookieConsentStore = {
  get settingsOpen() { return _settingsOpen },
  get adStorage() { return _adStorage },
  openSettings() { _settingsOpen = true },
  closeSettings() { _settingsOpen = false },
  setAdStorage(granted: boolean) { _adStorage = granted },
}
