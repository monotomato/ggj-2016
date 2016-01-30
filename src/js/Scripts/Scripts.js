import {MovementInputScript} from './MovementInputScript';
import {AnimationScript} from './AnimationScript';
import {DayNightCycleScript} from './DayNightCycleScript';
import {VillagerRankingSystemScript} from './VillagerRankingSystemScript';
import {VillagerIdentitySystemScript} from './VillagerIdentitySystemScript';
import {CameraScript} from './CameraScript';
import {CrisisScript} from './CrisisScript';
import {ItemSystemScript} from './ItemSystemScript';
import {TossableScript} from './TossableScript';
import {DoorScript} from './DoorScript';
import {VillagerAnimationScript} from './VillagerAnimationScript';
import {HouseControllerScript} from './HouseControllerScript';

const scripts = {
  movementInputScript: MovementInputScript,
  animationScript: AnimationScript,
  dayNightCycleScript: DayNightCycleScript,
  villagerRankingSystemScript: VillagerRankingSystemScript,
  villagerIdentitySystemScript: VillagerIdentitySystemScript,
  cameraScript: CameraScript,
  itemSystemScript: ItemSystemScript,
  crisisScript: CrisisScript,
  tossableScript: TossableScript,
  doorScript: DoorScript,
  villagerAnimationScript: VillagerAnimationScript,
  houseControllerScript: HouseControllerScript
};

export {scripts as Scripts};
