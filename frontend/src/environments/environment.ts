// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Backend base URL. On a phone over USB, run `adb reverse tcp:3000 tcp:3000` first (see README).
  apiUrl: 'http://localhost:3000/api/v1',
  // The backend doesn't have /programs yet. While this is true, Home and Details read the
  // sample data in api/mocks/programs.mock.ts. Set it to false once GET /programs exists.
  mockPrograms: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
