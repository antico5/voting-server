import Server from 'socket.io'

export default function startServer(store) {
  const io = new Server().attach(8090)

  store.subscribe(
    () => io.emit('store', store.getState().toJS())
  )

  io.on('connection', (socket) => {
    socket.emit('store', store.getState().toJS())
    socket.on('action', store.dispatch.bind(store)
  })
}
