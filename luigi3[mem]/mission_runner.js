/// <reference path="../.config/gta3.d.ts" />

export function defineMission(starter, body, onFail) {
  const _wait = wait;
  const p = new Player(0);
  starter(() => {
    wait = (delay) => {
      _wait(delay);
      if (!p.isPlaying()) {
        throw new Error("MISSION ABORTED");
      }
    };
    try {
      body();
    } catch (e) {
      log(e);
      onFail();
      Text.ClearSmallPrints();
      ONMISSION = 0;
    }
    wait = _wait;
  });
}
