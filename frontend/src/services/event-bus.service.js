function createEventEmitter() {
  const listenersMap = {}

  return {
    on(evName, listener) {
      listenersMap[evName] = listenersMap[evName] ? [...listenersMap[evName], listener] : [listener]
      return () => {
        listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
      }
    },
    emit(evName, data) {
      if (!listenersMap[evName]) return
      listenersMap[evName].forEach(listener => listener(data))
    }
  }
}

export const eventBusService = createEventEmitter()

export function showUserMsg(txt, type = 'success') {
  eventBusService.emit('show-user-msg', { txt, type })
}

export function showSuccessMsg(txt) {
  showUserMsg(txt, 'success')
}

export function showErrorMsg(txt) {
  showUserMsg(txt, 'error')
}
