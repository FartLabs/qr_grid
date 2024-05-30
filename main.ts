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
  const sizeString = url.searchParams.get("size");
  const size = sizeString ? parseInt(sizeString, 10) : 40;
  const gap = url.searchParams.get("gap") ?? "0";
  const padding = url.searchParams.get("padding") ?? "0";
  return {
    amount,
    rows,
    columns,
    gap,
    padding,
    size,
    data: () => crypto.randomUUID(),
    qrcode: async (data) =>
      (await qrcode(
        data,
        {
          size,
          typeNumber: 0,
          // https://www.qrcode.com/en/about/error_correction.html
          errorCorrectLevel: "H",
        },
      )) as unknown as string,
    before: () =>
      `<div style="display: flex; align-items: center; justify-content: center;">`,
    after: (data) =>
      `<span style="font-size: 0.5rem; margin-left: 0.5rem;">${data}</span></div>`,
  };
}

/**
 * generate generates a document of QR codes.
 */
async function generate(options: GenerateOptions) {
  const data = Array.from(
    { length: options.amount },
    (_, i) => options.data(i),
  );
  const codes = await Promise.all(data.map((data) => options.qrcode(data)));
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
        max-height: 100vh;
        grid-gap: ${options.gap};
        justify-items: center;
        align-items: center;
        padding: 0;
        padding: ${options.padding};
      }

      img {
        width: ${options.size}px;
        height: ${options.size}px;
        image-rendering: pixelated;
      }
    </style>
</head>
<body>
   ${
    partition(data, options.rows * options.columns)
      .map((page, i) =>
        `<div class="page">${
          page.map((code) =>
            `${
              options.before !== undefined ? options.before(code) : ""
            }<img src="${codes[i]}" alt="QR Code" title="${code}">${
              options.after !== undefined ? options.after(code) : ""
            }`
          ).join("")
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
  gap: string;
  padding: string;
  size: number;
  data(i: number): string;
  qrcode: (data: string) => Promise<string>;
  before?: (data: string) => string;
  after?: (data: string) => string;
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
