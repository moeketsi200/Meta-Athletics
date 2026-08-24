import { engine, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { ThrowerState, JumperState, PlayerThrowState, PlayerJumpState, EventEnvironment } from '../components'
import { EVENT_CONFIGS, EventType, FoulRules } from '../events/EventConfig'

type EnvironmentData = ReturnType<typeof EventEnvironment.get>

interface AthleteFoulParams {
  athleteState: { state: number, currentEvent: string };
  isActive: (state: number) => boolean;
  athleteType: string;
  position: Vector3;
  environment: EnvironmentData;
  onFoul: () => void;
}

export function foulSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  const environment = getActiveEnvironment()
  
  if (!environment || !Transform.has(playerEntity)) return
  
  const position = Transform.get(playerEntity).position
  
  if (ThrowerState.has(playerEntity)) {
    processAthleteFoul({
      athleteState: ThrowerState.get(playerEntity),
      isActive: isActiveThrowerState,
      athleteType: 'Thrower',
      position,
      environment,
      onFoul: () => {
        ThrowerState.getMutable(playerEntity).state = PlayerThrowState.FOUL
      }
    })
  }
  
  if (JumperState.has(playerEntity)) {
    processAthleteFoul({
      athleteState: JumperState.get(playerEntity),
      isActive: isActiveJumperState,
      athleteType: 'Jumper',
      position,
      environment,
      onFoul: () => {
        JumperState.getMutable(playerEntity).state = PlayerJumpState.FOUL
      }
    })
  }
}

function getActiveEnvironment(): EnvironmentData | null {
  for (const [entity, env] of engine.getEntitiesWith(EventEnvironment)) {
    return env
  }
  return null
}

function processAthleteFoul(params: AthleteFoulParams) {
  if (!params.isActive(params.athleteState.state)) return
  
  const currentEvent = params.athleteState.currentEvent as EventType
  const rules = EVENT_CONFIGS[currentEvent]?.foulRules
  
  if (!rules) return
  
  if (hasCommittedFoul(rules, params.position, params.environment)) {
    console.log(`FoulSystem: ${params.athleteType} fouled in ${currentEvent}!`)
    params.onFoul()
  }
}

function isActiveThrowerState(state: number): boolean {
  return state === PlayerThrowState.WINDUP || 
         state === PlayerThrowState.POWER_SELECTION || 
         state === PlayerThrowState.ANGLE_SELECTION || 
         state === PlayerThrowState.THROWING
}

function isActiveJumperState(state: number): boolean {
  return state === PlayerJumpState.RUNUP || state === PlayerJumpState.TAKEOFF
}

function hasCommittedFoul(rules: FoulRules, position: Vector3, environment: EnvironmentData): boolean {
  if (rules.requiresCircleContainment && isOutsideCircle(position, environment)) return true
  if (rules.requiresRunwayContainment && isPastFoulLine(position, environment)) return true
  if (rules.requiresBoardTakeoff && isPastFoulLine(position, environment)) return true
  return false
}

function isOutsideCircle(position: Vector3, environment: EnvironmentData): boolean {
  const dist = Vector3.distance(
    Vector3.create(position.x, 0, position.z),
    Vector3.create(environment.circleCenter.x, 0, environment.circleCenter.z)
  )
  return dist > environment.circleRadius
}

function isPastFoulLine(position: Vector3, environment: EnvironmentData): boolean {
  return position.z > environment.foulLineZ
}
