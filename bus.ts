// allowed types for event keys
type EventType = string | symbol | number
// generic handler function, T depends on Events generic definition
type Handler<T> = (payload: T) => void

class EventBus<Events extends Record<EventType, unknown>> {
	// listeners stored here, keyed by EventType contain Set of handler functions to execute on emit
	private listeners = new Map<keyof Events, Set<Handler<any>>>()


	/**
	 * Adds an event listener keyed with event type containing a handler callback to be called later when emitting events with the same key
	 * @param evt event key to register the handler with
	 * @param handler the handler that will be registered on the event key
	 */
	on<K extends keyof Events>(evt: K, handler: Handler<Events[K]>) {
		let set = this.listeners.get(evt)
		if (!set) {
			// create new set and add it to listeners
			set = new Set()
			this.listeners.set(evt, set)
		}
		// add handlers to the set
		set.add(handler)
	}

	/**
	 * Removes event keys and all handlers or specified handlers from event keys
	 * @param evt event key to be removed
	 * @param handler OPTIONAL if handler is provided will only remove handler else remove all handlers for event key
	 */
	off<K extends keyof Events>(evt: K, handler?: Handler<Events[K]>) {
		let set = this.listeners.get(evt)
		if (!set) return
		if (handler) {
			// delete specified handler
			set?.delete(handler)
			if (set.size === 0) this.listeners.delete(evt)
		} else {
			// if no handler, delete all for event type
			this.listeners.delete(evt)
		}
	}

	/** 
	 * Emits events and executes handlers registered with the provided event key
	 * @param evt event key 
	 * @param args payload passed to handlers
	 */
	emit<K extends keyof Events>(evt: K, args: Events[K]) {
		let set = this.listeners.get(evt)
		if (set) {
			// execute handlers for the provided event type with the payload
			set.forEach(handler => handler(args))
		}
	}
}

type Events = {
	// 'error' is Events key of type EventType
	// Payload types for events are defined in Events; handlers and emitters are type-checked against these.
	'error': { err: string, code: number }
}

export const bus = new EventBus<Events>()


