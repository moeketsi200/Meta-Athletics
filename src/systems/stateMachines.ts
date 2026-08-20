import { engine, inputSystem, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { ThrowerState, PlayerThrowState, JumperState, PlayerJumpState } from '../components'

type ThrowerMutable = ReturnType<typeof ThrowerState.getMutable>
type JumperMutable = ReturnType<typeof JumperState.getMutable>

// --- Thrower State Handlers ---

const throwerStateHandlers: Record<number, (stateComp: ThrowerMutable) => void> = {
  [PlayerThrowState.IDLE]: (stateComp) => {
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
      stateComp.state = PlayerThrowState.WINDUP
      console.log('Thrower: Transition to WINDUP')
    }
  },
  [PlayerThrowState.WINDUP]: (stateComp) => {
    stateComp.state = PlayerThrowState.POWER_SELECTION
    stateComp.startTime = Date.now()
    console.log('Thrower: Transition to POWER_SELECTION')
  },
  [PlayerThrowState.POWER_SELECTION]: (stateComp) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      stateComp.state = PlayerThrowState.ANGLE_SELECTION
      console.log('Thrower: Transition to ANGLE_SELECTION')
    }
  },
  [PlayerThrowState.ANGLE_SELECTION]: (stateComp) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      stateComp.state = PlayerThrowState.THROWING
      console.log('Thrower: Transition to THROWING')
    }
  },
  [PlayerThrowState.THROWING]: (_stateComp) => {
    // Projectile flies. The KinematicSystem handles the flight.
  },
  [PlayerThrowState.RESULT]: handleThrowerReset,
  [PlayerThrowState.FOUL]: handleThrowerReset
}

function handleThrowerReset(stateComp: ThrowerMutable) {
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    stateComp.state = PlayerThrowState.IDLE
    console.log('Thrower: Transition to IDLE')
  }
}

export function throwerStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  if (!ThrowerState.has(playerEntity)) return
  
  const stateComp = ThrowerState.getMutable(playerEntity)
  const handler = throwerStateHandlers[stateComp.state]
  if (handler) {
    handler(stateComp)
  }
}

// --- Jumper State Handlers ---

const jumperStateHandlers: Record<number, (stateComp: JumperMutable) => void> = {
  [PlayerJumpState.IDLE]: (stateComp) => {
    if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
      stateComp.state = PlayerJumpState.RUNUP
      console.log('Jumper: Transition to RUNUP')
    }
  },
  [PlayerJumpState.RUNUP]: (stateComp) => {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
      stateComp.state = PlayerJumpState.TAKEOFF
      console.log('Jumper: Transition to TAKEOFF')
    }
  },
  [PlayerJumpState.TAKEOFF]: (stateComp) => {
    stateComp.state = PlayerJumpState.FLIGHT
    console.log('Jumper: Transition to FLIGHT')
  },
  [PlayerJumpState.FLIGHT]: (_stateComp) => {
    // JumpPhysicsSystem will handle landing and transition to RESULT
  },
  [PlayerJumpState.RESULT]: handleJumperReset,
  [PlayerJumpState.FOUL]: handleJumperReset
}

function handleJumperReset(stateComp: JumperMutable) {
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    stateComp.state = PlayerJumpState.IDLE
    console.log('Jumper: Transition to IDLE')
  }
}

export function jumperStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  if (!JumperState.has(playerEntity)) return
  
  const stateComp = JumperState.getMutable(playerEntity)
  const handler = jumperStateHandlers[stateComp.state]
  if (handler) {
    handler(stateComp)
  }
}
