# Camera Photo App

Basically threw this together to test out rapid photo capture. The whole point is you can spam the "Take Photo" button without the screen switching away from the camera feed, which is honestly how it should work everywhere.

## What it does

Split-screen layout - camera feed on the left, gallery on the right. Click the button, boom, photo shows up in the gallery instantly while the camera keeps running. No loading screens, no navigation, just continuous capture.

The gallery updates live as you take photos. You can delete any photo by clicking the little × button that appears on each one.

## Tech Stack

- React + TypeScript
- Vite (because it's fast)
- Uses browser's native `getUserMedia` API for camera access
- Canvas API for capturing frames

## Running it locally

Make sure you have Node.js installed, then:

```bash
npm install
npm run dev
```

Open the URL it gives you (usually `http://localhost:5173`). Your browser will ask for camera permission - you gotta allow it or nothing works.

## How to use

1. Allow camera access when prompted
2. Click "Take Photo" as many times as you want
3. Photos show up in the gallery on the right immediately
4. Hover over any photo and click the × to delete it

The rapid capture thing is the key feature here - camera never stops streaming, so you can take multiple photos in quick succession. Perfect for getting that one good shot when someone's moving around.

## Notes

- Photos are only stored in memory (they're base64 data URLs)
- Refresh the page and they're gone
- Works best on desktop, mobile should work too but layout adapts
- Uses your front-facing camera by default

That's it. Pretty straightforward.
