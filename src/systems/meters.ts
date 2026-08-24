import { engine } from '@dcl/sdk/ecs'
import { ThrowerState, PlayerThrowState } from '../components'
import { EVENT_CONFIGS, EventType } from '../events/EventConfig'

export function metersSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  if (!ThrowerState.has(playerEntity)) return
  
  const stateComp = ThrowerState.getMutable(playerEntity)
  
  if (stateComp.state === PlayerThrowState.WINDUP) {
    if (stateComp.currentEvent === EventType.SHOT_PUT) {
      // Oscillate technique from 0 to 1 for the timing window
      const speed = 1.5
      const time = Date.now() / 1000.0
      stateComp.technique = (Math.sin(time * speed * Math.PI) + 1) / 2
    } else if (stateComp.currentEvent === EventType.DISCUS) {
      // For discus, maybe a fast moving meter that the user must click 3 times when it's high
      const speed = 2.5
      const time = Date.now() / 1000.0
      stateComp.technique = (Math.sin(time * speed * Math.PI) + 1) / 2
    } else if (stateComp.currentEvent === EventType.HAMMER) {
      // Hammer uses 4 fast clicks for momentum building
      const speed = 3.5
      const time = Date.now() / 1000.0
      stateComp.technique = (Math.sin(time * speed * Math.PI) + 1) / 2
    }
  } else if (stateComp.state === PlayerThrowState.POWER_SELECTION) {
    const config = EVENT_CONFIGS[stateComp.currentEvent as EventType]
    const minPower = config?.minPower ?? 0
    const maxPower = config?.maxPower ?? 100
    
    // Oscillate power between minPower and maxPower
    // using a sine wave based on time
    const speed = 2.0 // Adjust for faster/slower meter
    const time = Date.now() / 1000.0
    const normalized = (Math.sin(time * speed * Math.PI) + 1) / 2 // 0 to 1
    
    stateComp.power = minPower + normalized * (maxPower - minPower)
  } else if (stateComp.state === PlayerThrowState.ANGLE_SELECTION) {
    const config = EVENT_CONFIGS[stateComp.currentEvent as EventType]
    const minAngle = config?.minAngle ?? 0
    const maxAngle = config?.maxAngle ?? 90
    
    // Oscillate angle between minAngle and maxAngle
    const speed = 3.0 // Adjust for faster/slower meter
    const time = Date.now() / 1000.0
    const normalized = (Math.sin(time * speed * Math.PI) + 1) / 2 // 0 to 1
    
    stateComp.angle = minAngle + normalized * (maxAngle - minAngle)
  }
}
