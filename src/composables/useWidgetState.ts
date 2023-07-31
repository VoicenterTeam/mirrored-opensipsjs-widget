import { ref } from 'vue'


/**
 * Possible states:
 *
 * 1. Not initialized - when initFunction was not called, should just show the warning message without any buttons
 * 2. Initialized:
 * ---- 1. Inactive - when there is an active instance of this widget on different tab. Should show button 'activate'
 * ---- 2. Active - this widget instance is activated:
 * -------- 1. Idle - when no call is active:
 * ------------ 1. Target input - if making outgoing calls is allowed
 * ------------ 2. Empty view - if making outgoing calls is disabled:
 * ---------------- 1. Minimized empty view - if option 'shrinkOnIdle' is enabled
 * ---------------- 2. Maximized empty view - if option 'shrinkOnIdle' is disabled
 * -------- 2. Active call - when call is active:
 * ------------ 1. One call - when there is only one call. Show the call and it's actions
 * ------------ 2. Few calls/rooms
 * -------- 3. Ringing - when there is an incoming call. Should show button 'answer' and 'reject'. If option 'autoAnswer' is enabled and there is no active call, should answer automatically, otherwise should show button 'answer' and 'reject'
 */

export const isSettingsPageOpened = ref<boolean>(false)
