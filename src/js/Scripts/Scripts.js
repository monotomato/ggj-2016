import {MovementInputScript} from './MovementInputScript';
import {AnimationScript} from './AnimationScript';
import {DayNightCycleScript} from './DayNightCycleScript';
import {VillagerRankingSystemScript} from './VillagerRankingSystemScript';
import {VillagerIdentitySystemScript} from './VillagerIdentitySystemScript';
import {CameraScript} from './CameraScript';
import {CrisisScript} from './CrisisScript';
import {ItemSystemScript} from './ItemSystemScript';

const scripts = {
  movementInputScript: MovementInputScript,
  animationScript: AnimationScript,
  dayNightCycleScript: DayNightCycleScript,
  villagerRankingSystemScript: VillagerRankingSystemScript,
  villagerIdentitySystemScript: VillagerIdentitySystemScript,
  cameraScript: CameraScript,
  itemSystemScript: ItemSystemScript,
  crisisScript: CrisisScript
};

export {scripts as Scripts};
