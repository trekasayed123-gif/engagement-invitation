# Eslam & Mayade — Engagement Invitation (burgundy & cream theme)

Static site: HTML + CSS + vanilla JS. No build, no backend.

## Run
Double-click `index.html`, or run `python3 -m http.server 8080` in this folder → http://localhost:8080

## Add your photos (no code editing)
The site shows exactly **6 photos** (the two of you together as kids). Put them here, then refresh:

`assets/images/gallery/1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg`, `6.jpg`

- `jpg / jpeg / png / webp` all work. Numbers must be consecutive.
- Layout: photo 1 big + 2 small, then photo 4 big + 2 small. Photos are cropped to fit, so keep faces near the center.
- Until you add yours, pink placeholders from `assets/images/placeholders/` are shown.
- Resize to ~1600px on the long side (under ~400 KB each) for fast loading on phones.
- Captions: edit `captions` in `js/config.js`.

## Add your song
Save it as `assets/music/background.mp3` (also accepted: `song.mp3`, `music.mp3`, `background.m4a`).
It starts when the guest taps **Open Invitation**; a floating button pauses/resumes. No file = no button, no errors.

## Other settings (`js/config.js`)
Names, `eventDate`, `eventTime` (empty = date only; set `"19:30"` for a live countdown), `venue.mapsUrl`, `shareUrl`, RSVP (`formEndpoint` or `whatsappNumber` — otherwise nothing is saved). All wording: `js/translations.js`.

## Publish
Netlify: drag the folder to https://app.netlify.com/drop. Vercel: run `vercel` in the folder (framework "Other", no build command), then `vercel --prod`.
After publishing, put your URL in `shareUrl`.

## Event time & calendar
`eventTime: '19:00'` (7 PM, Cairo time) turns on the live countdown and the "Add to Calendar" link (Google Calendar).
`durationHours` (default 3) is only used for the calendar end time — change it if you like.

## How guest messages reach you
- With `whatsappNumber` set, the guest's WhatsApp opens with the reply written; **the guest must press Send** — it then arrives in your WhatsApp as a normal message.
- For fully automatic delivery, set `formEndpoint` (free Formspree form → replies go to your email). It takes priority over WhatsApp when both are set.
