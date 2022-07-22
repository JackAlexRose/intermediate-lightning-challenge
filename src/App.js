/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Utils, Router } from "@lightningjs/sdk";
import routes from "./routes"
import colors from "./lib/colors";

export default class App extends Router.App {
  _setup() {
    Router.startRouter(routes);
  }

  static getFonts() {
    return [
      { family: "Regular", url: Utils.asset("fonts/Roboto-Regular.ttf") },
    ];
  }

  static colors() {
    return colors;
  }

  static _template() {
    return {
      ...super._template(),
      w: 1920,
      h: 1080,

      color: 0xff333333,
      rect: true,
    };
  }
}
