# Maestro E2E Testing

This directory contains end-to-end (e2e) tests for the Expo app using [Maestro](https://maestro.mobile.dev/), a mobile UI testing framework.

## Overview

Maestro provides a simple, declarative YAML-based syntax for writing e2e tests. The tests are organized by feature area and cover:

- **Navigation**: Home screen and user detail screen navigation
- **Authentication**: Sign in, sign out, and protected endpoint testing
- **Theme**: Dark/light mode toggle functionality
- **Locale**: Internationalization and locale switching
- **Integration**: Full user flow combining multiple features

## Prerequisites

1. **Install Maestro CLI**

   On macOS (using Homebrew):
   ```bash
   brew tap mobile-dev-inc/tap
   brew install maestro
   ```

   On other platforms, see the [Maestro installation guide](https://maestro.mobile.dev/cli/installation).

2. **Build and install the app**

   Maestro requires the app to be built and installed on a device or emulator. You have two options:

   **Option A: Development Build (Metro Bundler Required)**
   
   For development builds, you need Metro bundler running:
   
   ```bash
   # Terminal 1: Start Metro bundler
   cd apps/expo
   yarn start
   
   # Terminal 2: Build and install app (in another terminal)
   yarn ios  # or yarn android
   ```
   
   Then run Maestro tests while Metro is still running.
   
   **Option B: Production Build (Embedded Bundle)**
   
   For production builds with embedded JS bundle (better for CI/CD), use EAS Build:
   
   ```bash
   # Build with embedded bundle (no Metro required)
   yarn eas:build:ios  # or yarn eas:build:android
   ```
   
   Or use local production build:
   ```bash
   yarn build:ios  # or yarn build:android
   ```
   
   Note: Local builds may still require Metro. For truly standalone builds without Metro, use EAS Build.

   **Note**: Expo Go has limitations for e2e testing. It's recommended to use a development build or standalone build.

3. **Set up test credentials (optional)**

   Set environment variables before running tests:

   ```bash
   export TEST_USER_EMAIL=test@test.com
   export TEST_USER_PASSWORD=password
   ```

   These environment variables are referenced in test files using `${TEST_USER_EMAIL}` and `${TEST_USER_PASSWORD}` syntax.

## Running Tests

### Prerequisites Before Running Tests

1. **Start Metro bundler** (for development builds):
   ```bash
   cd apps/expo
   yarn start
   ```
   Keep this terminal running.

2. **Build and install the app** (in another terminal):
   ```bash
   cd apps/expo
   yarn ios  # or yarn android
   ```
   Wait for the app to launch successfully.

3. **Run Maestro tests** (in a third terminal or after Metro is running):
   ```bash
   cd apps/expo
   yarn test:e2e
   ```

### Run all tests

```bash
yarn test:e2e
```

Maestro will automatically detect available iOS simulators and Android emulators. If multiple devices are available, Maestro will prompt you to select one.

**Important**: For development builds, ensure Metro bundler is running before executing Maestro tests.

### List available devices

```bash
# List all devices (iOS and Android)
yarn test:e2e:device:list

# Or use platform-specific commands:
# iOS simulators
xcrun simctl list devices

# Android emulators/devices
adb devices
```

### Run tests on a specific device

To run tests on a specific device, you can:

1. **Set environment variable**:
   ```bash
   export MAESTRO_DEVICE_ID=<device-id>
   yarn test:e2e
   ```

2. **Use Maestro directly** - Maestro will prompt you to select a device if multiple are available:
   ```bash
   maestro test .maestro
   ```

3. **Ensure only one device is running** - Maestro will auto-select it

### Platform-specific testing

Maestro automatically detects the platform based on available devices. To test on a specific platform:

- **iOS**: Ensure only iOS simulators are running
- **Android**: Ensure only Android emulators are running
- Or use device selection as shown above

### Run a specific test file

```bash
maestro test .maestro/navigation/home-screen.yaml
```


## Test Structure

```
.maestro/
├── config.yaml              # Maestro configuration
├── navigation/              # Navigation tests
│   ├── home-screen.yaml
│   └── user-detail.yaml
├── auth/                    # Authentication tests
│   ├── sign-in.yaml
│   ├── sign-out.yaml
│   └── protected-endpoint.yaml
├── theme/                   # Theme tests
│   └── theme-toggle.yaml
├── locale/                  # Locale tests
│   └── locale-switch.yaml
└── integration/             # Integration tests
    └── full-flow.yaml
```

## Test IDs

The app components use `testID` props for reliable element selection. The following test IDs are available:

- `theme-toggle-button` - Theme toggle button
- `email-input` - Email input field
- `password-input` - Password input field
- `sign-in-button` - Sign in button
- `sign-out-button` - Sign out button
- `auth-test-button` - Protected endpoint test button
- `locale-en-card` - English locale card
- `locale-cs-card` - Czech locale card
- `locale-fr-card` - French locale card

## Writing New Tests

1. Create a new YAML file in the appropriate directory (navigation, auth, theme, locale, or integration)

2. Start with the app ID and basic structure:

   ```yaml
   appId: ${MAESTRO_APP_ID}
   ---
   # Test description
   
   - launchApp
   - assertVisible: "Expected Text"
   - tapOn:
       id: "test-id"
   ```

3. Use test IDs for reliable element selection:

   ```yaml
   - tapOn:
       id: "my-test-id"
   ```

4. Use text-based selectors as fallback:

   ```yaml
   - tapOn: "Button Text"
   ```

5. Wait for animations to complete:

   ```yaml
   - waitForAnimationToEnd
   ```

6. Scroll to find elements:

   ```yaml
   - scrollUntilVisible:
       element: "Text to find"
       direction: DOWN
   ```

For more details, see the [Maestro documentation](https://maestro.mobile.dev/).

## Configuration

### App IDs

The app IDs are configured in each test file:

- iOS: `com.nexpo.app`
- Android: `com.nexpo.app` (from `app.json` and `android/app/build.gradle`)

Each test file specifies the appId at the top:

```yaml
appId: com.nexpo.app
```

Maestro automatically detects the platform (iOS/Android) based on the device it's running on.

### Environment Variables

Test credentials can be set via environment variables:

- `TEST_USER_EMAIL` - Test user email (default: `test@test.com`)
- `TEST_USER_PASSWORD` - Test user password (default: `password`)

These are referenced in test files using `${TEST_USER_EMAIL}` and `${TEST_USER_PASSWORD}`.

## Troubleshooting

### "No script URL provided" / "unsanitizedScriptURLString = (null)" Error

This error means the app can't connect to Metro bundler. To fix:

**For Development Builds:**
1. **Start Metro bundler first**:
   ```bash
   cd apps/expo
   yarn start
   ```
   Keep Metro running in a separate terminal.

2. **Then build and install the app**:
   ```bash
   # In another terminal
   yarn ios  # or yarn android
   ```

3. **Run Maestro tests while Metro is still running**

**For Production Builds:**
Use EAS Build for standalone builds with embedded bundle (no Metro required):
```bash
yarn eas:build:ios  # or yarn eas:build:android
```

Or use local production build:
```bash
yarn build:ios  # or yarn build:android
```
Note: Local builds may still require Metro for development builds.

### "Unable to launch app com.nexpo.app" Error

This error means the app isn't installed on the device/emulator. To fix:

1. **Build and install the app first**:
   ```bash
   # For iOS (with Metro running)
   yarn start  # Terminal 1
   yarn ios     # Terminal 2
   
   # For Android (with Metro running)
   yarn start     # Terminal 1
   yarn android   # Terminal 2
   ```

2. **Verify the app is installed**:
   ```bash
   # Check iOS simulators
   xcrun simctl list devices | grep Booted
   
   # Check Android devices
   adb devices
   ```

3. **Verify the app ID matches**:
   - iOS: Check `app.json` → `ios.bundleIdentifier` (should be `com.nexpo.app`)
   - Android: Check `android/app/build.gradle` → `applicationId` (should be `com.nexpo.app`)

4. **Ensure a device is running**:
   - Start an iOS Simulator from Xcode or `open -a Simulator`
   - Start an Android Emulator from Android Studio or `emulator -avd <avd-name>`

### Tests fail to find elements

1. Ensure the app is built and installed on the device/emulator
2. Verify the app is running before starting tests
3. Check that testIDs are correctly set in the components
4. Use text-based selectors as fallback if testIDs are not available

### App not launching

1. Verify the app ID matches the bundle identifier/package name
2. Ensure the app is installed on the device
3. Check that the device is connected and recognized: `yarn test:e2e:device:list`

### Tests timing out

1. Add `waitForAnimationToEnd` after actions that trigger animations
2. Increase wait times if needed
3. Check that elements are actually visible before interacting with them

### Platform-specific issues

- iOS: Ensure the app is signed and can be launched
- Android: Check that the app has the required permissions
- Some UI elements may differ between platforms - use platform-specific selectors if needed

## CI/CD Integration

Maestro tests can be integrated into CI/CD pipelines. Example GitHub Actions workflow:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Maestro
        run: |
          brew tap mobile-dev-inc/tap
          brew install maestro
      - name: Run E2E tests
        run: |
          cd apps/expo
          yarn test:e2e:ios
```

## Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro Best Practices](https://maestro.mobile.dev/best-practices)
- [Maestro Examples](https://maestro.mobile.dev/examples)

