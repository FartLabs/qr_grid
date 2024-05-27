import { qrcode } from "qrcode";

if (import.meta.main) {
  Deno.serve(async (request) => {
    const url = new URL(request.url);
    return new Response(
      await generate(parseGenerateOptions(url)),
      { headers: { "Content-Type": "text/html" } },
    );
  });
}

function parseGenerateOptions(url: URL): GenerateOptions {
  const amountString = url.searchParams.get("amount");
  const amount = amountString ? parseInt(amountString, 10) : 150;
  const rowsString = url.searchParams.get("rows");
  const rows = rowsString ? parseInt(rowsString, 10) : 10;
  const columnsString = url.searchParams.get("columns");
  const columns = columnsString ? parseInt(columnsString, 10) : 5;
  const gapString = url.searchParams.get("gap");
  const gap = gapString ? parseInt(gapString, 10) : 0;
  const sizeString = url.searchParams.get("size");
  const size = sizeString ? parseInt(sizeString, 10) : 40;
  return {
    amount,
    rows,
    columns,
    gap,
    qrcode: async () =>
      (await qrcode(
        crypto.randomUUID(),
        {
          size,
          typeNumber: 0,
          // https://www.qrcode.com/en/about/error_correction.html
          errorCorrectLevel: "H",
        },
      )) as unknown as string,
  };
}

/**
 * generate generates a document of QR codes.
 */
async function generate(options: GenerateOptions) {
  const codes = await Promise.all(
    Array.from({ length: options.amount }, (_, i) => options.qrcode(i)),
  );
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>go.fart.tools/gh/qr_grid</title>
    <style>
      body {
        margin: 0;
      }

      .page {
        display: grid;
        grid-template-columns: repeat(${options.columns}, 1fr);
        grid-template-rows: repeat(${options.rows}, 1fr);
        height: 100vh;
        grid-gap: ${options.gap}px;
        justify-items: center;
        align-items: center;
        padding: 0;
      }

      img {
        width: auto;
        height: auto;
      }
    </style>
</head>
<body>
   ${
    partition(codes, options.rows * options.columns)
      .map((page) =>
        `<div class="page">${
          page.map((code) => `<img src="${code}" alt="QR Code">`).join("")
        }</div>`
      ).join("")
  }
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
  gap: number;
  qrcode: (i: number) => Promise<string>;
}

/**
 * partition partitions an array into chunks of a specific size. The last chunk
 * may contain fewer elements.
 */
function partition<T>(array: T[], size: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / size) },
    (_, i) => array.slice(i * size, i * size + size),
  );
}
