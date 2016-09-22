import Horizon from '@horizon/client'
let horizon

horizon = Horizon({ host: '127.0.0.1:8181' })
horizon.connect()


export default horizon
