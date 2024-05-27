import { qrcode } from "qrcode";

if (import.meta.main) {
  const example = await generate({
    amount: 150,
    rows: 10,
    columns: 5,
    async qrcode() {
      return (await qrcode(await crypto.randomUUID(), {
        size: 40,
        typeNumber: 0,
        // https://www.qrcode.com/en/about/error_correction.html
        errorCorrectLevel: "H",
      })) as unknown as string;
    },
  });
  await Deno.writeTextFile("example.html", example);
}

/**
 * generate generates a document of QR codes.
 */
async function generate(options: GenerateOptions) {
  const codes = await Promise.all(
    Array.from({ length: options.amount }, (_, i) => options.qrcode(i)),
  );
  // TODO: Add CSS grid settings.
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>go.fart.tools/gh/qr_grid</title>
</head>
<body>
   ${codes.map((code) => `<img src="${code}" alt="QR Code" />`).join("\n")}
</body>
</html>`;
}

/**
 * GenerateOptions is the options for the generate function.
 */
export interface GenerateOptions {
  amount: number;
  rows: number;
  columns: number;
  qrcode: (i: number) => Promise<string>;
}
