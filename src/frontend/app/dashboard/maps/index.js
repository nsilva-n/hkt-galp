// NOTE: Commented section is related to the world map,
// which includes information regarding international
// input of kms. Switch between both to render the
// preferred map, Portugal or World.

import React from "react";
import { render } from "react-dom";

import { Portugal } from "./Portugal";

const rootElement = document.getElementById("root");
render(<Portugal />, rootElement);

import GeoChartPortugueseDistricts from "./Portugal.js";

export default function HomePage() {
  return (
    <div>
      <h1>Portuguese Districts GeoChart</h1>
      <GeoChartPortugueseDistricts />
    </div>
  );
}

// import React from "react";
// import { render } from "react-dom";

// import { World } from "./World";
// import GeoChartWorld from "./World.js";

// const rootElement = document.getElementById("root");
// render(<World />, rootElement);

// export default function HomePage() {
//   return (
//     <div>
//       <h1>World GeoChart</h1>
//       <GeoChartWorld />
//     </div>
//   );
// }

