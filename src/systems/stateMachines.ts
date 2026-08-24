import { engine, inputSystem, InputAction, PointerEventType, Entity, Transform, MeshRenderer } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { ThrowerState, PlayerThrowState, JumperState, PlayerJumpState, ProjectileComponent } from '../components'
import { EVENT_CONFIGS, EventType } from '../events/EventConfig'

// --- Thrower State Handlers ---

const throwerStateHandlers: Record<number, (entity: Entity) => void> = {
  [PlayerThrowState.IDLE]: (entity) => {
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
      const stateComp = ThrowerState.getMutable(entity)
      stateComp.state = PlayerThrowState.WINDUP
      console.log('Thrower: Transition to WINDUP')
    }
  },
  [PlayerThrowState.WINDUP]: (entity) => {
    const stateComp = ThrowerState.getMutable(entity)
    
    if (stateComp.currentEvent === EventType.JAVELIN) {
      // Javelin skips WINDUP
      stateComp.technique = 1.0
      stateComp.state = PlayerThrowState.POWER_SELECTION
      stateComp.startTime = Date.now()
      console.log('Thrower: Transition to POWER_SELECTION')
    } else if (stateComp.currentEvent === EventType.SHOT_PUT) {
      // Shot Put waits for 1 click to lock in technique
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        stateComp.state = PlayerThrowState.POWER_SELECTION
        stateComp.startTime = Date.now()
        console.log(`Thrower: Transition to POWER_SELECTION (Technique: ${stateComp.technique.toFixed(2)})`)
      }
    } else if (stateComp.currentEvent === EventType.DISCUS) {
      // Discus requires 3 clicks
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        stateComp.clickCount += 1
        stateComp.techniqueSum += stateComp.technique
        console.log(`Thrower: Discus rotation click ${stateComp.clickCount}/3 (Hit: ${stateComp.technique.toFixed(2)})`)
        if (stateComp.clickCount >= 3) {
          stateComp.technique = stateComp.techniqueSum / 3.0
          stateComp.state = PlayerThrowState.POWER_SELECTION
          stateComp.startTime = Date.now()
          console.log(`Thrower: Transition to POWER_SELECTION (Avg Technique: ${stateComp.technique.toFixed(2)})`)
        }
      }
    } else if (stateComp.currentEvent === EventType.HAMMER) {
      // Hammer requires 4 clicks
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
        stateComp.clickCount += 1
        stateComp.techniqueSum += stateComp.technique
        console.log(`Thrower: Hammer rotation click ${stateComp.clickCount}/4 (Hit: ${stateComp.technique.toFixed(2)})`)
        if (stateComp.clickCount >= 4) {
          stateComp.technique = stateComp.techniqueSum / 4.0
          stateComp.state = PlayerThrowState.POWER_SELECTION
          stateComp.startTime = Date.now()
          console.log(`Thrower: Transition to POWER_SELECTION (Avg Technique: ${stateComp.technique.toFixed(2)})`)
        }
      }
    } else {
      // Default fallback
      stateComp.technique = 1.0
      stateComp.state = PlayerThrowState.POWER_SELECTION
      stateComp.startTime = Date.now()
    }
  },
  [PlayerThrowState.POWER_SELECTION]: (entity) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      const stateComp = ThrowerState.getMutable(entity)
      stateComp.state = PlayerThrowState.ANGLE_SELECTION
      console.log('Thrower: Transition to ANGLE_SELECTION')
    }
  },
  [PlayerThrowState.ANGLE_SELECTION]: (entity) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      const stateComp = ThrowerState.getMutable(entity)
      stateComp.state = PlayerThrowState.THROWING
      console.log(`Thrower: Transition to THROWING (Power: ${stateComp.power.toFixed(2)}, Angle: ${stateComp.angle.toFixed(2)})`)

      // Create the projectile
      const projectileEntity = engine.addEntity()
      
      const config = EVENT_CONFIGS[stateComp.currentEvent as EventType]
      const speedMult = config?.projectileSpeedMultiplier || 1.0
      
      // Calculate start position (e.g. 1.8m high in front of player)
      const startPos = Vector3.create(8, 1.8, 8)
      
      ProjectileComponent.create(projectileEntity, {
        isFlying: true,
        velocity: stateComp.power * 0.2 * speedMult * (stateComp.technique || 1.0), // rough scaling * technique
        angle: stateComp.angle,
        gravity: config?.gravity || 9.81,
        startTime: Date.now(),
        startPosition: startPos,
        direction: Vector3.create(0, 0, 1) // default throwing down Z axis
      })
      
      Transform.create(projectileEntity, {
        position: startPos
      })
      
      // We could also add a visible mesh so we can see it
      MeshRenderer.setSphere(projectileEntity)
    }
  },
  [PlayerThrowState.THROWING]: (_entity) => {
    // Projectile flies. The KinematicSystem handles the flight.
  },
  [PlayerThrowState.RESULT]: handleThrowerReset,
  [PlayerThrowState.FOUL]: handleThrowerReset
}

function handleThrowerReset(entity: Entity) {
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    const stateComp = ThrowerState.getMutable(entity)
    stateComp.state = PlayerThrowState.IDLE
    console.log('Thrower: Transition to IDLE')
  }
}

export function throwerStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  if (!ThrowerState.has(playerEntity)) return
  
  const stateComp = ThrowerState.get(playerEntity)
  const handler = throwerStateHandlers[stateComp.state]
  if (handler) {
    handler(playerEntity)
  }
}

// --- Jumper State Handlers ---

const jumperStateHandlers: Record<number, (entity: Entity) => void> = {
  [PlayerJumpState.IDLE]: (entity) => {
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
      const stateComp = JumperState.getMutable(entity)
      stateComp.state = PlayerJumpState.RUNUP
      console.log('Jumper: Transition to RUNUP')
    }
  },
  [PlayerJumpState.RUNUP]: (entity) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      const stateComp = JumperState.getMutable(entity)
      stateComp.state = PlayerJumpState.TAKEOFF
      console.log('Jumper: Transition to TAKEOFF')
    }
  },
  [PlayerJumpState.TAKEOFF]: (entity) => {
    const stateComp = JumperState.getMutable(entity)
    stateComp.state = PlayerJumpState.FLIGHT
    console.log('Jumper: Transition to FLIGHT')
  },
  [PlayerJumpState.FLIGHT]: (_entity) => {
    // JumpPhysicsSystem will handle landing and transition to RESULT
  },
  [PlayerJumpState.RESULT]: handleJumperReset,
  [PlayerJumpState.FOUL]: handleJumperReset
}

function handleJumperReset(entity: Entity) {
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    const stateComp = JumperState.getMutable(entity)
    stateComp.state = PlayerJumpState.IDLE
    console.log('Jumper: Transition to IDLE')
  }
}

export function jumperStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  if (!JumperState.has(playerEntity)) return
  
  const stateComp = JumperState.get(playerEntity)
  const handler = jumperStateHandlers[stateComp.state]
  if (handler) {
    handler(playerEntity)
  }
}

