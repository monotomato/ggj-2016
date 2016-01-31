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
import {FadeInScript} from './FadeInScript';
import {VillagerAnimationScript} from './VillagerAnimationScript';
import {HouseControllerScript} from './HouseControllerScript';
import {EventTimerScript} from './EventTimerScript';
import {InitiateConversationScript} from './InitiateConversationScript';
import {BulletinBoardScript} from './BulletinBoardScript';
import {HouseScript} from './HouseScript';

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
  houseControllerScript: HouseControllerScript,
  fadeInScript: FadeInScript,
  eventTimerScript: EventTimerScript,
  initiateConversationScript: InitiateConversationScript,
  bulletinBoardScript: BulletinBoardScript,
  houseScript: HouseScript
};

export {scripts as Scripts};
