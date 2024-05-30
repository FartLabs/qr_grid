import * as QrScanner from "qr-scanner";

if (import.meta.main) {
  const filePath = Deno.args[0];
  const data = await Deno.readFile(filePath);
  const blob = new Blob([data.buffer]);
  const result = await QrScanner.default.default.scanImage(blob);
  console.log(result);
}
