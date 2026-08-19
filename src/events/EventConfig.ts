export enum EventType {
  JAVELIN = 'JAVELIN',
  SHOT_PUT = 'SHOT_PUT',
  DISCUS = 'DISCUS',
  HAMMER = 'HAMMER',
  LONG_JUMP = 'LONG_JUMP',
  TRIPLE_JUMP = 'TRIPLE_JUMP',
  HIGH_JUMP = 'HIGH_JUMP',
  POLE_VAULT = 'POLE_VAULT'
}

export enum EventCategory {
  THROW = 'THROW',
  JUMP = 'JUMP'
}

export interface FoulRules {
  requiresBoardTakeoff?: boolean;
  requiresCircleContainment?: boolean;
  requiresRunwayContainment?: boolean;
  requiresBarClearance?: boolean;
}

export interface ScoringRules {
  metric: 'DISTANCE' | 'HEIGHT';
  ascendingIsBetter: boolean;
}

export interface EventConfig {
  eventType: EventType;
  category: EventCategory;
  
  // Input Ranges
  minPower?: number;
  maxPower?: number;
  minAngle?: number;
  maxAngle?: number;
  maxRunupSpeed?: number;
  
  // Physics Constraints
  gravity: number;
  projectileMass?: number;
  projectileSpeedMultiplier?: number;
  
  foulRules: FoulRules;
  scoringRules: ScoringRules;
}

export const EVENT_CONFIGS: Record<EventType, EventConfig> = {
  [EventType.JAVELIN]: {
    eventType: EventType.JAVELIN,
    category: EventCategory.THROW,
    minPower: 0,
    maxPower: 100,
    minAngle: 20,
    maxAngle: 70,
    gravity: 9.81,
    projectileMass: 0.8,
    projectileSpeedMultiplier: 1.5,
    foulRules: { requiresRunwayContainment: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.SHOT_PUT]: {
    eventType: EventType.SHOT_PUT,
    category: EventCategory.THROW,
    minPower: 0,
    maxPower: 100,
    minAngle: 20,
    maxAngle: 60,
    gravity: 9.81,
    projectileMass: 7.26,
    projectileSpeedMultiplier: 1.0,
    foulRules: { requiresCircleContainment: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.DISCUS]: {
    eventType: EventType.DISCUS,
    category: EventCategory.THROW,
    minPower: 0,
    maxPower: 100,
    minAngle: 10,
    maxAngle: 60,
    gravity: 9.81,
    projectileMass: 2.0,
    projectileSpeedMultiplier: 1.3,
    foulRules: { requiresCircleContainment: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.HAMMER]: {
    eventType: EventType.HAMMER,
    category: EventCategory.THROW,
    minPower: 0,
    maxPower: 100,
    minAngle: 10,
    maxAngle: 60,
    gravity: 9.81,
    projectileMass: 7.26,
    projectileSpeedMultiplier: 1.4,
    foulRules: { requiresCircleContainment: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.LONG_JUMP]: {
    eventType: EventType.LONG_JUMP,
    category: EventCategory.JUMP,
    minAngle: 15,
    maxAngle: 45,
    maxRunupSpeed: 100,
    gravity: 9.81,
    foulRules: { requiresBoardTakeoff: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.TRIPLE_JUMP]: {
    eventType: EventType.TRIPLE_JUMP,
    category: EventCategory.JUMP,
    minAngle: 10,
    maxAngle: 40,
    maxRunupSpeed: 100,
    gravity: 9.81,
    foulRules: { requiresBoardTakeoff: true },
    scoringRules: { metric: 'DISTANCE', ascendingIsBetter: true }
  },
  [EventType.HIGH_JUMP]: {
    eventType: EventType.HIGH_JUMP,
    category: EventCategory.JUMP,
    minAngle: 45,
    maxAngle: 85,
    maxRunupSpeed: 100,
    gravity: 9.81,
    foulRules: { requiresBarClearance: true },
    scoringRules: { metric: 'HEIGHT', ascendingIsBetter: true }
  },
  [EventType.POLE_VAULT]: {
    eventType: EventType.POLE_VAULT,
    category: EventCategory.JUMP,
    minAngle: 60,
    maxAngle: 90,
    maxRunupSpeed: 100,
    gravity: 9.81,
    foulRules: { requiresBarClearance: true },
    scoringRules: { metric: 'HEIGHT', ascendingIsBetter: true }
  }
};
