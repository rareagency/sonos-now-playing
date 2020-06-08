import React from "react";

import "./App.css";

function getAverageRGB(imgEl: any) {
  var blockSize = 5, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement("canvas"),
    context = canvas.getContext && canvas.getContext("2d"),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;

  if (!context) {
    return defaultRGB;
  }

  height = canvas.height =
    imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
  width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
  } catch (e) {
    /* security error, img on diff domain */
    return defaultRGB;
  }

  length = data.data.length;

  while ((i += blockSize * 4) < length) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i + 1];
    rgb.b += data.data[i + 2];
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count);
  rgb.g = ~~(rgb.g / count);
  rgb.b = ~~(rgb.b / count);

  return rgb;
}

function componentToHex(c: any) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: any, g: any, b: any) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function padZero(str: string, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function invertColor(hex: any) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function App() {
  const [cover, setCover] = React.useState<any>();
  const [rgb, setRGB] = React.useState<any>({ r: 0, g: 0, b: 0 });
  React.useEffect(() => {
    async function fetchCover() {
      const res = await fetch("http://localhost:5005/zones", {
        mode: "cors",
        headers: {
          moro: "poro",
          Authorization: "Basic " + btoa("admin:password"),
        },
      });
      const data = await res.json();

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = data[0].coordinator.state.currentTrack.albumArtUri;
      img.onload = () => {
        setRGB(getAverageRGB(img));
      };

      setCover(data[0].coordinator.state);
      setTimeout(fetchCover, 5000);
    }
    fetchCover();
  }, []);

  return (
    <div
      className="App"
      style={{ backgroundImage: `url(${cover?.currentTrack.albumArtUri})` }}
    >
      <div>
        <h1
          style={{
            color: rgbToHex(rgb.r, rgb.g, rgb.b),
            background: invertColor(rgbToHex(rgb.r, rgb.g, rgb.b)),
          }}
        >
          {cover?.currentTrack.title}
        </h1>
        <br />
        <br />
        <h2
          style={{
            color: rgbToHex(rgb.r, rgb.g, rgb.b),
            background: invertColor(rgbToHex(rgb.r, rgb.g, rgb.b)),
          }}
        >
          {cover?.currentTrack.artist}
        </h2>
      </div>
    </div>
  );
}

export default App;
