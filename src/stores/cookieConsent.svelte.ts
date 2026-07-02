let _settingsOpen = $state(false)

export const cookieConsentStore = {
  get settingsOpen() { return _settingsOpen },
  openSettings() { _settingsOpen = true },
  closeSettings() { _settingsOpen = false },
}
