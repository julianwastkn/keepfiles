export default {
  url: 'https://keepfil.es',
  identifierLength: 5,
  allowSignups: true,
  maxFileSize: '100000000', // 100 MB
  PermissionLevels: {
    // Permission: Level
    // Where Level is the *minimum* level required.
    // Default PermissionLevel for Users is 0.
    UnlimitedFileSize: 1,
    GrantAPIAccessAndPrivileged: 2,
    GrantAdministrator: 3,
  },
};

/* Permission Levels
 * 0 -    Basic      - Upload files, shorten links ONLY if API key is granted.
 * 1 -  Privileged   - Basic, with no limit on file sizes.
 * 2 - Service Admin - Privileged, with the ability to grant and revoke API keys and Level 1
 * 3 -     Owner     - Service Admin, with the ability to grant and revoke Level 2
 */
