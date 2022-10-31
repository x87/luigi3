/// <reference path="../.config/gta3.d.ts" />

import { Fade, SwitchType, PedType, AnimGroup } from ".././.config/enums";
import { readScmVariable, writeScmVariable } from "./scm";
import { defineMission } from "./mission_runner";
import { car, ped, hier } from "./ide";

ONMISSION = false;
const p = new Player(0);

// SCM Variable Ids
const flag_luigi_mission3_passed = 250;
const flag_player_on_luigi_mission = 232;
const flag_industrial_passed = 208;
const misty_door1 = 17;

// Object Ids
const INDHIBUILD3 = 257;
const LUIGICLUBOUT = 256;
const LUIGIINEERCLUB = 243;
const BACKDOOR = 1376;

/** @type {Char} */
let misty_lm3;
/** @type {Blip} */
let radar_blip_coord1_lm3;
/** @type {Blip} */
let radar_blip_coord2_lm3;
/** @type {Blip} */
let radar_blip_ped1_lm3;
/** @type {boolean} */
let flag_blip_on_misty_lm3;
/** @type {boolean} */
let flag_player_got_message_lm3;
/** @type {Car} */
let car_lm3;
/** @type {boolean} */
let blob_flag;
/** @type {boolean} */
let flag_camera_mode_lm3;

const startPos = [p.getCoordinates().x + 2, p.getCoordinates().y, p.getCoordinates().z];
// const startPos = [892.8, -425.8, 13.9];
defineMission(starter, body, onFailed);

function starter(missionBody) {
  while (true) {
    wait(0);
    if (readScmVariable(flag_luigi_mission3_passed) || readScmVariable(flag_industrial_passed)) {
      exit();
    }

    // check if player is in the marker and can start the mission
    if (p.isPlaying() && p.locateOnFoot3D(...startPos, 1.5, 2.0, 2.0, true) && !ONMISSION) {
      if (p.canStartMission()) {
        log("*** STARTING MISSION luigi3 ***");
        p.makeSafeForCutscene();
        Camera.SetFadingColor(0, 0, 0);
        Camera.DoFade(1500, Fade.Out);
        Streaming.Switch(false);
        Text.PrintBig("LM3", 15000, 2); //"Drive Misty For Me."
        fading();
        missionBody();
      }
    }
  }
}

// actual mission implementation
function body() {
  // Variable for mission
  ONMISSION = true;
  writeScmVariable(flag_player_on_luigi_mission, 1);
  blob_flag = true;

  Stat.RegisterMissionGiven();
  wait(0);

  Camera.DoFade(0, Fade.In);

  Streaming.LoadSpecialCharacter(1, "LUIGI");
  Streaming.LoadSpecialCharacter(2, "MICKY");
  Streaming.RequestModel(INDHIBUILD3);
  Streaming.RequestModel(LUIGICLUBOUT);
  Streaming.RequestModel(LUIGIINEERCLUB);
  Streaming.LoadSpecialModel(hier`cutobj01`, "LUDOOR");
  Streaming.LoadSpecialModel(hier`cutobj02`, "LUIGIH");
  Streaming.LoadSpecialModel(hier`cutobj03`, "PLAYERH");
  Streaming.LoadSpecialModel(hier`cutobj04`, "MICKYH");

  World.SetPedDensityMultiplier(0.0);
  World.ClearAreaOfChars(926.54, -471.72, 1.0, 830.76, -257.96, 25.0);
  Streaming.LoadAllModelsNow();

  while (
    !Streaming.HasSpecialCharacterLoaded(1) ||
    !Streaming.HasSpecialCharacterLoaded(2) ||
    !Streaming.HasModelLoaded(hier`cutobj01`) ||
    !Streaming.HasModelLoaded(hier`cutobj02`) ||
    !Streaming.HasModelLoaded(hier`cutobj03`) ||
    !Streaming.HasModelLoaded(hier`cutobj04`) ||
    !Streaming.HasModelLoaded(INDHIBUILD3) ||
    !Streaming.HasModelLoaded(LUIGICLUBOUT) ||
    !Streaming.HasModelLoaded(LUIGIINEERCLUB)
  ) {
    wait(0);
  }

  World.SetVisibilityOfClosestObjectOfType(890.9, -416.9, 15.0, 6.0, BACKDOOR, false);

  Cutscene.Load("L3_DM");
  Cutscene.SetOffset(900.782, -427.523, 13.829);
  let cs_player = CutsceneObject.Create(0).setAnim("PLAYER");
  let cs_luigi = CutsceneObject.Create(26).setAnim("LUIGI");
  let cs_micky = CutsceneObject.Create(27).setAnim("MICKY");
  let cs_luigihead = CutsceneHead.Create(cs_luigi, hier`cutobj02`).setAnim("LUIGI");
  let cs_playerhead = CutsceneHead.Create(cs_player, hier`cutobj03`).setAnim("PLAYER");
  let cs_mickyhead = CutsceneHead.Create(cs_micky, hier`cutobj04`).setAnim("MICKY");
  let cs_ludoor = CutsceneObject.Create(hier`cutobj01`).setAnim("LUDOOR");

  World.ClearArea(896.6, -426.2, 13.9, 1.0, true);
  p.setCoordinates(896.6, -426.2, 13.9).setHeading(270.0);
  Camera.DoFade(1500, Fade.In);
  World.SwitchRubbish(false);

  Cutscene.Start();
  print("LM3_A", 2433); // "Hey I've gotta talk to you... All right Mick I talk to yah later"
  waitCutscene(5504);
  Text.ClearThisPrint("LM3_A");
  print("LM3_B", 8333); //"How yah doing kid?
  print("LM3_C", 9667); //"The Don's son, Joey Leone, he wants some action from his regular girl Misty"
  print("LM3_D", 13833); //"Go pick her up at Hepburn Heights..."
  print("LM3_E", 15467); //"but watch yourself that's Diablo turf."
  print("LM3_F", 18233); //"Then run her over to his garage in Trenton and make it quick,"
  print("LM3_G", 21100); //"Joey ain't the kinda you keep waiting, remember, this is your foot in the door..."
  print("LM3_H", 25333); //"so keep your eyes on the road and off Misty!"
  waitCutscene(27701);
  Text.ClearThisPrint("LM3_H");
  waitCutscene(29666);
  Camera.DoFade(1500, Fade.Out);
  while (!Cutscene.HasFinished()) {
    wait(0);
  }
  Text.ClearPrints();
  fading();
  Cutscene.Clear();

  Streaming.Switch(true);
  World.SwitchRubbish(true);
  Streaming.LoadScene(920.3, -425.4, 15.0);
  Camera.SetBehindPlayer();
  wait(500);
  Camera.DoFade(1500, Fade.In);
  World.SetVisibilityOfClosestObjectOfType(890.9, -416.9, 15.0, 6.0, BACKDOOR, true);

  Streaming.UnloadSpecialCharacter(1);
  Streaming.UnloadSpecialCharacter(2);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj01`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj02`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj03`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj04`);
  Streaming.MarkModelAsNoLongerNeeded(INDHIBUILD3);
  Streaming.MarkModelAsNoLongerNeeded(LUIGICLUBOUT);
  Streaming.MarkModelAsNoLongerNeeded(LUIGIINEERCLUB);

  World.SetPedDensityMultiplier(1.0);

  Streaming.LoadSpecialCharacter(2, "MiSTY");
  while (!Streaming.HasSpecialCharacterLoaded(2)) {
    wait(0);
  }
  fading();
  Text.PrintNow("LM3_10", 5000, 1); //Get a vehicle!"
  let controlmode = Pad.GetControllerMode();
  if (controlmode === 0 || controlmode === 1 || controlmode === 2 || controlmode === 3) {
    Text.PrintHelp("HELP15"); //"Press the...."
  }

  while (!p.isInAnyCar()) {
    wait(0);
  }

  car_lm3 = p.storeCarIsIn();
  Text.PrintNow("LM3_4", 7000, 1); //"Now Pick up Misty!"
  Audio.LoadMissionAudio("L2_A");
  radar_blip_coord1_lm3 = Blip.AddForCoord(937.9, -259.8, -100.0);

  while (!p.locateStoppedInCar2D(937.9, -259.8, 3.0, 3.0, blob_flag) || !Audio.HasMissionAudioLoaded()) {
    wait(0);
    if (!p.isInAnyCar() && !flag_player_got_message_lm3) {
      Text.PrintNow("IN_VEH2", 5000, 1); //"Get a vehicle and get on with the mission!"
      radar_blip_coord1_lm3.remove();
      flag_player_got_message_lm3 = true;
      blob_flag = false;
    }
    if (p.isInAnyCar() && flag_player_got_message_lm3) {
      radar_blip_coord1_lm3 = Blip.AddForCoord(937.9, -259.8, -100.0);
      car_lm3 = p.storeCarIsIn();
      flag_player_got_message_lm3 = false;
      blob_flag = true;
    }
  }

  switch (Pad.GetControllerMode()) {
    case 0:
    case 3:
      Text.PrintHelp("LM3_1A"); //"Press the~h~ L1 button~w~ to activate the ~h~horn~w~ and let Misty know you are here."
      break;
    case 1:
      Text.PrintHelp("LM3_1B"); //"Press the~h~ L3 button~w~ to activate the ~h~horn~w~ and let Misty know you are here."
      break;
    case 2:
      Text.PrintHelp("LM3_1C"); //"Press the~h~ R1 button~w~ to activate the ~h~horn~w~ and let Misty know you are here."
      break;
  }

  blob_flag = true;
  while (!p.isPressingHorn() || !p.locateStoppedInCar2D(937.9, -259.8, 3.0, 3.0, blob_flag) || !p.isSittingInAnyCar()) {
    wait(0);
    if (!p.isInAnyCar() && !flag_player_got_message_lm3) {
      Text.PrintNow("IN_VEH2", 5000, 1); //"Get a vehicle and get on with the mission!"
      radar_blip_coord1_lm3.remove();
      flag_player_got_message_lm3 = true;
      blob_flag = false;
    }
    if (p.isInAnyCar() && flag_player_got_message_lm3) {
      radar_blip_coord1_lm3 = Blip.AddForCoord(937.9, -259.8, -100.0);
      car_lm3 = p.storeCarIsIn();
      flag_player_got_message_lm3 = false;
      blob_flag = true;
    }
  }
  Text.ClearHelp();

  let script_controlled_player = p.getChar();
  script_controlled_player.setCantBeDraggedOut(true);

  wait(500);
  Hud.SwitchWidescreen(true);
  p.setControl(false);
  World.ClearArea(936.2, -263.9, 5.0, 1.0, true);

  flag_camera_mode_lm3 =
    p.locateInCar2D(937.9, -259.8, 3.0, 3.0, false) &&
    [
      car`BUS`,
      car`COACH`,
      car`FLATBED`,
      car`firetruk`,
      car`landstal`,
      car`linerun`,
      car`trash`,
      car`PONY`,
      car`MULE`,
      car`ambulan`,
      car`mrwhoop`,
      car`enforcer`,
      car`RUMPO`,
      car`BELLYUP`,
      car`MRWONGS`,
      car`YANKEE`,
      car`securica`,
    ].some((model) => p.isInModel(model));

  if (flag_camera_mode_lm3) {
    World.ClearArea(930.112, -264.972, 7.336, 4.0, true);
    Camera.SetFixedPosition(930.112, -264.972, 7.336, 0.0, 0.0, 0.0);
    Camera.PointAtPoint(930.959, -265.474, 7.164, SwitchType.JumpCut);
  } else {
    World.ClearArea(928.169, -267.549, 4.0, 4.0, true);
    Camera.SetFixedPosition(928.169, -267.549, 5.623, 0.0, 0.0, 0.0);
    Camera.PointAtPoint(929.162, -267.43, 5.656, SwitchType.JumpCut);
  }

  Game.SetPoliceIgnorePlayer(p, true);
  Game.SetEveryoneIgnorePlayer(p, true);

  World.ClearArea(941.7, -269.2, 4.0, 1.0, true); // Location misty is going to run to
  radar_blip_coord1_lm3.remove();
  misty_lm3 = Char.Create(PedType.Special, ped`special02`, 946.47, -275.5, 3.9, 0.0);
  misty_lm3.turnToFaceCoord(942.0, -268.0, -100.0).clearThreatSearch().setAnimGroup(AnimGroup.SexyWoman);

  let door = new ScriptObject(readScmVariable(misty_door1));
  let door1_position_lm3 = door.getHeading();
  while (door1_position_lm3 !== 90.0) {
    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
    if (door1_position_lm3 >= 80.0) {
      door1_position_lm3 = 90.0;
    } else {
      door1_position_lm3 += 10.0;
    }
    door.setHeading(door1_position_lm3);
  }

  wait(0);
  if (Char.IsDead(misty_lm3)) {
    Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
    return onFailed();
  }

  World.ClearArea(944.1, -270.7, 4.0, 2.0, true);
  misty_lm3.setObjGotoCoordOnFoot(944.1, -270.7, -100.0);

  TIMERB = 0;

  while (!misty_lm3.isObjectivePassed()) {
    wait(0);
    if (p.isInAnyCar()) {
      car_lm3 = p.storeCarIsIn();
      if (Car.IsDead(car_lm3)) {
        Text.PrintNow("WRECKED", 5000, 1); //"The vehicle's wrecked!"
        return onFailed();
      }
    }
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
    if (TIMERB >= 10000) {
      if (!misty_lm3.isObjectivePassed()) {
        misty_lm3.setCoordinates(944.1, -270.7, 3.9);
      }
    }
  }

  World.ClearArea(941.0, -264.0, -100.0, 4.0, true);
  Camera.SetFixedPosition(934.2, -265.8, 5.9, 0.0, 0.0, 0.0);
  Camera.PointAtPoint(934.7, -264.9, 5.7, SwitchType.JumpCut);
  door.setHeading(0.0);
  if (!Char.IsDead(misty_lm3)) {
    if (!World.IsAreaOccupied(934.1, -266.46, 2.0, 935.08, -268.9, 10.0, false, true, true, true, true)) {
      World.ClearArea(934.79, -267.47, 3.9, 1.0, true);
      misty_lm3.setCoordinates(934.79, -267.47, 3.9);
    }
  }

  if (p.isInAnyCar()) {
    car_lm3 = p.storeCarIsIn();
    misty_lm3.setObjEnterCarAsPassenger(car_lm3);
    if (Car.IsDead(car_lm3)) {
      Text.PrintNow("WRECKED", 5000, 1); //"The vehicle's wrecked!"
      return onFailed();
    }
    // waiting for Misty to get into the car
    while (!misty_lm3.isInCar(car_lm3)) {
      wait(0);

      if (Char.IsDead(misty_lm3)) {
        Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
        return onFailed();
      }
      if (Car.IsDead(car_lm3)) {
        Text.PrintNow("WRECKED", 5000, 1); //"The vehicle's wrecked!"
        return onFailed();
      }
    }
  } else {
    misty_lm3.setObjGotoPlayerOnFoot();

    while (!misty_lm3.isObjectivePassed()) {
      wait(0);
      if (p.isInAnyCar()) {
        car_lm3 = p.storeCarIsIn();
        if (Car.IsDead(car_lm3)) {
          Text.PrintNow("WRECKED", 5000, 1); //"The vehicle's wrecked!"
          return onFailed();
        }
      }
      if (Char.IsDead(misty_lm3)) {
        Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
        return onFailed();
      }
    }
  }

  misty_lm3.followPlayer(p);
  Hud.SwitchWidescreen(false);
  Camera.Restore();
  script_controlled_player.setCantBeDraggedOut(false);
  p.setControl(true);
  Game.SetPoliceIgnorePlayer(p, false);
  Game.SetEveryoneIgnorePlayer(p, false);
  Audio.PlayMissionAudio();
  Text.PrintNow("LM3_5", 7000, 1); //"You working for Luigi regular huh? It's about time he got a driver we can trust!"
  while (!Audio.HasMissionAudioFinished()) {
    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
    if (!misty_lm3.isInPlayersGroup(p) && !flag_blip_on_misty_lm3) {
      Text.PrintNow("HEY4", 5000, 1); //"You have left Misty behind go and get her!"
      radar_blip_ped1_lm3 = Blip.AddForChar(misty_lm3);
      flag_blip_on_misty_lm3 = true;
      blob_flag = false;
    }
    if (p.locateAnyMeansChar2D(misty_lm3, 8.0, 8.0, false) && flag_blip_on_misty_lm3) {
      misty_lm3.followPlayer(p);
      radar_blip_ped1_lm3.remove();
      flag_blip_on_misty_lm3 = false;
      blob_flag = true;
    }
  }

  Text.ClearThisPrint("LM3_5");

  Text.PrintNow("LM3_2", 5000, 1); //"Take Misty to see Joey Leone."
  radar_blip_coord2_lm3 = Blip.AddForCoord(1196.0, -874.0, -100.0);
  blob_flag = true;

  while (
    !p.locateStoppedAnyMeans2D(1196.0, -874.0, 3.0, 4.0, blob_flag) &&
    !misty_lm3.locateStoppedAnyMeans2D(1196.0, -874.0, 3.0, 4.0, false)
  ) {
    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
    if (!misty_lm3.isInPlayersGroup(p) && !flag_blip_on_misty_lm3) {
      Text.PrintNow("HEY4", 5000, 1); //"You have left Misty behind go and get her!"
      radar_blip_ped1_lm3 = Blip.AddForChar(misty_lm3);
      radar_blip_coord2_lm3.remove();
      flag_blip_on_misty_lm3 = true;
      blob_flag = false;
    }
    if (p.locateAnyMeansChar2D(misty_lm3, 8.0, 8.0, false) && flag_blip_on_misty_lm3) {
      misty_lm3.followPlayer(p);
      Text.PrintNow("LM3_2", 5000, 1); //"Take Misty to see Joey Leone."
      radar_blip_ped1_lm3.remove();
      radar_blip_coord2_lm3 = Blip.AddForCoord(1196.0, -874.0, -100.0);
      flag_blip_on_misty_lm3 = false;
      blob_flag = true;
    }
  }

  radar_blip_coord2_lm3.remove();
  Camera.SetFixedPosition(1211.85, -882.4, 19.42, 0.0, 0.0, 0.0);
  Camera.PointAtPoint(1210.99, -881.9, 19.34, SwitchType.JumpCut);

  if (Char.IsDead(misty_lm3)) {
    Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
    return onFailed();
  }

  misty_lm3.leaveGroup();
  Hud.SwitchWidescreen(true);
  p.setControl(false).clearWantedLevel();
  World.ClearArea(1190.6, -869.1, -100.0, 6.0, true); // This should get rid of any stuff to block the cut-scene area
  Game.SetPoliceIgnorePlayer(p, true);
  script_controlled_player = p.getChar();
  if (misty_lm3.isInAnyCar()) {
    car_lm3 = misty_lm3.storeCarIsIn();
    misty_lm3.setObjLeaveCar(car_lm3);
  }
  while (misty_lm3.isInAnyCar()) {
    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
  }
  if (script_controlled_player.isInAnyCar()) {
    car_lm3 = script_controlled_player.storeCarIsIn();
    script_controlled_player.setObjLeaveCar(car_lm3);
  }
  misty_lm3.setObjGotoCoordOnFoot(1193.1, -868.3);
  while (script_controlled_player.isInAnyCar()) {
    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"

      return onFailed();
    }
  }
  script_controlled_player.setObjGotoCoordOnFoot(1193.1, -868.3);
  wait(500);
  if (Char.IsDead(misty_lm3)) {
    Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
    return onFailed();
  }
  car_lm3.markAsNoLongerNeeded();

  // ********************************START OF CUT-SCENE PART TWO******************************

  let breakout_timer_start = Clock.GetGameTimer();
  let breakout_diff = 0;
  while (!p.canStartMission() && breakout_diff < 5000) {
    //	if player is not in control after 5 secs do the cutscene anyway

    wait(0);
    if (Char.IsDead(misty_lm3)) {
      Text.PrintNow("MISTY1", 5000, 1); //"Misty's dead!"
      return onFailed();
    }
    breakout_timer = Clock.GetGameTimer();
    breakout_diff = breakout_timer - breakout_timer_start;
  }
  p.makeSafeForCutscene();
  Camera.SetFadingColor(0, 0, 0);
  Camera.DoFade(1500, Fade.Out);
  Streaming.Switch(false);
  Streaming.LoadSpecialCharacter(1, "JOEY");
  Streaming.LoadSpecialModel(hier`cutobj01`, "JOEDOOR");
  Streaming.LoadSpecialModel(hier`cutobj02`, "JOEYH");
  Streaming.LoadSpecialModel(hier`cutobj03`, "PLAYERH");
  Streaming.LoadSpecialModel(hier`cutobj04`, "MISTYH");
  Streaming.RequestModel(car`MAFIA`);
  Streaming.RequestModel(car`IDAHO`);
  Streaming.RequestModel(car`STALLION`);

  const jogarageext = 939;
  const jogarageint = 1074;
  Streaming.RequestModel(jogarageext);
  Streaming.RequestModel(jogarageint);

  fading();

  script_controlled_player.setIdle();
  if (!Char.IsDead(misty_lm3)) {
    misty_lm3.setIdle();
  }

  Streaming.LoadAllModelsNow();
  while (
    !Streaming.HasSpecialCharacterLoaded(1) ||
    !Streaming.HasModelLoaded(hier`cutobj01`) ||
    !Streaming.HasModelLoaded(hier`cutobj02`) ||
    !Streaming.HasModelLoaded(hier`cutobj03`) ||
    !Streaming.HasModelLoaded(hier`cutobj04`) ||
    !Streaming.HasModelLoaded(car`MAFIA`) ||
    !Streaming.HasModelLoaded(car`IDAHO`) ||
    !Streaming.HasModelLoaded(car`STALLION`) ||
    !Streaming.HasModelLoaded(jogarageext) ||
    !Streaming.HasModelLoaded(jogarageint)
  ) {
    wait(0);
  }

  Cutscene.Load("j0_dm2");
  Cutscene.SetOffset(1190.079, -869.861, 13.977);
  let cut_car_lm3 = Car.Create(car`MAFIA`, 1189.1, -858.8, 14.0).setHeading(76.0);
  let cut_car2_lm3 = Car.Create(car`IDAHO`, 1182.5, -857.0, 14.1).setHeading(291.2);
  let cut_car3_lm3 = Car.Create(car`STALLION`, 1192.9, -860.8, 14.0).setHeading(150.0);
  cs_player = CutsceneObject.Create(0).setAnim("PLAYER");
  let cs_joey = CutsceneObject.Create(26).setAnim("JOEY");
  let cs_misty = CutsceneObject.Create(27).setAnim("MISTY");
  let cs_joeyhead = CutsceneHead.Create(cs_joey, hier`cutobj02`).setAnim("joey");
  let cs_mistyhead = CutsceneHead.Create(cs_misty, hier`cutobj04`).setAnim("misty");
  cs_playerhead = CutsceneHead.Create(cs_player, hier`cutobj03`).setAnim("player");
  let cs_joedoor = CutsceneObject.Create(hier`cutobj01`).setAnim("JOEDOOR");
  const joey_door1 = 1375;
  const joey_door2 = 1374;
  World.SetVisibilityOfClosestObjectOfType(1192.23, -867.252, 14.124, 6.0, joey_door1, false);
  World.SetVisibilityOfClosestObjectOfType(1192.23, -867.252, 14.124, 6.0, joey_door2, false);
  World.ClearArea(1194.0, -872.5, 14.0, 2.0, true);
  p.setCoordinates(1194.0, -872.5, -100.0);
  p.setHeading(230.0);
  misty_lm3.delete();
  Camera.DoFade(1500, Fade.In);
  World.SwitchRubbish(false);
  Cutscene.Start();

  // Displays cutscene text
  print("LM3_6", 10538); //"Joey..."
  waitCutscene(11896);
  Text.ClearThisPrint("LM3_6");
  print("LM3_6A", 14353); //"Am I goin' to play with our big end again?"
  print("LM3_7", 16869); //"I'll be with you In a minute spark plug."
  print("LM3_8", 20173); //"Hey, I'm Joey."
  print("LM3_9", 21116); //"Luigi said you were reliable so come back later,"
  print("LM3_9A", 23397); //"There might be some work for you."
  print("LM3_9B", 25088); //"Alright."
  waitCutscene(25723);
  Text.ClearThisPrint("LM3_9B");
  waitCutscene(26666);
  Camera.DoFade(1500, Fade.Out);
  while (!Cutscene.HasFinished()) {
    wait(0);
  }
  Text.ClearPrints();

  fading();

  Cutscene.Clear();
  World.SwitchRubbish(true);
  Streaming.Switch(true);
  Camera.SetBehindPlayer();
  wait(500);
  Camera.DoFade(1500, Fade.In);
  World.SetVisibilityOfClosestObjectOfType(1192.23, -867.252, 14.124, 6.0, joey_door1, true);
  World.SetVisibilityOfClosestObjectOfType(1192.23, -867.252, 14.124, 6.0, joey_door2, true);
  Streaming.UnloadSpecialCharacter(1);
  Streaming.UnloadSpecialCharacter(2);

  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj01`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj02`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj03`);
  Streaming.MarkModelAsNoLongerNeeded(hier`cutobj04`);
  Streaming.MarkModelAsNoLongerNeeded(car`MAFIA`);
  Streaming.MarkModelAsNoLongerNeeded(car`IDAHO`);

  Streaming.MarkModelAsNoLongerNeeded(car`STALLION`);
  Streaming.MarkModelAsNoLongerNeeded(jogarageext);
  Streaming.MarkModelAsNoLongerNeeded(jogarageint);

  cut_car_lm3.delete();
  cut_car2_lm3.delete();
  cut_car3_lm3.delete();

  return onPassed();
}

function print(text, start) {
  waitCutscene(start);
  Text.PrintNow(text, 10000, 1);
}

function waitCutscene(timestamp) {
  while (Cutscene.GetTime() < timestamp) {
    wait(0);
  }
}

function fading() {
  while (Camera.GetFadingStatus()) {
    wait(0);
  }
}

function onFailed() {
  log("*** MISSION luigi3 FAILED ***");
  Text.PrintBig("M_FAIL", 5000, 1);
  cleanup();
  return false;
}

function onPassed() {
  log("*** MISSION luigi3 PASSED ***");
  writeScmVariable(flag_luigi_mission3_passed, 1);
  Stat.RegisterMissionPassed("LM3");
  Stat.PlayerMadeProgress(1);
  Text.PrintWithNumberBig("M_PASS", 1000, 5000, 1);
  Audio.PlayMissionPassedTune(1);
  p.addScore(1000).clearWantedLevel();
  // ADD_SPRITE_BLIP_FOR_CONTACT_POINT 1191.7 -870.0 -100.0 RADAR_SPRITE_JOEY joey_contact_blip
  // START_NEW_SCRIPT luigi_mission4_loop
  // START_NEW_SCRIPT joey_mission1_loop
  // START_NEW_SCRIPT meat_mission1_loop
  cleanup();
  return true;
}

function cleanup() {
  log("*** MISSION luigi3 CLEANUP ***");
  writeScmVariable(flag_player_on_luigi_mission, 0);
  misty_lm3?.removeElegantly();
  Streaming.MarkModelAsNoLongerNeeded(car`MAFIA`);
  Streaming.MarkModelAsNoLongerNeeded(car`IDAHO`);
  Streaming.MarkModelAsNoLongerNeeded(car`STALLION`);
  radar_blip_coord1_lm3?.remove();
  radar_blip_coord2_lm3?.remove();
  Mission.Finish();
  ONMISSION = false;
}
