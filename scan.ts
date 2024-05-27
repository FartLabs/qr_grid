import * as QrScanner from "qr-scanner";

if (import.meta.main) {
  const imageBytes = await Deno.stdin.readable.pipeTo;
}

QrScanner.default.default.scanImage("qr.png")
  .then((result) => console.log(result))
  .catch((error) => console.log(error || "No QR code found."));

// TODO: Read file from file system and pipe to QrScanner to read QR code.
