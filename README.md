# notarize-cli

Notarize a macOS app from the command line.

## Details

This tool is a wrapper for `xcrun notarytool` and `xcrun stapler` and is intended for use in a continuous integration (CI) environment. Requires Xcode.

Supports notarizing app packages, disk images, and zip files.

## Example

```sh
npx notarize-cli --file build/$PRODUCT_MODULE_NAME.dmg \
                 --apple-id $NOTARIZE_APPLE_ID \
                 --team-id $NOTARIZE_TEAM_ID \
                 --password $NOTARIZE_PASSWORD
```

## Usage and options

```sh-session
$ npx notarize-cli --help
Notarize a macOS app from the command line

USAGE
  $ notarize-cli

OPTIONS
  -h, --help                   show CLI help
  -v, --version                show CLI version
  --file=file                  (required) path to the file to notarize
  --no-staple                  disable automatic stapling
  --password=password          (required) password to use for authentication
  --apple-id=apple-id          (required) Apple ID to use for authentication
  --team-id=team-id            (required) Team ID to use for authentication
```

## Environment variables

Some options may be passed as environment variables.

- `NOTARIZE_PASSWORD`: password to use for authentication
- `NOTARIZE_APPLE_ID`: Apple ID to use for authentication
- `NOTARIZE_TEAM_ID`: Team ID to use for authentication
- `PRODUCT_BUNDLE_IDENTIFIER`: bundle id of the app to notarize

## Installation

Installation is unnecessary when you run the command using `npx`, but you can install it if you wish:

```sh
npm install -g notarize-cli
```

## Implementation details

1. Runs `xcrun notarytool submit --wait`.
2. Runs `xcrun stapler staple` if notarization is successful.
