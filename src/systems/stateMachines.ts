import { engine, inputSystem, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { ThrowerState, PlayerThrowState, JumperState, PlayerJumpState } from '../components'

export function throwerStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  
  if (ThrowerState.has(playerEntity)) {
    const stateComp = ThrowerState.getMutable(playerEntity)
    
    switch (stateComp.state) {
      case PlayerThrowState.IDLE:
        // Transition IDLE -> WINDUP when player presses Primary Action (E)
        if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerThrowState.WINDUP
          console.log('Thrower: Transition to WINDUP')
        }
        break
        
      case PlayerThrowState.WINDUP:
        // Automatically transition to POWER_SELECTION (or wait for an animation to finish)
        stateComp.state = PlayerThrowState.POWER_SELECTION
        stateComp.startTime = Date.now()
        console.log('Thrower: Transition to POWER_SELECTION')
        break
        
      case PlayerThrowState.POWER_SELECTION:
        // Transition to ANGLE_SELECTION on Pointer Click
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerThrowState.ANGLE_SELECTION
          // power would be calculated here based on the meter
          console.log('Thrower: Transition to ANGLE_SELECTION')
        }
        break
        
      case PlayerThrowState.ANGLE_SELECTION:
        // Transition to THROWING on Pointer Click
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerThrowState.THROWING
          // angle would be calculated here based on the meter
          console.log('Thrower: Transition to THROWING')
        }
        break
        
      case PlayerThrowState.THROWING:
        // Projectile flies. The KinematicSystem handles the flight.
        // It will update the state to RESULT when the projectile lands.
        break
        
      case PlayerThrowState.RESULT:
      case PlayerThrowState.FOUL:
        // Transition back to IDLE when player presses Primary Action (E)
        if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerThrowState.IDLE
          console.log('Thrower: Transition to IDLE')
        }
        break
    }
  }
}

export function jumperStateMachineSystem(dt: number) {
  const playerEntity = engine.PlayerEntity
  
  if (JumperState.has(playerEntity)) {
    const stateComp = JumperState.getMutable(playerEntity)
    
    switch (stateComp.state) {
      case PlayerJumpState.IDLE:
        if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerJumpState.RUNUP
          console.log('Jumper: Transition to RUNUP')
        }
        break
        
      case PlayerJumpState.RUNUP:
        if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerJumpState.TAKEOFF
          console.log('Jumper: Transition to TAKEOFF')
        }
        break
        
      case PlayerJumpState.TAKEOFF:
        // Automatically transitions to FLIGHT
        stateComp.state = PlayerJumpState.FLIGHT
        console.log('Jumper: Transition to FLIGHT')
        break
        
      case PlayerJumpState.FLIGHT:
        // JumpPhysicsSystem will handle landing and transition to RESULT
        break
        
      case PlayerJumpState.RESULT:
      case PlayerJumpState.FOUL:
        if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
          stateComp.state = PlayerJumpState.IDLE
          console.log('Jumper: Transition to IDLE')
        }
        break
    }
  }
}
