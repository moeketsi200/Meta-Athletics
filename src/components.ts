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
  technique: Schemas.Float,
  techniqueSum: Schemas.Float,
  clickCount: Schemas.Int,
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
  jumpId: Schemas.String
})

export const ProjectileComponent = engine.defineComponent('meta_athletics_projectile', {
  isFlying: Schemas.Boolean,
  velocity: Schemas.Float,
  angle: Schemas.Float,
  gravity: Schemas.Float,
  startTime: Schemas.Double,
  startPosition: Schemas.Vector3,
  direction: Schemas.Vector3
})

export const JumperPhysicsComponent = engine.defineComponent('meta_athletics_jumper_physics', {
  isJumping: Schemas.Boolean,
  runupSpeed: Schemas.Float,
  takeoffAngle: Schemas.Float,
  gravity: Schemas.Float,
  startTime: Schemas.Double,
  startPosition: Schemas.Vector3,
  direction: Schemas.Vector3
})

export const EventEnvironment = engine.defineComponent('meta_athletics_environment', {
  foulLineZ: Schemas.Float, // For runway containment / board takeoff
  circleCenter: Schemas.Vector3, // For circle containment
  circleRadius: Schemas.Float,
})