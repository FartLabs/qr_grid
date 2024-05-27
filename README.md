# qr_grid

Generate printable grids of QR codes.

## Usage

Production URL: <https://qr-grid.deno.dev>

The QR codes displayed on the website are configured by the URL search
parameters. The following parameters are supported:

- `amount`: The total number of QR codes to generate. Default is 150.
- `rows`: The number of rows in the grid per page. Default is 10.
- `columns`: The number of columns in the grid per page. Default is 5.
- `gap`: The gap between QR codes in the grid. Default is 0.
- `size`: The size of the QR codes. Default is 40.

### Example

<https://qr-grid.deno.dev?amount=100&rows=10&columns=10&gap=5&size=50>

## Development

- [Install Deno](https://docs.deno.com/runtime/manual).
- Clone the repository.
- Run the development server.

```sh
deno task dev
```

- Open the browser and navigate to <http://localhost:8000>.

---

Developed with 💖 [**@FartLabs**](https://github.com/FartLabs)
