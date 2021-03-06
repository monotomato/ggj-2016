import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {Factory} from 'Factory';
import {Collision} from 'Collision';

class RankBoardScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'rank_apply_end',
      'villagers_updated'
    );
    this.converse = false;
    this.text = 'This is placeholder text. Change it with events!';
    this.bubble = Factory.createSpeechBubble(13, 7, 6, this.text, 'Rankings', false);
    this.bubble.position.y -= 40;
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
    this.village = rootEntity.findEntityWithTag('village');
    this.text = '';
    this.village.villagers.forEach((villager) => {
      this.text += villager.name + ', ' + villager.role + '\n';
    });
    parent.addChild(this.bubble);
    this.bubble.setText(this.text);
    this.bubble.visible = false;
  }

  update(parent, rootEntity, delta) {
    let playerCollide = Collision.aabbTestFast(parent.physics.body, this.player.physics.body);
    if (playerCollide) {
      this.bubble.visible = true;
    } else {
      this.bubble.visible = false;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'rank_apply_end' || evt.eventType === 'villagers_updated') {
      this.text = '';
      this.village.villagers.forEach((villager) => {
        this.text += villager.name + ', ' + villager.role + '\n';
      });
      parent.addChild(this.bubble);
      this.bubble.setText(this.text);
    }
  }
}

export {RankBoardScript};
