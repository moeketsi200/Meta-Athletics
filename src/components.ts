import { Schemas, engine } from '@dcl/sdk/ecs'

// Default template components
export const Spinner = engine.defineComponent('spinner', { speed: Schemas.Number })
export const Cube = engine.defineComponent('cube-id', {})

// --- META-ATHLETICS STATE MACHINES ---

export enum PlayerThrowState {
  IDLE = 0,
  WINDUP = 1,
  POWER_SELECTION = 2,
  ANGLE_SELECTION = 3,
  THROWING = 4,
  RESULT = 5,
  FOUL = 6
}

export const ThrowerState = engine.defineComponent('meta_athletics_thrower_state', {
  state: Schemas.Int,          // Cast as PlayerThrowState
  currentEvent: Schemas.String, // Cast as EventType
  power: Schemas.Float,
  angle: Schemas.Float,
  startTime: Schemas.Double,
  throwId: Schemas.String
})

export enum PlayerJumpState {
  IDLE = 0,
  RUNUP = 1,
  TAKEOFF = 2,
  FLIGHT = 3,
  LANDING = 4,
  RESULT = 5,
  FOUL = 6
}

export const JumperState = engine.defineComponent('meta_athletics_jumper_state', {
  state: Schemas.Int,          // Cast as PlayerJumpState
  currentEvent: Schemas.String, // Cast as EventType
  runupSpeed: Schemas.Float,
  takeoffAngle: Schemas.Float,
  startTime: Schemas.Double,
  jumpId: Schemas.String
})