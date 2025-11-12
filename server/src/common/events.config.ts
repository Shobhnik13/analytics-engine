export const VALID_EVENTS = [
    'user_registered',
    'user_logged_in',
    'user_profile_updated',
    'session_started',
    'session_ended',
    'dashboard_viewed',
    'project_created',
    'task_created',
    'task_completed',
    'payment_success',
    'plan_upgraded',
    'plan_renewed',
    'most_used_feature'
] as const

export type ValidEvent = typeof VALID_EVENTS[number]

export function isValidEvent(e: string): e is ValidEvent {
    return (VALID_EVENTS as readonly string[]).includes(e);
}