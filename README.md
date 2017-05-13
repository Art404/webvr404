# webvr404

_Based on [webvr-boilerplate](https://github.com/borismus/webvr-boilerplate)_

A [THREE.js][three]-based starting point for cross-platform web-based VR
experiences.

This project relies heavily on the [WebVR Polyfill][polyfill] to provide VR
support if the [WebVR API][spec] is not implemented. It also uses the [WebVR
UI][ui] project to render the UI to enter VR and magic window modes. See here
for a [live demo][demo].

[three]: http://threejs.org/
[polyfill]: https://github.com/googlevr/webvr-polyfill
[ui]: https://github.com/googlevr/webvr-ui
[spec]: https://w3c.github.io/webvr/
[demo]: https://borismus.github.io/webvr-boilerplate/

## Getting started

The easiest way to start is to fork or clone this repository.

To run development mode:

```bash
npm start
```

To run build assets for production:

```bash
npm run build
```
