
import posthog from 'posthog-js';

// Define event names as constants to avoid typos
export const ANALYTICS_EVENTS = {
    PROJECT_CREATED: 'project_created',
    PLAN_UPLOADED: 'plan_uploaded',
    PHOTO_UPLOADED: 'photo_uploaded',
    PIN_PLACED: 'pin_placed',
    EXPORT_GENERATED: 'export_generated',
    REVIEW_SESSION_STARTED: 'review_session_started',
};

type EventProps = Record<string, any>;

export const trackEvent = (eventName: string, properties?: EventProps) => {
    if (typeof window !== 'undefined') {
        // Track in PostHog
        posthog.capture(eventName, properties);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${eventName}`, properties);
        }
    }
};
