const addon = require("bindings")("notificationstate");

/**
 * Returns the status, either 'UNKNOWN_ERROR', 'UNKNOWN', 'SESSION_SCREEN_IS_LOCKED','SESSION_ON_CONSOLE_KEY', or 'DO_NOT_DISTURB'. If DND is enabled, the session state isn't checked.
 *
 * @returns {string} USER_NOTIFICATION_STATE
 */
function getNotificationState() {
  if (process.platform !== "darwin") {
    throw new Error("macos-notification-state only works on macOS");
  }

  const USER_NOTIFICATION_STATE = [
    "UNKNOWN",
    "SESSION_SCREEN_IS_LOCKED",
    "SESSION_ON_CONSOLE_KEY",
    "DO_NOT_DISTURB",
  ];

  const dnd = getDoNotDisturb();
  if (dnd) return USER_NOTIFICATION_STATE[3];

  const ss = addon.getNotificationState();
  if (USER_NOTIFICATION_STATE[ss]) {
    return USER_NOTIFICATION_STATE[ss];
  } else {
    return "UNKNOWN_ERROR";
  }
}

/**
 * Returns the session state
 *
 * @returns {string} sessionState
 */
function getSessionState() {
  if (process.platform !== "darwin") {
    throw new Error("macos-notification-state only works on macOS");
  }

  const result = addon.getNotificationState();

  if (result === -1) {
    throw new Error(
      "Getting session state for macOS encountered unknown error"
    );
  } else if (result === 1) {
    return "SESSION_SCREEN_IS_LOCKED";
  } else if (result === 2) {
    return "SESSION_ON_CONSOLE_KEY";
  } else {
    return "UNKNOWN";
  }
}

/**
 * Is do not disturb enabled?
 *
 * @returns {boolean} isDoNotDisturb
 */
function getDoNotDisturb() {
  if (process.platform !== "darwin") {
    throw new Error("macos-notification-state only works on macOS");
  }

  const dnd = addon.getDoNotDisturb();

  if (dnd === -1) {
    throw new Error(
      "Getting do not disturb for macOS encountered unknown error"
    );
  } else if (dnd === 1) {
    return true;
  } else {
    // We should use [Dnd time range] to check it again.
    const hour_24 = 60 * 24;
    const hours = getDoNotDisturbHours();

    const d = new Date();
    const nowMinutes = d.getHours() * 60 + d.getMinutes();

    if (hours) {
      // for example: 18:00 ~ 06:00
      if (hours.start > hours.end) {
        if (
          (hours.start <= nowMinutes && nowMinutes <= hour_24) ||
          (0 < nowMinutes && nowMinutes <= hours.end)
        ) {
          console.log("*****DnD is true - case 1");
          return true;
        }
      }
      // for example: 10:00 ~ 12:00
      if (hours.start < hours.end) {
        if (hours.start <= nowMinutes && nowMinutes <= hours.end) {
          console.log("*****DnD is true - case 2");
          return true;
        }
      }
    }
    console.log("*****DnD is false");
    return false;
  }
}

/**
 * Get do not disturb hours (start ~ end)
 *
 * @returns {boolean} isDoNotDisturb
 */
function getDoNotDisturbHours() {
  if (process.platform !== "darwin") {
    throw new Error("macos-notification-state only works on macOS");
  }

  const start = addon.getDoNotDisturbStartHour();
  const end = addon.getDoNotDisturbEndHour();
  console.log("***time", start, end);

  if (!start || !end) {
    return null;
  } else {
    return {
      start,
      end,
    };
  }
}

module.exports = {
  getDoNotDisturbHours: getDoNotDisturbHours,
  getDoNotDisturb: getDoNotDisturb,
  getNotificationState: getNotificationState,
  getSessionState: getSessionState,
};
