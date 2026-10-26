# BIMI setup

The static Mova BIMI mark is served at:

`https://ridebymova.com/mova-bimi.svg`

It is based on the supplied animated M-mark artwork, with animation and decorative effects removed and the mark placed on a square canvas. It uses SVG Tiny PS (`version="1.2"` and `baseProfile="tiny-ps"`), with no scripts, embedded raster images, or external references.

## DNS record

After publishing the site asset over HTTPS, publish this TXT record with the DNS provider for `ridebymova.com`:

| Name / host | Type | Value |
| --- | --- | --- |
| `default._bimi` | TXT | `v=BIMI1; l=https://ridebymova.com/mova-bimi.svg; a=` |

The `a=` tag is intentionally empty because no Verified Mark Certificate (VMC) or Common Mark Certificate (CMC) URL has been provided. Some mailbox providers, notably Gmail, require a qualifying certificate to display BIMI logos; a BIMI record alone does not guarantee logo display.

## DMARC prerequisite

BIMI requires DMARC to be enforced for the sending domain. Check the existing `_dmarc.ridebymova.com` TXT record and ensure it has an enforcement policy (`p=quarantine` or `p=reject`) and `pct=100`. Do not add a second DMARC record. Make any policy change only after confirming that all legitimate mail sources pass SPF or DKIM alignment, to avoid disrupting email delivery.

Before relying on BIMI, confirm the public logo URL returns the SVG directly over HTTPS, validate the SVG with a BIMI-compatible checker, and check the published DNS records after propagation.
