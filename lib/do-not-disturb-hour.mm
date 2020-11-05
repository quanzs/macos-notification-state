#import <Foundation/Foundation.h>

int getDoNotDisturbStartHour() {
  int hour;
  NSOperatingSystemVersion version = [[NSProcessInfo processInfo] operatingSystemVersion];
  bool isBigSur = version.majorVersion == 11 || (version.majorVersion == 10 && version.minorVersion > 15);
  if (!isBigSur) {
    hour = [[[[NSUserDefaults alloc] initWithSuiteName:@"com.apple.notificationcenterui"] objectForKey:@"dndStart"] intValue];
  } 
  return hour;
}

int getDoNotDisturbEndHour() {
  int hour;
  NSOperatingSystemVersion version = [[NSProcessInfo processInfo] operatingSystemVersion];
  bool isBigSur = version.majorVersion == 11 || (version.majorVersion == 10 && version.minorVersion > 15);
  if (!isBigSur) {
    hour = [[[[NSUserDefaults alloc] initWithSuiteName:@"com.apple.notificationcenterui"] objectForKey:@"dndEnd"] intValue];
  } 
  return hour;
}
