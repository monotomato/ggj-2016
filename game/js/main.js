(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "fps": 60,
  "logLevel": 0,
  "debugMode":true,
  "renderer":{
    "options": {
      "antialias": true,
      "transparent": false
    },
    "size":{
      "x":960,
      "y":640
    }
  },
  "resourceLists":[
    "res/filelist.json"
  ],
  "staticResources":[
    "res/sprite/sprite.json",
    "res/sounds/sounds.json"
  ],
  "audioResources":[
    "res/sounds/sounds.json"
  ]
}

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collision = undefined;

var _Log = require('Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collision = function () {
  function Collision() {
    _classCallCheck(this, Collision);
  }

  _createClass(Collision, null, [{
    key: 'aabbTestFast',
    value: function aabbTestFast(a, b) {
      var aHalfWidth = a.width / 2.0;
      var aHalfHeight = a.height / 2.0;
      var bHalfWidth = b.width / 2.0;
      var bHalfHeight = b.height / 2.0;

      var xDif = a.pos.x - b.pos.x;
      var yDif = a.pos.y - b.pos.y;

      var intersectX = Math.abs(xDif) - (aHalfWidth + bHalfWidth);
      var intersectY = Math.abs(yDif) - (aHalfHeight + bHalfHeight);

      return intersectX < 0 && intersectY < 0;
    }
  }, {
    key: 'aabbTest',
    value: function aabbTest(a, b) {
      var aHalfWidth = a.width / 2.0;
      var aHalfHeight = a.height / 2.0;

      var bHalfWidth = b.width / 2.0;
      var bHalfHeight = b.height / 2.0;

      var xDif = a.pos.x - b.pos.x;
      var yDif = a.pos.y - b.pos.y;

      var intersectX = Math.abs(xDif) - (aHalfWidth + bHalfWidth);
      var intersectY = Math.abs(yDif) - (aHalfHeight + bHalfHeight);

      if (intersectX < 0 && intersectY < 0) {
        if (Math.abs(intersectX) < Math.abs(intersectY)) {
          return { x: intersectX * Math.sign(xDif), y: 0 };
        } else {
          return { x: 0, y: intersectY * Math.sign(yDif) };
        }
      } else {
        return { x: 0, y: 0 };
      }
    }
  }]);

  return Collision;
}();

exports.Collision = Collision;

},{"Log":6}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = undefined;

var _ResourceManager = require('Managers/ResourceManager');

var _Log = require('Log');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _Scripts = require('Scripts/Scripts');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Physics = require('Physics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Entity = function (_PIXI$Container) {
  _inherits(Entity, _PIXI$Container);

  /* TODO: How (and when) initialize scripts? Need planning.
  It cant be done at construction time, as script might need to find other entities.
  How to control sctipt init and update order.
  Could `components` be entirely scraped? Like unity, component data could be in scripts.
  Would this be useful/easy/more convenient?
  */

  function Entity(data) {
    _classCallCheck(this, Entity);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Entity).call(this));

    _this.eventTypes = [];
    _this.events = [];
    _this.isActive = true;
    _this.tags = [];
    _this.scripts = [];
    return _this;
  }

  _createClass(Entity, [{
    key: 'init',
    value: function init(rootEntity) {
      var _this2 = this;

      this.children.forEach(function (child) {
        if (child.init) child.init(rootEntity);
      });
      this.scripts.forEach(function (script) {
        script.init(_this2, rootEntity);
      });
      _EventManager.EventMan.registerListener(this);
    }

    // TODO: Check if event is relevant to the script.

  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this3 = this;

      this.events.forEach(function (evt) {
        _this3.scripts.forEach(function (script) {
          script.handleGameEvent(_this3, evt);
        });
      });
      this.events = [];
    }

    // findEntityWithTags(tags){
    // }

  }, {
    key: 'findEntitiesWithTag',
    value: function findEntitiesWithTag(tag) {
      var _this4 = this;

      if (this.tags.indexOf(tag) >= 0) {
        return [this];
      } else {
        var _ret = function () {
          var ents = [];
          for (var i = 0; i < _this4.children.length; i++) {
            var child = _this4.children[i];
            var found = [];
            if (child.findEntitiesWithTag) {
              found = child.findEntitiesWithTag(tag);
              found.forEach(function (e) {
                ents.push(e);
              });
              // log.debug(found.forEach);
            }
          }
          return {
            v: ents
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  }, {
    key: 'findEntityWithTag',
    value: function findEntityWithTag(tag) {
      var indof = this.tags.indexOf(tag);
      if (indof >= 0) {
        return this;
      } else {
        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          var found = undefined;
          if (child.findEntityWithTag) {
            found = child.findEntityWithTag(tag);
          }
          if (found) {
            return found;
          }
        }
      }
    }
  }, {
    key: 'findEntityWithName',
    value: function findEntityWithName(name) {
      if (this.name === name) {
        return this;
      } else {
        for (var i = 0; i < this.children.length; i++) {
          var child = this.children[i];
          var found = undefined;
          if (child.findEntityWithName) {
            found = child.findEntityWithName(name);
          }
          if (found) {
            return found;
          }
        }
      }
    }

    // TODO: Remove duplicate event types (keep only topmost)

  }, {
    key: 'addScript',
    value: function addScript(scriptName, parameters) {
      var _this5 = this;

      var script = new _Scripts.Scripts[scriptName](parameters);
      this.scripts.push(script);
      var eventTypes = script.eventTypes;
      eventTypes.forEach(function (eventType) {
        _this5.eventTypes.push(eventType);
      });
    }
  }, {
    key: 'addEvent',
    value: function addEvent(evt) {
      this.events.push(evt);
    }
  }, {
    key: 'setSprite',
    value: function setSprite(spriteName) {
      if (!this.sprite) {
        this.sprite = new PIXI.Sprite();
        this.sprite.anchor = {
          x: 0.5,
          y: 0.5
        };
        this.addChild(this.sprite);
        var opts = this.sprite_options || {
          scale: 1,
          offset: {
            x: 0,
            y: 0
          }
        };
        this.sprite.scale.x = opts.scale;
        this.sprite.scale.y = opts.scale;
        this.sprite.position = opts.offset;

        if (this.debugGraphics) {
          this.swapChildren(this.debugGraphics, this.sprite);
        }
      }
      this.sprite.texture = _ResourceManager.resources.sprite.textures[spriteName];
    }
  }, {
    key: 'addBox',
    value: function addBox(color, width, height) {
      var graphics = new PIXI.Graphics();
      graphics.beginFill(color);
      graphics.drawRect(0, 0, width, height);
      graphics.pivot = {
        x: width / 2,
        y: height / 2
      };

      this.addChild(graphics);
    }

    // https://github.com/wellcaffeinated/PhysicsJS/wiki/Fundamentals#the-factory-pattern

  }, {
    key: 'addPhysics',
    value: function addPhysics(bodyType) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.physics = {
        inWorld: false,
        body: _Physics.Physics.body(bodyType, options)
      };
    }
  }, {
    key: 'addDebugGraphics',
    value: function addDebugGraphics() {}
    // let physics = this.physics;
    // if(physics){
    //   let body = physics.body;
    //   this.debugGraphics = new PIXI.Graphics();
    //   let color = this.collider_color || '0xFFFFFF';
    //
    //   // log.debug(body);
    //   this.debugGraphics.beginFill(color);
    //   this.debugGraphics.lineStyle(2, '0x000000');
    //   this.debugGraphics.alpha = 0.5;
    //   this.debugGraphics.drawRect(0, 0, body.width, body.height);
    //   this.debugGraphics.pivot = {
    //     x: body.width/2,
    //     y: body.height/2
    //   };
    //   this.addChild(this.debugGraphics);
    // }

    /*
      Unpacks entity from configuration file. Loads config
      Config format:
        - component_data
          - Will go straight to entity.
            Useful when defining components that dont need their own config files
        - component_configuration
          - Holds a handle for config file that holds the actual data.
            Useful when actual component data is in another file. Like animations.
      Create entity with this and see its structure for more info.
    */

  }], [{
    key: 'fromConfig',
    value: function fromConfig(configName) {
      return Entity.fromConfigObj(_ResourceManager.resources[configName].data);
    }
  }, {
    key: 'fromConfigObj',
    value: function fromConfigObj(config) {
      var ent = new Entity();

      // Assign component_data to entity
      Object.assign(ent, config.component_data);

      // Get each component_configuration and set them to entity
      var compConf = config.component_configuration;
      Object.keys(compConf).forEach(function (key) {
        ent[key] = _ResourceManager.resources[compConf[key]].data;
      });

      var physics = config.physics;
      if (physics) {
        ent.addPhysics(physics.bodyType, physics.options);
        if (_config2.default.debugMode) ent.addDebugGraphics();
      }

      var scriptConf = config.scripts;
      scriptConf.forEach(function (conf) {
        var name = conf.name;
        var params = conf.parameters || {};
        ent.addScript(name, params);
      });
      return ent;
    }
  }, {
    key: 'fromTiledObject',
    value: function fromTiledObject(tiledObj) {
      var props = tiledObj.properties;
      var config = _ResourceManager.resources[props.config].data;

      Object.assign(config.component_data, tiledObj.properties);

      config.component_data.name = tiledObj.name;

      config.physics.options.x = tiledObj.x + tiledObj.width / 2;
      config.physics.options.y = tiledObj.y + tiledObj.height / 2;
      config.physics.options.width = tiledObj.width;
      config.physics.options.height = tiledObj.height;

      var ent = Entity.fromConfigObj(config);
      // log.debug(ent);
      return ent;
    }
  }]);

  return Entity;
}(PIXI.Container);

exports.Entity = Entity;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Managers/ResourceManager":12,"Physics":13,"Scripts/Scripts":32,"config.json":1}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Factory = undefined;

var _Log = require('Log');

var _Entity = require('Entity');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

var _StringUtil = require('Utils/StringUtil');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Factory = function () {
  function Factory() {
    _classCallCheck(this, Factory);
  }

  _createClass(Factory, null, [{
    key: 'createSpeechBubble',

    // static addSprite(ent, priteName, opts) {
    //   let sprite = new PIXI.Spite();
    //   ent.addChild(sprite);
    //   sprite.anchor = {
    //     x: 0.5,
    //     y: 0.5
    //   };
    //   sprite.scale.x = opts.scale;
    //   sprite.scale.y = opts.scale;
    //   sprite.position = opts.offset;
    // }

    value: function createSpeechBubble(width, height, arrowPos, text) {
      var title = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];
      var wrap = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
      var arrow = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];
      var wraplen = arguments.length <= 7 || arguments[7] === undefined ? 31 : arguments[7];

      var box = new _Entity.Entity();
      var addSprite = function addSprite(spriteName, opts) {
        var sprite = new PIXI.Sprite();
        box.addChild(sprite);
        sprite.anchor = {
          x: 0.5,
          y: 0.5
        };
        sprite.scale.x = opts.scale;
        sprite.scale.y = opts.scale;
        sprite.position = opts.offset;
        sprite.texture = _ResourceManager.resources.sprite.textures[spriteName];
      };

      var tileWidth = 32;
      var tileHeight = 32;

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var t = 'sprite_piece_5';
          if (x === 0) {
            t = 'sprite_piece_4';
            if (y === 0) {
              t = 'sprite_piece_1';
            } else if (y === height - 1) {
              t = 'sprite_piece_7';
            }
          } else if (x === width - 1) {
            t = 'sprite_piece_6';
            if (y === 0) {
              t = 'sprite_piece_3';
            } else if (y === height - 1) {
              t = 'sprite_piece_9';
            }
          } else {
            if (y === 0) {
              t = 'sprite_piece_2';
            } else if (y === height - 1) {
              t = t = 'sprite_piece_8';
            }
          }
          addSprite(t, {
            scale: 0.26,
            offset: {
              x: tileWidth * x,
              y: tileHeight * y
            }
          });
        }
      }
      if (arrow) {
        addSprite('sprite_piece_11', {
          scale: 0.26,
          offset: {
            x: tileWidth * arrowPos,
            y: tileHeight * height
          }
        });
        addSprite('sprite_piece_10', {
          scale: 0.26,
          offset: {
            x: tileWidth * arrowPos,
            y: tileHeight * (height - 1)
          }
        });
      }
      var textWrapped = text;
      if (wrap) textWrapped = (0, _StringUtil.wordWrap)(text, wraplen);
      var textObj = new PIXI.Text(textWrapped, { font: '18px Monaco', fill: 0x121212, align: 'left' });
      if (title !== '') {
        textObj.position.y = 20.0;
      }
      box.addChild(textObj);

      var titleObj = new PIXI.Text(title, { font: 'bold 18px Monaco', fill: 0x000000, align: 'left' });
      titleObj.position.y = -5;
      box.addChild(titleObj);

      box.position.x = -tileWidth * arrowPos - 4;
      box.position.y = -height * tileHeight - 16;

      var ent = new _Entity.Entity();
      ent.setText = function (newText) {
        if (wrap) {
          textObj.text = (0, _StringUtil.wordWrap)(newText, wraplen);
        } else {
          textObj.text = newText;
        }
      };
      ent.addChild(box);
      return ent;
    }
  }]);

  return Factory;
}();

exports.Factory = Factory;

},{"Entity":3,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Utils/StringUtil":42}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = undefined;

var _Log = require('Log');

var _ScriptSystem = require('Systems/ScriptSystem');

var _EventSystem = require('Systems/EventSystem');

var _PhysicsSystem = require('Systems/PhysicsSystem');

var _Entity = require('Entity');

var _Scripts = require('Scripts/Scripts');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Factory = require('Factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);

    _Log.log.debug('CONSTRUCTOR');
    this.stage = new _Entity.Entity();
    this.world = new _Entity.Entity();
    this.world.tags.push('push');
    this.world.addScript('cameraScript', {});
    this.stage.addChild(this.world);

    this.ui = new _Entity.Entity(); //new Entity('entity_ui');

    this.stage.addChild(this.ui);

    this.systems = [];

    var eventSystem = new _EventSystem.EventSystem();
    this.systems.push(eventSystem);

    var physicsSystem = new _PhysicsSystem.PhysicsSystem();
    this.systems.push(physicsSystem);

    var scriptSystem = new _ScriptSystem.ScriptSystem();
    this.systems.push(scriptSystem);

    if (_config2.default.debugMode) {
      _Log.log.debug('Debug mode is ON');
      this.debugConstructor();
    }
  }

  _createClass(Game, [{
    key: 'debugConstructor',
    value: function debugConstructor() {
      this.addEntityToWorld(this.loadMap('testmap'));

      var fade = new _Entity.Entity();
      fade.addBox(0x000000, _config2.default.renderer.size.x, _config2.default.renderer.size.y);
      fade.position.x = _config2.default.renderer.size.x / 2;
      fade.position.y = _config2.default.renderer.size.y / 2;
      fade.addScript('fadeInScript');

      var darken = new _Entity.Entity();
      darken.position.x = _config2.default.renderer.size.x / 2;
      darken.position.y = _config2.default.renderer.size.y / 2;
      darken.setSprite('sprite_darken');
      darken.addScript('darkenScript');

      var clock = new _Entity.Entity();
      // clock.addBox(0xFFFFFF, 50, 50);
      clock.setSprite('kello');
      var text = new PIXI.Text('Clockan is kymppi', { font: '24px Arial', fill: 0x222222, align: 'center' });
      text.x = -40;
      text.y = -13;
      clock.addChild(text);
      clock.position.x = _config2.default.renderer.size.x - 30;
      clock.position.y = _config2.default.renderer.size.y - 30;
      clock.addScript('dayNightCycleScript');

      var messageBox = new _Entity.Entity();
      messageBox.addScript('messageBoxScript');
      messageBox.position.x = 60;
      messageBox.position.y = 665;

      var intro = new _Entity.Entity();
      intro.addScript('introScript');
      intro.position.x = _config2.default.renderer.size.x / 2;
      intro.position.y = _config2.default.renderer.size.y / 2 + 30;
      // let bubble = Factory.createSpeechBubble(10, 3, 6, 'The short brown little fox thing jumped over the lazy dog.');
      // bubble.position.x = 480 + 25;
      // bubble.position.y = 320 - 60;
      // this.addEntityToUI(bubble);

      var eventTimer = new _Entity.Entity();
      eventTimer.addScript('eventTimerScript');
      this.addEntityToWorld(eventTimer);

      this.addEntityToUI(fade);
      this.addEntityToUI(darken);
      this.addEntityToUI(clock);
      this.addEntityToUI(messageBox);
      this.addEntityToUI(intro);
      this.stage.init(this.stage);

      _EventManager.EventMan.publish({ eventType: 'intro', parameters: {} });
    }
  }, {
    key: 'addEntityToWorld',
    value: function addEntityToWorld(entity) {
      // EventMan.registerListener(entity);
      this.world.addChild(entity);
    }
  }, {
    key: 'addEntityToUI',
    value: function addEntityToUI(entity) {
      // EventMan.registerListener(entity);
      this.ui.addChild(entity);
    }
  }, {
    key: 'update',
    value: function update(delta) {
      var _this = this;

      this.systems.forEach(function (system) {
        system.update(_this.world, delta);
        system.update(_this.ui, delta);
      });
    }
  }, {
    key: 'render',
    value: function render(renderer) {
      renderer.render(this.stage);
    }
  }, {
    key: 'loadMap',
    value: function loadMap(mapname) {
      console.log(_ResourceManager.resources);
      // let a = resources[mapname].data.properties.config
      // console.log(a);
      var eMap = new _Entity.Entity(); //Entity.fromConfig(a);
      _Log.log.debug(mapname);
      _ResourceManager.resources[mapname].data.layers.forEach(function (layer) {
        var eLayer = new _Entity.Entity();
        // console.log(layer);
        if (layer.type === 'imagelayer') {
          var imagename = layer.image.split('.')[0];
          var sprite = new PIXI.Sprite();
          sprite.texture = _ResourceManager.resources[imagename].texture;
          eLayer.position.x = layer.offsetx || 0;
          eLayer.position.y = layer.offsety || 0;
          eLayer.addChild(sprite);
        } else if (layer.type === 'objectgroup') {
          layer.objects.forEach(function (obj) {
            var eObj = _Entity.Entity.fromTiledObject(obj);
            eLayer.addChild(eObj);
          });
        }
        eMap.addChild(eLayer);
      });
      _Log.log.debug(eMap);
      return eMap;
    }
  }]);

  return Game;
}();

exports.Game = Game;

},{"Entity":3,"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Scripts/Scripts":32,"Systems/EventSystem":38,"Systems/PhysicsSystem":39,"Systems/ScriptSystem":40,"config.json":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = undefined;

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var levels = new Map([[1, ['DEBUG', 'color: #22AA22;']], [2, ['INFO ', 'color: #2222AA;']], [3, ['WARN ', 'color: #CC8822;']], [4, ['ERROR', 'color: #DD4422;']], [5, ['FATAL', 'color: #FF0000;']]]);

function print() {
  var msg = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
  var level = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  level = Math.max(1, Math.min(5, level));
  if (level >= _config2.default.logLevel) {
    var prop = levels.get(level);
    console.log('%c[' + prop[0] + ']:', prop[1], msg);
  }
}

var log = {
  debug: function debug(msg) {
    print(msg, 1);
  },
  info: function info(msg) {
    print(msg, 2);
  },
  warn: function warn(msg) {
    print(msg, 3);
  },
  error: function error(msg) {
    print(msg, 4);
  },
  fatal: function fatal(msg) {
    print(msg, 5);
  },
  print: print,
  test: test
};

function test() {
  log.debug('debug msg');
  log.info('info msg');
  log.warn('warn msg');
  log.error('error msg');
  log.fatal('fatal msg');
}
exports.log = log;

},{"config.json":1}],7:[function(require,module,exports){
'use strict';

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _AudioManager = require('Managers/AudioManager');

var _ResourceManager = require('Managers/ResourceManager');

var _Scripts = require('Scripts/Scripts');

var _Entity = require('Entity');

var _Game = require('Game');

var _Log = require('Log');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Pixi setup
PIXI.utils._saidHello = true; // Keep console clean
// PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Renderer
var redOpt = _config2.default.renderer.options;
// redOpt.resolution = window.devicePixelRatio || 1;
redOpt.resolution = 1;
var renderer = PIXI.autoDetectRenderer(_config2.default.renderer.size.x, _config2.default.renderer.size.y, redOpt);
renderer.backgroundColor = 0x000000;
// Managers
/* TODO: Figure out way to prioritize manager init.
Now resman init is called before anything else manually.
Luckily, resman does not need to update itself. */
var managers = [_InputManager.InputMan, _EventManager.EventMan, _AudioManager.AudioMan];

// Stage
var game = undefined;

// Times
var loopInterval = 1000 / _config2.default.fps;
var lastFrame = 0;

// Main entry
function main() {
  _Log.log.info('Target fps: ' + _config2.default.fps);
  document.body.appendChild(renderer.view);

  _ResourceManager.ResourceMan.init().then(function () {
    var manPromises = managers.map(function (man) {
      return man.init();
    });

    Promise.all(manPromises).then(function (values) {
      managers.forEach(function (man) {
        _EventManager.EventMan.registerListener(man);
      });
      // All manger inits are done, start the game!
      initReady();
    });
  });
}

function initReady() {
  _Log.log.info('Initialization ready!');
  //console.clear(); // Clears the console.
  game = new _Game.Game();
  _EventManager.EventMan.publish({ eventType: 'audio_music_play', parameters: { audio: 'audio_music_interior' } });
  _EventManager.EventMan.publish({ eventType: 'audio_sound_play', parameters: { audio: 'audio_sheep' } });
  requestAnimationFrame(loop);
}

var delta = 0;
function loop(ctime) {
  delta += ctime - lastFrame;

  // Use count to limit number of accumulated frames
  var count = 0;
  while (delta > loopInterval && count < 3) {
    count++;
    update(loopInterval);
    delta -= loopInterval;
    draw();
    managers.forEach(function (man) {
      man.update();
    });
  }
  if (count == 3) {
    delta = 0;
  }
  lastFrame = ctime;

  // if(ctime - lastFrame > loopInterval) {
  //   lastFrame = ctime;
  //   update(delta);
  //   draw();
  //   Input.update();
  //   EventManager.delegateEvents();
  // }
  requestAnimationFrame(loop);
}

function update(delta) {
  game.update(delta);
}

function draw() {
  game.render(renderer);
}

main(); // Main entry

},{"Entity":3,"Game":5,"Log":6,"Managers/AudioManager":9,"Managers/EventManager":10,"Managers/InputManager":11,"Managers/ResourceManager":12,"Scripts/Scripts":32,"config.json":1}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.eventTypes = [];
    this.events = [];
  }

  // Run at game init. Returns promise!

  _createClass(Manager, [{
    key: 'init',
    value: function init() {
      var promise = new Promise(function (resolve, reject) {
        resolve('Default manager init done!');
      });

      return promise;
    }

    // Run each frame.

  }, {
    key: 'update',
    value: function update() {
      this.handleEvents();
    }
  }, {
    key: 'addEvent',
    value: function addEvent(evt) {
      this.events.push(evt);
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents() {
      var _this = this;

      this.events.forEach(function (evt) {
        _this.handleSingleEvent(evt);
      });
      this.events = [];
    }
  }, {
    key: 'handleSingleEvent',
    value: function handleSingleEvent(evt) {}
  }]);

  return Manager;
}();

exports.Manager = Manager;

},{}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AudioMan = undefined;

var _Log = require('Log');

var _ResourceManager = require('Managers/ResourceManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Manager2 = require('Manager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioManager = function (_Manager) {
  _inherits(AudioManager, _Manager);

  function AudioManager() {
    _classCallCheck(this, AudioManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioManager).call(this));

    _this.eventTypes = ['audio'];
    _this.musicid = -1;
    _this.soundid = -1;
    return _this;
  }

  _createClass(AudioManager, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      var promise = new Promise(function (resolve, reject) {
        var soundConfig = _ResourceManager.resources.sounds.data;

        var ready = function ready() {
          resolve('Audio manager init done!');
        };
        // Paths are just filenames. This adds rest of the path
        var fixedUrls = soundConfig.urls.map(function (e) {
          return 'res/sounds/' + e;
        });
        _this2.howl = new Howl({
          src: fixedUrls,
          sprite: soundConfig.sprite,
          // html5: true,
          preload: true,
          onload: ready
        });
      });

      return promise;
    }
  }, {
    key: 'handleSingleEvent',
    value: function handleSingleEvent(evt) {
      var spriteName = evt.parameters.audio;

      if (evt.eventType == 'audio_sound_play') {
        if (this.soundid >= 0) {
          this.howl.stop(this.soundid);
        }
        this.soundid = this.howl.play(spriteName);
      } else if (evt.eventType == 'audio_music_play') {
        if (this.musicid >= 0) {
          this.howl.stop(this.musicid);
        }
        this.musicid = this.howl.play(spriteName);
      }
    }
  }]);

  return AudioManager;
}(_Manager2.Manager);

var AudioMan = new AudioManager();

exports.AudioMan = AudioMan;

},{"Log":6,"Manager":8,"Managers/ResourceManager":12,"config.json":1}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventMan = undefined;

var _Log = require('Log');

var _Manager2 = require('Manager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventManager = function (_Manager) {
  _inherits(EventManager, _Manager);

  function EventManager() {
    _classCallCheck(this, EventManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventManager).call(this));

    _this.listeners = {
      listeners: []
    };
    _this.events = [];
    return _this;
  }

  // TODO: Test optimizeEventTypes method

  _createClass(EventManager, [{
    key: 'optimizeEventTypes',
    value: function optimizeEventTypes(eventTypes) {
      var results = [];
      if (eventTypes.length > 0) {
        var sorted = eventTypes.sort();
        var check = sorted[0];
        results.push(check);
        for (var i = 1; i < sorted.length; i++) {
          var other = sorted[i];
          var subs = other.substr(0, check.length);
          if (subs !== check) {
            check = other;
            results.push(check);
          }
        }
      }
      return results;
    }
  }, {
    key: 'registerListener',
    value: function registerListener(listener) {
      var _this2 = this;

      var eventTypes = this.optimizeEventTypes(listener.eventTypes);
      eventTypes.forEach(function (eventType) {
        var s = eventType.split('_');
        var root = _this2.listeners;
        for (var i = 0; i < s.length; i++) {
          var key = s[i];
          if (!root[key]) {
            root[key] = {
              listeners: []
            };
          }
          root = root[key];
        }
        root.listeners.push(listener);
      });
    }
  }, {
    key: 'publish',
    value: function publish(event) {
      this.events.push(event);
    }
  }, {
    key: 'update',
    value: function update() {
      this.delegateEvents();
    }
  }, {
    key: 'delegateEvents',
    value: function delegateEvents() {
      var _this3 = this;

      this.events.forEach(function (event) {
        var eventType = event.eventType;
        var s = eventType.split('_');
        var root = _this3.listeners;
        root.listeners.forEach(function (listener) {
          return listener.addEvent(event);
        });

        var addEvent = function addEvent(listener) {
          return listener.addEvent(event);
        };
        for (var i = 0; i < s.length; i++) {
          var key = s[i];
          if (!root[key]) {
            break;
          }
          root = root[key];
          root.listeners.forEach(addEvent);
        }
      });
      this.events = [];
    }

    // TODO: Implement removeListener in EventManager

  }, {
    key: 'removeListener',
    value: function removeListener() {
      throw new Error('Remove Listener not implemented!');
    }
  }]);

  return EventManager;
}(_Manager2.Manager);

var EventMan = new EventManager();

exports.EventMan = EventMan;

},{"Log":6,"Manager":8}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputMan = undefined;

var _keys = require('keys.json');

var _keys2 = _interopRequireDefault(_keys);

var _Manager2 = require('Manager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputManager = function (_Manager) {
  _inherits(InputManager, _Manager);

  function InputManager() {
    _classCallCheck(this, InputManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InputManager).call(this));

    _this.keyDown = {};
    _this.keyPressed = {};
    _this.keyReleased = {};
    return _this;
  }

  _createClass(InputManager, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      var promise = new Promise(function (resolve, reject) {

        _this2.keys = new Map(Object.keys(_keys2.default).map(function (key) {
          return [_keys2.default[key], key];
        }));

        window.addEventListener('keydown', function (e) {
          return _this2.setKeyState(e, true);
        }, false);
        window.addEventListener('keyup', function (e) {
          return _this2.setKeyState(e, false);
        }, false);

        resolve('Input manager init done!');
      });

      return promise;
    }
  }, {
    key: 'setKeyState',
    value: function setKeyState(ev, state) {
      var code = ev.which;
      var key = this.keys.get(code);
      if (key) ev.preventDefault();
      if (this.keyDown[key] != state) {
        this.keyDown[key] = state;
        if (state) {
          this.keyPressed[key] = true;
        } else {
          this.keyReleased[key] = true;
        }
      }
    }
  }, {
    key: 'update',
    value: function update() {
      /*TODO: Ensure input stays constant throughout game update.
      Keydown and keyup events will trigger even when game is updating.*/
      this.keyPressed = {};
      this.keyReleased = {};
    }
  }]);

  return InputManager;
}(_Manager2.Manager);

var InputMan = new InputManager();

exports.InputMan = InputMan;

},{"Manager":8,"keys.json":43}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resources = exports.ResourceMan = undefined;

var _Log = require('Log');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Manager2 = require('Manager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResourceManager = function (_Manager) {
  _inherits(ResourceManager, _Manager);

  function ResourceManager() {
    _classCallCheck(this, ResourceManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ResourceManager).call(this));

    _this.loadBarLen = 10;
    _this.loader = PIXI.loader;
    _this.resources = _this.loader.resources;
    return _this;
  }

  _createClass(ResourceManager, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      var promise = new Promise(function (resolve, reject) {
        var ready = function ready() {
          resolve('Resource manager init done!');
        };

        var error = function error(a, b, c) {
          _Log.log.error(a);
          _Log.log.error(b);
          _Log.log.error(c);
          reject('Resource manager init ERROR!');
        };
        var filelistLoader = new PIXI.loaders.Loader();

        Object.keys(_config2.default.resourceLists).forEach(function (key) {
          filelistLoader.add(_config2.default.resourceLists[key]);
        });

        filelistLoader.on('progress', function (a, b) {
          return _this2.loadProgress(a, b, 'Filelist');
        });
        filelistLoader.on('error', error);

        filelistLoader.once('complete', function (ldr, res) {

          Object.keys(res).forEach(function (key) {
            res[key].data.forEach(function (path) {
              _this2.loader.add(_this2.getName(path), path);
            });
          });

          _config2.default.staticResources.forEach(function (path) {
            _this2.loader.add(_this2.getName(path), path);
          });

          _this2.loader.on('progress', function (a, b) {
            return _this2.loadProgress(a, b, 'Resource');
          });
          _this2.loader.on('error', error);
          _this2.loader.once('complete', ready);
          _this2.loader.load();
        });
        filelistLoader.load();
      });

      return promise;
    }
  }, {
    key: 'getName',
    value: function getName(path) {
      return path.split('\\').pop().split('/').pop().split('.')[0];
    }
  }, {
    key: 'loadProgress',
    value: function loadProgress(ldr, res, header) {
      var p = ldr.progress;
      var ready = Math.floor(this.loadBarLen * (Math.floor(p) / 100));
      var i = '='.repeat(ready) + ' '.repeat(this.loadBarLen - ready);
      var str = header + ' progress [' + i + '] ' + Math.floor(p) + '%';
      _Log.log.info(str);
    }
  }]);

  return ResourceManager;
}(_Manager2.Manager);

var ResourceMan = new ResourceManager();
var res = ResourceMan.resources;

exports.ResourceMan = ResourceMan;
exports.resources = res;

},{"Log":6,"Manager":8,"config.json":1}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Physics = undefined;

var _Log = require('Log');

var _Collision = require('Collision');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Physics = function () {
  function Physics() {
    _classCallCheck(this, Physics);

    this.dynamicBodies = [];
    this.staticBodies = [];
    this.triggers = [];
    this.behaviors = [];
  }

  _createClass(Physics, [{
    key: 'copyBody',
    value: function copyBody(from, to) {
      jQuery.extend(true, to, from);
    }
  }, {
    key: 'checkCollisionFast',
    value: function checkCollisionFast(body, delta) {
      var newBody = {};
      this.copyBody(body, newBody);
      newBody.pos.x += newBody.vel.x * delta;
      newBody.pos.y += newBody.vel.y * delta;

      this.behaviors.forEach(function (behavior) {
        for (var key in behavior) {
          newBody[key].x += behavior[key].x * delta;
          newBody[key].y += behavior[key].y * delta;
        }
      });

      var collided = this.staticBodies.find(function (staticBod) {
        return _Collision.Collision.aabbTestFast(newBody, staticBod);
      });
      return collided;
    }
  }, {
    key: 'lengthSquared',
    value: function lengthSquared(v) {
      return v.x * v.x + v.y * v.y;
    }
  }, {
    key: 'checkCollision',
    value: function checkCollision(body, delta) {
      var newBody = {};
      this.copyBody(body, newBody);
      if (!newBody.freeze.x) {
        newBody.pos.x += newBody.vel.x * delta;
      }
      if (!newBody.freeze.y) {
        newBody.pos.y += newBody.vel.y * delta;
      }

      this.behaviors.forEach(function (behavior) {
        for (var key in behavior) {
          newBody[key].x += behavior[key].x * delta;
          newBody[key].y += behavior[key].y * delta;
        }
      });

      for (var i = 0; i < this.staticBodies.length; i++) {
        var sBod = this.staticBodies[i];
        var t = _Collision.Collision.aabbTest(newBody, sBod);
        if (this.lengthSquared(t) > 0) {
          return t;
        }
      }
      return { x: 0, y: 0 };
    }
  }, {
    key: 'binarySearchCollision',
    value: function binarySearchCollision(body, delta, tolerance) {
      if (this.lengthSquared(this.checkCollision(body, 0)) > 0) {
        return 0;
      }
      var low = 0.0;
      var high = delta;
      var mid = (low + high) / 2.0;
      var collision = this.checkCollision(body, mid);
      var l = this.lengthSquared(collision);
      var count = 0;
      while ((l > tolerance || l === 0) && count < 32) {
        if (l > tolerance) {
          high = mid;
        } else if (l === 0) {
          low = mid;
        }
        mid = (low + high) / 2.0;
        // console.log("low: ", low);
        // console.log("high: ", high);
        // console.log("mid: ", mid);
        collision = this.checkCollision(body, mid);
        l = this.lengthSquared(collision);
        // console.log("l: ", l);
        count++;
      }

      return mid;
    }
  }, {
    key: 'calcStep',
    value: function calcStep(body, delta) {
      body.pos.x += body.vel.x * delta;
      body.pos.y += body.vel.y * delta;

      this.behaviors.forEach(function (behavior) {
        for (var key in behavior) {
          body[key].x += behavior[key].x * delta;
          body[key].y += behavior[key].y * delta;
        }
      });
    }
  }, {
    key: 'step',
    value: function step(delta) {
      var _this = this;

      this.dynamicBodies.forEach(function (body) {
        if (body.awake) {
          body.freeze = {
            x: false,
            y: false
          };
          var collided = _this.checkCollisionFast(body, delta);
          if (!collided) {
            _this.calcStep(body, delta);
            var col = _this.checkCollision(body, 0);
            body.pos.y -= col.y;
            body.pos.x -= col.x;
          } else {
            var remaining = delta;
            var count = 0;
            while (remaining >= 0 && count < 6) {
              count++;
              var d = _this.binarySearchCollision(body, remaining, 0.1);
              _this.calcStep(body, d);
              remaining -= delta;
              var col = _this.checkCollision(body, 0);
              if (col.y !== 0.0) {
                if (Math.sign(body.vel.y) === Math.sign(col.y)) {
                  body.vel.y = 0;
                  body.freeze.y = true;
                }
                if (body.frictionless) {
                  // log.debug("Frictionless!");
                } else {
                    body.vel.x /= 2.0;
                  }
              } else if (col.x !== 0.0) {
                if (Math.sign(body.vel.x) === Math.sign(col.x)) {
                  body.vel.x = 0;
                  body.freeze.x = true;
                }
              }
              body.pos.y -= col.y;
              body.pos.x -= col.x;
            }
          }
        }
      });
    }
  }, {
    key: 'addBehavior',
    value: function addBehavior(behavior) {
      this.behaviors.push(behavior);
    }
  }, {
    key: 'addEntity',
    value: function addEntity(entity) {
      if (entity.physics && entity.physics.body) {
        if (entity.physics.body.static) {
          this.staticBodies.push(entity.physics.body);
        } else {
          if (entity.physics.body.trigger) {
            this.triggers.push(entity.physics.body);
          } else {
            this.dynamicBodies.push(entity.physics.body);
          }
        }
      } else {
        _Log.log.debug('Cannot add to physics: entity does not have a body!');
      }
    }
  }], [{
    key: 'body',
    value: function body(bodyType, options) {
      var body = {
        pos: {
          x: 0,
          y: 0
        },
        vel: {
          x: 0,
          y: 0
        },
        static: false,
        awake: true
      };
      body.pos.x = options.x | 0;
      body.pos.y = options.y | 0;
      body.frictionless = options.frictionless | false;
      if (options.treatment === 'static') {
        body.static = true;
      } else if (options.treatment === 'trigger') {
        body.trigger = true;
      }
      Object.assign(body, options);
      // log.debug(body);
      return body;
    }
  }]);

  return Physics;
}();

exports.Physics = Physics;

},{"Collision":2,"Log":6}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = undefined;

var _Log = require('Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Script = function () {
  function Script(parameters) {
    _classCallCheck(this, Script);

    var a = {};
    jQuery.extend(true, a, parameters);
    Object.assign(this, a);

    // Object.keys().forEach(key => {
    //   let a = {};
    //   jQuery
    //   this[key] =
    // });
    this.eventTypes = [];
  }

  _createClass(Script, [{
    key: 'init',
    value: function init(parent, rootEntity) {}
  }, {
    key: 'update',
    value: function update(parameters, parent, rootEntity, delta) {}
  }, {
    key: 'lateUpdate',
    value: function lateUpdate(parameters, parent, rootEntity, delta) {}
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {}
  }]);

  return Script;
}();

exports.Script = Script;

},{"Log":6}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AnimationScript = function (_Script) {
  _inherits(AnimationScript, _Script);

  function AnimationScript(parameters) {
    _classCallCheck(this, AnimationScript);

    // this.eventTypes.push(
    //   'animation_test'
    // );

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AnimationScript).call(this, parameters));

    _this.currentFrame = 0;
    return _this;
  }

  _createClass(AnimationScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      parent.timeAtCurrentFrame = -1;
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      var anim = parent.animation;

      if (anim) {
        var frames = anim.anim;

        if (frames.length <= this.currentFrame) {
          this.currentFrame = frames.length - 1;
        }

        if (parent.timeAtCurrentFrame > frames[this.currentFrame].duration || parent.timeAtCurrentFrame === -1) {
          // Change current frame
          var newFrame = (this.currentFrame + 1) % frames.length;
          this.currentFrame = newFrame;
          parent.setSprite(frames[this.currentFrame].frame);
          parent.timeAtCurrentFrame = 0;
        } else {
          parent.timeAtCurrentFrame += delta;
        }
      } else {
        _Log.log.warn('Animation script needs animation component to work');
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {}
  }]);

  return AnimationScript;
}(_Script2.Script);

exports.AnimationScript = AnimationScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BulletinBoardScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Factory = require('Factory');

var _Collision = require('Collision');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BulletinBoardScript = function (_Script) {
  _inherits(BulletinBoardScript, _Script);

  function BulletinBoardScript(parameters) {
    _classCallCheck(this, BulletinBoardScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BulletinBoardScript).call(this, parameters));

    _this.eventTypes.push('change_text');
    _this.converse = false;
    _this.text = 'This is placeholder text. Change it with events.';
    _this.bubble = _Factory.Factory.createSpeechBubble(11, 6, 6, _this.text);
    _this.bubble.position.y -= 40;
    return _this;
  }

  _createClass(BulletinBoardScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.player = rootEntity.findEntityWithTag('player');
      parent.addChild(this.bubble);
      this.bubble.visible = false;
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      var playerCollide = _Collision.Collision.aabbTestFast(parent.physics.body, this.player.physics.body);
      if (playerCollide) {
        this.bubble.visible = true;
      } else {
        // EventMan.publish({eventType: 'audio_sound_play', parameters: {audio:'audio_door_2'}});
        this.bubble.visible = false;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {

      if (evt.eventType === 'change_text') {
        if (evt.parameters.target.name == parent.name) {
          this.text = evt.parameters.text;
          this.bubble.setText(this.text);
        }
      }
    }
  }]);

  return BulletinBoardScript;
}(_Script2.Script);

exports.BulletinBoardScript = BulletinBoardScript;

},{"Collision":2,"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CameraScript = function (_Script) {
  _inherits(CameraScript, _Script);

  function CameraScript(parameters) {
    _classCallCheck(this, CameraScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CameraScript).call(this, parameters));

    _this.eventTypes.push('camera', 'disable_camera', 'enable_camera');
    _this.enabled = true;
    return _this;
  }

  _createClass(CameraScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.player = rootEntity.findEntityWithTag('player');
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.player.position.y > 800) {
        _EventManager.EventMan.publish({ eventType: 'disable_camera', parameters: {} });
      } else {
        _EventManager.EventMan.publish({ eventType: 'enable_camera', parameters: {} });
      }
      if (this.enabled) {
        parent.position.x = -this.player.position.x + _config2.default.renderer.size.x / 2;
        if (this.player.position.x < _config2.default.renderer.size.x / 2) parent.position.x = 0;
        if (this.player.position.y < 800 && this.player.position.x > 2430) parent.position.x = _config2.default.renderer.size.x / 2 - 2430;
        if (this.player.position.y < 800) {
          parent.position.y = -220;
        } else {
          parent.position.y = -this.player.position.y + _config2.default.renderer.size.y / 2 + 100;
        }
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'disable_camera') {
        this.enabled = false;
      } else {
        this.enabled = true;
      }
    }
  }]);

  return CameraScript;
}(_Script2.Script);

exports.CameraScript = CameraScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrisisScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _NumUtil = require('Utils/NumUtil');

var _StringUtil = require('Utils/StringUtil');

var _ResourceManager = require('Managers/ResourceManager');

var _Collision = require('Collision');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CrisisScript = function (_Script) {
  _inherits(CrisisScript, _Script);

  function CrisisScript(parameters) {
    _classCallCheck(this, CrisisScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CrisisScript).call(this, parameters));

    _this.eventTypes.push('rank_apply_end', 'item_thrown');
    return _this;
  }

  _createClass(CrisisScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.parent = parent;
      this.village = rootEntity.findEntityWithTag('village');
      this.sign = rootEntity.findEntityWithName('crisis_sign');
      this.data = _ResourceManager.resources.crisises.data.crisises;
      this.crisisIndex = 0;
    }
  }, {
    key: 'randomizeCrisis',
    value: function randomizeCrisis() {
      var itemTypes = [];

      var select = this.data[this.crisisIndex];
      this.requiredItems = [];
      while (itemTypes.length < select.itemCount) {
        var type = this.village.itemTypes[(0, _NumUtil.rand)(this.village.itemTypes.length)];
        if (itemTypes.indexOf(type) === -1) {
          this.requiredItems.push(this.village.rawTypesByName[type]);
          itemTypes.push(type);
        }
      }
      this.timeLeft = select.duration;
      var crisis = { villageName: this.village.name };
      for (var i = 0; i < itemTypes.length; i++) {
        crisis['item' + (i + 1)] = itemTypes[i];
      }

      crisis.description = (0, _StringUtil.populateTemplate)(select.desc, crisis);

      this.village.currentCrisis = crisis;

      _Log.log.debug(this.sign);

      _EventManager.EventMan.publish({ eventType: 'change_text',
        parameters: {
          target: this.sign,
          text: this.village.currentCrisis.description
        }
      });
    }
  }, {
    key: 'nextCrisis',
    value: function nextCrisis() {
      this.crisisIndex++;
      if (this.crisisIndex >= this.data.length) {
        this.crisisIndex = 0;
      }
      this.randomizeCrisis();
    }
  }, {
    key: 'advanceDay',
    value: function advanceDay() {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        if (this.requiredItems.length === 0) {
          this.crisisAverted();
        } else {
          this.crisisFailed();
        }
        this.nextCrisis();
      } else if (this.timeLeft === 1) {
        _EventManager.EventMan.publish({ eventType: 'notification', parameters: { text: 'The ritual is approaching...' } });
      }
    }
  }, {
    key: 'crisisFailed',
    value: function crisisFailed() {
      var name = this.village.villagers[this.village.villagers.length - 1].name;
      _EventManager.EventMan.publish({ eventType: 'villager_ritualized',
        parameters: { villagerName: name } });
      _EventManager.EventMan.publish({ eventType: 'notification', parameters: { text: name + ' got sacrificed in a ritual' } });
    }
  }, {
    key: 'crisisAverted',
    value: function crisisAverted() {
      _EventManager.EventMan.publish({ eventType: 'rank_change', parameters: { villagerName: this.village.player.name, rankChange: -1.1 } });
      _EventManager.EventMan.publish({ eventType: 'notification', parameters: { text: 'Crisis averted, no rituals were performed.' } });
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (!this.village.currentCrisis) {
        this.randomizeCrisis();
      }
    }
  }, {
    key: 'updateCrisisNeeds',
    value: function updateCrisisNeeds(item) {
      var newReq = [];
      this.requiredItems.forEach(function (req) {
        if (item.tags.indexOf(req) === -1) {
          newReq.push(req);
        }
      });
      if (newReq.length < this.requiredItems.length) {
        item.physics.body.pos.x = 150000;
        item.relocated = true;
        this.requiredItems = newReq;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'rank_apply_end') {
        this.advanceDay();
      } else if (evt.eventType === 'item_thrown') {
        if (_Collision.Collision.aabbTestFast(this.parent.physics.body, evt.parameters.item.physics.body)) {
          this.updateCrisisNeeds(evt.parameters.item);
        }
      }
    }
  }]);

  return CrisisScript;
}(_Script2.Script);

exports.CrisisScript = CrisisScript;

},{"Collision":2,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41,"Utils/StringUtil":42}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DarkenScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DarkenScript = function (_Script) {
  _inherits(DarkenScript, _Script);

  function DarkenScript(parameters) {
    _classCallCheck(this, DarkenScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DarkenScript).call(this, parameters));

    _this.eventTypes.push('time_change');
    return _this;
  }

  _createClass(DarkenScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {}
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'time_change') {
        var t = evt.parameters.time;
        parent.sprite.alpha = Math.abs(t - 12) / 12.0;
      }
    }
  }]);

  return DarkenScript;
}(_Script2.Script);

exports.DarkenScript = DarkenScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DayNightCycleScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DayNightCycleScript = function (_Script) {
  _inherits(DayNightCycleScript, _Script);

  function DayNightCycleScript(parameters) {
    _classCallCheck(this, DayNightCycleScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DayNightCycleScript).call(this, parameters));

    _this.eventTypes.push('time_advance');
    _this.time = 0;
    return _this;
  }

  _createClass(DayNightCycleScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      // EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
      this.village = rootEntity.findEntityWithTag('village');
      this.schelude = _ResourceManager.resources.npcSchelude.data.schelude;
      this.rootEntity = rootEntity;
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      parent.getChildAt(1).text = this.dayTime() + ":00";
      if (!this.firstUpdate) {
        this.firstUpdate = true;
        this.time = 11;
        this.advanceTime();
      }
    }
  }, {
    key: 'dayNumber',
    value: function dayNumber() {
      return Math.floor(this.time / 24) + 1;
    }
  }, {
    key: 'dayTime',
    value: function dayTime() {
      return this.time % 24;
    }
  }, {
    key: 'advanceTime',
    value: function advanceTime() {
      var oldTime = this.time;
      this.time += 1;
      _EventManager.EventMan.publish({ eventType: 'time_change', parameters: { time: this.dayTime() } });
      this.updateNpcs();
      if (this.dayTime() === 0) {
        _EventManager.EventMan.publish({ eventType: 'cycle_morning', parameters: { cycleNumber: this.dayNumber() } });
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'time_advance') {
        this.advanceTime();
      }
    }
  }, {
    key: 'updateNpcs',
    value: function updateNpcs() {
      var _this2 = this;

      var schel = this.schelude[this.dayTime()];
      this.village.npcs.forEach(function (villager) {
        var location = schel[villager.id];
        var spawn = undefined;
        if (location == 'home') {
          var house = villager.house;
          if (house) {
            var houseId = villager.house.houseId;
            spawn = _this2.rootEntity.findEntityWithName('house_spawn_' + houseId);
          }
        } else {
          var last = location[location.length - 1];
          var spawnId = '1';
          if (last == 'a') {
            spawnId = '2';
            last = location[location.length - 2];
          }
          var convId = last;
          spawn = _this2.rootEntity.findEntityWithName('location_conversation_' + convId + '_spawn_' + spawnId);
        }
        if (villager.dead) {
          villager.physics.body.pos.x = 15000;
          villager.physics.body.vel.y = 0;
          villager.physics.body.vel.x = 0;
        } else if (spawn) {
          villager.location = location;
          villager.physics.body.pos.x = spawn.physics.body.pos.x;
          villager.physics.body.pos.y = spawn.physics.body.pos.y;
        }
      });
    }
  }]);

  return DayNightCycleScript;
}(_Script2.Script);

exports.DayNightCycleScript = DayNightCycleScript;

},{"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Script":14}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DoorScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _Collision = require('Collision.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DoorScript = function (_Script) {
  _inherits(DoorScript, _Script);

  function DoorScript(parameters) {
    _classCallCheck(this, DoorScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DoorScript).call(this, parameters));

    _this.eventTypes.push('enter_player', 'teleport_player');
    return _this;
  }

  _createClass(DoorScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.player = rootEntity.findEntityWithTag('player');
      this.target = rootEntity.findEntityWithName(parent.target);
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'teleport_player') {
        var p = evt.parameters;
        if (p.sender == this) {
          this.player.physics.body.pos.x = this.target.physics.body.pos.x;
          this.player.physics.body.pos.y = this.target.physics.body.pos.y;
        }
      }
      if (evt.eventType === 'enter_player') {
        if (_Collision.Collision.aabbTestFast(this.player.physics.body, parent.physics.body) && !this.player.entered) {
          // this.player.physics.body.pos.x = this.target.physics.body.pos.x;
          // this.player.physics.body.pos.y = this.target.physics.body.pos.y;
          this.player.entered = true;
          _EventManager.EventMan.publish({ eventType: 'audio_sound_play', parameters: { audio: 'audio_door_1' } });
          _EventManager.EventMan.publish({
            eventType: 'timed',
            parameters: {
              evt: {
                eventType: 'time_advance',
                parameters: {}
              },
              time: 0.5
            }
          });
          _EventManager.EventMan.publish({
            eventType: 'timed',
            parameters: {
              evt: {
                eventType: 'fade_in',
                parameters: {
                  duration: 0.5
                }
              },
              time: 0.5
            }
          });
          _EventManager.EventMan.publish({
            eventType: 'timed',
            parameters: {
              evt: {
                eventType: 'teleport_player',
                parameters: {
                  sender: this
                }
              },
              time: 0.5
            }
          });
          _EventManager.EventMan.publish({
            eventType: 'disable_player',
            parameters: {
              evt: {}
            }
          });
          _EventManager.EventMan.publish({
            eventType: 'timed',
            parameters: {
              evt: {
                eventType: 'enable_player',
                parameters: {}
              },
              time: 1.0
            }
          });
          // EventMan.publish({eventType: 'time_advance', parameters: {}});
          _EventManager.EventMan.publish({ eventType: 'fade_out', parameters: {
              duration: 0.5
            } });
        }
      }
    }
  }]);

  return DoorScript;
}(_Script2.Script);

exports.DoorScript = DoorScript;

},{"Collision.js":2,"Log":6,"Managers/EventManager":10,"Script":14}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTimerScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventTimerScript = function (_Script) {
  _inherits(EventTimerScript, _Script);

  function EventTimerScript(parameters) {
    _classCallCheck(this, EventTimerScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventTimerScript).call(this, parameters));

    _this.eventTypes.push('timed');
    _this.events = [];
    return _this;
  }

  _createClass(EventTimerScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {}
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      this.events.forEach(function (evtOb) {
        var evt = evtOb.event;
        evtOb.timer += delta / 1000.0;
        // log.debug(evtOb.timer);
        // log.debug(evt.parameters.time);
        if (evtOb.timer > evt.parameters.time) {
          _EventManager.EventMan.publish(evt.parameters.evt);
        }
      });
      this.events = this.events.filter(function (evtOb) {
        return evtOb.timer < evtOb.event.parameters.time;
      });
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'timed') {
        this.events.push({ event: evt, timer: 0.0 });
      }
    }
  }]);

  return EventTimerScript;
}(_Script2.Script);

exports.EventTimerScript = EventTimerScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FadeInScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FadeInScript = function (_Script) {
  _inherits(FadeInScript, _Script);

  function FadeInScript(parameters) {
    _classCallCheck(this, FadeInScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FadeInScript).call(this, parameters));

    _this.eventTypes.push('fade_in', 'fade_out');
    _this.fade_in = false;
    _this.fade_out = false;
    _this.fade_rate = 1 / 60.0;
    return _this;
  }

  _createClass(FadeInScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {}
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.fade_in) {
        parent.alpha -= this.fade_rate;
        if (parent.alpha < 0.0) {
          parent.alpha = 0.0;
          this.fade_in = false;
        }
      } else if (this.fade_out) {
        parent.alpha += this.fade_rate;
        if (parent.alpha > 1.0) {
          parent.alpha = 1.0;
          this.fade_out = false;
        }
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'fade_in') {
        var d = 1.0;
        if (evt.parameters.duration) {
          d = evt.parameters.duration;
        }
        this.fade_rate = 1.0 / _config2.default.fps / d;
        this.fade_in = true;
      } else if (evt.eventType === 'fade_out') {
        _Log.log.debug(evt.parameters);
        var d = 1.0;
        if (evt.parameters.duration) {
          d = evt.parameters.duration;
        }
        _Log.log.debug(d);
        this.fade_rate = 1.0 / _config2.default.fps / d;
        this.fade_out = true;
      }
    }
  }]);

  return FadeInScript;
}(_Script2.Script);

exports.FadeInScript = FadeInScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],24:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HouseControllerScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

var _NumUtil = require('Utils/NumUtil');

var _Entity = require('Entity');

var _Collision = require('Collision.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HouseControllerScript = function (_Script) {
  _inherits(HouseControllerScript, _Script);

  function HouseControllerScript(parameters) {
    _classCallCheck(this, HouseControllerScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HouseControllerScript).call(this, parameters));

    _this.eventTypes.push('cycle_morning');
    return _this;
  }

  _createClass(HouseControllerScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.village = rootEntity.findEntityWithTag('village');
      this.village.houses = this.village.houses || rootEntity.findEntitiesWithTag('location_house');
      this.village.items = this.village.items || rootEntity.findEntitiesWithTag('item');
    }
  }, {
    key: 'mapItemsToHouses',
    value: function mapItemsToHouses() {
      var _this2 = this;

      var map = {};
      this.village.houses.forEach(function (house) {
        map[house.name] = [];
        _this2.village.items.forEach(function (item) {
          if (_Collision.Collision.aabbTestFast(house.physics.body, item.physics.body)) {
            map[house.name].push(item);
          }
        });
      });
      this.village.houseItemMap = map;
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'cycle_morning') {
        this.mapItemsToHouses();
        _EventManager.EventMan.publish({ eventType: 'rank_apply_start', parameters: {} });
      }
    }
  }]);

  return HouseControllerScript;
}(_Script2.Script);

exports.HouseControllerScript = HouseControllerScript;

},{"Collision.js":2,"Entity":3,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41}],25:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HouseScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _Collision = require('Collision');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HouseScript = function (_Script) {
  _inherits(HouseScript, _Script);

  function HouseScript(parameters) {
    _classCallCheck(this, HouseScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HouseScript).call(this, parameters));

    _this.eventTypes.push('item');
    return _this;
  }

  _createClass(HouseScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.parent = parent;
      this.village = rootEntity.findEntityWithTag('village');
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'checkIfStealing',
    value: function checkIfStealing(item) {
      if (this.parent.villager.location === 'home' && !this.parent.villager.dead) {
        _EventManager.EventMan.publish({ eventType: 'rank_change', parameters: { villagerName: this.village.player.name, rankChange: 1.1 } });
        _EventManager.EventMan.publish({ eventType: 'notification', parameters: { text: 'Your rank decreased because you got caught stealing.' } });
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'item_thrown') {
        if (_Collision.Collision.aabbTestFast(this.parent.physics.body, evt.parameters.item.physics.body)) {
          this.checkItemAgainstVillagerNeeds(evt.parameters.item);
        }
      } else if (evt.eventType === 'item_picked') {
        if (_Collision.Collision.aabbTestFast(this.parent.physics.body, evt.parameters.item.physics.body)) {
          this.checkIfStealing(evt.parameters.item);
        }
      }
    }
  }, {
    key: 'checkItemAgainstVillagerNeeds',
    value: function checkItemAgainstVillagerNeeds(item) {
      var disappear = undefined;
      if (!this.parent.villager.dead) {
        if (item === this.parent.villager.love) {
          _EventManager.EventMan.publish({ eventType: 'rank_change', parameters: { villagerName: this.village.player.name, rankChange: -1.1 } });
          _EventManager.EventMan.publish({ eventType: 'notification', parameters: { text: 'Your rank increased for a good deed!' } });
          disappear = true;
        } else if (item === this.parent.villager.hate) {
          _EventManager.EventMan.publish({ eventType: 'rank_change', parameters: { villagerName: this.parent.villager.name, rankChange: 1.1 } });
          _EventManager.EventMan.publish({ eventType: 'notification',
            parameters: { text: 'Rank of ' + this.parent.villager.name + ' decreased for seeing a hated item.' } });
          disappear = true;
        }
        if (disappear) {
          item.physics.body.pos.x = 15000;
          item.relocated = true;
        }
      }
    }
  }]);

  return HouseScript;
}(_Script2.Script);

exports.HouseScript = HouseScript;

},{"Collision":2,"Log":6,"Managers/EventManager":10,"Script":14}],26:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitiateConversationScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _StringUtil = require('Utils/StringUtil');

var _ResourceManager = require('Managers/ResourceManager');

var _Factory = require('Factory');

var _NumUtil = require('Utils/NumUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InitiateConversationScript = function (_Script) {
  _inherits(InitiateConversationScript, _Script);

  function InitiateConversationScript(parameters) {
    _classCallCheck(this, InitiateConversationScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InitiateConversationScript).call(this, parameters));

    _this.converse = false;
    _this.eventTypes.push('cycle_morning', 'time_advance');
    _this.text = 'Blaablaablaablaa.';
    return _this;
  }

  _createClass(InitiateConversationScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.bubble = _Factory.Factory.createSpeechBubble(11, 3, 6, this.text, parent.name);
      this.bubble.position.y -= 80;
      this.parent = parent;
      this.player = rootEntity.findEntityWithTag('player');
      this.conversations = _ResourceManager.resources.conversations.data;
      parent.addChild(this.bubble);
      this.bubble.visible = false;
      this.randomize();
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (Math.abs(this.player.physics.body.pos.x - parent.physics.body.pos.x) < 50) {
        this.converse = true;
      } else {
        this.converse = false;
      }
      if (this.converse) {
        // EventMan.publish({eventType: 'audio_sound_play', parameters: {audio:'audio_door_2'}});
        this.bubble.visible = true;
      } else {
        this.bubble.visible = false;
      }
    }
  }, {
    key: 'randomize',
    value: function randomize() {
      var text = undefined;
      var r = (0, _NumUtil.rand)(3);
      if (r === 0) {
        text = this.conversations.hate[(0, _NumUtil.rand)(this.conversations.hate.length)];
      } else if (r === 1) {
        text = this.conversations.love[(0, _NumUtil.rand)(this.conversations.love.length)];
      } else {
        text = this.conversations.replies[(0, _NumUtil.rand)(this.conversations.replies.length)];
      }
      var obj = { love: this.parent.love.name.slice(5), hate: this.parent.hate.name.slice(5) };
      this.text = (0, _StringUtil.populateTemplate)(text, obj);
      this.bubble.setText(this.text);
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'time_advance') {
        this.randomize();
      }
    }
  }]);

  return InitiateConversationScript;
}(_Script2.Script);

exports.InitiateConversationScript = InitiateConversationScript;

},{"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41,"Utils/StringUtil":42,"config.json":1}],27:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntroScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Factory = require('Factory');

var _Collision = require('Collision');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IntroScript = function (_Script) {
  _inherits(IntroScript, _Script);

  function IntroScript(parameters) {
    _classCallCheck(this, IntroScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IntroScript).call(this, parameters));

    _this.eventTypes = ['intro'];
    _this.text = 'The town of Ovisbury has fallen out of favor with their god! Once every two days, the lowest-ranking member of the society will be sacrificed unless the concerning issue is solved. Help the society or save yourself, the choice is yours. Good luck!';
    _this.bubble = _Factory.Factory.createSpeechBubble(21, 5, 10, _this.text, 'Welcome', true, false, 60);
    _this.timer = 0;
    return _this;
  }

  _createClass(IntroScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      // this.world = rootEntity.findEntityWithTag('world');
      parent.addChild(this.bubble);
      // this.bubble.visible = true;
      // console.log(parent.position);
      // EventMan.publish({eventType: 'notification', parameters: {text:'Welcome to the Ovisburg!'}});
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.timer < 5500) {
        this.timer += delta;
      } else {
        // this.bubble.visible = false;
        this.bubble.alpha -= 0.01;
      }
      // if(this.bubble.visible){
      //   if(this.timer > 5000){
      //     this.bubble.visible = false;
      //     this.timer = 0;
      //   } else {
      //     this.timer += delta;
      //   }
      // }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'intro') {
        _EventManager.EventMan.publish({
          eventType: 'disable_player',
          parameters: {}
        });
        _EventManager.EventMan.publish({
          eventType: 'timed',
          parameters: {
            evt: {
              eventType: 'fade_in',
              parameters: {
                duration: 2.0
              }
            },
            time: 4.0
          }
        });
        _EventManager.EventMan.publish({
          eventType: 'timed',
          parameters: {
            evt: {
              eventType: 'enable_player',
              parameters: {}
            },
            time: 6.0
          }
        });
      }
      // if (evt.eventType === 'notification') {
      //   console.log(evt);
      //   this.bubble.visible = true;
      //
      //   this.text = evt.parameters.text;
      //   this.bubble.setText(this.text);
      // }
    }
  }]);

  return IntroScript;
}(_Script2.Script);

exports.IntroScript = IntroScript;

},{"Collision":2,"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],28:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemSystemScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _Game = require('Game');

var _NumUtil = require('Utils/NumUtil');

var _ResourceManager = require('Managers/ResourceManager');

var _Entity = require('Entity');

var _StringUtil = require('Utils/StringUtil');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemSystemScript = function (_Script) {
  _inherits(ItemSystemScript, _Script);

  function ItemSystemScript(parameters) {
    _classCallCheck(this, ItemSystemScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ItemSystemScript).call(this, parameters));

    _this.eventTypes.push('cycle_morning');
    return _this;
  }

  _createClass(ItemSystemScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.village = rootEntity.findEntityWithTag('village');
      this.items = rootEntity.findEntitiesWithTag('item');
      this.village.items = this.village.items || this.items;
      this.itemLocations = rootEntity.findEntitiesWithTag('location_item');
      this.rootEntity = rootEntity;
      this.relocateItems(rootEntity);
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'cycle_morning') {
        this.relocateItems(this.rootEntity);
      }
    }
  }, {
    key: 'relocateItems',
    value: function relocateItems(rootEntity) {
      var _this2 = this;

      if (this.itemLocations.length < this.items.length) {
        _Log.log.error('There should be more locations than items on map!');
        return;
      }
      var typeNames = _ResourceManager.resources.itemTypes.data;
      this.itemLocations.forEach(function (loc) {
        loc.inUse = false;
      });
      this.village.itemTypes = [];
      this.village.rawTypesByName = {};
      this.items.forEach(function (item) {
        if (item.relocated) {
          var loc = undefined;
          item.relocated = false;
          do {
            loc = _this2.itemLocations[(0, _NumUtil.rand)(_this2.itemLocations.length)];
          } while (loc.inUse);
          loc.inUse = true;
          item.physics.body.pos.x = loc.physics.body.pos.x;
          item.physics.body.pos.y = loc.physics.body.pos.y;
          item.physics.body.vel.x = 0;
          item.physics.body.vel.y = 0;
        }
        //Register all types of items
        item.tags.forEach(function (tag) {
          if (_this2.village.itemTypes.indexOf(tag) === -1 && typeNames[tag]) {
            _this2.village.itemTypes.push(typeNames[tag]);
            _this2.village.rawTypesByName[typeNames[tag]] = tag;
          }
        });
      });
    }
  }]);

  return ItemSystemScript;
}(_Script2.Script);

exports.ItemSystemScript = ItemSystemScript;

},{"Entity":3,"Game":5,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41,"Utils/StringUtil":42}],29:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageBoxScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Factory = require('Factory');

var _Collision = require('Collision');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageBoxScript = function (_Script) {
  _inherits(MessageBoxScript, _Script);

  function MessageBoxScript(parameters) {
    _classCallCheck(this, MessageBoxScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MessageBoxScript).call(this, parameters));

    _this.eventTypes = ['notification'];
    _this.text = 'Welcome to the village';
    _this.bubble = _Factory.Factory.createSpeechBubble(15, 2, 1, _this.text, 'Latest news', false, false, 10);
    _this.timer = 0;
    _this.bubble.visible = false;
    return _this;
  }

  _createClass(MessageBoxScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.world = rootEntity.findEntityWithTag('world');
      parent.addChild(this.bubble);
      console.log(parent.position);
      // EventMan.publish({eventType: 'notification', parameters: {text:'Welcome to the Ovisburg!'}});
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.bubble.visible) {
        if (this.timer > 5000) {
          this.bubble.visible = false;
          this.timer = 0;
        } else {
          this.timer += delta;
        }
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'notification') {
        _EventManager.EventMan.publish({ eventType: 'audio_sound_play', parameters: { audio: 'audio_door_2' } });
        console.log(evt);
        this.bubble.visible = true;

        this.text = evt.parameters.text;
        this.timer = 0;
        this.bubble.setText(this.text);
      }
    }
  }]);

  return MessageBoxScript;
}(_Script2.Script);

exports.MessageBoxScript = MessageBoxScript;

},{"Collision":2,"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],30:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementInputScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovementInputScript = function (_Script) {
  _inherits(MovementInputScript, _Script);

  function MovementInputScript(parameters) {
    _classCallCheck(this, MovementInputScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovementInputScript).call(this, parameters));

    _this.eventTypes.push('enable_player', 'disable_player');
    _this.enabled = true;
    return _this;
  }

  _createClass(MovementInputScript, [{
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      var movement = 0;
      parent.entered = false;
      if (this.enabled) {
        if (_InputManager.InputMan.keyDown.left) {
          movement -= this.movementSpeed;
          parent.sprite.scale.x = -1;
          parent.facingRight = false;
        }
        if (_InputManager.InputMan.keyDown.right) {
          movement += this.movementSpeed;
          parent.sprite.scale.x = +1;
          parent.facingRight = true;
        }
        if (_InputManager.InputMan.keyPressed.interact) {
          _EventManager.EventMan.publish({
            eventType: 'interact_player',
            parameters: {}
          });
        }
        if (_InputManager.InputMan.keyPressed.up) {
          _EventManager.EventMan.publish({ eventType: 'enter_player', parameters: {} });
        }
        if (movement === 0) {
          parent.animation = parent.idle;
        } else {
          parent.animation = parent.walk;
        }
        parent.physics.body.vel.x = movement;
      } else {
        parent.animation = parent.idle;
        parent.physics.body.vel.x = 0;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'disable_player') {
        this.enabled = false;
      } else if (evt.eventType === 'enable_player') {
        this.enabled = true;
      }
    }
  }]);

  return MovementInputScript;
}(_Script2.Script);

exports.MovementInputScript = MovementInputScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14}],31:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RankBoardScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Factory = require('Factory');

var _Collision = require('Collision');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RankBoardScript = function (_Script) {
  _inherits(RankBoardScript, _Script);

  function RankBoardScript(parameters) {
    _classCallCheck(this, RankBoardScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RankBoardScript).call(this, parameters));

    _this.eventTypes.push('rank_apply_end', 'villagers_updated');
    _this.converse = false;
    _this.text = 'This is placeholder text. Change it with events!';
    _this.bubble = _Factory.Factory.createSpeechBubble(13, 7, 6, _this.text, 'Rankings', false);
    _this.bubble.position.y -= 40;
    return _this;
  }

  _createClass(RankBoardScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      var _this2 = this;

      this.player = rootEntity.findEntityWithTag('player');
      this.village = rootEntity.findEntityWithTag('village');
      this.text = '';
      this.village.villagers.forEach(function (villager) {
        _this2.text += villager.name + ', ' + villager.role + '\n';
      });
      parent.addChild(this.bubble);
      this.bubble.setText(this.text);
      this.bubble.visible = false;
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      var playerCollide = _Collision.Collision.aabbTestFast(parent.physics.body, this.player.physics.body);
      if (playerCollide) {
        this.bubble.visible = true;
      } else {
        this.bubble.visible = false;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      var _this3 = this;

      if (evt.eventType === 'rank_apply_end' || evt.eventType === 'villagers_updated') {
        this.text = '';
        this.village.villagers.forEach(function (villager) {
          _this3.text += villager.name + ', ' + villager.role + '\n';
        });
        parent.addChild(this.bubble);
        this.bubble.setText(this.text);
      }
    }
  }]);

  return RankBoardScript;
}(_Script2.Script);

exports.RankBoardScript = RankBoardScript;

},{"Collision":2,"Factory":4,"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Script":14,"config.json":1}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scripts = undefined;

var _MovementInputScript = require('./MovementInputScript');

var _AnimationScript = require('./AnimationScript');

var _DayNightCycleScript = require('./DayNightCycleScript');

var _VillagerRankingSystemScript = require('./VillagerRankingSystemScript');

var _VillagerIdentitySystemScript = require('./VillagerIdentitySystemScript');

var _CameraScript = require('./CameraScript');

var _CrisisScript = require('./CrisisScript');

var _ItemSystemScript = require('./ItemSystemScript');

var _TossableScript = require('./TossableScript');

var _DoorScript = require('./DoorScript');

var _FadeInScript = require('./FadeInScript');

var _VillagerAnimationScript = require('./VillagerAnimationScript');

var _HouseControllerScript = require('./HouseControllerScript');

var _EventTimerScript = require('./EventTimerScript');

var _InitiateConversationScript = require('./InitiateConversationScript');

var _BulletinBoardScript = require('./BulletinBoardScript');

var _HouseScript = require('./HouseScript');

var _RankBoardScript = require('./RankBoardScript');

var _DarkenScript = require('./DarkenScript');

var _MessageBoxScript = require('./MessageBoxScript');

var _IntroScript = require('./IntroScript');

var scripts = {
  movementInputScript: _MovementInputScript.MovementInputScript,
  animationScript: _AnimationScript.AnimationScript,
  dayNightCycleScript: _DayNightCycleScript.DayNightCycleScript,
  villagerRankingSystemScript: _VillagerRankingSystemScript.VillagerRankingSystemScript,
  villagerIdentitySystemScript: _VillagerIdentitySystemScript.VillagerIdentitySystemScript,
  cameraScript: _CameraScript.CameraScript,
  itemSystemScript: _ItemSystemScript.ItemSystemScript,
  crisisScript: _CrisisScript.CrisisScript,
  tossableScript: _TossableScript.TossableScript,
  doorScript: _DoorScript.DoorScript,
  villagerAnimationScript: _VillagerAnimationScript.VillagerAnimationScript,
  houseControllerScript: _HouseControllerScript.HouseControllerScript,
  fadeInScript: _FadeInScript.FadeInScript,
  eventTimerScript: _EventTimerScript.EventTimerScript,
  initiateConversationScript: _InitiateConversationScript.InitiateConversationScript,
  bulletinBoardScript: _BulletinBoardScript.BulletinBoardScript,
  houseScript: _HouseScript.HouseScript,
  rankBoardScript: _RankBoardScript.RankBoardScript,
  darkenScript: _DarkenScript.DarkenScript,
  messageBoxScript: _MessageBoxScript.MessageBoxScript,
  introScript: _IntroScript.IntroScript
};

exports.Scripts = scripts;

},{"./AnimationScript":15,"./BulletinBoardScript":16,"./CameraScript":17,"./CrisisScript":18,"./DarkenScript":19,"./DayNightCycleScript":20,"./DoorScript":21,"./EventTimerScript":22,"./FadeInScript":23,"./HouseControllerScript":24,"./HouseScript":25,"./InitiateConversationScript":26,"./IntroScript":27,"./ItemSystemScript":28,"./MessageBoxScript":29,"./MovementInputScript":30,"./RankBoardScript":31,"./TossableScript":33,"./VillagerAnimationScript":34,"./VillagerIdentitySystemScript":35,"./VillagerRankingSystemScript":36}],33:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TossableScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _Collision = require('Collision');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TossableScript = function (_Script) {
  _inherits(TossableScript, _Script);

  function TossableScript(parameters) {
    _classCallCheck(this, TossableScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TossableScript).call(this, parameters));

    _this.eventTypes.push('interact_player');
    _this.picked = false;
    return _this;
  }

  _createClass(TossableScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.parent = parent;
      this.player = rootEntity.findEntitiesWithTag('player')[0];
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.picked) {
        parent.physics.body.awake = false;
        parent.position.x = this.player.position.x;
        parent.position.y = this.player.position.y - 50;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'interact_player') {
        if (this.picked) {
          var body = parent.physics.body;
          body.awake = true;
          body.pos.x = parent.position.x;
          body.pos.y = parent.position.y;
          if (this.player.facingRight) {
            body.vel.x = 0.5;
          } else {
            body.vel.x = -0.5;
          }
          parent.physics.body.vel.y = -0.5;
          this.picked = false;
          this.player.hasItem = false;
          _EventManager.EventMan.publish({ eventType: 'item_thrown', parameters: { item: this.parent } });
        } else if (_Collision.Collision.aabbTestFast(parent.physics.body, this.player.physics.body)) {
          if (this.player.hasItem) {} else {
            this.picked = true;
            this.player.hasItem = true;
            _EventManager.EventMan.publish({ eventType: 'item_picked', parameters: { item: this.parent } });
          }
        }
      }
    }
  }]);

  return TossableScript;
}(_Script2.Script);

exports.TossableScript = TossableScript;

},{"Collision":2,"Log":6,"Managers/EventManager":10,"Script":14}],34:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VillagerAnimationScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _InputManager = require('Managers/InputManager');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

var _NumUtil = require('Utils/NumUtil');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VillagerAnimationScript = function (_Script) {
  _inherits(VillagerAnimationScript, _Script);

  function VillagerAnimationScript(parameters) {
    _classCallCheck(this, VillagerAnimationScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VillagerAnimationScript).call(this, parameters));

    _this.eventTypes.push('animation_test');
    var allparts = _this.getVillagerParts();
    // console.log(this);
    var partnames = Object.keys(_this.parts);
    _this.parts.body = allparts.body[(0, _NumUtil.rand)(allparts.body.length)];
    _this.parts.head = allparts.head[(0, _NumUtil.rand)(allparts.head.length)];
    _this.parts.hair = allparts.hair[(0, _NumUtil.rand)(allparts.hair.length)];
    _this.parts.limbs = allparts.limbs[(0, _NumUtil.rand)(allparts.limbs.length)];
    // this.parts.
    _this.timeAtCurrentFrame = -1;
    _this.duration = 2000;
    _this.currentFrame = 0;
    return _this;
  }

  _createClass(VillagerAnimationScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      // console.log(this.parts);
      var sprites = {};
      sprites.head = new PIXI.Sprite();
      sprites.body = new PIXI.Sprite();
      sprites.limbs = new PIXI.Sprite();
      sprites.hair = new PIXI.Sprite();
      sprites.head.texture = _ResourceManager.resources.sprite.textures['sprite_npc_head_' + this.parts.head + '_0'];
      sprites.body.texture = _ResourceManager.resources.sprite.textures['sprite_npc_body_' + this.parts.body + '_0'];
      sprites.limbs.texture = _ResourceManager.resources.sprite.textures['sprite_npc_limbs_' + this.parts.limbs + '_0'];
      sprites.hair.texture = _ResourceManager.resources.sprite.textures['sprite_npc_hair_' + this.parts.hair + '_0'];
      this.sprites = sprites;
      Object.keys(sprites).forEach(function (key) {
        sprites[key].anchor = {
          x: 0.5,
          y: 0.5
        };
      });
      parent.addChild(sprites.limbs);
      parent.addChild(sprites.body);
      parent.addChild(sprites.head);
      parent.addChild(sprites.hair);
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (this.timeAtCurrentFrame > this.duration || this.timeAtCurrentFrame === -1) {
        var newFrame = (this.currentFrame + 1) % 2;
        this.sprites.head.texture = _ResourceManager.resources.sprite.textures['sprite_npc_head_' + this.parts.head + '_' + newFrame];
        this.sprites.body.texture = _ResourceManager.resources.sprite.textures['sprite_npc_body_' + this.parts.body + '_' + newFrame];
        this.sprites.limbs.texture = _ResourceManager.resources.sprite.textures['sprite_npc_limbs_' + this.parts.limbs + '_' + newFrame];
        this.sprites.hair.texture = _ResourceManager.resources.sprite.textures['sprite_npc_hair_' + this.parts.hair + '_' + newFrame];
        this.currentFrame = newFrame;
        this.timeAtCurrentFrame = 0;
      } else {
        this.timeAtCurrentFrame += delta;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      // log.debug('Anim script: ' + evt.parameters.message);
    }
  }, {
    key: 'getVillagerParts',
    value: function getVillagerParts() {
      var parts = {
        head: [],
        body: [],
        hair: [],
        limbs: []
      };
      Object.keys(_ResourceManager.resources.sprite.textures).forEach(function (key) {
        var splitted = key.split('_');
        if (splitted[0] === 'sprite' && splitted[1] === 'npc') {
          if (parts[splitted[2]].indexOf(splitted[3]) < 0) {
            parts[splitted[2]].push(splitted[3]);
          }
        }
      });
      return parts;
    }
  }]);

  return VillagerAnimationScript;
}(_Script2.Script);

exports.VillagerAnimationScript = VillagerAnimationScript;

},{"Log":6,"Managers/EventManager":10,"Managers/InputManager":11,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41}],35:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VillagerIdentitySystemScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _ResourceManager = require('Managers/ResourceManager');

var _NumUtil = require('Utils/NumUtil');

var _Entity = require('Entity');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VillagerIdentitySystemScript = function (_Script) {
  _inherits(VillagerIdentitySystemScript, _Script);

  function VillagerIdentitySystemScript(parameters) {
    _classCallCheck(this, VillagerIdentitySystemScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VillagerIdentitySystemScript).call(this, parameters));

    _this.eventTypes.push('villager_ritualized');
    return _this;
  }

  _createClass(VillagerIdentitySystemScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      var _this2 = this;

      this.villagers = rootEntity.findEntitiesWithTag('villager');
      this.village = rootEntity.findEntityWithTag('village');
      this.village.houses = this.village.houses || rootEntity.findEntitiesWithTag('location_house');
      this.village.items = this.village.items || rootEntity.findEntitiesWithTag('item');
      this.village.npcs = rootEntity.findEntitiesWithTag('npc');
      this.village.player = rootEntity.findEntityWithTag('player');

      var spawner = rootEntity.findEntityWithTag('spawn_villager');

      // parent.villagers = rootEntity.findEntitiesWithTag('villager');
      parent.villagers = this.villagers;
      this.village.villages = this.villagers;
      // log.debug(parent);

      this.roles = [];
      this.reservedNames = [];

      var freeHouses = [];

      this.village.houses.forEach(function (h) {
        if (h.name.indexOf('town_hall') === -1) {
          freeHouses.push(h);
        }
      });

      _ResourceManager.resources.identities.data.roles.forEach(function (e) {
        return _this2.roles.push(e);
      });

      var fnames = _ResourceManager.resources.identities.data.fnames;
      var snames = _ResourceManager.resources.identities.data.snames;
      var idCounter = 1;
      this.villagers.forEach(function (villager) {
        if (villager.tags.indexOf('player') === -1) {
          var name = undefined;
          do {
            var fname = fnames[(0, _NumUtil.rand)(fnames.length)];
            var sname = snames[(0, _NumUtil.rand)(snames.length)];
            name = fname + ' ' + sname;
          } while (_this2.reservedNames.indexOf(name) !== -1);
          _this2.reservedNames.push(name);
          var role = _this2.roles.splice((0, _NumUtil.rand)(_this2.roles.length), 1)[0];
          var hate = _this2.village.items[(0, _NumUtil.rand)(_this2.village.items.length)];
          var love = undefined;
          do {
            love = _this2.village.items[(0, _NumUtil.rand)(_this2.village.items.length)];
          } while (love === hate);
          var hid = (0, _NumUtil.rand)(freeHouses.length);
          villager.house = freeHouses[hid];
          villager.house.villager = villager;
          freeHouses.splice(hid, 1);

          villager.name = name;
          villager.role = role;
          villager.love = love;
          villager.hate = hate;
          villager.id = 'villager_' + idCounter++;
        } else {
          villager.name = 'sheep';
          villager.role = 'sheep';
        }
      });
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {
      if (!this.firstUpdate) {
        _EventManager.EventMan.publish({ eventType: 'villagers_updated', parameters: { updateType: 'identified' } });
        this.firstUpdate = true;
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'villager_ritualized') {
        var rem = undefined;
        for (var i = 0; i < this.villagers.length; i++) {
          if (this.villagers[i].name === evt.parameters.villagerName) {
            rem = i;
            this.villagers[i].dead = true;
            this.villagers[i].physics.body.x = 15000;
            break;
          }
        }
        if (rem) {
          this.villagers.splice(rem, 1);
        }
        _EventManager.EventMan.publish({ eventType: 'villagers_updated', parameters: { updateType: 'ritualized' } });
      }
    }
  }]);

  return VillagerIdentitySystemScript;
}(_Script2.Script);

exports.VillagerIdentitySystemScript = VillagerIdentitySystemScript;

},{"Entity":3,"Log":6,"Managers/EventManager":10,"Managers/ResourceManager":12,"Script":14,"Utils/NumUtil":41}],36:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VillagerRankingSystemScript = undefined;

var _Log = require('Log');

var _Script2 = require('Script');

var _EventManager = require('Managers/EventManager');

var _StringUtil = require('Utils/StringUtil');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VillagerRankingSystemScript = function (_Script) {
  _inherits(VillagerRankingSystemScript, _Script);

  function VillagerRankingSystemScript(parameters) {
    _classCallCheck(this, VillagerRankingSystemScript);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VillagerRankingSystemScript).call(this, parameters));

    _this.eventTypes.push('rank_change', 'rank_apply', 'villagers_updated');
    _this.rankChanges = [];
    _this.villagers = [];
    return _this;
  }

  _createClass(VillagerRankingSystemScript, [{
    key: 'init',
    value: function init(parent, rootEntity) {
      this.village = rootEntity.findEntityWithTag('village');
    }
  }, {
    key: 'update',
    value: function update(parent, rootEntity, delta) {}
  }, {
    key: 'applyRankChanges',
    value: function applyRankChanges() {
      var ranks = {};
      for (var i = 0; i < this.village.villagers.length; i++) {
        ranks[this.village.villagers[i].name] = i;
      }
      for (var i = 0; i < this.rankChanges.length; i++) {
        var rankChange = this.rankChanges[i];
        ranks[rankChange.villagerName] += rankChange.rankChange;
      }
      for (var i = 0; i < this.village.villagers.length; i++) {
        var name = this.village.villagers[i].name;
        _Log.log.debug(name + ' ' + ranks[name]);
      }
      this.villagers.sort(function (l, r) {
        return ranks[l.name] - ranks[r.name];
      });
      _EventManager.EventMan.publish({ eventType: 'rank_apply_end', parameters: { rankChanges: this.rankChanges } });
      this.rankChanges = [];
    }
  }, {
    key: 'findVillager',
    value: function findVillager(name) {
      return this.villagers[findVillagerIndex(name)];
    }
  }, {
    key: 'findVillagerIndex',
    value: function findVillagerIndex(name) {
      for (var i = 0; i < this.villagers.length; i++) {
        var v = this.villagers[i];
        if (v.name === name) {
          return i;
        }
      }
    }
  }, {
    key: 'handleGameEvent',
    value: function handleGameEvent(parent, evt) {
      if (evt.eventType === 'rank_change') {
        this.rankChanges.push({ villagerName: evt.parameters.villagerName, rankChange: evt.parameters.rankChange });
      } else if (evt.eventType === 'rank_apply_start') {
        this.applyRankChanges();
      } else if (evt.eventType === 'villagers_updated') {
        this.villagers = parent.villagers;
      }
    }
  }]);

  return VillagerRankingSystemScript;
}(_Script2.Script);

exports.VillagerRankingSystemScript = VillagerRankingSystemScript;

},{"Log":6,"Managers/EventManager":10,"Script":14,"Utils/StringUtil":42}],37:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.System = undefined;

var _Log = require('Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var System = function () {
  function System() {
    _classCallCheck(this, System);
  }

  _createClass(System, [{
    key: 'updateEntities',
    value: function updateEntities(entity, rootEntity, delta) {
      var _this = this;

      entity.children.forEach(function (child) {
        _this.updateEntities(child, rootEntity, delta);
      });
      this.applySystem(entity, rootEntity, delta);
    }
  }, {
    key: 'applySystem',
    value: function applySystem(entity, rootEntity, delta) {
      _Log.log.warn('System apply not defined');
    }
  }, {
    key: 'updateSystem',
    value: function updateSystem(rootEntity, delta) {}
  }, {
    key: 'update',
    value: function update(rootEntity, delta) {
      this.updateSystem(rootEntity, delta);
      this.updateEntities(rootEntity, rootEntity, delta);
    }
  }]);

  return System;
}();

exports.System = System;

},{"Log":6}],38:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventSystem = undefined;

var _System2 = require('System');

var _Log = require('Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventSystem = function (_System) {
  _inherits(EventSystem, _System);

  function EventSystem() {
    _classCallCheck(this, EventSystem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(EventSystem).apply(this, arguments));
  }

  _createClass(EventSystem, [{
    key: 'applySystem',
    value: function applySystem(entity, rootEntity, delta) {
      if (entity.handleEvents) {
        entity.handleEvents();
      }
    }
  }]);

  return EventSystem;
}(_System2.System);

exports.EventSystem = EventSystem;

},{"Log":6,"System":37}],39:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhysicsSystem = undefined;

var _System2 = require('System');

var _Log = require('Log');

var _config = require('config.json');

var _config2 = _interopRequireDefault(_config);

var _Physics = require('Physics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PhysicsSystem = function (_System) {
  _inherits(PhysicsSystem, _System);

  function PhysicsSystem() {
    var timeStep = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];
    var maxIPF = arguments.length <= 1 || arguments[1] === undefined ? 16 : arguments[1];
    var integrator = arguments.length <= 2 || arguments[2] === undefined ? 'verlet' : arguments[2];

    _classCallCheck(this, PhysicsSystem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PhysicsSystem).call(this));

    _this.world = new _Physics.Physics();
    // this.time = 0.0;
    // this.world = Physics({
    //   // set the timestep
    //   timestep: timeStep,
    //   // maximum number of iterations per step
    //   maxIPF: maxIPF,
    //   // set the integrator (may also be set with world.add())
    //   integrator: integrator,
    //   //Nothing sleeps
    //   sleepDisabled: true
    // });
    if (_config2.default.debugMode) _this.debug();
    return _this;
  }

  _createClass(PhysicsSystem, [{
    key: 'addEntity',
    value: function addEntity(entity) {
      if (entity.physics && entity.physics.body) {
        if (entity.physics.body.static) {
          this.world.staticBodies.push(entity.physics.body);
        } else if (entity.physics.body.trigger) {
          this.world.triggers.push(entity.physics.body);
        } else {
          this.world.dynamicBodies.push(entity.physics.body);
        }
      } else {
        _Log.log.debug('Cannot add to physics: entity does not have a body!');
      }
    }
  }, {
    key: 'debug',
    value: function debug() {
      this.world.addBehavior({
        vel: {
          x: 0,
          y: 0.0012
        }
      });
    }
  }, {
    key: 'applySystem',
    value: function applySystem(entity, rootEntity, delta) {
      if (entity.physics) {
        if (!entity.physics.inWorld) {
          // log.debug('Adding to world');
          this.world.addEntity(entity);
          entity.physics.inWorld = true;
          // log.debug(entity.physics.body.state);
        }
        // Update the position of the entity to that of the
        // body
        entity.position = {
          x: entity.physics.body.pos.x,
          y: entity.physics.body.pos.y
        };
      }
    }
  }, {
    key: 'updateSystem',
    value: function updateSystem(rootEntity, delta) {
      this.world.step(delta);
      // log.debug(this.world);
    }
  }]);

  return PhysicsSystem;
}(_System2.System);

exports.PhysicsSystem = PhysicsSystem;

},{"Log":6,"Physics":13,"System":37,"config.json":1}],40:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScriptSystem = undefined;

var _System2 = require('System');

var _Log = require('Log');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScriptSystem = function (_System) {
  _inherits(ScriptSystem, _System);

  function ScriptSystem() {
    _classCallCheck(this, ScriptSystem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ScriptSystem).apply(this, arguments));
  }

  _createClass(ScriptSystem, [{
    key: 'applySystem',
    value: function applySystem(entity, rootEntity, delta) {
      if (entity.scripts) {
        entity.scripts.forEach(function (scriptObj) {
          scriptObj.update(entity, rootEntity, delta);
        });
      }
    }
  }]);

  return ScriptSystem;
}(_System2.System);

exports.ScriptSystem = ScriptSystem;

},{"Log":6,"System":37}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function rand(range) {
  return Math.floor(Math.random() * range);
}

exports.rand = rand;

},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
window.WebFontConfig = {
  google: {
    families: ['Indie Flower', 'Arvo:700italic', 'Podkova:700']
  },

  active: function active() {
    // do something
    init();
  }
};

function populateTemplate(string, object) {
  var parts = string.split(' ');
  var popl = parts.map(function (word) {
    if (word[0] === '%') {
      var li = word.lastIndexOf('%');
      var sli = word.slice(1, li);
      return word.replace(/%.*%/, object[sli]);
    } else {
      return word;
    }
  });
  return popl.join(' ');
}

function testWhite(x) {
  var white = new RegExp(/^\s$/);
  return white.test(x.charAt(0));
}

function wordWrap(str, maxWidth) {
  var newLineStr = '\n';var done = false;var res = '';
  do {
    var found = false;
    // Inserts new line at first whitespace of the line
    for (var i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res = res + [str.slice(0, i), newLineStr].join('');
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    // Inserts new line at maxWidth position, the word is too long to wrap
    if (!found) {
      res += [str.slice(0, maxWidth), newLineStr].join('');
      str = str.slice(maxWidth);
    }

    if (str.length < maxWidth) done = true;
  } while (!done);

  return res + str;
}

exports.populateTemplate = populateTemplate;
exports.wordWrap = wordWrap;

},{}],43:[function(require,module,exports){
module.exports={

  "left": 37,
  "up": 38,
  "right": 39,
  "down": 40,
  "interact": 32
}

},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29uZmlnLmpzb24iLCJzcmMvanMvQ29sbGlzaW9uLmpzIiwic3JjL2pzL0VudGl0eS5qcyIsInNyYy9qcy9GYWN0b3J5LmpzIiwic3JjL2pzL0dhbWUuanMiLCJzcmMvanMvTG9nLmpzIiwic3JjL2pzL01haW4uanMiLCJzcmMvanMvTWFuYWdlci5qcyIsInNyYy9qcy9NYW5hZ2Vycy9BdWRpb01hbmFnZXIuanMiLCJzcmMvanMvTWFuYWdlcnMvRXZlbnRNYW5hZ2VyLmpzIiwic3JjL2pzL01hbmFnZXJzL0lucHV0TWFuYWdlci5qcyIsInNyYy9qcy9NYW5hZ2Vycy9SZXNvdXJjZU1hbmFnZXIuanMiLCJzcmMvanMvUGh5c2ljcy5qcyIsInNyYy9qcy9TY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9BbmltYXRpb25TY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9CdWxsZXRpbkJvYXJkU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvQ2FtZXJhU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvQ3Jpc2lzU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvRGFya2VuU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvRGF5TmlnaHRDeWNsZVNjcmlwdC5qcyIsInNyYy9qcy9TY3JpcHRzL0Rvb3JTY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9FdmVudFRpbWVyU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvRmFkZUluU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvSG91c2VDb250cm9sbGVyU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvSG91c2VTY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9Jbml0aWF0ZUNvbnZlcnNhdGlvblNjcmlwdC5qcyIsInNyYy9qcy9TY3JpcHRzL0ludHJvU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvSXRlbVN5c3RlbVNjcmlwdC5qcyIsInNyYy9qcy9TY3JpcHRzL01lc3NhZ2VCb3hTY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9Nb3ZlbWVudElucHV0U2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvUmFua0JvYXJkU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvU2NyaXB0cy5qcyIsInNyYy9qcy9TY3JpcHRzL1Rvc3NhYmxlU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvVmlsbGFnZXJBbmltYXRpb25TY3JpcHQuanMiLCJzcmMvanMvU2NyaXB0cy9WaWxsYWdlcklkZW50aXR5U3lzdGVtU2NyaXB0LmpzIiwic3JjL2pzL1NjcmlwdHMvVmlsbGFnZXJSYW5raW5nU3lzdGVtU2NyaXB0LmpzIiwic3JjL2pzL1N5c3RlbS5qcyIsInNyYy9qcy9TeXN0ZW1zL0V2ZW50U3lzdGVtLmpzIiwic3JjL2pzL1N5c3RlbXMvUGh5c2ljc1N5c3RlbS5qcyIsInNyYy9qcy9TeXN0ZW1zL1NjcmlwdFN5c3RlbS5qcyIsInNyYy9qcy9VdGlscy9OdW1VdGlsLmpzIiwic3JjL2pzL1V0aWxzL1N0cmluZ1V0aWwuanMiLCJzcmMva2V5cy5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0lDdkJNOzs7Ozs7O2lDQUVnQixHQUFHLEdBQUc7QUFDeEIsVUFBSSxhQUFhLEVBQUUsS0FBRixHQUFRLEdBQVIsQ0FETztBQUV4QixVQUFJLGNBQWMsRUFBRSxNQUFGLEdBQVMsR0FBVCxDQUZNO0FBR3hCLFVBQUksYUFBYSxFQUFFLEtBQUYsR0FBUSxHQUFSLENBSE87QUFJeEIsVUFBSSxjQUFjLEVBQUUsTUFBRixHQUFTLEdBQVQsQ0FKTTs7QUFNeEIs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RCxFQXJCc0I7O0FBdUIvQixTQUFPLE1BQU0sR0FBTixDQXZCd0I7Q0FBakM7O1FBMEJRO1FBQWtCOzs7QUN6RDFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiZnBzXCI6IDYwLFxuICBcImxvZ0xldmVsXCI6IDAsXG4gIFwiZGVidWdNb2RlXCI6dHJ1ZSxcbiAgXCJyZW5kZXJlclwiOntcbiAgICBcIm9wdGlvbnNcIjoge1xuICAgICAgXCJhbnRpYWxpYXNcIjogdHJ1ZSxcbiAgICAgIFwidHJhbnNwYXJlbnRcIjogZmFsc2VcbiAgICB9LFxuICAgIFwic2l6ZVwiOntcbiAgICAgIFwieFwiOjk2MCxcbiAgICAgIFwieVwiOjY0MFxuICAgIH1cbiAgfSxcbiAgXCJyZXNvdXJjZUxpc3RzXCI6W1xuICAgIFwicmVzL2ZpbGVsaXN0Lmpzb25cIlxuICBdLFxuICBcInN0YXRpY1Jlc291cmNlc1wiOltcbiAgICBcInJlcy9zcHJpdGUvc3ByaXRlLmpzb25cIixcbiAgICBcInJlcy9zb3VuZHMvc291bmRzLmpzb25cIlxuICBdLFxuICBcImF1ZGlvUmVzb3VyY2VzXCI6W1xuICAgIFwicmVzL3NvdW5kcy9zb3VuZHMuanNvblwiXG4gIF1cbn1cbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuXG5jbGFzcyBDb2xsaXNpb24ge1xuXG4gIHN0YXRpYyBhYWJiVGVzdEZhc3QoYSwgYikge1xuICAgIGxldCBhSGFsZldpZHRoID0gYS53aWR0aC8yLjA7XG4gICAgbGV0IGFIYWxmSGVpZ2h0ID0gYS5oZWlnaHQvMi4wO1xuICAgIGxldCBiSGFsZldpZHRoID0gYi53aWR0aC8yLjA7XG4gICAgbGV0IGJIYWxmSGVpZ2h0ID0gYi5oZWlnaHQvMi4wO1xuXG4gICAgbGV0IHhEaWYgPSBhLnBvcy54IC0gYi5wb3MueDtcbiAgICBsZXQgeURpZiA9IGEucG9zLnkgLSBiLnBvcy55O1xuXG4gICAgbGV0IGludGVyc2VjdFggPSBNYXRoLmFicyh4RGlmKSAtIChhSGFsZldpZHRoICsgYkhhbGZXaWR0aCk7XG4gICAgbGV0IGludGVyc2VjdFkgPSBNYXRoLmFicyh5RGlmKSAtIChhSGFsZkhlaWdodCArIGJIYWxmSGVpZ2h0KTtcblxuICAgIHJldHVybiBpbnRlcnNlY3RYIDwgMCAmJiBpbnRlcnNlY3RZIDwgMDtcbiAgfVxuXG4gIHN0YXRpYyBhYWJiVGVzdChhLCBiKSB7XG4gICAgbGV0IGFIYWxmV2lkdGggPSBhLndpZHRoLzIuMDtcbiAgICBsZXQgYUhhbGZIZWlnaHQgPSBhLmhlaWdodC8yLjA7XG5cbiAgICBsZXQgYkhhbGZXaWR0aCA9IGIud2lkdGgvMi4wO1xuICAgIGxldCBiSGFsZkhlaWdodCA9IGIuaGVpZ2h0LzIuMDtcblxuICAgIGxldCB4RGlmID0gYS5wb3MueCAtIGIucG9zLng7XG4gICAgbGV0IHlEaWYgPSBhLnBvcy55IC0gYi5wb3MueTtcblxuICAgIGxldCBpbnRlcnNlY3RYID0gTWF0aC5hYnMoeERpZikgLSAoYUhhbGZXaWR0aCArIGJIYWxmV2lkdGgpO1xuICAgIGxldCBpbnRlcnNlY3RZID0gTWF0aC5hYnMoeURpZikgLSAoYUhhbGZIZWlnaHQgKyBiSGFsZkhlaWdodCk7XG5cbiAgICBpZiAoaW50ZXJzZWN0WCA8IDAgJiYgaW50ZXJzZWN0WSA8IDApIHtcbiAgICAgIGlmIChNYXRoLmFicyhpbnRlcnNlY3RYKSA8IE1hdGguYWJzKGludGVyc2VjdFkpKSB7XG4gICAgICAgIHJldHVybiB7eDogaW50ZXJzZWN0WCAqIE1hdGguc2lnbih4RGlmKSwgeTogMH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge3g6IDAsIHk6IGludGVyc2VjdFkgKiBNYXRoLnNpZ24oeURpZil9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge3g6IDAsIHk6IDB9O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge0NvbGxpc2lvbn07XG4iLCJpbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtJbnB1dE1hbn0gZnJvbSAnTWFuYWdlcnMvSW5wdXRNYW5hZ2VyJztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQge1NjcmlwdHN9IGZyb20gJ1NjcmlwdHMvU2NyaXB0cyc7XG5pbXBvcnQgY2ZnIGZyb20gJ2NvbmZpZy5qc29uJztcbmltcG9ydCB7UGh5c2ljc30gZnJvbSAnUGh5c2ljcyc7XG5cbmNsYXNzIEVudGl0eSBleHRlbmRzIFBJWEkuQ29udGFpbmVyIHtcbiAgLyogVE9ETzogSG93IChhbmQgd2hlbikgaW5pdGlhbGl6ZSBzY3JpcHRzPyBOZWVkIHBsYW5uaW5nLlxuICBJdCBjYW50IGJlIGRvbmUgYXQgY29uc3RydWN0aW9uIHRpbWUsIGFzIHNjcmlwdCBtaWdodCBuZWVkIHRvIGZpbmQgb3RoZXIgZW50aXRpZXMuXG4gIEhvdyB0byBjb250cm9sIHNjdGlwdCBpbml0IGFuZCB1cGRhdGUgb3JkZXIuXG4gIENvdWxkIGBjb21wb25lbnRzYCBiZSBlbnRpcmVseSBzY3JhcGVkPyBMaWtlIHVuaXR5LCBjb21wb25lbnQgZGF0YSBjb3VsZCBiZSBpbiBzY3JpcHRzLlxuICBXb3VsZCB0aGlzIGJlIHVzZWZ1bC9lYXN5L21vcmUgY29udmVuaWVudD9cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihkYXRhKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMgPSBbXTtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICAgIHRoaXMuaXNBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMuc2NyaXB0cyA9IFtdO1xuICB9XG5cbiAgaW5pdChyb290RW50aXR5KXtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBpZihjaGlsZC5pbml0KSBjaGlsZC5pbml0KHJvb3RFbnRpdHkpO1xuICAgIH0pO1xuICAgIHRoaXMuc2NyaXB0cy5mb3JFYWNoKChzY3JpcHQpID0+IHtcbiAgICAgIHNjcmlwdC5pbml0KHRoaXMsIHJvb3RFbnRpdHkpO1xuICAgIH0pO1xuICAgIEV2ZW50TWFuLnJlZ2lzdGVyTGlzdGVuZXIodGhpcyk7XG4gIH1cblxuICAvLyBUT0RPOiBDaGVjayBpZiBldmVudCBpcyByZWxldmFudCB0byB0aGUgc2NyaXB0LlxuICBoYW5kbGVFdmVudHMoKSB7XG4gICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoZXZ0KSA9PiB7XG4gICAgICB0aGlzLnNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0KSA9PiB7XG4gICAgICAgIHNjcmlwdC5oYW5kbGVHYW1lRXZlbnQodGhpcywgZXZ0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMuZXZlbnRzID0gW107XG4gIH1cblxuICAvLyBmaW5kRW50aXR5V2l0aFRhZ3ModGFncyl7XG4gIC8vIH1cblxuICBmaW5kRW50aXRpZXNXaXRoVGFnKHRhZyl7XG5cbiAgICBpZih0aGlzLnRhZ3MuaW5kZXhPZih0YWcpID49IDApeyByZXR1cm4gW3RoaXNdOyB9XG4gICAgZWxzZSB7XG4gICAgICBsZXQgZW50cyA9IFtdO1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBmb3VuZCA9IFtdO1xuICAgICAgICBpZihjaGlsZC5maW5kRW50aXRpZXNXaXRoVGFnKXtcbiAgICAgICAgICBmb3VuZCA9IGNoaWxkLmZpbmRFbnRpdGllc1dpdGhUYWcodGFnKTtcbiAgICAgICAgICBmb3VuZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgZW50cy5wdXNoKGUpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGxvZy5kZWJ1Zyhmb3VuZC5mb3JFYWNoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVudHM7XG4gICAgfVxuICB9XG5cbiAgZmluZEVudGl0eVdpdGhUYWcodGFnKXtcbiAgICBsZXQgaW5kb2YgPSB0aGlzLnRhZ3MuaW5kZXhPZih0YWcpO1xuICAgIGlmKGluZG9mID49IDApeyByZXR1cm4gdGhpczsgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoO2krKyl7XG4gICAgICAgIGxldCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgIGxldCBmb3VuZDtcbiAgICAgICAgaWYoY2hpbGQuZmluZEVudGl0eVdpdGhUYWcpe1xuICAgICAgICAgIGZvdW5kID0gY2hpbGQuZmluZEVudGl0eVdpdGhUYWcodGFnKTtcbiAgICAgICAgfVxuICAgICAgICBpZihmb3VuZCl7XG4gICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZEVudGl0eVdpdGhOYW1lKG5hbWUpe1xuICAgIGlmKHRoaXMubmFtZSA9PT0gbmFtZSl7IHJldHVybiB0aGlzOyB9XG4gICAgZWxzZSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7aSsrKXtcbiAgICAgICAgbGV0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgbGV0IGZvdW5kO1xuICAgICAgICBpZihjaGlsZC5maW5kRW50aXR5V2l0aE5hbWUpe1xuICAgICAgICAgIGZvdW5kID0gY2hpbGQuZmluZEVudGl0eVdpdGhOYW1lKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGZvdW5kKXtcbiAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiBSZW1vdmUgZHVwbGljYXRlIGV2ZW50IHR5cGVzIChrZWVwIG9ubHkgdG9wbW9zdClcbiAgYWRkU2NyaXB0KHNjcmlwdE5hbWUsIHBhcmFtZXRlcnMpIHtcbiAgICBsZXQgc2NyaXB0ID0gbmV3IFNjcmlwdHNbc2NyaXB0TmFtZV0ocGFyYW1ldGVycyk7XG4gICAgdGhpcy5zY3JpcHRzLnB1c2goc2NyaXB0KTtcbiAgICBsZXQgZXZlbnRUeXBlcyA9IHNjcmlwdC5ldmVudFR5cGVzO1xuICAgIGV2ZW50VHlwZXMuZm9yRWFjaCgoZXZlbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChldmVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgYWRkRXZlbnQoZXZ0KSB7XG4gICAgdGhpcy5ldmVudHMucHVzaChldnQpO1xuICB9XG5cbiAgc2V0U3ByaXRlKHNwcml0ZU5hbWUpe1xuICAgIGlmKCF0aGlzLnNwcml0ZSl7XG4gICAgICB0aGlzLnNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZSgpO1xuICAgICAgdGhpcy5zcHJpdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAwLjUsXG4gICAgICAgIHk6IDAuNVxuICAgICAgfTtcbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5zcHJpdGUpO1xuICAgICAgbGV0IG9wdHMgPSB0aGlzLnNwcml0ZV9vcHRpb25zIHx8IHtcbiAgICAgICAgc2NhbGU6MSxcbiAgICAgICAgb2Zmc2V0OiB7XG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLnNwcml0ZS5zY2FsZS54ID0gb3B0cy5zY2FsZTtcbiAgICAgIHRoaXMuc3ByaXRlLnNjYWxlLnkgPSBvcHRzLnNjYWxlO1xuICAgICAgdGhpcy5zcHJpdGUucG9zaXRpb24gPSBvcHRzLm9mZnNldDtcblxuICAgICAgaWYodGhpcy5kZWJ1Z0dyYXBoaWNzKXtcbiAgICAgICAgdGhpcy5zd2FwQ2hpbGRyZW4odGhpcy5kZWJ1Z0dyYXBoaWNzLCB0aGlzLnNwcml0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc3ByaXRlLnRleHR1cmUgPSByZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzW3Nwcml0ZU5hbWVdO1xuICB9XG5cbiAgYWRkQm94KGNvbG9yLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgbGV0IGdyYXBoaWNzID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICBncmFwaGljcy5iZWdpbkZpbGwoY29sb3IpO1xuICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGdyYXBoaWNzLnBpdm90ID0ge1xuICAgICAgeDogd2lkdGgvMixcbiAgICAgIHk6IGhlaWdodC8yXG4gICAgfTtcblxuICAgIHRoaXMuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlbGxjYWZmZWluYXRlZC9QaHlzaWNzSlMvd2lraS9GdW5kYW1lbnRhbHMjdGhlLWZhY3RvcnktcGF0dGVyblxuICBhZGRQaHlzaWNzKGJvZHlUeXBlLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnBoeXNpY3MgPSB7XG4gICAgICBpbldvcmxkOiBmYWxzZSxcbiAgICAgIGJvZHk6IFBoeXNpY3MuYm9keShib2R5VHlwZSwgb3B0aW9ucylcbiAgICB9O1xuICB9XG5cbiAgYWRkRGVidWdHcmFwaGljcygpe1xuICAgIC8vIGxldCBwaHlzaWNzID0gdGhpcy5waHlzaWNzO1xuICAgIC8vIGlmKHBoeXNpY3Mpe1xuICAgIC8vICAgbGV0IGJvZHkgPSBwaHlzaWNzLmJvZHk7XG4gICAgLy8gICB0aGlzLmRlYnVnR3JhcGhpY3MgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgIC8vICAgbGV0IGNvbG9yID0gdGhpcy5jb2xsaWRlcl9jb2xvciB8fCAnMHhGRkZGRkYnO1xuICAgIC8vXG4gICAgLy8gICAvLyBsb2cuZGVidWcoYm9keSk7XG4gICAgLy8gICB0aGlzLmRlYnVnR3JhcGhpY3MuYmVnaW5GaWxsKGNvbG9yKTtcbiAgICAvLyAgIHRoaXMuZGVidWdHcmFwaGljcy5saW5lU3R5bGUoMiwgJzB4MDAwMDAwJyk7XG4gICAgLy8gICB0aGlzLmRlYnVnR3JhcGhpY3MuYWxwaGEgPSAwLjU7XG4gICAgLy8gICB0aGlzLmRlYnVnR3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgYm9keS53aWR0aCwgYm9keS5oZWlnaHQpO1xuICAgIC8vICAgdGhpcy5kZWJ1Z0dyYXBoaWNzLnBpdm90ID0ge1xuICAgIC8vICAgICB4OiBib2R5LndpZHRoLzIsXG4gICAgLy8gICAgIHk6IGJvZHkuaGVpZ2h0LzJcbiAgICAvLyAgIH07XG4gICAgLy8gICB0aGlzLmFkZENoaWxkKHRoaXMuZGVidWdHcmFwaGljcyk7XG4gICAgLy8gfVxuXG4gIH1cbiAgLypcbiAgICBVbnBhY2tzIGVudGl0eSBmcm9tIGNvbmZpZ3VyYXRpb24gZmlsZS4gTG9hZHMgY29uZmlnXG4gICAgQ29uZmlnIGZvcm1hdDpcbiAgICAgIC0gY29tcG9uZW50X2RhdGFcbiAgICAgICAgLSBXaWxsIGdvIHN0cmFpZ2h0IHRvIGVudGl0eS5cbiAgICAgICAgICBVc2VmdWwgd2hlbiBkZWZpbmluZyBjb21wb25lbnRzIHRoYXQgZG9udCBuZWVkIHRoZWlyIG93biBjb25maWcgZmlsZXNcbiAgICAgIC0gY29tcG9uZW50X2NvbmZpZ3VyYXRpb25cbiAgICAgICAgLSBIb2xkcyBhIGhhbmRsZSBmb3IgY29uZmlnIGZpbGUgdGhhdCBob2xkcyB0aGUgYWN0dWFsIGRhdGEuXG4gICAgICAgICAgVXNlZnVsIHdoZW4gYWN0dWFsIGNvbXBvbmVudCBkYXRhIGlzIGluIGFub3RoZXIgZmlsZS4gTGlrZSBhbmltYXRpb25zLlxuICAgIENyZWF0ZSBlbnRpdHkgd2l0aCB0aGlzIGFuZCBzZWUgaXRzIHN0cnVjdHVyZSBmb3IgbW9yZSBpbmZvLlxuICAqL1xuICBzdGF0aWMgZnJvbUNvbmZpZyhjb25maWdOYW1lKXtcbiAgICByZXR1cm4gRW50aXR5LmZyb21Db25maWdPYmoocmVzb3VyY2VzW2NvbmZpZ05hbWVdLmRhdGEpO1xuICB9XG5cbiAgc3RhdGljIGZyb21Db25maWdPYmooY29uZmlnKXtcbiAgICBjb25zdCBlbnQgPSBuZXcgRW50aXR5KCk7XG5cbiAgICAvLyBBc3NpZ24gY29tcG9uZW50X2RhdGEgdG8gZW50aXR5XG4gICAgT2JqZWN0LmFzc2lnbihlbnQsIGNvbmZpZy5jb21wb25lbnRfZGF0YSk7XG5cbiAgICAvLyBHZXQgZWFjaCBjb21wb25lbnRfY29uZmlndXJhdGlvbiBhbmQgc2V0IHRoZW0gdG8gZW50aXR5XG4gICAgY29uc3QgY29tcENvbmYgPSBjb25maWcuY29tcG9uZW50X2NvbmZpZ3VyYXRpb247XG4gICAgT2JqZWN0LmtleXMoY29tcENvbmYpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGVudFtrZXldID0gcmVzb3VyY2VzW2NvbXBDb25mW2tleV1dLmRhdGE7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwaHlzaWNzID0gY29uZmlnLnBoeXNpY3M7XG4gICAgaWYocGh5c2ljcyl7XG4gICAgICBlbnQuYWRkUGh5c2ljcyhwaHlzaWNzLmJvZHlUeXBlLCBwaHlzaWNzLm9wdGlvbnMpO1xuICAgICAgaWYoY2ZnLmRlYnVnTW9kZSkgZW50LmFkZERlYnVnR3JhcGhpY3MoKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JpcHRDb25mID0gY29uZmlnLnNjcmlwdHM7XG4gICAgc2NyaXB0Q29uZi5mb3JFYWNoKGNvbmYgPT4ge1xuICAgICAgY29uc3QgbmFtZSA9IGNvbmYubmFtZTtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNvbmYucGFyYW1ldGVycyB8fCB7fTtcbiAgICAgIGVudC5hZGRTY3JpcHQobmFtZSwgcGFyYW1zKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZW50O1xuICB9XG5cbiAgc3RhdGljIGZyb21UaWxlZE9iamVjdCh0aWxlZE9iail7XG4gICAgbGV0IHByb3BzID0gdGlsZWRPYmoucHJvcGVydGllcztcbiAgICBsZXQgY29uZmlnID0gcmVzb3VyY2VzW3Byb3BzLmNvbmZpZ10uZGF0YTtcblxuICAgIE9iamVjdC5hc3NpZ24oY29uZmlnLmNvbXBvbmVudF9kYXRhLCB0aWxlZE9iai5wcm9wZXJ0aWVzKTtcblxuICAgIGNvbmZpZy5jb21wb25lbnRfZGF0YS5uYW1lID0gdGlsZWRPYmoubmFtZTtcblxuICAgIGNvbmZpZy5waHlzaWNzLm9wdGlvbnMueCA9IHRpbGVkT2JqLnggKyB0aWxlZE9iai53aWR0aC8yO1xuICAgIGNvbmZpZy5waHlzaWNzLm9wdGlvbnMueSA9IHRpbGVkT2JqLnkgKyB0aWxlZE9iai5oZWlnaHQvMjtcbiAgICBjb25maWcucGh5c2ljcy5vcHRpb25zLndpZHRoID0gdGlsZWRPYmoud2lkdGg7XG4gICAgY29uZmlnLnBoeXNpY3Mub3B0aW9ucy5oZWlnaHQgPSB0aWxlZE9iai5oZWlnaHQ7XG5cbiAgICBsZXQgZW50ID0gRW50aXR5LmZyb21Db25maWdPYmooY29uZmlnKTtcbiAgICAvLyBsb2cuZGVidWcoZW50KTtcbiAgICByZXR1cm4gZW50O1xuICB9XG5cbn1cblxuZXhwb3J0IHtFbnRpdHl9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge0VudGl0eX0gZnJvbSAnRW50aXR5JztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCB7d29yZFdyYXB9IGZyb20gJ1V0aWxzL1N0cmluZ1V0aWwnO1xuXG5jbGFzcyBGYWN0b3J5IHtcblxuICAvLyBzdGF0aWMgYWRkU3ByaXRlKGVudCwgcHJpdGVOYW1lLCBvcHRzKSB7XG4gIC8vICAgbGV0IHNwcml0ZSA9IG5ldyBQSVhJLlNwaXRlKCk7XG4gIC8vICAgZW50LmFkZENoaWxkKHNwcml0ZSk7XG4gIC8vICAgc3ByaXRlLmFuY2hvciA9IHtcbiAgLy8gICAgIHg6IDAuNSxcbiAgLy8gICAgIHk6IDAuNVxuICAvLyAgIH07XG4gIC8vICAgc3ByaXRlLnNjYWxlLnggPSBvcHRzLnNjYWxlO1xuICAvLyAgIHNwcml0ZS5zY2FsZS55ID0gb3B0cy5zY2FsZTtcbiAgLy8gICBzcHJpdGUucG9zaXRpb24gPSBvcHRzLm9mZnNldDtcbiAgLy8gfVxuXG4gIHN0YXRpYyBjcmVhdGVTcGVlY2hCdWJibGUod2lkdGgsIGhlaWdodCwgYXJyb3dQb3MsIHRleHQsIHRpdGxlPScnLCB3cmFwPXRydWUsIGFycm93PXRydWUsIHdyYXBsZW49MzEpIHtcbiAgICBsZXQgYm94ID0gbmV3IEVudGl0eSgpO1xuICAgIGxldCBhZGRTcHJpdGUgPSAoc3ByaXRlTmFtZSwgb3B0cykgPT4ge1xuICAgICAgbGV0IHNwcml0ZSA9IG5ldyBQSVhJLlNwcml0ZSgpO1xuICAgICAgYm94LmFkZENoaWxkKHNwcml0ZSk7XG4gICAgICBzcHJpdGUuYW5jaG9yID0ge1xuICAgICAgICB4OiAwLjUsXG4gICAgICAgIHk6IDAuNVxuICAgICAgfTtcbiAgICAgIHNwcml0ZS5zY2FsZS54ID0gb3B0cy5zY2FsZTtcbiAgICAgIHNwcml0ZS5zY2FsZS55ID0gb3B0cy5zY2FsZTtcbiAgICAgIHNwcml0ZS5wb3NpdGlvbiA9IG9wdHMub2Zmc2V0O1xuICAgICAgc3ByaXRlLnRleHR1cmUgPSByZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzW3Nwcml0ZU5hbWVdO1xuICAgIH07XG5cbiAgICBsZXQgdGlsZVdpZHRoID0gMzI7XG4gICAgbGV0IHRpbGVIZWlnaHQgPSAzMjtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuICAgICAgICBsZXQgdCA9ICdzcHJpdGVfcGllY2VfNSc7XG4gICAgICAgIGlmICh4ID09PSAwKSB7XG4gICAgICAgICAgdCA9ICdzcHJpdGVfcGllY2VfNCc7XG4gICAgICAgICAgaWYgKHkgPT09IDApIHtcbiAgICAgICAgICAgIHQgPSAnc3ByaXRlX3BpZWNlXzEnO1xuICAgICAgICAgIH0gZWxzZSBpZiAoeSA9PT0gaGVpZ2h0IC0gMSkge1xuICAgICAgICAgICAgdCA9ICdzcHJpdGVfcGllY2VfNyc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHggPT09IHdpZHRoIC0gMSkge1xuICAgICAgICAgIHQgPSAnc3ByaXRlX3BpZWNlXzYnO1xuICAgICAgICAgIGlmICh5ID09PSAwKSB7XG4gICAgICAgICAgICB0ID0gJ3Nwcml0ZV9waWVjZV8zJztcbiAgICAgICAgICB9IGVsc2UgaWYgKHkgPT09IGhlaWdodCAtIDEpIHtcbiAgICAgICAgICAgIHQgPSAnc3ByaXRlX3BpZWNlXzknO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoeSA9PT0gMCkge1xuICAgICAgICAgICAgdCA9ICdzcHJpdGVfcGllY2VfMic7XG4gICAgICAgICAgfSBlbHNlIGlmICh5ID09PSBoZWlnaHQgLSAxKSB7XG4gICAgICAgICAgICB0ID0gdCA9ICdzcHJpdGVfcGllY2VfOCc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFkZFNwcml0ZSh0LCB7XG4gICAgICAgICAgc2NhbGU6IDAuMjYsXG4gICAgICAgICAgb2Zmc2V0OiB7XG4gICAgICAgICAgICB4OiB0aWxlV2lkdGggKiB4LFxuICAgICAgICAgICAgeTogdGlsZUhlaWdodCAqIHlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZihhcnJvdyl7XG4gICAgICBhZGRTcHJpdGUoJ3Nwcml0ZV9waWVjZV8xMScsIHtcbiAgICAgICAgc2NhbGU6IDAuMjYsXG4gICAgICAgIG9mZnNldDoge1xuICAgICAgICAgIHg6IHRpbGVXaWR0aCAqIGFycm93UG9zLFxuICAgICAgICAgIHk6IHRpbGVIZWlnaHQgKiBoZWlnaHRcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhZGRTcHJpdGUoJ3Nwcml0ZV9waWVjZV8xMCcsIHtcbiAgICAgICAgc2NhbGU6IDAuMjYsXG4gICAgICAgIG9mZnNldDoge1xuICAgICAgICAgIHg6IHRpbGVXaWR0aCAqIGFycm93UG9zLFxuICAgICAgICAgIHk6IHRpbGVIZWlnaHQgKiAoaGVpZ2h0IC0gMSlcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGxldCB0ZXh0V3JhcHBlZCA9IHRleHQ7XG4gICAgaWYgKHdyYXApIHRleHRXcmFwcGVkID0gd29yZFdyYXAodGV4dCwgd3JhcGxlbik7XG4gICAgbGV0IHRleHRPYmogPSBuZXcgUElYSS5UZXh0KHRleHRXcmFwcGVkLCB7Zm9udCA6ICcxOHB4IE1vbmFjbycsIGZpbGwgOiAweDEyMTIxMiwgYWxpZ24gOiAnbGVmdCd9KTtcbiAgICBpZiAodGl0bGUgIT09ICcnKSB7XG4gICAgICB0ZXh0T2JqLnBvc2l0aW9uLnkgPSAyMC4wO1xuICAgIH1cbiAgICBib3guYWRkQ2hpbGQodGV4dE9iaik7XG5cbiAgICBsZXQgdGl0bGVPYmogPSBuZXcgUElYSS5UZXh0KHRpdGxlLCB7Zm9udCA6ICdib2xkIDE4cHggTW9uYWNvJywgZmlsbCA6IDB4MDAwMDAwLCBhbGlnbiA6ICdsZWZ0J30pO1xuICAgIHRpdGxlT2JqLnBvc2l0aW9uLnkgPSAtNTtcbiAgICBib3guYWRkQ2hpbGQodGl0bGVPYmopO1xuXG4gICAgYm94LnBvc2l0aW9uLnggPSAtdGlsZVdpZHRoICogKGFycm93UG9zKSAtIDQ7XG4gICAgYm94LnBvc2l0aW9uLnkgPSAtaGVpZ2h0ICogKHRpbGVIZWlnaHQpIC0gMTY7XG5cbiAgICBsZXQgZW50ID0gbmV3IEVudGl0eSgpO1xuICAgIGVudC5zZXRUZXh0ID0gKG5ld1RleHQpID0+IHtcbiAgICAgIGlmICh3cmFwKSB7XG4gICAgICAgIHRleHRPYmoudGV4dCA9IHdvcmRXcmFwKG5ld1RleHQsIHdyYXBsZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dE9iai50ZXh0ID0gbmV3VGV4dDtcbiAgICAgIH1cbiAgICB9O1xuICAgIGVudC5hZGRDaGlsZChib3gpO1xuICAgIHJldHVybiBlbnQ7XG4gIH1cbn1cblxuZXhwb3J0IHtGYWN0b3J5fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHRTeXN0ZW19IGZyb20gJ1N5c3RlbXMvU2NyaXB0U3lzdGVtJztcbmltcG9ydCB7RXZlbnRTeXN0ZW19IGZyb20gJ1N5c3RlbXMvRXZlbnRTeXN0ZW0nO1xuaW1wb3J0IHtQaHlzaWNzU3lzdGVtfSBmcm9tICdTeXN0ZW1zL1BoeXNpY3NTeXN0ZW0nO1xuaW1wb3J0IHtFbnRpdHl9IGZyb20gJ0VudGl0eSc7XG5pbXBvcnQge1NjcmlwdHN9IGZyb20gJ1NjcmlwdHMvU2NyaXB0cyc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtyZXNvdXJjZXN9IGZyb20gJ01hbmFnZXJzL1Jlc291cmNlTWFuYWdlcic7XG5pbXBvcnQgY2ZnIGZyb20gJ2NvbmZpZy5qc29uJztcbmltcG9ydCB7RmFjdG9yeX0gZnJvbSAnRmFjdG9yeSc7XG5cbmNsYXNzIEdhbWUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsb2cuZGVidWcoJ0NPTlNUUlVDVE9SJyk7XG4gICAgdGhpcy5zdGFnZSA9IG5ldyBFbnRpdHkoKTtcbiAgICB0aGlzLndvcmxkID0gbmV3IEVudGl0eSgpO1xuICAgIHRoaXMud29ybGQudGFncy5wdXNoKCdwdXNoJyk7XG4gICAgdGhpcy53b3JsZC5hZGRTY3JpcHQoJ2NhbWVyYVNjcmlwdCcsIHt9KTtcbiAgICB0aGlzLnN0YWdlLmFkZENoaWxkKHRoaXMud29ybGQpO1xuXG5cbiAgICB0aGlzLnVpID0gbmV3IEVudGl0eSgpOyAvL25ldyBFbnRpdHkoJ2VudGl0eV91aScpO1xuXG4gICAgdGhpcy5zdGFnZS5hZGRDaGlsZCh0aGlzLnVpKTtcblxuICAgIHRoaXMuc3lzdGVtcyA9IFtdO1xuXG4gICAgbGV0IGV2ZW50U3lzdGVtID0gbmV3IEV2ZW50U3lzdGVtKCk7XG4gICAgdGhpcy5zeXN0ZW1zLnB1c2goZXZlbnRTeXN0ZW0pO1xuXG4gICAgbGV0IHBoeXNpY3NTeXN0ZW0gPSBuZXcgUGh5c2ljc1N5c3RlbSgpO1xuICAgIHRoaXMuc3lzdGVtcy5wdXNoKHBoeXNpY3NTeXN0ZW0pO1xuXG4gICAgbGV0IHNjcmlwdFN5c3RlbSA9IG5ldyBTY3JpcHRTeXN0ZW0oKTtcbiAgICB0aGlzLnN5c3RlbXMucHVzaChzY3JpcHRTeXN0ZW0pO1xuXG5cbiAgICBpZiAoY2ZnLmRlYnVnTW9kZSkge1xuICAgICAgbG9nLmRlYnVnKCdEZWJ1ZyBtb2RlIGlzIE9OJyk7XG4gICAgICB0aGlzLmRlYnVnQ29uc3RydWN0b3IoKTtcbiAgICB9XG4gIH1cblxuICBkZWJ1Z0NvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWRkRW50aXR5VG9Xb3JsZCh0aGlzLmxvYWRNYXAoJ3Rlc3RtYXAnKSk7XG5cbiAgICBsZXQgZmFkZSA9IG5ldyBFbnRpdHkoKTtcbiAgICBmYWRlLmFkZEJveCgweDAwMDAwMCwgY2ZnLnJlbmRlcmVyLnNpemUueCwgY2ZnLnJlbmRlcmVyLnNpemUueSk7XG4gICAgZmFkZS5wb3NpdGlvbi54ID0gY2ZnLnJlbmRlcmVyLnNpemUueCAvIDI7XG4gICAgZmFkZS5wb3NpdGlvbi55ID0gY2ZnLnJlbmRlcmVyLnNpemUueSAvIDI7XG4gICAgZmFkZS5hZGRTY3JpcHQoJ2ZhZGVJblNjcmlwdCcpO1xuXG4gICAgbGV0IGRhcmtlbiA9IG5ldyBFbnRpdHkoKTtcbiAgICBkYXJrZW4ucG9zaXRpb24ueCA9IGNmZy5yZW5kZXJlci5zaXplLnggLyAyO1xuICAgIGRhcmtlbi5wb3NpdGlvbi55ID0gY2ZnLnJlbmRlcmVyLnNpemUueSAvIDI7XG4gICAgZGFya2VuLnNldFNwcml0ZSgnc3ByaXRlX2RhcmtlbicpO1xuICAgIGRhcmtlbi5hZGRTY3JpcHQoJ2RhcmtlblNjcmlwdCcpO1xuXG4gICAgbGV0IGNsb2NrID0gbmV3IEVudGl0eSgpO1xuICAgIC8vIGNsb2NrLmFkZEJveCgweEZGRkZGRiwgNTAsIDUwKTtcbiAgICBjbG9jay5zZXRTcHJpdGUoJ2tlbGxvJyk7XG4gICAgbGV0IHRleHQgPSBuZXcgUElYSS5UZXh0KCdDbG9ja2FuIGlzIGt5bXBwaScse2ZvbnQgOiAnMjRweCBBcmlhbCcsIGZpbGwgOiAweDIyMjIyMiwgYWxpZ24gOiAnY2VudGVyJ30pO1xuICAgIHRleHQueCA9IC00MDtcbiAgICB0ZXh0LnkgPSAtMTM7XG4gICAgY2xvY2suYWRkQ2hpbGQodGV4dCk7XG4gICAgY2xvY2sucG9zaXRpb24ueCA9IGNmZy5yZW5kZXJlci5zaXplLnggLSAzMDtcbiAgICBjbG9jay5wb3NpdGlvbi55ID0gY2ZnLnJlbmRlcmVyLnNpemUueSAtIDMwO1xuICAgIGNsb2NrLmFkZFNjcmlwdCgnZGF5TmlnaHRDeWNsZVNjcmlwdCcpO1xuXG4gICAgbGV0IG1lc3NhZ2VCb3ggPSBuZXcgRW50aXR5KCk7XG4gICAgbWVzc2FnZUJveC5hZGRTY3JpcHQoJ21lc3NhZ2VCb3hTY3JpcHQnKTtcbiAgICBtZXNzYWdlQm94LnBvc2l0aW9uLnggPSA2MDtcbiAgICBtZXNzYWdlQm94LnBvc2l0aW9uLnkgPSA2NjU7XG5cbiAgICBsZXQgaW50cm8gPSBuZXcgRW50aXR5KCk7XG4gICAgaW50cm8uYWRkU2NyaXB0KCdpbnRyb1NjcmlwdCcpO1xuICAgIGludHJvLnBvc2l0aW9uLnggPSBjZmcucmVuZGVyZXIuc2l6ZS54IC8gMjtcbiAgICBpbnRyby5wb3NpdGlvbi55ID0gY2ZnLnJlbmRlcmVyLnNpemUueSAvIDIgKyAzMDtcbiAgICAvLyBsZXQgYnViYmxlID0gRmFjdG9yeS5jcmVhdGVTcGVlY2hCdWJibGUoMTAsIDMsIDYsICdUaGUgc2hvcnQgYnJvd24gbGl0dGxlIGZveCB0aGluZyBqdW1wZWQgb3ZlciB0aGUgbGF6eSBkb2cuJyk7XG4gICAgLy8gYnViYmxlLnBvc2l0aW9uLnggPSA0ODAgKyAyNTtcbiAgICAvLyBidWJibGUucG9zaXRpb24ueSA9IDMyMCAtIDYwO1xuICAgIC8vIHRoaXMuYWRkRW50aXR5VG9VSShidWJibGUpO1xuXG4gICAgbGV0IGV2ZW50VGltZXIgPSBuZXcgRW50aXR5KCk7XG4gICAgZXZlbnRUaW1lci5hZGRTY3JpcHQoJ2V2ZW50VGltZXJTY3JpcHQnKTtcbiAgICB0aGlzLmFkZEVudGl0eVRvV29ybGQoZXZlbnRUaW1lcik7XG5cbiAgICB0aGlzLmFkZEVudGl0eVRvVUkoZmFkZSk7XG4gICAgdGhpcy5hZGRFbnRpdHlUb1VJKGRhcmtlbik7XG4gICAgdGhpcy5hZGRFbnRpdHlUb1VJKGNsb2NrKTtcbiAgICB0aGlzLmFkZEVudGl0eVRvVUkobWVzc2FnZUJveCk7XG4gICAgdGhpcy5hZGRFbnRpdHlUb1VJKGludHJvKTtcbiAgICB0aGlzLnN0YWdlLmluaXQodGhpcy5zdGFnZSk7XG5cbiAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdpbnRybycsIHBhcmFtZXRlcnM6IHt9fSk7XG4gIH1cblxuICBhZGRFbnRpdHlUb1dvcmxkKGVudGl0eSkge1xuICAgIC8vIEV2ZW50TWFuLnJlZ2lzdGVyTGlzdGVuZXIoZW50aXR5KTtcbiAgICB0aGlzLndvcmxkLmFkZENoaWxkKGVudGl0eSk7XG4gIH1cblxuICBhZGRFbnRpdHlUb1VJKGVudGl0eSkge1xuICAgIC8vIEV2ZW50TWFuLnJlZ2lzdGVyTGlzdGVuZXIoZW50aXR5KTtcbiAgICB0aGlzLnVpLmFkZENoaWxkKGVudGl0eSk7XG4gIH1cblxuICB1cGRhdGUoZGVsdGEpIHtcbiAgICB0aGlzLnN5c3RlbXMuZm9yRWFjaCgoc3lzdGVtKSA9PiB7XG4gICAgICBzeXN0ZW0udXBkYXRlKHRoaXMud29ybGQsIGRlbHRhKTtcbiAgICAgIHN5c3RlbS51cGRhdGUodGhpcy51aSwgZGVsdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKHJlbmRlcmVyKSB7XG4gICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc3RhZ2UpO1xuICB9XG5cbiAgbG9hZE1hcChtYXBuYW1lKSB7XG4gICAgY29uc29sZS5sb2cocmVzb3VyY2VzKTtcbiAgICAvLyBsZXQgYSA9IHJlc291cmNlc1ttYXBuYW1lXS5kYXRhLnByb3BlcnRpZXMuY29uZmlnXG4gICAgLy8gY29uc29sZS5sb2coYSk7XG4gICAgbGV0IGVNYXAgPSBuZXcgRW50aXR5KCk7IC8vRW50aXR5LmZyb21Db25maWcoYSk7XG4gICAgbG9nLmRlYnVnKG1hcG5hbWUpO1xuICAgIHJlc291cmNlc1ttYXBuYW1lXS5kYXRhLmxheWVycy5mb3JFYWNoKGxheWVyID0+IHtcbiAgICAgIGxldCBlTGF5ZXIgPSBuZXcgRW50aXR5KCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhsYXllcik7XG4gICAgICBpZiAobGF5ZXIudHlwZSA9PT0gJ2ltYWdlbGF5ZXInKXtcbiAgICAgICAgbGV0IGltYWdlbmFtZSA9IGxheWVyLmltYWdlLnNwbGl0KCcuJylbMF07XG4gICAgICAgIGxldCBzcHJpdGUgPSBuZXcgUElYSS5TcHJpdGUoKTtcbiAgICAgICAgc3ByaXRlLnRleHR1cmUgPSByZXNvdXJjZXNbaW1hZ2VuYW1lXS50ZXh0dXJlO1xuICAgICAgICBlTGF5ZXIucG9zaXRpb24ueCA9IGxheWVyLm9mZnNldHggfHwgMDtcbiAgICAgICAgZUxheWVyLnBvc2l0aW9uLnkgPSBsYXllci5vZmZzZXR5IHx8IDA7XG4gICAgICAgIGVMYXllci5hZGRDaGlsZChzcHJpdGUpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAobGF5ZXIudHlwZSA9PT0gJ29iamVjdGdyb3VwJyl7XG4gICAgICAgIGxheWVyLm9iamVjdHMuZm9yRWFjaChvYmogPT4ge1xuICAgICAgICAgIGxldCBlT2JqID0gRW50aXR5LmZyb21UaWxlZE9iamVjdChvYmopO1xuICAgICAgICAgIGVMYXllci5hZGRDaGlsZChlT2JqKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlTWFwLmFkZENoaWxkKGVMYXllcik7XG4gICAgfSk7XG4gICAgbG9nLmRlYnVnKGVNYXApO1xuICAgIHJldHVybiBlTWFwO1xuICB9XG5cbn1cblxuZXhwb3J0IHtHYW1lfTtcbiIsImltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuXG5jb25zdCBsZXZlbHMgPSBuZXcgTWFwKFtcbiAgWzEsIFsnREVCVUcnLCAnY29sb3I6ICMyMkFBMjI7J11dLFxuICBbMiwgWydJTkZPICcsICdjb2xvcjogIzIyMjJBQTsnXV0sXG4gIFszLCBbJ1dBUk4gJywgJ2NvbG9yOiAjQ0M4ODIyOyddXSxcbiAgWzQsIFsnRVJST1InLCAnY29sb3I6ICNERDQ0MjI7J11dLFxuICBbNSwgWydGQVRBTCcsICdjb2xvcjogI0ZGMDAwMDsnXV1cbl0pO1xuXG5mdW5jdGlvbiBwcmludChtc2c9JycsIGxldmVsPTEpe1xuICBsZXZlbCA9IE1hdGgubWF4KDEsIE1hdGgubWluKDUsIGxldmVsKSk7XG4gIGlmKGxldmVsID49IGNmZy5sb2dMZXZlbCl7XG4gICAgY29uc3QgcHJvcCA9IGxldmVscy5nZXQobGV2ZWwpO1xuICAgIGNvbnNvbGUubG9nKGAlY1ske3Byb3BbMF19XTpgLCBwcm9wWzFdLCBtc2cpO1xuICB9XG59XG5cbmNvbnN0IGxvZyA9IHtcbiAgZGVidWc6IChtc2cpID0+IHsgcHJpbnQobXNnLCAxKTsgfSxcbiAgaW5mbzogIChtc2cpID0+IHsgcHJpbnQobXNnLCAyKTsgfSxcbiAgd2FybjogIChtc2cpID0+IHsgcHJpbnQobXNnLCAzKTsgfSxcbiAgZXJyb3I6IChtc2cpID0+IHsgcHJpbnQobXNnLCA0KTsgfSxcbiAgZmF0YWw6IChtc2cpID0+IHsgcHJpbnQobXNnLCA1KTsgfSxcbiAgcHJpbnQ6IHByaW50LFxuICB0ZXN0OiB0ZXN0XG59O1xuXG5mdW5jdGlvbiB0ZXN0KCl7XG4gIGxvZy5kZWJ1ZygnZGVidWcgbXNnJyk7XG4gIGxvZy5pbmZvKCdpbmZvIG1zZycpO1xuICBsb2cud2Fybignd2FybiBtc2cnKTtcbiAgbG9nLmVycm9yKCdlcnJvciBtc2cnKTtcbiAgbG9nLmZhdGFsKCdmYXRhbCBtc2cnKTtcbn1cbmV4cG9ydCB7bG9nfTtcbiIsImltcG9ydCB7SW5wdXRNYW59IGZyb20gJ01hbmFnZXJzL0lucHV0TWFuYWdlcic7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtBdWRpb01hbn0gZnJvbSAnTWFuYWdlcnMvQXVkaW9NYW5hZ2VyJztcbmltcG9ydCB7UmVzb3VyY2VNYW59IGZyb20gJ01hbmFnZXJzL1Jlc291cmNlTWFuYWdlcic7XG5cbmltcG9ydCB7cmVzb3VyY2VzfSBmcm9tICdNYW5hZ2Vycy9SZXNvdXJjZU1hbmFnZXInO1xuaW1wb3J0IHtTY3JpcHRzfSBmcm9tICdTY3JpcHRzL1NjcmlwdHMnO1xuaW1wb3J0IHtFbnRpdHl9IGZyb20gJ0VudGl0eSc7XG5pbXBvcnQge0dhbWV9IGZyb20gJ0dhbWUnO1xuaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5cbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuXG5cbi8vIFBpeGkgc2V0dXBcblBJWEkudXRpbHMuX3NhaWRIZWxsbyA9IHRydWU7IC8vIEtlZXAgY29uc29sZSBjbGVhblxuLy8gUElYSS5TQ0FMRV9NT0RFUy5ERUZBVUxUID0gUElYSS5TQ0FMRV9NT0RFUy5ORUFSRVNUO1xuXG4vLyBSZW5kZXJlclxuY29uc3QgcmVkT3B0ID0gY2ZnLnJlbmRlcmVyLm9wdGlvbnM7XG4vLyByZWRPcHQucmVzb2x1dGlvbiA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG5yZWRPcHQucmVzb2x1dGlvbiA9IDE7XG5jb25zdCByZW5kZXJlciA9IFBJWEkuYXV0b0RldGVjdFJlbmRlcmVyKGNmZy5yZW5kZXJlci5zaXplLngsIGNmZy5yZW5kZXJlci5zaXplLnksIHJlZE9wdCk7XG5yZW5kZXJlci5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcbi8vIE1hbmFnZXJzXG4vKiBUT0RPOiBGaWd1cmUgb3V0IHdheSB0byBwcmlvcml0aXplIG1hbmFnZXIgaW5pdC5cbk5vdyByZXNtYW4gaW5pdCBpcyBjYWxsZWQgYmVmb3JlIGFueXRoaW5nIGVsc2UgbWFudWFsbHkuXG5MdWNraWx5LCByZXNtYW4gZG9lcyBub3QgbmVlZCB0byB1cGRhdGUgaXRzZWxmLiAqL1xuY29uc3QgbWFuYWdlcnMgPSBbXG4gIElucHV0TWFuLFxuICBFdmVudE1hbixcbiAgQXVkaW9NYW5cbl07XG5cbi8vIFN0YWdlXG5sZXQgZ2FtZTtcblxuLy8gVGltZXNcbmNvbnN0IGxvb3BJbnRlcnZhbCA9IDEwMDAgLyBjZmcuZnBzO1xubGV0IGxhc3RGcmFtZSA9IDA7XG5cbi8vIE1haW4gZW50cnlcbmZ1bmN0aW9uIG1haW4oKSB7XG4gIGxvZy5pbmZvKGBUYXJnZXQgZnBzOiAke2NmZy5mcHN9YCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIudmlldyk7XG5cbiAgUmVzb3VyY2VNYW4uaW5pdCgpLnRoZW4oKCkgPT4ge1xuICAgIGNvbnN0IG1hblByb21pc2VzID0gbWFuYWdlcnMubWFwKG1hbiA9PiBtYW4uaW5pdCgpKTtcblxuICAgIFByb21pc2UuYWxsKG1hblByb21pc2VzKS50aGVuKGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgbWFuYWdlcnMuZm9yRWFjaChtYW4gPT57XG4gICAgICAgIEV2ZW50TWFuLnJlZ2lzdGVyTGlzdGVuZXIobWFuKTtcbiAgICAgIH0pO1xuICAgICAgLy8gQWxsIG1hbmdlciBpbml0cyBhcmUgZG9uZSwgc3RhcnQgdGhlIGdhbWUhXG4gICAgICBpbml0UmVhZHkoKTtcbiAgICB9KTtcbiAgfSk7XG5cbn1cblxuZnVuY3Rpb24gaW5pdFJlYWR5KCkge1xuICBsb2cuaW5mbygnSW5pdGlhbGl6YXRpb24gcmVhZHkhJyk7XG4gIC8vY29uc29sZS5jbGVhcigpOyAvLyBDbGVhcnMgdGhlIGNvbnNvbGUuXG4gIGdhbWUgPSBuZXcgR2FtZSgpO1xuICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdhdWRpb19tdXNpY19wbGF5JywgcGFyYW1ldGVyczoge2F1ZGlvOidhdWRpb19tdXNpY19pbnRlcmlvcid9fSk7XG4gIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ2F1ZGlvX3NvdW5kX3BsYXknLCBwYXJhbWV0ZXJzOiB7YXVkaW86J2F1ZGlvX3NoZWVwJ319KTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xufVxuXG5sZXQgZGVsdGEgPSAwO1xuZnVuY3Rpb24gbG9vcChjdGltZSkge1xuICBkZWx0YSArPSBjdGltZSAtIGxhc3RGcmFtZTtcblxuICAvLyBVc2UgY291bnQgdG8gbGltaXQgbnVtYmVyIG9mIGFjY3VtdWxhdGVkIGZyYW1lc1xuICBsZXQgY291bnQgPSAwO1xuICB3aGlsZSAoZGVsdGEgPiBsb29wSW50ZXJ2YWwgJiYgY291bnQgPCAzKSB7XG4gICAgY291bnQrKztcbiAgICB1cGRhdGUobG9vcEludGVydmFsKTtcbiAgICBkZWx0YSAtPSBsb29wSW50ZXJ2YWw7XG4gICAgZHJhdygpO1xuICAgIG1hbmFnZXJzLmZvckVhY2goKG1hbikgPT4ge1xuICAgICAgbWFuLnVwZGF0ZSgpO1xuICAgIH0pO1xuICB9XG4gIGlmIChjb3VudCA9PSAzKSB7XG4gICAgZGVsdGEgPSAwO1xuICB9XG4gIGxhc3RGcmFtZSA9IGN0aW1lO1xuXG4gIC8vIGlmKGN0aW1lIC0gbGFzdEZyYW1lID4gbG9vcEludGVydmFsKSB7XG4gIC8vICAgbGFzdEZyYW1lID0gY3RpbWU7XG4gIC8vICAgdXBkYXRlKGRlbHRhKTtcbiAgLy8gICBkcmF3KCk7XG4gIC8vICAgSW5wdXQudXBkYXRlKCk7XG4gIC8vICAgRXZlbnRNYW5hZ2VyLmRlbGVnYXRlRXZlbnRzKCk7XG4gIC8vIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUoZGVsdGEpIHtcbiAgZ2FtZS51cGRhdGUoZGVsdGEpO1xufVxuXG5mdW5jdGlvbiBkcmF3KCkge1xuICBnYW1lLnJlbmRlcihyZW5kZXJlcik7XG59XG5cbm1haW4oKTsgLy8gTWFpbiBlbnRyeVxuIiwiXG5jbGFzcyBNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLmV2ZW50VHlwZXMgPSBbXTtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICB9XG5cbiAgLy8gUnVuIGF0IGdhbWUgaW5pdC4gUmV0dXJucyBwcm9taXNlIVxuICBpbml0KCl7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+e1xuICAgICAgcmVzb2x2ZSgnRGVmYXVsdCBtYW5hZ2VyIGluaXQgZG9uZSEnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLy8gUnVuIGVhY2ggZnJhbWUuXG4gIHVwZGF0ZSgpe1xuICAgIHRoaXMuaGFuZGxlRXZlbnRzKCk7XG4gIH1cblxuICBhZGRFdmVudChldnQpIHtcbiAgICB0aGlzLmV2ZW50cy5wdXNoKGV2dCk7XG4gIH1cblxuICBoYW5kbGVFdmVudHMoKSB7XG4gICAgdGhpcy5ldmVudHMuZm9yRWFjaCgoZXZ0KSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNpbmdsZUV2ZW50KGV2dCk7XG4gICAgfSk7XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgfVxuXG4gIGhhbmRsZVNpbmdsZUV2ZW50KGV2dCkge31cblxufVxuZXhwb3J0e01hbmFnZXJ9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuaW1wb3J0IHtNYW5hZ2VyfSBmcm9tICdNYW5hZ2VyJztcblxuY2xhc3MgQXVkaW9NYW5hZ2VyIGV4dGVuZHMgTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5ldmVudFR5cGVzID0gWydhdWRpbyddO1xuICAgIHRoaXMubXVzaWNpZCA9IC0xO1xuICAgIHRoaXMuc291bmRpZCA9IC0xO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHNvdW5kQ29uZmlnID0gcmVzb3VyY2VzLnNvdW5kcy5kYXRhO1xuXG4gICAgICBsZXQgcmVhZHkgPSBmdW5jdGlvbigpe1xuICAgICAgICByZXNvbHZlKCdBdWRpbyBtYW5hZ2VyIGluaXQgZG9uZSEnKTtcbiAgICAgIH07XG4gICAgICAvLyBQYXRocyBhcmUganVzdCBmaWxlbmFtZXMuIFRoaXMgYWRkcyByZXN0IG9mIHRoZSBwYXRoXG4gICAgICBsZXQgZml4ZWRVcmxzID0gc291bmRDb25maWcudXJscy5tYXAoKGUpID0+ICdyZXMvc291bmRzLycgKyBlKTtcbiAgICAgIHRoaXMuaG93bCA9IG5ldyBIb3dsKHtcbiAgICAgICAgc3JjOiBmaXhlZFVybHMsXG4gICAgICAgIHNwcml0ZTogc291bmRDb25maWcuc3ByaXRlLFxuICAgICAgICAvLyBodG1sNTogdHJ1ZSxcbiAgICAgICAgcHJlbG9hZDogdHJ1ZSxcbiAgICAgICAgb25sb2FkOiByZWFkeVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGhhbmRsZVNpbmdsZUV2ZW50KGV2dCkge1xuICAgIGxldCBzcHJpdGVOYW1lID0gZXZ0LnBhcmFtZXRlcnMuYXVkaW87XG5cbiAgICBpZihldnQuZXZlbnRUeXBlID09ICdhdWRpb19zb3VuZF9wbGF5Jyl7XG4gICAgICBpZih0aGlzLnNvdW5kaWQgPj0gMCApe1xuICAgICAgICB0aGlzLmhvd2wuc3RvcCh0aGlzLnNvdW5kaWQpO1xuICAgICAgfVxuICAgICAgdGhpcy5zb3VuZGlkID0gdGhpcy5ob3dsLnBsYXkoc3ByaXRlTmFtZSk7XG4gICAgfVxuICAgIGVsc2UgaWYoZXZ0LmV2ZW50VHlwZSA9PSAnYXVkaW9fbXVzaWNfcGxheScpe1xuICAgICAgaWYodGhpcy5tdXNpY2lkID49IDAgKXtcbiAgICAgICAgdGhpcy5ob3dsLnN0b3AodGhpcy5tdXNpY2lkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubXVzaWNpZCA9IHRoaXMuaG93bC5wbGF5KHNwcml0ZU5hbWUpO1xuICAgIH1cblxuICB9XG5cbn1cbmNvbnN0IEF1ZGlvTWFuID0gbmV3IEF1ZGlvTWFuYWdlcigpO1xuXG5leHBvcnQge0F1ZGlvTWFufTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtNYW5hZ2VyfSBmcm9tICdNYW5hZ2VyJztcblxuY2xhc3MgRXZlbnRNYW5hZ2VyIGV4dGVuZHMgTWFuYWdlcntcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGlzdGVuZXJzID0ge1xuICAgICAgbGlzdGVuZXJzOiBbXVxuICAgIH07XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgfVxuXG4gIC8vIFRPRE86IFRlc3Qgb3B0aW1pemVFdmVudFR5cGVzIG1ldGhvZFxuICBvcHRpbWl6ZUV2ZW50VHlwZXMoZXZlbnRUeXBlcykge1xuICAgIGxldCByZXN1bHRzID0gW107XG4gICAgaWYgKGV2ZW50VHlwZXMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHNvcnRlZCA9IGV2ZW50VHlwZXMuc29ydCgpO1xuICAgICAgbGV0IGNoZWNrID0gc29ydGVkWzBdO1xuICAgICAgcmVzdWx0cy5wdXNoKGNoZWNrKTtcbiAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc29ydGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBvdGhlciA9IHNvcnRlZFtpXTtcbiAgICAgICAgbGV0IHN1YnMgPSBvdGhlci5zdWJzdHIoMCwgY2hlY2subGVuZ3RoKTtcbiAgICAgICAgaWYgKHN1YnMgIT09IGNoZWNrKSB7XG4gICAgICAgICAgY2hlY2sgPSBvdGhlcjtcbiAgICAgICAgICByZXN1bHRzLnB1c2goY2hlY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgcmVnaXN0ZXJMaXN0ZW5lcihsaXN0ZW5lcikge1xuICAgIGxldCBldmVudFR5cGVzID0gdGhpcy5vcHRpbWl6ZUV2ZW50VHlwZXMobGlzdGVuZXIuZXZlbnRUeXBlcyk7XG4gICAgZXZlbnRUeXBlcy5mb3JFYWNoKChldmVudFR5cGUpID0+IHtcbiAgICAgIGxldCBzID0gZXZlbnRUeXBlLnNwbGl0KCdfJyk7XG4gICAgICBsZXQgcm9vdCA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBrZXkgPSBzW2ldO1xuICAgICAgICBpZiAoIXJvb3Rba2V5XSkge1xuICAgICAgICAgIHJvb3Rba2V5XSA9IHtcbiAgICAgICAgICAgIGxpc3RlbmVyczogW11cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJvb3QgPSByb290W2tleV07XG4gICAgICB9XG4gICAgICByb290Lmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1Ymxpc2goZXZlbnQpIHtcbiAgICB0aGlzLmV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgfVxuXG4gIHVwZGF0ZSgpe1xuICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIGRlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBsZXQgZXZlbnRUeXBlID0gZXZlbnQuZXZlbnRUeXBlO1xuICAgICAgbGV0IHMgPSBldmVudFR5cGUuc3BsaXQoJ18nKTtcbiAgICAgIGxldCByb290ID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICByb290Lmxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIuYWRkRXZlbnQoZXZlbnQpKTtcblxuICAgICAgY29uc3QgYWRkRXZlbnQgPSAobGlzdGVuZXIpID0+IGxpc3RlbmVyLmFkZEV2ZW50KGV2ZW50KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQga2V5ID0gc1tpXTtcbiAgICAgICAgaWYgKCFyb290W2tleV0pIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByb290ID0gcm9vdFtrZXldO1xuICAgICAgICByb290Lmxpc3RlbmVycy5mb3JFYWNoKGFkZEV2ZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICB9XG5cbiAgLy8gVE9ETzogSW1wbGVtZW50IHJlbW92ZUxpc3RlbmVyIGluIEV2ZW50TWFuYWdlclxuICByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlbW92ZSBMaXN0ZW5lciBub3QgaW1wbGVtZW50ZWQhJyk7XG4gIH1cbn1cblxuY29uc3QgRXZlbnRNYW4gPSBuZXcgRXZlbnRNYW5hZ2VyKCk7XG5cbmV4cG9ydCB7RXZlbnRNYW59O1xuIiwiaW1wb3J0IGtleWNmZyBmcm9tICdrZXlzLmpzb24nO1xuaW1wb3J0IHtNYW5hZ2VyfSBmcm9tICdNYW5hZ2VyJztcblxuY2xhc3MgSW5wdXRNYW5hZ2VyIGV4dGVuZHMgTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmtleURvd24gPSB7fTtcbiAgICB0aGlzLmtleVByZXNzZWQgPSB7fTtcbiAgICB0aGlzLmtleVJlbGVhc2VkID0ge307XG4gIH1cblxuICBpbml0KCl7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5rZXlzID0gbmV3IE1hcCggT2JqZWN0LmtleXMoa2V5Y2ZnKS5tYXAoa2V5ID0+IHtcbiAgICAgICAgICByZXR1cm4gW2tleWNmZ1trZXldLCBrZXldO1xuICAgICAgICB9KSk7XG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHRoaXMuc2V0S2V5U3RhdGUoZSwgdHJ1ZSksIGZhbHNlKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB0aGlzLnNldEtleVN0YXRlKGUsIGZhbHNlKSwgZmFsc2UpO1xuXG4gICAgICByZXNvbHZlKCdJbnB1dCBtYW5hZ2VyIGluaXQgZG9uZSEnKTtcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBzZXRLZXlTdGF0ZShldiwgc3RhdGUpIHtcbiAgICBjb25zdCBjb2RlID0gZXYud2hpY2g7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5rZXlzLmdldChjb2RlKTtcbiAgICBpZihrZXkpIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYoIHRoaXMua2V5RG93bltrZXldICE9IHN0YXRlICkge1xuICAgICAgdGhpcy5rZXlEb3duW2tleV0gPSBzdGF0ZTtcbiAgICAgIGlmKHN0YXRlKXtcbiAgICAgICAgdGhpcy5rZXlQcmVzc2VkW2tleV0gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5rZXlSZWxlYXNlZFtrZXldID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGUoKXtcbiAgICAvKlRPRE86IEVuc3VyZSBpbnB1dCBzdGF5cyBjb25zdGFudCB0aHJvdWdob3V0IGdhbWUgdXBkYXRlLlxuICAgIEtleWRvd24gYW5kIGtleXVwIGV2ZW50cyB3aWxsIHRyaWdnZXIgZXZlbiB3aGVuIGdhbWUgaXMgdXBkYXRpbmcuKi9cbiAgICB0aGlzLmtleVByZXNzZWQgPSB7fTtcbiAgICB0aGlzLmtleVJlbGVhc2VkID0ge307XG4gIH1cblxufVxuXG5jb25zdCBJbnB1dE1hbiA9IG5ldyBJbnB1dE1hbmFnZXIoKTtcblxuZXhwb3J0IHtJbnB1dE1hbn07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuaW1wb3J0IHtNYW5hZ2VyfSBmcm9tICdNYW5hZ2VyJztcblxuY2xhc3MgUmVzb3VyY2VNYW5hZ2VyIGV4dGVuZHMgTWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3IoKXtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubG9hZEJhckxlbiA9IDEwO1xuICAgIHRoaXMubG9hZGVyID0gUElYSS5sb2FkZXI7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB0aGlzLmxvYWRlci5yZXNvdXJjZXM7XG4gIH1cblxuICBpbml0KCl7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJlYWR5ID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCdSZXNvdXJjZSBtYW5hZ2VyIGluaXQgZG9uZSEnKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGVycm9yID0gKGEsYixjKSA9PiB7XG4gICAgICAgIGxvZy5lcnJvcihhKTtcbiAgICAgICAgbG9nLmVycm9yKGIpO1xuICAgICAgICBsb2cuZXJyb3IoYyk7XG4gICAgICAgIHJlamVjdCgnUmVzb3VyY2UgbWFuYWdlciBpbml0IEVSUk9SIScpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGZpbGVsaXN0TG9hZGVyID0gbmV3IFBJWEkubG9hZGVycy5Mb2FkZXIoKTtcblxuICAgICAgT2JqZWN0LmtleXMoY2ZnLnJlc291cmNlTGlzdHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgZmlsZWxpc3RMb2FkZXIuYWRkKGNmZy5yZXNvdXJjZUxpc3RzW2tleV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGZpbGVsaXN0TG9hZGVyLm9uKCdwcm9ncmVzcycsIChhLGIpID0+IHRoaXMubG9hZFByb2dyZXNzKGEsYiwnRmlsZWxpc3QnKSk7XG4gICAgICBmaWxlbGlzdExvYWRlci5vbignZXJyb3InLCBlcnJvcik7XG5cbiAgICAgIGZpbGVsaXN0TG9hZGVyLm9uY2UoJ2NvbXBsZXRlJywgKGxkciwgcmVzKSA9PiB7XG5cbiAgICAgICAgT2JqZWN0LmtleXMocmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgcmVzW2tleV0uZGF0YS5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIuYWRkKHRoaXMuZ2V0TmFtZShwYXRoKSwgcGF0aCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNmZy5zdGF0aWNSZXNvdXJjZXMuZm9yRWFjaCggcGF0aCA9PiB7XG4gICAgICAgICAgdGhpcy5sb2FkZXIuYWRkKHRoaXMuZ2V0TmFtZShwYXRoKSwgcGF0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubG9hZGVyLm9uKCdwcm9ncmVzcycsIChhLGIpID0+IHRoaXMubG9hZFByb2dyZXNzKGEsYiwnUmVzb3VyY2UnKSk7XG4gICAgICAgIHRoaXMubG9hZGVyLm9uKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgdGhpcy5sb2FkZXIub25jZSgnY29tcGxldGUnLCByZWFkeSk7XG4gICAgICAgIHRoaXMubG9hZGVyLmxvYWQoKTtcbiAgICAgIH0pO1xuICAgICAgZmlsZWxpc3RMb2FkZXIubG9hZCgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG5cbiAgfVxuXG4gIGdldE5hbWUocGF0aCl7XG4gICAgcmV0dXJuIHBhdGguc3BsaXQoJ1xcXFwnKS5wb3AoKS5zcGxpdCgnLycpLnBvcCgpLnNwbGl0KCcuJylbMF07XG4gIH1cblxuICBsb2FkUHJvZ3Jlc3MobGRyLCByZXMsIGhlYWRlcil7XG4gICAgbGV0IHAgPSBsZHIucHJvZ3Jlc3M7XG4gICAgbGV0IHJlYWR5ID0gTWF0aC5mbG9vcih0aGlzLmxvYWRCYXJMZW4gKiAoTWF0aC5mbG9vcihwKSAvIDEwMCkpO1xuICAgIGxldCBpID0gJz0nLnJlcGVhdChyZWFkeSkgKyAnICcucmVwZWF0KHRoaXMubG9hZEJhckxlbiAtIHJlYWR5KTtcbiAgICBsZXQgc3RyID0gYCR7aGVhZGVyfSBwcm9ncmVzcyBbJHtpfV0gJHtNYXRoLmZsb29yKHApfSVgO1xuICAgIGxvZy5pbmZvKHN0cik7XG4gIH1cblxufVxuXG5jb25zdCBSZXNvdXJjZU1hbiA9IG5ldyBSZXNvdXJjZU1hbmFnZXIoKTtcbmNvbnN0IHJlcyA9IFJlc291cmNlTWFuLnJlc291cmNlcztcblxuZXhwb3J0IHtSZXNvdXJjZU1hbiwgcmVzIGFzIHJlc291cmNlc307XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24nO1xuXG5jbGFzcyBQaHlzaWNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5keW5hbWljQm9kaWVzID0gW107XG4gICAgdGhpcy5zdGF0aWNCb2RpZXMgPSBbXTtcbiAgICB0aGlzLnRyaWdnZXJzID0gW107XG4gICAgdGhpcy5iZWhhdmlvcnMgPSBbXTtcbiAgfVxuXG4gIGNvcHlCb2R5KGZyb20sIHRvKSB7XG4gICAgalF1ZXJ5LmV4dGVuZCh0cnVlLCB0bywgZnJvbSk7XG4gIH1cblxuICBjaGVja0NvbGxpc2lvbkZhc3QoYm9keSwgZGVsdGEpIHtcbiAgICBsZXQgbmV3Qm9keSA9IHt9O1xuICAgIHRoaXMuY29weUJvZHkoYm9keSwgbmV3Qm9keSk7XG4gICAgbmV3Qm9keS5wb3MueCArPSBuZXdCb2R5LnZlbC54ICogZGVsdGE7XG4gICAgbmV3Qm9keS5wb3MueSArPSBuZXdCb2R5LnZlbC55ICogZGVsdGE7XG5cbiAgICB0aGlzLmJlaGF2aW9ycy5mb3JFYWNoKChiZWhhdmlvcikgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGJlaGF2aW9yKSB7XG4gICAgICAgIG5ld0JvZHlba2V5XS54ICs9IGJlaGF2aW9yW2tleV0ueCAqIGRlbHRhO1xuICAgICAgICBuZXdCb2R5W2tleV0ueSArPSBiZWhhdmlvcltrZXldLnkgKiBkZWx0YTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBjb2xsaWRlZCA9IHRoaXMuc3RhdGljQm9kaWVzLmZpbmQoKHN0YXRpY0JvZCkgPT4ge1xuICAgICAgcmV0dXJuIENvbGxpc2lvbi5hYWJiVGVzdEZhc3QobmV3Qm9keSwgc3RhdGljQm9kKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29sbGlkZWQ7XG4gIH1cblxuICBsZW5ndGhTcXVhcmVkKHYpIHtcbiAgICByZXR1cm4gdi54ICogdi54ICsgdi55ICogdi55O1xuICB9XG5cbiAgY2hlY2tDb2xsaXNpb24oYm9keSwgZGVsdGEpIHtcbiAgICBsZXQgbmV3Qm9keSA9IHt9O1xuICAgIHRoaXMuY29weUJvZHkoYm9keSwgbmV3Qm9keSk7XG4gICAgaWYgKCFuZXdCb2R5LmZyZWV6ZS54KSB7XG4gICAgICBuZXdCb2R5LnBvcy54ICs9IG5ld0JvZHkudmVsLnggKiBkZWx0YTtcbiAgICB9XG4gICAgaWYgKCFuZXdCb2R5LmZyZWV6ZS55KSB7XG4gICAgICBuZXdCb2R5LnBvcy55ICs9IG5ld0JvZHkudmVsLnkgKiBkZWx0YTtcbiAgICB9XG5cbiAgICB0aGlzLmJlaGF2aW9ycy5mb3JFYWNoKChiZWhhdmlvcikgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIGJlaGF2aW9yKSB7XG4gICAgICAgIG5ld0JvZHlba2V5XS54ICs9IGJlaGF2aW9yW2tleV0ueCAqIGRlbHRhO1xuICAgICAgICBuZXdCb2R5W2tleV0ueSArPSBiZWhhdmlvcltrZXldLnkgKiBkZWx0YTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGF0aWNCb2RpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzQm9kID0gdGhpcy5zdGF0aWNCb2RpZXNbaV07XG4gICAgICBsZXQgdCA9IENvbGxpc2lvbi5hYWJiVGVzdChuZXdCb2R5LCBzQm9kKTtcbiAgICAgIGlmICh0aGlzLmxlbmd0aFNxdWFyZWQodCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge3g6IDAsIHk6IDB9O1xuICB9XG5cbiAgYmluYXJ5U2VhcmNoQ29sbGlzaW9uKGJvZHksIGRlbHRhLCB0b2xlcmFuY2UpIHtcbiAgICBpZiAodGhpcy5sZW5ndGhTcXVhcmVkKHRoaXMuY2hlY2tDb2xsaXNpb24oYm9keSwgMCkpID4gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGxldCBsb3cgPSAwLjA7XG4gICAgbGV0IGhpZ2ggPSBkZWx0YTtcbiAgICBsZXQgbWlkID0gKChsb3cgKyBoaWdoKSAvIDIuMCk7XG4gICAgbGV0IGNvbGxpc2lvbiA9IHRoaXMuY2hlY2tDb2xsaXNpb24oYm9keSwgbWlkKTtcbiAgICBsZXQgbCA9IHRoaXMubGVuZ3RoU3F1YXJlZChjb2xsaXNpb24pO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKChsID4gdG9sZXJhbmNlIHx8IGwgPT09IDApICYmIGNvdW50IDwgMzIpIHtcbiAgICAgIGlmIChsID4gdG9sZXJhbmNlKSB7XG4gICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICB9IGVsc2UgaWYgKGwgPT09IDApIHtcbiAgICAgICAgbG93ID0gbWlkO1xuICAgICAgfVxuICAgICAgbWlkID0gKChsb3cgKyBoaWdoKSAvIDIuMCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImxvdzogXCIsIGxvdyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImhpZ2g6IFwiLCBoaWdoKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwibWlkOiBcIiwgbWlkKTtcbiAgICAgIGNvbGxpc2lvbiA9IHRoaXMuY2hlY2tDb2xsaXNpb24oYm9keSwgbWlkKTtcbiAgICAgIGwgPSB0aGlzLmxlbmd0aFNxdWFyZWQoY29sbGlzaW9uKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwibDogXCIsIGwpO1xuICAgICAgY291bnQrKztcbiAgICB9XG5cbiAgICByZXR1cm4gbWlkO1xuICB9XG5cbiAgY2FsY1N0ZXAoYm9keSwgZGVsdGEpIHtcbiAgICBib2R5LnBvcy54ICs9IGJvZHkudmVsLnggKiBkZWx0YTtcbiAgICBib2R5LnBvcy55ICs9IGJvZHkudmVsLnkgKiBkZWx0YTtcblxuICAgIHRoaXMuYmVoYXZpb3JzLmZvckVhY2goKGJlaGF2aW9yKSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gYmVoYXZpb3IpIHtcbiAgICAgICAgYm9keVtrZXldLnggKz0gYmVoYXZpb3Jba2V5XS54ICogZGVsdGE7XG4gICAgICAgIGJvZHlba2V5XS55ICs9IGJlaGF2aW9yW2tleV0ueSAqIGRlbHRhO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RlcChkZWx0YSkge1xuICAgIHRoaXMuZHluYW1pY0JvZGllcy5mb3JFYWNoKChib2R5KSA9PiB7XG4gICAgICBpZiAoYm9keS5hd2FrZSkge1xuICAgICAgICBib2R5LmZyZWV6ZSA9IHtcbiAgICAgICAgICB4OiBmYWxzZSxcbiAgICAgICAgICB5OiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBsZXQgY29sbGlkZWQgPSB0aGlzLmNoZWNrQ29sbGlzaW9uRmFzdChib2R5LCBkZWx0YSk7XG4gICAgICAgIGlmICghY29sbGlkZWQpIHtcbiAgICAgICAgICB0aGlzLmNhbGNTdGVwKGJvZHksIGRlbHRhKTtcbiAgICAgICAgICBsZXQgY29sID0gdGhpcy5jaGVja0NvbGxpc2lvbihib2R5LCAwKTtcbiAgICAgICAgICBib2R5LnBvcy55IC09IGNvbC55O1xuICAgICAgICAgIGJvZHkucG9zLnggLT0gY29sLng7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IHJlbWFpbmluZyA9IGRlbHRhO1xuICAgICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgICAgd2hpbGUgKHJlbWFpbmluZyA+PSAwICYmIGNvdW50IDwgNikge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIGxldCBkID0gdGhpcy5iaW5hcnlTZWFyY2hDb2xsaXNpb24oYm9keSwgcmVtYWluaW5nLCAwLjEpO1xuICAgICAgICAgICAgdGhpcy5jYWxjU3RlcChib2R5LCBkKTtcbiAgICAgICAgICAgIHJlbWFpbmluZyAtPSBkZWx0YTtcbiAgICAgICAgICAgIGxldCBjb2wgPSB0aGlzLmNoZWNrQ29sbGlzaW9uKGJvZHksIDApO1xuICAgICAgICAgICAgaWYgKGNvbC55ICE9PSAwLjApIHtcbiAgICAgICAgICAgICAgaWYgKE1hdGguc2lnbihib2R5LnZlbC55KSA9PT0gTWF0aC5zaWduKGNvbC55KSkge1xuICAgICAgICAgICAgICAgIGJvZHkudmVsLnkgPSAwO1xuICAgICAgICAgICAgICAgIGJvZHkuZnJlZXplLnkgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChib2R5LmZyaWN0aW9ubGVzcykge1xuICAgICAgICAgICAgICAgIC8vIGxvZy5kZWJ1ZyhcIkZyaWN0aW9ubGVzcyFcIik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm9keS52ZWwueCAvPSAyLjA7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29sLnggIT09IDAuMCkge1xuICAgICAgICAgICAgICBpZiAoTWF0aC5zaWduKGJvZHkudmVsLngpID09PSBNYXRoLnNpZ24oY29sLngpKSB7XG4gICAgICAgICAgICAgICAgYm9keS52ZWwueCA9IDA7XG4gICAgICAgICAgICAgICAgYm9keS5mcmVlemUueCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkucG9zLnkgLT0gY29sLnk7XG4gICAgICAgICAgICBib2R5LnBvcy54IC09IGNvbC54O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYWRkQmVoYXZpb3IoYmVoYXZpb3IpIHtcbiAgICB0aGlzLmJlaGF2aW9ycy5wdXNoKGJlaGF2aW9yKTtcbiAgfVxuXG4gIGFkZEVudGl0eShlbnRpdHkpIHtcbiAgICBpZiAoZW50aXR5LnBoeXNpY3MgJiYgZW50aXR5LnBoeXNpY3MuYm9keSkge1xuICAgICAgaWYgKGVudGl0eS5waHlzaWNzLmJvZHkuc3RhdGljKSB7XG4gICAgICAgIHRoaXMuc3RhdGljQm9kaWVzLnB1c2goZW50aXR5LnBoeXNpY3MuYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZW50aXR5LnBoeXNpY3MuYm9keS50cmlnZ2VyKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2Vycy5wdXNoKGVudGl0eS5waHlzaWNzLmJvZHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZHluYW1pY0JvZGllcy5wdXNoKGVudGl0eS5waHlzaWNzLmJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdDYW5ub3QgYWRkIHRvIHBoeXNpY3M6IGVudGl0eSBkb2VzIG5vdCBoYXZlIGEgYm9keSEnKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYm9keShib2R5VHlwZSwgb3B0aW9ucykge1xuICAgIGxldCBib2R5ID0ge1xuICAgICAgcG9zOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICB2ZWw6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIHN0YXRpYzogZmFsc2UsXG4gICAgICBhd2FrZTogdHJ1ZVxuICAgIH07XG4gICAgYm9keS5wb3MueCA9IG9wdGlvbnMueCB8IDA7XG4gICAgYm9keS5wb3MueSA9IG9wdGlvbnMueSB8IDA7XG4gICAgYm9keS5mcmljdGlvbmxlc3MgPSBvcHRpb25zLmZyaWN0aW9ubGVzcyB8IGZhbHNlO1xuICAgIGlmIChvcHRpb25zLnRyZWF0bWVudCA9PT0gJ3N0YXRpYycpIHtcbiAgICAgIGJvZHkuc3RhdGljID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMudHJlYXRtZW50ID09PSAndHJpZ2dlcicpIHtcbiAgICAgIGJvZHkudHJpZ2dlciA9IHRydWU7XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24oYm9keSwgb3B0aW9ucyk7XG4gICAgLy8gbG9nLmRlYnVnKGJvZHkpO1xuICAgIHJldHVybiBib2R5O1xuICB9XG59XG5cbmV4cG9ydCB7UGh5c2ljc307XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcblxuY2xhc3MgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIGxldCBhID0ge307XG4gICAgalF1ZXJ5LmV4dGVuZCh0cnVlLCBhLCBwYXJhbWV0ZXJzKTtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGEpO1xuXG4gICAgLy8gT2JqZWN0LmtleXMoKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgLy8gICBsZXQgYSA9IHt9O1xuICAgIC8vICAgalF1ZXJ5XG4gICAgLy8gICB0aGlzW2tleV0gPVxuICAgIC8vIH0pO1xuICAgIHRoaXMuZXZlbnRUeXBlcyA9IFtdO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHt9XG5cbiAgdXBkYXRlKHBhcmFtZXRlcnMsIHBhcmVudCwgcm9vdEVudGl0eSwgZGVsdGEpIHt9XG4gIGxhdGVVcGRhdGUocGFyYW1ldGVycywgcGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge31cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHt9XG59XG5cbmV4cG9ydCB7U2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcblxuY2xhc3MgQW5pbWF0aW9uU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIC8vIHRoaXMuZXZlbnRUeXBlcy5wdXNoKFxuICAgIC8vICAgJ2FuaW1hdGlvbl90ZXN0J1xuICAgIC8vICk7XG4gICAgdGhpcy5jdXJyZW50RnJhbWUgPSAwO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgICBwYXJlbnQudGltZUF0Q3VycmVudEZyYW1lID0gLTE7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGNvbnN0IGFuaW0gPSBwYXJlbnQuYW5pbWF0aW9uO1xuXG4gICAgaWYoYW5pbSl7XG4gICAgICBjb25zdCBmcmFtZXMgPSBhbmltLmFuaW07XG5cbiAgICAgIGlmIChmcmFtZXMubGVuZ3RoIDw9IHRoaXMuY3VycmVudEZyYW1lKSB7XG4gICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gZnJhbWVzLmxlbmd0aCAtIDE7XG4gICAgICB9XG5cbiAgICAgIGlmKHBhcmVudC50aW1lQXRDdXJyZW50RnJhbWUgPiBmcmFtZXNbdGhpcy5jdXJyZW50RnJhbWVdLmR1cmF0aW9uIHx8IHBhcmVudC50aW1lQXRDdXJyZW50RnJhbWUgPT09IC0xKXtcbiAgICAgICAgLy8gQ2hhbmdlIGN1cnJlbnQgZnJhbWVcbiAgICAgICAgY29uc3QgbmV3RnJhbWUgPSAodGhpcy5jdXJyZW50RnJhbWUgKyAxKSAlIGZyYW1lcy5sZW5ndGg7XG4gICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gbmV3RnJhbWU7XG4gICAgICAgIHBhcmVudC5zZXRTcHJpdGUoZnJhbWVzW3RoaXMuY3VycmVudEZyYW1lXS5mcmFtZSk7XG4gICAgICAgIHBhcmVudC50aW1lQXRDdXJyZW50RnJhbWUgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LnRpbWVBdEN1cnJlbnRGcmFtZSArPSBkZWx0YTtcbiAgICAgIH1cbiAgICB9IGVsc2V7XG4gICAgICBsb2cud2FybignQW5pbWF0aW9uIHNjcmlwdCBuZWVkcyBhbmltYXRpb24gY29tcG9uZW50IHRvIHdvcmsnKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcblxuICB9XG59XG5cbmV4cG9ydCB7QW5pbWF0aW9uU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuaW1wb3J0IHtGYWN0b3J5fSBmcm9tICdGYWN0b3J5JztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24nO1xuXG5jbGFzcyBCdWxsZXRpbkJvYXJkU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcy5wdXNoKCdjaGFuZ2VfdGV4dCcpO1xuICAgIHRoaXMuY29udmVyc2UgPSBmYWxzZTtcbiAgICB0aGlzLnRleHQgPSAnVGhpcyBpcyBwbGFjZWhvbGRlciB0ZXh0LiBDaGFuZ2UgaXQgd2l0aCBldmVudHMuJztcbiAgICB0aGlzLmJ1YmJsZSA9IEZhY3RvcnkuY3JlYXRlU3BlZWNoQnViYmxlKDExLCA2LCA2LCB0aGlzLnRleHQpO1xuICAgIHRoaXMuYnViYmxlLnBvc2l0aW9uLnkgLT0gNDA7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIHRoaXMucGxheWVyID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygncGxheWVyJyk7XG4gICAgcGFyZW50LmFkZENoaWxkKHRoaXMuYnViYmxlKTtcbiAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGxldCBwbGF5ZXJDb2xsaWRlID0gQ29sbGlzaW9uLmFhYmJUZXN0RmFzdChwYXJlbnQucGh5c2ljcy5ib2R5LCB0aGlzLnBsYXllci5waHlzaWNzLmJvZHkpO1xuICAgIGlmIChwbGF5ZXJDb2xsaWRlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnYXVkaW9fc291bmRfcGxheScsIHBhcmFtZXRlcnM6IHthdWRpbzonYXVkaW9fZG9vcl8yJ319KTtcbiAgICAgIHRoaXMuYnViYmxlLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcblxuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAnY2hhbmdlX3RleHQnKSB7XG4gICAgICBpZiAoZXZ0LnBhcmFtZXRlcnMudGFyZ2V0Lm5hbWUgPT0gcGFyZW50Lm5hbWUpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gZXZ0LnBhcmFtZXRlcnMudGV4dDtcbiAgICAgICAgdGhpcy5idWJibGUuc2V0VGV4dCh0aGlzLnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge0J1bGxldGluQm9hcmRTY3JpcHR9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge1NjcmlwdH0gZnJvbSAnU2NyaXB0JztcbmltcG9ydCB7SW5wdXRNYW4gYXMgSW5wdXR9IGZyb20gJ01hbmFnZXJzL0lucHV0TWFuYWdlcic7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IGNmZyBmcm9tICdjb25maWcuanNvbic7XG5cbmNsYXNzIENhbWVyYVNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChcbiAgICAgICdjYW1lcmEnLFxuICAgICAgJ2Rpc2FibGVfY2FtZXJhJyxcbiAgICAgICdlbmFibGVfY2FtZXJhJ1xuICAgICk7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXQocGFyZW50LCByb290RW50aXR5KSB7XG4gICAgdGhpcy5wbGF5ZXIgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCdwbGF5ZXInKTtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgaWYgKHRoaXMucGxheWVyLnBvc2l0aW9uLnkgPiA4MDApIHtcbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ2Rpc2FibGVfY2FtZXJhJywgcGFyYW1ldGVyczoge319KTtcbiAgICB9IGVsc2Uge1xuICAgICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnZW5hYmxlX2NhbWVyYScsIHBhcmFtZXRlcnM6IHt9fSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHBhcmVudC5wb3NpdGlvbi54ID0gLXRoaXMucGxheWVyLnBvc2l0aW9uLnggKyBjZmcucmVuZGVyZXIuc2l6ZS54LzI7XG4gICAgICBpZiAodGhpcy5wbGF5ZXIucG9zaXRpb24ueCA8IGNmZy5yZW5kZXJlci5zaXplLnggLyAyKSBwYXJlbnQucG9zaXRpb24ueCA9IDA7XG4gICAgICBpZiAodGhpcy5wbGF5ZXIucG9zaXRpb24ueSA8IDgwMCAmJiB0aGlzLnBsYXllci5wb3NpdGlvbi54ID4gMjQzMCkgcGFyZW50LnBvc2l0aW9uLnggPSBjZmcucmVuZGVyZXIuc2l6ZS54LzIgLSAyNDMwO1xuICAgICAgaWYgKHRoaXMucGxheWVyLnBvc2l0aW9uLnkgPCA4MDApIHtcbiAgICAgICAgcGFyZW50LnBvc2l0aW9uLnkgPSAtMjIwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LnBvc2l0aW9uLnkgPSAtdGhpcy5wbGF5ZXIucG9zaXRpb24ueSArIGNmZy5yZW5kZXJlci5zaXplLnkvMiArIDEwMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ2Rpc2FibGVfY2FtZXJhJykge1xuICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7Q2FtZXJhU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtyYW5kfSBmcm9tICdVdGlscy9OdW1VdGlsJztcbmltcG9ydCB7cG9wdWxhdGVUZW1wbGF0ZX0gZnJvbSAnVXRpbHMvU3RyaW5nVXRpbCc7XG5pbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24nO1xuXG5jbGFzcyBDcmlzaXNTY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAncmFua19hcHBseV9lbmQnLFxuICAgICAgJ2l0ZW1fdGhyb3duJ1xuICAgICk7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMudmlsbGFnZSA9IHJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhUYWcoJ3ZpbGxhZ2UnKTtcbiAgICB0aGlzLnNpZ24gPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoTmFtZSgnY3Jpc2lzX3NpZ24nKTtcbiAgICB0aGlzLmRhdGEgPSByZXNvdXJjZXMuY3Jpc2lzZXMuZGF0YS5jcmlzaXNlcztcbiAgICB0aGlzLmNyaXNpc0luZGV4ID0gMDtcbiAgfVxuXG4gIHJhbmRvbWl6ZUNyaXNpcygpIHtcbiAgICBsZXQgaXRlbVR5cGVzID0gW107XG5cbiAgICBsZXQgc2VsZWN0ID0gdGhpcy5kYXRhW3RoaXMuY3Jpc2lzSW5kZXhdO1xuICAgIHRoaXMucmVxdWlyZWRJdGVtcyA9IFtdO1xuICAgIHdoaWxlIChpdGVtVHlwZXMubGVuZ3RoIDwgc2VsZWN0Lml0ZW1Db3VudCkge1xuICAgICAgbGV0IHR5cGUgPSB0aGlzLnZpbGxhZ2UuaXRlbVR5cGVzW3JhbmQodGhpcy52aWxsYWdlLml0ZW1UeXBlcy5sZW5ndGgpXTtcbiAgICAgIGlmIChpdGVtVHlwZXMuaW5kZXhPZih0eXBlKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5yZXF1aXJlZEl0ZW1zLnB1c2godGhpcy52aWxsYWdlLnJhd1R5cGVzQnlOYW1lW3R5cGVdKTtcbiAgICAgICAgaXRlbVR5cGVzLnB1c2godHlwZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudGltZUxlZnQgPSBzZWxlY3QuZHVyYXRpb247XG4gICAgbGV0IGNyaXNpcyA9IHt2aWxsYWdlTmFtZTogdGhpcy52aWxsYWdlLm5hbWV9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbVR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjcmlzaXNbJ2l0ZW0nICsgKGkgKyAxKV0gPSBpdGVtVHlwZXNbaV07XG4gICAgfVxuXG4gICAgY3Jpc2lzLmRlc2NyaXB0aW9uID0gcG9wdWxhdGVUZW1wbGF0ZShzZWxlY3QuZGVzYywgY3Jpc2lzKTtcblxuICAgIHRoaXMudmlsbGFnZS5jdXJyZW50Q3Jpc2lzID0gY3Jpc2lzO1xuXG4gICAgbG9nLmRlYnVnKHRoaXMuc2lnbik7XG5cbiAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdjaGFuZ2VfdGV4dCcsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHRhcmdldDogdGhpcy5zaWduLFxuICAgICAgICB0ZXh0OiB0aGlzLnZpbGxhZ2UuY3VycmVudENyaXNpcy5kZXNjcmlwdGlvblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmV4dENyaXNpcygpIHtcbiAgICB0aGlzLmNyaXNpc0luZGV4Kys7XG4gICAgaWYgKHRoaXMuY3Jpc2lzSW5kZXggPj0gdGhpcy5kYXRhLmxlbmd0aCkge1xuICAgICAgdGhpcy5jcmlzaXNJbmRleCA9IDA7XG4gICAgfVxuICAgIHRoaXMucmFuZG9taXplQ3Jpc2lzKCk7XG4gIH1cblxuICBhZHZhbmNlRGF5KCkge1xuICAgIHRoaXMudGltZUxlZnQtLTtcbiAgICBpZiAodGhpcy50aW1lTGVmdCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMucmVxdWlyZWRJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5jcmlzaXNBdmVydGVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNyaXNpc0ZhaWxlZCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5uZXh0Q3Jpc2lzKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRpbWVMZWZ0ID09PSAxKSB7XG4gICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdub3RpZmljYXRpb24nLCBwYXJhbWV0ZXJzOiB7dGV4dDogJ1RoZSByaXR1YWwgaXMgYXBwcm9hY2hpbmcuLi4nfX0pO1xuICAgIH1cbiAgfVxuXG4gIGNyaXNpc0ZhaWxlZCgpIHtcbiAgICBsZXQgbmFtZSA9IHRoaXMudmlsbGFnZS52aWxsYWdlcnNbdGhpcy52aWxsYWdlLnZpbGxhZ2Vycy5sZW5ndGggLSAxXS5uYW1lO1xuICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ3ZpbGxhZ2VyX3JpdHVhbGl6ZWQnLFxuICAgIHBhcmFtZXRlcnM6IHt2aWxsYWdlck5hbWU6IG5hbWV9fSk7XG4gICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnbm90aWZpY2F0aW9uJywgcGFyYW1ldGVyczoge3RleHQ6IG5hbWUgKyAnIGdvdCBzYWNyaWZpY2VkIGluIGEgcml0dWFsJ319KTtcbiAgfVxuXG4gIGNyaXNpc0F2ZXJ0ZWQoKSB7XG4gICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAncmFua19jaGFuZ2UnLCBwYXJhbWV0ZXJzOiB7dmlsbGFnZXJOYW1lOiB0aGlzLnZpbGxhZ2UucGxheWVyLm5hbWUsIHJhbmtDaGFuZ2U6IC0xLjF9fSk7XG4gICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnbm90aWZpY2F0aW9uJywgcGFyYW1ldGVyczoge3RleHQ6ICdDcmlzaXMgYXZlcnRlZCwgbm8gcml0dWFscyB3ZXJlIHBlcmZvcm1lZC4nfX0pO1xuICB9XG5cbiAgdXBkYXRlKHBhcmVudCwgcm9vdEVudGl0eSwgZGVsdGEpIHtcbiAgICBpZiAoIXRoaXMudmlsbGFnZS5jdXJyZW50Q3Jpc2lzKSB7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUNyaXNpcygpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNyaXNpc05lZWRzKGl0ZW0pIHtcbiAgICBsZXQgbmV3UmVxID0gW107XG4gICAgdGhpcy5yZXF1aXJlZEl0ZW1zLmZvckVhY2gocmVxID0+IHtcbiAgICAgIGlmIChpdGVtLnRhZ3MuaW5kZXhPZihyZXEpID09PSAtMSkge1xuICAgICAgICBuZXdSZXEucHVzaChyZXEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChuZXdSZXEubGVuZ3RoIDwgdGhpcy5yZXF1aXJlZEl0ZW1zLmxlbmd0aCkge1xuICAgICAgaXRlbS5waHlzaWNzLmJvZHkucG9zLnggPSAxNTAwMDA7XG4gICAgICBpdGVtLnJlbG9jYXRlZCA9IHRydWU7XG4gICAgICB0aGlzLnJlcXVpcmVkSXRlbXMgPSBuZXdSZXE7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdyYW5rX2FwcGx5X2VuZCcpIHtcbiAgICAgIHRoaXMuYWR2YW5jZURheSgpO1xuICAgIH0gZWxzZSBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ2l0ZW1fdGhyb3duJykge1xuICAgICAgaWYgKENvbGxpc2lvbi5hYWJiVGVzdEZhc3QodGhpcy5wYXJlbnQucGh5c2ljcy5ib2R5LCBldnQucGFyYW1ldGVycy5pdGVtLnBoeXNpY3MuYm9keSkpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDcmlzaXNOZWVkcyhldnQucGFyYW1ldGVycy5pdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtDcmlzaXNTY3JpcHR9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge1NjcmlwdH0gZnJvbSAnU2NyaXB0JztcbmltcG9ydCB7SW5wdXRNYW4gYXMgSW5wdXR9IGZyb20gJ01hbmFnZXJzL0lucHV0TWFuYWdlcic7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IGNmZyBmcm9tICdjb25maWcuanNvbic7XG5cbmNsYXNzIERhcmtlblNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChcbiAgICAgICd0aW1lX2NoYW5nZSdcbiAgICApO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ3RpbWVfY2hhbmdlJykge1xuICAgICAgbGV0IHQgPSBldnQucGFyYW1ldGVycy50aW1lO1xuICAgICAgcGFyZW50LnNwcml0ZS5hbHBoYSA9IChNYXRoLmFicyh0IC0gMTIpIC8gMTIuMCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7RGFya2VuU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtyZXNvdXJjZXN9IGZyb20gJ01hbmFnZXJzL1Jlc291cmNlTWFuYWdlcic7XG5cbmNsYXNzIERheU5pZ2h0Q3ljbGVTY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAndGltZV9hZHZhbmNlJ1xuICAgICk7XG4gICAgdGhpcy50aW1lID0gMDtcbiAgfVxuXG4gIGluaXQocGFyZW50LHJvb3RFbnRpdHkpe1xuICAgIC8vIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ2N5Y2xlX21vcm5pbmcnLCBwYXJhbWV0ZXJzOiB7Y3ljbGVOdW1iZXI6IHRoaXMuZGF5TnVtYmVyKCl9fSk7XG4gICAgdGhpcy52aWxsYWdlID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygndmlsbGFnZScpO1xuICAgIHRoaXMuc2NoZWx1ZGUgPSByZXNvdXJjZXMubnBjU2NoZWx1ZGUuZGF0YS5zY2hlbHVkZTtcbiAgICB0aGlzLnJvb3RFbnRpdHkgPSByb290RW50aXR5O1xuICB9XG5cbiAgdXBkYXRlKHBhcmVudCwgcm9vdEVudGl0eSwgZGVsdGEpIHtcbiAgICBwYXJlbnQuZ2V0Q2hpbGRBdCgxKS50ZXh0ID0gdGhpcy5kYXlUaW1lKCkgKyBcIjowMFwiO1xuICAgIGlmICghdGhpcy5maXJzdFVwZGF0ZSkge1xuICAgICAgdGhpcy5maXJzdFVwZGF0ZSA9IHRydWU7XG4gICAgICB0aGlzLnRpbWUgPSAxMTtcbiAgICAgIHRoaXMuYWR2YW5jZVRpbWUoKTtcbiAgICB9XG4gIH1cblxuICBkYXlOdW1iZXIoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy50aW1lIC8gMjQpICsgMTtcbiAgfVxuXG4gIGRheVRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZSAlIDI0O1xuICB9XG5cbiAgYWR2YW5jZVRpbWUoKSB7XG4gICAgbGV0IG9sZFRpbWUgPSB0aGlzLnRpbWU7XG4gICAgdGhpcy50aW1lICs9IDE7XG4gICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAndGltZV9jaGFuZ2UnLCBwYXJhbWV0ZXJzOiB7dGltZTogdGhpcy5kYXlUaW1lKCl9fSk7XG4gICAgdGhpcy51cGRhdGVOcGNzKCk7XG4gICAgaWYgKHRoaXMuZGF5VGltZSgpID09PSAwKSB7XG4gICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdjeWNsZV9tb3JuaW5nJywgcGFyYW1ldGVyczoge2N5Y2xlTnVtYmVyOiB0aGlzLmRheU51bWJlcigpfX0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAndGltZV9hZHZhbmNlJykge1xuICAgICAgdGhpcy5hZHZhbmNlVGltZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU5wY3MoKSB7XG4gICAgbGV0IHNjaGVsID0gdGhpcy5zY2hlbHVkZVt0aGlzLmRheVRpbWUoKV07XG4gICAgdGhpcy52aWxsYWdlLm5wY3MuZm9yRWFjaCh2aWxsYWdlciA9PiB7XG4gICAgICBsZXQgbG9jYXRpb24gPSBzY2hlbFt2aWxsYWdlci5pZF07XG4gICAgICBsZXQgc3Bhd247XG4gICAgICBpZiAobG9jYXRpb24gPT0gJ2hvbWUnKSB7XG4gICAgICAgIGxldCBob3VzZSA9IHZpbGxhZ2VyLmhvdXNlO1xuICAgICAgICBpZiAoaG91c2UpIHtcbiAgICAgICAgICBsZXQgaG91c2VJZCA9IHZpbGxhZ2VyLmhvdXNlLmhvdXNlSWQ7XG4gICAgICAgICAgc3Bhd24gPSB0aGlzLnJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhOYW1lKCdob3VzZV9zcGF3bl8nICsgaG91c2VJZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBsYXN0ID0gbG9jYXRpb25bbG9jYXRpb24ubGVuZ3RoIC0gMV07XG4gICAgICAgIGxldCBzcGF3bklkID0gJzEnO1xuICAgICAgICBpZiAobGFzdCA9PSAnYScpIHtcbiAgICAgICAgICBzcGF3bklkID0gJzInO1xuICAgICAgICAgIGxhc3QgPSBsb2NhdGlvbltsb2NhdGlvbi5sZW5ndGggLSAyXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29udklkID0gbGFzdDtcbiAgICAgICAgc3Bhd24gPSB0aGlzLnJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhOYW1lKCdsb2NhdGlvbl9jb252ZXJzYXRpb25fJyArIGNvbnZJZCArICdfc3Bhd25fJyArIHNwYXduSWQpO1xuICAgICAgfVxuICAgICAgaWYgKHZpbGxhZ2VyLmRlYWQpIHtcbiAgICAgICAgdmlsbGFnZXIucGh5c2ljcy5ib2R5LnBvcy54ID0gMTUwMDA7XG4gICAgICAgIHZpbGxhZ2VyLnBoeXNpY3MuYm9keS52ZWwueSA9IDA7XG4gICAgICAgIHZpbGxhZ2VyLnBoeXNpY3MuYm9keS52ZWwueCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKHNwYXduKSB7XG4gICAgICAgIHZpbGxhZ2VyLmxvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICAgIHZpbGxhZ2VyLnBoeXNpY3MuYm9keS5wb3MueCA9IHNwYXduLnBoeXNpY3MuYm9keS5wb3MueDtcbiAgICAgICAgdmlsbGFnZXIucGh5c2ljcy5ib2R5LnBvcy55ID0gc3Bhd24ucGh5c2ljcy5ib2R5LnBvcy55O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCB7RGF5TmlnaHRDeWNsZVNjcmlwdH07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7U2NyaXB0fSBmcm9tICdTY3JpcHQnO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24uanMnO1xuXG5jbGFzcyBEb29yU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcy5wdXNoKFxuICAgICAgJ2VudGVyX3BsYXllcicsXG4gICAgICAndGVsZXBvcnRfcGxheWVyJ1xuICAgICk7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIHRoaXMucGxheWVyID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygncGxheWVyJyk7XG4gICAgdGhpcy50YXJnZXQgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoTmFtZShwYXJlbnQudGFyZ2V0KTtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ3RlbGVwb3J0X3BsYXllcicpIHtcbiAgICAgIGxldCBwID0gZXZ0LnBhcmFtZXRlcnM7XG4gICAgICBpZiAocC5zZW5kZXIgPT0gdGhpcykge1xuICAgICAgICB0aGlzLnBsYXllci5waHlzaWNzLmJvZHkucG9zLnggPSB0aGlzLnRhcmdldC5waHlzaWNzLmJvZHkucG9zLng7XG4gICAgICAgIHRoaXMucGxheWVyLnBoeXNpY3MuYm9keS5wb3MueSA9IHRoaXMudGFyZ2V0LnBoeXNpY3MuYm9keS5wb3MueTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdlbnRlcl9wbGF5ZXInKSB7XG4gICAgICBpZiAoQ29sbGlzaW9uLmFhYmJUZXN0RmFzdCh0aGlzLnBsYXllci5waHlzaWNzLmJvZHksIHBhcmVudC5waHlzaWNzLmJvZHkpICYmICF0aGlzLnBsYXllci5lbnRlcmVkKSB7XG4gICAgICAgIC8vIHRoaXMucGxheWVyLnBoeXNpY3MuYm9keS5wb3MueCA9IHRoaXMudGFyZ2V0LnBoeXNpY3MuYm9keS5wb3MueDtcbiAgICAgICAgLy8gdGhpcy5wbGF5ZXIucGh5c2ljcy5ib2R5LnBvcy55ID0gdGhpcy50YXJnZXQucGh5c2ljcy5ib2R5LnBvcy55O1xuICAgICAgICB0aGlzLnBsYXllci5lbnRlcmVkID0gdHJ1ZTtcbiAgICAgICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnYXVkaW9fc291bmRfcGxheScsIHBhcmFtZXRlcnM6IHthdWRpbzonYXVkaW9fZG9vcl8xJ319KTtcbiAgICAgICAgRXZlbnRNYW4ucHVibGlzaCh7XG4gICAgICAgICAgZXZlbnRUeXBlOiAndGltZWQnLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGV2dDoge1xuICAgICAgICAgICAgICBldmVudFR5cGU6ICd0aW1lX2FkdmFuY2UnLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWU6IDAuNVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe1xuICAgICAgICAgIGV2ZW50VHlwZTogJ3RpbWVkJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBldnQ6IHtcbiAgICAgICAgICAgICAgZXZlbnRUeXBlOiAnZmFkZV9pbicsXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMC41XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lOiAwLjVcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBFdmVudE1hbi5wdWJsaXNoKHtcbiAgICAgICAgICBldmVudFR5cGU6ICd0aW1lZCcsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgZXZ0OiB7XG4gICAgICAgICAgICAgIGV2ZW50VHlwZTogJ3RlbGVwb3J0X3BsYXllcicsXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBzZW5kZXI6IHRoaXNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRpbWU6IDAuNVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe1xuICAgICAgICAgIGV2ZW50VHlwZTogJ2Rpc2FibGVfcGxheWVyJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBldnQ6IHt9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgRXZlbnRNYW4ucHVibGlzaCh7XG4gICAgICAgICAgZXZlbnRUeXBlOiAndGltZWQnLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGV2dDoge1xuICAgICAgICAgICAgICBldmVudFR5cGU6ICdlbmFibGVfcGxheWVyJyxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczoge31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lOiAxLjBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICd0aW1lX2FkdmFuY2UnLCBwYXJhbWV0ZXJzOiB7fX0pO1xuICAgICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdmYWRlX291dCcsIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBkdXJhdGlvbjogMC41XG4gICAgICAgIH19KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtEb29yU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuXG5jbGFzcyBFdmVudFRpbWVyU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcy5wdXNoKFxuICAgICAgJ3RpbWVkJ1xuICAgICk7XG4gICAgdGhpcy5ldmVudHMgPSBbXTtcbiAgfVxuXG4gIGluaXQocGFyZW50LCByb290RW50aXR5KSB7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIHRoaXMuZXZlbnRzLmZvckVhY2goKGV2dE9iKSA9PiB7XG4gICAgICBsZXQgZXZ0ID0gZXZ0T2IuZXZlbnQ7XG4gICAgICBldnRPYi50aW1lciArPSBkZWx0YSAvIDEwMDAuMDtcbiAgICAgIC8vIGxvZy5kZWJ1ZyhldnRPYi50aW1lcik7XG4gICAgICAvLyBsb2cuZGVidWcoZXZ0LnBhcmFtZXRlcnMudGltZSk7XG4gICAgICBpZiAoZXZ0T2IudGltZXIgPiBldnQucGFyYW1ldGVycy50aW1lKSB7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goZXZ0LnBhcmFtZXRlcnMuZXZ0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzLmZpbHRlcigoZXZ0T2IpID0+IHtcbiAgICAgIHJldHVybiBldnRPYi50aW1lciA8IGV2dE9iLmV2ZW50LnBhcmFtZXRlcnMudGltZTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAndGltZWQnKSB7XG4gICAgICB0aGlzLmV2ZW50cy5wdXNoKHtldmVudDogZXZ0LCB0aW1lcjogMC4wfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7RXZlbnRUaW1lclNjcmlwdH07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7U2NyaXB0fSBmcm9tICdTY3JpcHQnO1xuaW1wb3J0IHtJbnB1dE1hbiBhcyBJbnB1dH0gZnJvbSAnTWFuYWdlcnMvSW5wdXRNYW5hZ2VyJztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQgY2ZnIGZyb20gJ2NvbmZpZy5qc29uJztcblxuY2xhc3MgRmFkZUluU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcy5wdXNoKFxuICAgICAgJ2ZhZGVfaW4nLFxuICAgICAgJ2ZhZGVfb3V0J1xuICAgICk7XG4gICAgdGhpcy5mYWRlX2luID0gZmFsc2U7XG4gICAgdGhpcy5mYWRlX291dCA9IGZhbHNlO1xuICAgIHRoaXMuZmFkZV9yYXRlID0gMS82MC4wO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgaWYgKHRoaXMuZmFkZV9pbikge1xuICAgICAgcGFyZW50LmFscGhhIC09IHRoaXMuZmFkZV9yYXRlO1xuICAgICAgaWYgKHBhcmVudC5hbHBoYSA8IDAuMCkge1xuICAgICAgICBwYXJlbnQuYWxwaGEgPSAwLjA7XG4gICAgICAgIHRoaXMuZmFkZV9pbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5mYWRlX291dCkge1xuICAgICAgcGFyZW50LmFscGhhICs9IHRoaXMuZmFkZV9yYXRlO1xuICAgICAgaWYgKHBhcmVudC5hbHBoYSA+IDEuMCkge1xuICAgICAgICBwYXJlbnQuYWxwaGEgPSAxLjA7XG4gICAgICAgIHRoaXMuZmFkZV9vdXQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ2ZhZGVfaW4nKSB7XG4gICAgICBsZXQgZCA9IDEuMDtcbiAgICAgIGlmIChldnQucGFyYW1ldGVycy5kdXJhdGlvbikge1xuICAgICAgICBkID0gZXZ0LnBhcmFtZXRlcnMuZHVyYXRpb247XG4gICAgICB9XG4gICAgICB0aGlzLmZhZGVfcmF0ZSA9ICgxLjAgLyBjZmcuZnBzKSAvIGQ7XG4gICAgICB0aGlzLmZhZGVfaW4gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ2ZhZGVfb3V0Jykge1xuICAgICAgbG9nLmRlYnVnKGV2dC5wYXJhbWV0ZXJzKTtcbiAgICAgIGxldCBkID0gMS4wO1xuICAgICAgaWYgKGV2dC5wYXJhbWV0ZXJzLmR1cmF0aW9uKSB7XG4gICAgICAgIGQgPSBldnQucGFyYW1ldGVycy5kdXJhdGlvbjtcbiAgICAgIH1cbiAgICAgIGxvZy5kZWJ1ZyhkKTtcbiAgICAgIHRoaXMuZmFkZV9yYXRlID0gKDEuMCAvIGNmZy5mcHMpIC8gZDtcbiAgICAgIHRoaXMuZmFkZV9vdXQgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge0ZhZGVJblNjcmlwdH07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7U2NyaXB0fSBmcm9tICdTY3JpcHQnO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCB7cmVzb3VyY2VzfSBmcm9tICdNYW5hZ2Vycy9SZXNvdXJjZU1hbmFnZXInO1xuaW1wb3J0IHtyYW5kfSBmcm9tICdVdGlscy9OdW1VdGlsJztcbmltcG9ydCB7RW50aXR5fSBmcm9tICdFbnRpdHknO1xuaW1wb3J0IHtDb2xsaXNpb259IGZyb20gJ0NvbGxpc2lvbi5qcyc7XG5cbmNsYXNzIEhvdXNlQ29udHJvbGxlclNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChcbiAgICAgICdjeWNsZV9tb3JuaW5nJ1xuICAgICk7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIHRoaXMudmlsbGFnZSA9IHJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhUYWcoJ3ZpbGxhZ2UnKTtcbiAgICB0aGlzLnZpbGxhZ2UuaG91c2VzID0gdGhpcy52aWxsYWdlLmhvdXNlcyB8fCByb290RW50aXR5LmZpbmRFbnRpdGllc1dpdGhUYWcoJ2xvY2F0aW9uX2hvdXNlJyk7XG4gICAgdGhpcy52aWxsYWdlLml0ZW1zID0gdGhpcy52aWxsYWdlLml0ZW1zIHx8IHJvb3RFbnRpdHkuZmluZEVudGl0aWVzV2l0aFRhZygnaXRlbScpO1xuICB9XG5cbiAgbWFwSXRlbXNUb0hvdXNlcygpIHtcbiAgICBsZXQgbWFwID0ge307XG4gICAgdGhpcy52aWxsYWdlLmhvdXNlcy5mb3JFYWNoKGhvdXNlID0+IHtcbiAgICAgIG1hcFtob3VzZS5uYW1lXSA9IFtdO1xuICAgICAgdGhpcy52aWxsYWdlLml0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmIChDb2xsaXNpb24uYWFiYlRlc3RGYXN0KGhvdXNlLnBoeXNpY3MuYm9keSwgaXRlbS5waHlzaWNzLmJvZHkpKSB7XG4gICAgICAgICAgbWFwW2hvdXNlLm5hbWVdLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRoaXMudmlsbGFnZS5ob3VzZUl0ZW1NYXAgPSBtYXA7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdjeWNsZV9tb3JuaW5nJykge1xuICAgICAgdGhpcy5tYXBJdGVtc1RvSG91c2VzKCk7XG4gICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdyYW5rX2FwcGx5X3N0YXJ0JywgcGFyYW1ldGVyczoge319KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtIb3VzZUNvbnRyb2xsZXJTY3JpcHR9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge1NjcmlwdH0gZnJvbSAnU2NyaXB0JztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQge0NvbGxpc2lvbn0gZnJvbSAnQ29sbGlzaW9uJztcblxuY2xhc3MgSG91c2VTY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAnaXRlbSdcbiAgICApO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnZpbGxhZ2UgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCd2aWxsYWdlJyk7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICB9XG5cbiAgY2hlY2tJZlN0ZWFsaW5nKGl0ZW0pIHtcbiAgICBpZiAodGhpcy5wYXJlbnQudmlsbGFnZXIubG9jYXRpb24gPT09ICdob21lJyAmJiAhdGhpcy5wYXJlbnQudmlsbGFnZXIuZGVhZCkge1xuICAgICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAncmFua19jaGFuZ2UnLCBwYXJhbWV0ZXJzOiB7dmlsbGFnZXJOYW1lOiB0aGlzLnZpbGxhZ2UucGxheWVyLm5hbWUsIHJhbmtDaGFuZ2U6IDEuMX19KTtcbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ25vdGlmaWNhdGlvbicsIHBhcmFtZXRlcnM6IHt0ZXh0OiAnWW91ciByYW5rIGRlY3JlYXNlZCBiZWNhdXNlIHlvdSBnb3QgY2F1Z2h0IHN0ZWFsaW5nLid9fSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdpdGVtX3Rocm93bicpIHtcbiAgICAgIGlmIChDb2xsaXNpb24uYWFiYlRlc3RGYXN0KHRoaXMucGFyZW50LnBoeXNpY3MuYm9keSwgZXZ0LnBhcmFtZXRlcnMuaXRlbS5waHlzaWNzLmJvZHkpKSB7XG4gICAgICAgIHRoaXMuY2hlY2tJdGVtQWdhaW5zdFZpbGxhZ2VyTmVlZHMoZXZ0LnBhcmFtZXRlcnMuaXRlbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChldnQuZXZlbnRUeXBlID09PSAnaXRlbV9waWNrZWQnKSB7XG4gICAgICBpZiAoQ29sbGlzaW9uLmFhYmJUZXN0RmFzdCh0aGlzLnBhcmVudC5waHlzaWNzLmJvZHksIGV2dC5wYXJhbWV0ZXJzLml0ZW0ucGh5c2ljcy5ib2R5KSkge1xuICAgICAgICB0aGlzLmNoZWNrSWZTdGVhbGluZyhldnQucGFyYW1ldGVycy5pdGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0l0ZW1BZ2FpbnN0VmlsbGFnZXJOZWVkcyhpdGVtKSB7XG4gICAgbGV0IGRpc2FwcGVhcjtcbiAgICBpZiAoIXRoaXMucGFyZW50LnZpbGxhZ2VyLmRlYWQpIHtcbiAgICAgIGlmIChpdGVtID09PSB0aGlzLnBhcmVudC52aWxsYWdlci5sb3ZlKSB7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ3JhbmtfY2hhbmdlJywgcGFyYW1ldGVyczoge3ZpbGxhZ2VyTmFtZTogdGhpcy52aWxsYWdlLnBsYXllci5uYW1lLCByYW5rQ2hhbmdlOiAtMS4xfX0pO1xuICAgICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdub3RpZmljYXRpb24nLCBwYXJhbWV0ZXJzOiB7dGV4dDogJ1lvdXIgcmFuayBpbmNyZWFzZWQgZm9yIGEgZ29vZCBkZWVkISd9fSk7XG4gICAgICAgIGRpc2FwcGVhciA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGl0ZW0gPT09IHRoaXMucGFyZW50LnZpbGxhZ2VyLmhhdGUpIHtcbiAgICAgICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAncmFua19jaGFuZ2UnLCBwYXJhbWV0ZXJzOiB7dmlsbGFnZXJOYW1lOiB0aGlzLnBhcmVudC52aWxsYWdlci5uYW1lLCByYW5rQ2hhbmdlOiAxLjF9fSk7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ25vdGlmaWNhdGlvbicsXG4gICAgICAgIHBhcmFtZXRlcnM6IHt0ZXh0OiAnUmFuayBvZiAnICsgdGhpcy5wYXJlbnQudmlsbGFnZXIubmFtZSArICcgZGVjcmVhc2VkIGZvciBzZWVpbmcgYSBoYXRlZCBpdGVtLid9fSk7XG4gICAgICAgIGRpc2FwcGVhciA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoZGlzYXBwZWFyKSB7XG4gICAgICAgIGl0ZW0ucGh5c2ljcy5ib2R5LnBvcy54ID0gMTUwMDA7XG4gICAgICAgIGl0ZW0ucmVsb2NhdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtIb3VzZVNjcmlwdH07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7U2NyaXB0fSBmcm9tICdTY3JpcHQnO1xuaW1wb3J0IHtJbnB1dE1hbiBhcyBJbnB1dH0gZnJvbSAnTWFuYWdlcnMvSW5wdXRNYW5hZ2VyJztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQgY2ZnIGZyb20gJ2NvbmZpZy5qc29uJztcbmltcG9ydCB7cG9wdWxhdGVUZW1wbGF0ZX0gZnJvbSAnVXRpbHMvU3RyaW5nVXRpbCc7XG5pbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCB7RmFjdG9yeX0gZnJvbSAnRmFjdG9yeSc7XG5pbXBvcnQge3JhbmR9IGZyb20gJ1V0aWxzL051bVV0aWwnO1xuXG5jbGFzcyBJbml0aWF0ZUNvbnZlcnNhdGlvblNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmNvbnZlcnNlID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAnY3ljbGVfbW9ybmluZycsXG4gICAgICAndGltZV9hZHZhbmNlJ1xuICAgICk7XG4gICAgdGhpcy50ZXh0ID0gJ0JsYWFibGFhYmxhYWJsYWEuJztcbiAgfVxuXG4gIGluaXQocGFyZW50LCByb290RW50aXR5KSB7XG4gICAgdGhpcy5idWJibGUgPSBGYWN0b3J5LmNyZWF0ZVNwZWVjaEJ1YmJsZSgxMSwgMywgNiwgdGhpcy50ZXh0LCBwYXJlbnQubmFtZSk7XG4gICAgdGhpcy5idWJibGUucG9zaXRpb24ueSAtPSA4MDtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLnBsYXllciA9IHJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhUYWcoJ3BsYXllcicpO1xuICAgIHRoaXMuY29udmVyc2F0aW9ucyA9IHJlc291cmNlcy5jb252ZXJzYXRpb25zLmRhdGE7XG4gICAgcGFyZW50LmFkZENoaWxkKHRoaXMuYnViYmxlKTtcbiAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gZmFsc2U7XG4gICAgdGhpcy5yYW5kb21pemUoKTtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgaWYgKE1hdGguYWJzKHRoaXMucGxheWVyLnBoeXNpY3MuYm9keS5wb3MueCAtIHBhcmVudC5waHlzaWNzLmJvZHkucG9zLngpIDwgNTApIHtcbiAgICAgIHRoaXMuY29udmVyc2UgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbnZlcnNlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbnZlcnNlKSB7XG4gICAgICAvLyBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdhdWRpb19zb3VuZF9wbGF5JywgcGFyYW1ldGVyczoge2F1ZGlvOidhdWRpb19kb29yXzInfX0pO1xuICAgICAgdGhpcy5idWJibGUudmlzaWJsZSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnViYmxlLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByYW5kb21pemUoKSB7XG4gICAgbGV0IHRleHQ7XG4gICAgbGV0IHIgPSByYW5kKDMpO1xuICAgIGlmIChyID09PSAwKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5jb252ZXJzYXRpb25zLmhhdGVbcmFuZCh0aGlzLmNvbnZlcnNhdGlvbnMuaGF0ZS5sZW5ndGgpXTtcbiAgICB9IGVsc2UgaWYgKHIgPT09IDEpIHtcbiAgICAgIHRleHQgPSB0aGlzLmNvbnZlcnNhdGlvbnMubG92ZVtyYW5kKHRoaXMuY29udmVyc2F0aW9ucy5sb3ZlLmxlbmd0aCldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0ZXh0ID0gdGhpcy5jb252ZXJzYXRpb25zLnJlcGxpZXNbcmFuZCh0aGlzLmNvbnZlcnNhdGlvbnMucmVwbGllcy5sZW5ndGgpXTtcbiAgICB9XG4gICAgbGV0IG9iaiA9IHtsb3ZlOiB0aGlzLnBhcmVudC5sb3ZlLm5hbWUuc2xpY2UoNSksIGhhdGU6IHRoaXMucGFyZW50LmhhdGUubmFtZS5zbGljZSg1KX07XG4gICAgdGhpcy50ZXh0ID0gcG9wdWxhdGVUZW1wbGF0ZSh0ZXh0LCBvYmopO1xuICAgIHRoaXMuYnViYmxlLnNldFRleHQodGhpcy50ZXh0KTtcbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAndGltZV9hZHZhbmNlJykge1xuICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtJbml0aWF0ZUNvbnZlcnNhdGlvblNjcmlwdH07XG4iLCJpbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcbmltcG9ydCB7U2NyaXB0fSBmcm9tICdTY3JpcHQnO1xuaW1wb3J0IHtJbnB1dE1hbiBhcyBJbnB1dH0gZnJvbSAnTWFuYWdlcnMvSW5wdXRNYW5hZ2VyJztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQgY2ZnIGZyb20gJ2NvbmZpZy5qc29uJztcbmltcG9ydCB7RmFjdG9yeX0gZnJvbSAnRmFjdG9yeSc7XG5pbXBvcnQge0NvbGxpc2lvbn0gZnJvbSAnQ29sbGlzaW9uJztcblxuY2xhc3MgSW50cm9TY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzID0gWydpbnRybyddO1xuICAgIHRoaXMudGV4dCA9ICdUaGUgdG93biBvZiBPdmlzYnVyeSBoYXMgZmFsbGVuIG91dCBvZiBmYXZvciB3aXRoIHRoZWlyIGdvZCEgT25jZSBldmVyeSB0d28gZGF5cywgdGhlIGxvd2VzdC1yYW5raW5nIG1lbWJlciBvZiB0aGUgc29jaWV0eSB3aWxsIGJlIHNhY3JpZmljZWQgdW5sZXNzIHRoZSBjb25jZXJuaW5nIGlzc3VlIGlzIHNvbHZlZC4gSGVscCB0aGUgc29jaWV0eSBvciBzYXZlIHlvdXJzZWxmLCB0aGUgY2hvaWNlIGlzIHlvdXJzLiBHb29kIGx1Y2shJztcbiAgICB0aGlzLmJ1YmJsZSA9IEZhY3RvcnkuY3JlYXRlU3BlZWNoQnViYmxlKDIxLCA1LCAxMCwgdGhpcy50ZXh0LCAnV2VsY29tZScsIHRydWUsIGZhbHNlLCA2MCk7XG4gICAgdGhpcy50aW1lciA9IDA7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIC8vIHRoaXMud29ybGQgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCd3b3JsZCcpO1xuICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzLmJ1YmJsZSk7XG4gICAgLy8gdGhpcy5idWJibGUudmlzaWJsZSA9IHRydWU7XG4gICAgLy8gY29uc29sZS5sb2cocGFyZW50LnBvc2l0aW9uKTtcbiAgICAvLyBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdub3RpZmljYXRpb24nLCBwYXJhbWV0ZXJzOiB7dGV4dDonV2VsY29tZSB0byB0aGUgT3Zpc2J1cmchJ319KTtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgaWYgKHRoaXMudGltZXIgPCA1NTAwKSB7XG4gICAgICB0aGlzLnRpbWVyICs9IGRlbHRhO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB0aGlzLmJ1YmJsZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLmJ1YmJsZS5hbHBoYSAtPSAwLjAxO1xuICAgIH1cbiAgICAvLyBpZih0aGlzLmJ1YmJsZS52aXNpYmxlKXtcbiAgICAvLyAgIGlmKHRoaXMudGltZXIgPiA1MDAwKXtcbiAgICAvLyAgICAgdGhpcy5idWJibGUudmlzaWJsZSA9IGZhbHNlO1xuICAgIC8vICAgICB0aGlzLnRpbWVyID0gMDtcbiAgICAvLyAgIH0gZWxzZSB7XG4gICAgLy8gICAgIHRoaXMudGltZXIgKz0gZGVsdGE7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdpbnRybycpIHtcbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe1xuICAgICAgICBldmVudFR5cGU6ICdkaXNhYmxlX3BsYXllcicsXG4gICAgICAgIHBhcmFtZXRlcnM6IHt9XG4gICAgICB9KTtcbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe1xuICAgICAgICBldmVudFR5cGU6ICd0aW1lZCcsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBldnQ6IHtcbiAgICAgICAgICAgIGV2ZW50VHlwZTogJ2ZhZGVfaW4nLFxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBkdXJhdGlvbjogMi4wXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1lOiA0LjBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBFdmVudE1hbi5wdWJsaXNoKHtcbiAgICAgICAgZXZlbnRUeXBlOiAndGltZWQnLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgZXZ0OiB7XG4gICAgICAgICAgICBldmVudFR5cGU6ICdlbmFibGVfcGxheWVyJyxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHt9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aW1lOiA2LjBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIGlmIChldnQuZXZlbnRUeXBlID09PSAnbm90aWZpY2F0aW9uJykge1xuICAgIC8vICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICAvLyAgIHRoaXMuYnViYmxlLnZpc2libGUgPSB0cnVlO1xuICAgIC8vXG4gICAgLy8gICB0aGlzLnRleHQgPSBldnQucGFyYW1ldGVycy50ZXh0O1xuICAgIC8vICAgdGhpcy5idWJibGUuc2V0VGV4dCh0aGlzLnRleHQpO1xuICAgIC8vIH1cbiAgfVxufVxuXG5leHBvcnQge0ludHJvU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtHYW1lfSBmcm9tICdHYW1lJztcbmltcG9ydCB7cmFuZH0gZnJvbSAnVXRpbHMvTnVtVXRpbCc7XG5pbXBvcnQge3Jlc291cmNlc30gZnJvbSAnTWFuYWdlcnMvUmVzb3VyY2VNYW5hZ2VyJztcbmltcG9ydCB7RW50aXR5fSBmcm9tICdFbnRpdHknO1xuaW1wb3J0IHtwb3B1bGF0ZVRlbXBsYXRlfSBmcm9tICdVdGlscy9TdHJpbmdVdGlsJztcblxuY2xhc3MgSXRlbVN5c3RlbVNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChcbiAgICAgICdjeWNsZV9tb3JuaW5nJ1xuICAgICk7XG4gIH1cblxuICBpbml0KHBhcmVudCxyb290RW50aXR5KSB7XG4gICAgdGhpcy52aWxsYWdlID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygndmlsbGFnZScpO1xuICAgIHRoaXMuaXRlbXMgPSByb290RW50aXR5LmZpbmRFbnRpdGllc1dpdGhUYWcoJ2l0ZW0nKTtcbiAgICB0aGlzLnZpbGxhZ2UuaXRlbXMgPSB0aGlzLnZpbGxhZ2UuaXRlbXMgfHwgdGhpcy5pdGVtcztcbiAgICB0aGlzLml0ZW1Mb2NhdGlvbnMgPSByb290RW50aXR5LmZpbmRFbnRpdGllc1dpdGhUYWcoJ2xvY2F0aW9uX2l0ZW0nKTtcbiAgICB0aGlzLnJvb3RFbnRpdHkgPSByb290RW50aXR5O1xuICAgIHRoaXMucmVsb2NhdGVJdGVtcyhyb290RW50aXR5KTtcbiAgfVxuXG4gIHVwZGF0ZShwYXJlbnQsIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ2N5Y2xlX21vcm5pbmcnKSB7XG4gICAgICB0aGlzLnJlbG9jYXRlSXRlbXModGhpcy5yb290RW50aXR5KTtcbiAgICB9XG4gIH1cblxuICByZWxvY2F0ZUl0ZW1zKHJvb3RFbnRpdHkpIHtcbiAgICBpZiAodGhpcy5pdGVtTG9jYXRpb25zLmxlbmd0aCA8IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICBsb2cuZXJyb3IoJ1RoZXJlIHNob3VsZCBiZSBtb3JlIGxvY2F0aW9ucyB0aGFuIGl0ZW1zIG9uIG1hcCEnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHR5cGVOYW1lcyA9IHJlc291cmNlcy5pdGVtVHlwZXMuZGF0YTtcbiAgICB0aGlzLml0ZW1Mb2NhdGlvbnMuZm9yRWFjaChsb2MgPT4ge1xuICAgICAgbG9jLmluVXNlID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy52aWxsYWdlLml0ZW1UeXBlcyA9IFtdO1xuICAgIHRoaXMudmlsbGFnZS5yYXdUeXBlc0J5TmFtZSA9IHt9O1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChpdGVtLnJlbG9jYXRlZCkge1xuICAgICAgICBsZXQgbG9jO1xuICAgICAgICBpdGVtLnJlbG9jYXRlZCA9IGZhbHNlO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgbG9jID0gdGhpcy5pdGVtTG9jYXRpb25zW3JhbmQodGhpcy5pdGVtTG9jYXRpb25zLmxlbmd0aCldO1xuICAgICAgICB9IHdoaWxlIChsb2MuaW5Vc2UpO1xuICAgICAgICBsb2MuaW5Vc2UgPSB0cnVlO1xuICAgICAgICBpdGVtLnBoeXNpY3MuYm9keS5wb3MueCA9IGxvYy5waHlzaWNzLmJvZHkucG9zLng7XG4gICAgICAgIGl0ZW0ucGh5c2ljcy5ib2R5LnBvcy55ID0gbG9jLnBoeXNpY3MuYm9keS5wb3MueTtcbiAgICAgICAgaXRlbS5waHlzaWNzLmJvZHkudmVsLnggPSAwO1xuICAgICAgICBpdGVtLnBoeXNpY3MuYm9keS52ZWwueSA9IDA7XG4gICAgICB9XG4gICAgICAvL1JlZ2lzdGVyIGFsbCB0eXBlcyBvZiBpdGVtc1xuICAgICAgaXRlbS50YWdzLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgaWYgKHRoaXMudmlsbGFnZS5pdGVtVHlwZXMuaW5kZXhPZih0YWcpID09PSAtMSAmJiB0eXBlTmFtZXNbdGFnXSkge1xuICAgICAgICAgIHRoaXMudmlsbGFnZS5pdGVtVHlwZXMucHVzaCh0eXBlTmFtZXNbdGFnXSk7XG4gICAgICAgICAgdGhpcy52aWxsYWdlLnJhd1R5cGVzQnlOYW1lW3R5cGVOYW1lc1t0YWddXSA9IHRhZztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHtJdGVtU3lzdGVtU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuaW1wb3J0IHtGYWN0b3J5fSBmcm9tICdGYWN0b3J5JztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24nO1xuXG5jbGFzcyBNZXNzYWdlQm94U2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcyA9IFsnbm90aWZpY2F0aW9uJ107XG4gICAgdGhpcy50ZXh0ID0gJ1dlbGNvbWUgdG8gdGhlIHZpbGxhZ2UnO1xuICAgIHRoaXMuYnViYmxlID0gRmFjdG9yeS5jcmVhdGVTcGVlY2hCdWJibGUoMTUsIDIsIDEsIHRoaXMudGV4dCwgJ0xhdGVzdCBuZXdzJywgZmFsc2UsIGZhbHNlLCAxMCk7XG4gICAgdGhpcy50aW1lciA9IDA7XG4gICAgdGhpcy5idWJibGUudmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgICB0aGlzLndvcmxkID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygnd29ybGQnKTtcbiAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcy5idWJibGUpO1xuICAgIGNvbnNvbGUubG9nKHBhcmVudC5wb3NpdGlvbik7XG4gICAgLy8gRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAnbm90aWZpY2F0aW9uJywgcGFyYW1ldGVyczoge3RleHQ6J1dlbGNvbWUgdG8gdGhlIE92aXNidXJnISd9fSk7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGlmKHRoaXMuYnViYmxlLnZpc2libGUpe1xuICAgICAgaWYodGhpcy50aW1lciA+IDUwMDApe1xuICAgICAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudGltZXIgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aW1lciArPSBkZWx0YTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICBpZiAoZXZ0LmV2ZW50VHlwZSA9PT0gJ25vdGlmaWNhdGlvbicpIHtcbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ2F1ZGlvX3NvdW5kX3BsYXknLCBwYXJhbWV0ZXJzOiB7YXVkaW86J2F1ZGlvX2Rvb3JfMid9fSk7XG4gICAgICBjb25zb2xlLmxvZyhldnQpO1xuICAgICAgdGhpcy5idWJibGUudmlzaWJsZSA9IHRydWU7XG5cbiAgICAgIHRoaXMudGV4dCA9IGV2dC5wYXJhbWV0ZXJzLnRleHQ7XG4gICAgICB0aGlzLnRpbWVyID0gMDtcbiAgICAgIHRoaXMuYnViYmxlLnNldFRleHQodGhpcy50ZXh0KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtNZXNzYWdlQm94U2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcblxuY2xhc3MgTW92ZW1lbnRJbnB1dFNjcmlwdCBleHRlbmRzIFNjcmlwdCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlcnMpIHtcbiAgICBzdXBlcihwYXJhbWV0ZXJzKTtcbiAgICB0aGlzLmV2ZW50VHlwZXMucHVzaChcbiAgICAgICdlbmFibGVfcGxheWVyJyxcbiAgICAgICdkaXNhYmxlX3BsYXllcidcbiAgICApO1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGxldCBtb3ZlbWVudCA9IDA7XG4gICAgcGFyZW50LmVudGVyZWQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICBpZiAoSW5wdXQua2V5RG93bi5sZWZ0KSB7XG4gICAgICAgIG1vdmVtZW50IC09IHRoaXMubW92ZW1lbnRTcGVlZDtcbiAgICAgICAgcGFyZW50LnNwcml0ZS5zY2FsZS54ID0gLTE7XG4gICAgICAgIHBhcmVudC5mYWNpbmdSaWdodCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKElucHV0LmtleURvd24ucmlnaHQpIHtcbiAgICAgICAgbW92ZW1lbnQgKz0gdGhpcy5tb3ZlbWVudFNwZWVkO1xuICAgICAgICBwYXJlbnQuc3ByaXRlLnNjYWxlLnggPSArMTtcbiAgICAgICAgcGFyZW50LmZhY2luZ1JpZ2h0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChJbnB1dC5rZXlQcmVzc2VkLmludGVyYWN0KSB7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe1xuICAgICAgICAgIGV2ZW50VHlwZTogJ2ludGVyYWN0X3BsYXllcicsXG4gICAgICAgICAgcGFyYW1ldGVyczoge31cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoSW5wdXQua2V5UHJlc3NlZC51cCkge1xuICAgICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdlbnRlcl9wbGF5ZXInLCBwYXJhbWV0ZXJzOiB7fX0pO1xuICAgICAgICBcbiAgICAgIH1cbiAgICAgIGlmIChtb3ZlbWVudCA9PT0gMCkge1xuICAgICAgICBwYXJlbnQuYW5pbWF0aW9uID0gcGFyZW50LmlkbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJlbnQuYW5pbWF0aW9uID0gcGFyZW50LndhbGs7XG4gICAgICB9XG4gICAgICBwYXJlbnQucGh5c2ljcy5ib2R5LnZlbC54ID0gbW92ZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudC5hbmltYXRpb24gPSBwYXJlbnQuaWRsZTtcbiAgICAgIHBhcmVudC5waHlzaWNzLmJvZHkudmVsLnggPSAwO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAnZGlzYWJsZV9wbGF5ZXInKSB7XG4gICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdlbmFibGVfcGxheWVyJykge1xuICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtNb3ZlbWVudElucHV0U2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCBjZmcgZnJvbSAnY29uZmlnLmpzb24nO1xuaW1wb3J0IHtGYWN0b3J5fSBmcm9tICdGYWN0b3J5JztcbmltcG9ydCB7Q29sbGlzaW9ufSBmcm9tICdDb2xsaXNpb24nO1xuXG5jbGFzcyBSYW5rQm9hcmRTY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAncmFua19hcHBseV9lbmQnLFxuICAgICAgJ3ZpbGxhZ2Vyc191cGRhdGVkJ1xuICAgICk7XG4gICAgdGhpcy5jb252ZXJzZSA9IGZhbHNlO1xuICAgIHRoaXMudGV4dCA9ICdUaGlzIGlzIHBsYWNlaG9sZGVyIHRleHQuIENoYW5nZSBpdCB3aXRoIGV2ZW50cyEnO1xuICAgIHRoaXMuYnViYmxlID0gRmFjdG9yeS5jcmVhdGVTcGVlY2hCdWJibGUoMTMsIDcsIDYsIHRoaXMudGV4dCwgJ1JhbmtpbmdzJywgZmFsc2UpO1xuICAgIHRoaXMuYnViYmxlLnBvc2l0aW9uLnkgLT0gNDA7XG4gIH1cblxuICBpbml0KHBhcmVudCwgcm9vdEVudGl0eSkge1xuICAgIHRoaXMucGxheWVyID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygncGxheWVyJyk7XG4gICAgdGhpcy52aWxsYWdlID0gcm9vdEVudGl0eS5maW5kRW50aXR5V2l0aFRhZygndmlsbGFnZScpO1xuICAgIHRoaXMudGV4dCA9ICcnO1xuICAgIHRoaXMudmlsbGFnZS52aWxsYWdlcnMuZm9yRWFjaCgodmlsbGFnZXIpID0+IHtcbiAgICAgIHRoaXMudGV4dCArPSB2aWxsYWdlci5uYW1lICsgJywgJyArIHZpbGxhZ2VyLnJvbGUgKyAnXFxuJztcbiAgICB9KTtcbiAgICBwYXJlbnQuYWRkQ2hpbGQodGhpcy5idWJibGUpO1xuICAgIHRoaXMuYnViYmxlLnNldFRleHQodGhpcy50ZXh0KTtcbiAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGxldCBwbGF5ZXJDb2xsaWRlID0gQ29sbGlzaW9uLmFhYmJUZXN0RmFzdChwYXJlbnQucGh5c2ljcy5ib2R5LCB0aGlzLnBsYXllci5waHlzaWNzLmJvZHkpO1xuICAgIGlmIChwbGF5ZXJDb2xsaWRlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS52aXNpYmxlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWJibGUudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAncmFua19hcHBseV9lbmQnIHx8IGV2dC5ldmVudFR5cGUgPT09ICd2aWxsYWdlcnNfdXBkYXRlZCcpIHtcbiAgICAgIHRoaXMudGV4dCA9ICcnO1xuICAgICAgdGhpcy52aWxsYWdlLnZpbGxhZ2Vycy5mb3JFYWNoKCh2aWxsYWdlcikgPT4ge1xuICAgICAgICB0aGlzLnRleHQgKz0gdmlsbGFnZXIubmFtZSArICcsICcgKyB2aWxsYWdlci5yb2xlICsgJ1xcbic7XG4gICAgICB9KTtcbiAgICAgIHBhcmVudC5hZGRDaGlsZCh0aGlzLmJ1YmJsZSk7XG4gICAgICB0aGlzLmJ1YmJsZS5zZXRUZXh0KHRoaXMudGV4dCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7UmFua0JvYXJkU2NyaXB0fTtcbiIsImltcG9ydCB7TW92ZW1lbnRJbnB1dFNjcmlwdH0gZnJvbSAnLi9Nb3ZlbWVudElucHV0U2NyaXB0JztcbmltcG9ydCB7QW5pbWF0aW9uU2NyaXB0fSBmcm9tICcuL0FuaW1hdGlvblNjcmlwdCc7XG5pbXBvcnQge0RheU5pZ2h0Q3ljbGVTY3JpcHR9IGZyb20gJy4vRGF5TmlnaHRDeWNsZVNjcmlwdCc7XG5pbXBvcnQge1ZpbGxhZ2VyUmFua2luZ1N5c3RlbVNjcmlwdH0gZnJvbSAnLi9WaWxsYWdlclJhbmtpbmdTeXN0ZW1TY3JpcHQnO1xuaW1wb3J0IHtWaWxsYWdlcklkZW50aXR5U3lzdGVtU2NyaXB0fSBmcm9tICcuL1ZpbGxhZ2VySWRlbnRpdHlTeXN0ZW1TY3JpcHQnO1xuaW1wb3J0IHtDYW1lcmFTY3JpcHR9IGZyb20gJy4vQ2FtZXJhU2NyaXB0JztcbmltcG9ydCB7Q3Jpc2lzU2NyaXB0fSBmcm9tICcuL0NyaXNpc1NjcmlwdCc7XG5pbXBvcnQge0l0ZW1TeXN0ZW1TY3JpcHR9IGZyb20gJy4vSXRlbVN5c3RlbVNjcmlwdCc7XG5pbXBvcnQge1Rvc3NhYmxlU2NyaXB0fSBmcm9tICcuL1Rvc3NhYmxlU2NyaXB0JztcbmltcG9ydCB7RG9vclNjcmlwdH0gZnJvbSAnLi9Eb29yU2NyaXB0JztcbmltcG9ydCB7RmFkZUluU2NyaXB0fSBmcm9tICcuL0ZhZGVJblNjcmlwdCc7XG5pbXBvcnQge1ZpbGxhZ2VyQW5pbWF0aW9uU2NyaXB0fSBmcm9tICcuL1ZpbGxhZ2VyQW5pbWF0aW9uU2NyaXB0JztcbmltcG9ydCB7SG91c2VDb250cm9sbGVyU2NyaXB0fSBmcm9tICcuL0hvdXNlQ29udHJvbGxlclNjcmlwdCc7XG5pbXBvcnQge0V2ZW50VGltZXJTY3JpcHR9IGZyb20gJy4vRXZlbnRUaW1lclNjcmlwdCc7XG5pbXBvcnQge0luaXRpYXRlQ29udmVyc2F0aW9uU2NyaXB0fSBmcm9tICcuL0luaXRpYXRlQ29udmVyc2F0aW9uU2NyaXB0JztcbmltcG9ydCB7QnVsbGV0aW5Cb2FyZFNjcmlwdH0gZnJvbSAnLi9CdWxsZXRpbkJvYXJkU2NyaXB0JztcbmltcG9ydCB7SG91c2VTY3JpcHR9IGZyb20gJy4vSG91c2VTY3JpcHQnO1xuaW1wb3J0IHtSYW5rQm9hcmRTY3JpcHR9IGZyb20gJy4vUmFua0JvYXJkU2NyaXB0JztcbmltcG9ydCB7RGFya2VuU2NyaXB0fSBmcm9tICcuL0RhcmtlblNjcmlwdCc7XG5pbXBvcnQge01lc3NhZ2VCb3hTY3JpcHR9IGZyb20gJy4vTWVzc2FnZUJveFNjcmlwdCc7XG5pbXBvcnQge0ludHJvU2NyaXB0fSBmcm9tICcuL0ludHJvU2NyaXB0JztcblxuY29uc3Qgc2NyaXB0cyA9IHtcbiAgbW92ZW1lbnRJbnB1dFNjcmlwdDogTW92ZW1lbnRJbnB1dFNjcmlwdCxcbiAgYW5pbWF0aW9uU2NyaXB0OiBBbmltYXRpb25TY3JpcHQsXG4gIGRheU5pZ2h0Q3ljbGVTY3JpcHQ6IERheU5pZ2h0Q3ljbGVTY3JpcHQsXG4gIHZpbGxhZ2VyUmFua2luZ1N5c3RlbVNjcmlwdDogVmlsbGFnZXJSYW5raW5nU3lzdGVtU2NyaXB0LFxuICB2aWxsYWdlcklkZW50aXR5U3lzdGVtU2NyaXB0OiBWaWxsYWdlcklkZW50aXR5U3lzdGVtU2NyaXB0LFxuICBjYW1lcmFTY3JpcHQ6IENhbWVyYVNjcmlwdCxcbiAgaXRlbVN5c3RlbVNjcmlwdDogSXRlbVN5c3RlbVNjcmlwdCxcbiAgY3Jpc2lzU2NyaXB0OiBDcmlzaXNTY3JpcHQsXG4gIHRvc3NhYmxlU2NyaXB0OiBUb3NzYWJsZVNjcmlwdCxcbiAgZG9vclNjcmlwdDogRG9vclNjcmlwdCxcbiAgdmlsbGFnZXJBbmltYXRpb25TY3JpcHQ6IFZpbGxhZ2VyQW5pbWF0aW9uU2NyaXB0LFxuICBob3VzZUNvbnRyb2xsZXJTY3JpcHQ6IEhvdXNlQ29udHJvbGxlclNjcmlwdCxcbiAgZmFkZUluU2NyaXB0OiBGYWRlSW5TY3JpcHQsXG4gIGV2ZW50VGltZXJTY3JpcHQ6IEV2ZW50VGltZXJTY3JpcHQsXG4gIGluaXRpYXRlQ29udmVyc2F0aW9uU2NyaXB0OiBJbml0aWF0ZUNvbnZlcnNhdGlvblNjcmlwdCxcbiAgYnVsbGV0aW5Cb2FyZFNjcmlwdDogQnVsbGV0aW5Cb2FyZFNjcmlwdCxcbiAgaG91c2VTY3JpcHQ6IEhvdXNlU2NyaXB0LFxuICByYW5rQm9hcmRTY3JpcHQ6IFJhbmtCb2FyZFNjcmlwdCxcbiAgZGFya2VuU2NyaXB0OiBEYXJrZW5TY3JpcHQsXG4gIG1lc3NhZ2VCb3hTY3JpcHQ6IE1lc3NhZ2VCb3hTY3JpcHQsXG4gIGludHJvU2NyaXB0OiBJbnRyb1NjcmlwdFxufTtcblxuZXhwb3J0IHtzY3JpcHRzIGFzIFNjcmlwdHN9O1xuIiwiaW1wb3J0IHtsb2d9IGZyb20gJ0xvZyc7XG5pbXBvcnQge1NjcmlwdH0gZnJvbSAnU2NyaXB0JztcbmltcG9ydCB7RXZlbnRNYW59IGZyb20gJ01hbmFnZXJzL0V2ZW50TWFuYWdlcic7XG5pbXBvcnQge0NvbGxpc2lvbn0gZnJvbSAnQ29sbGlzaW9uJztcblxuY2xhc3MgVG9zc2FibGVTY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAnaW50ZXJhY3RfcGxheWVyJ1xuICAgICk7XG4gICAgdGhpcy5waWNrZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXQocGFyZW50LCByb290RW50aXR5KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5wbGF5ZXIgPSByb290RW50aXR5LmZpbmRFbnRpdGllc1dpdGhUYWcoJ3BsYXllcicpWzBdO1xuICB9XG5cbiAgdXBkYXRlKHBhcmVudCwgcm9vdEVudGl0eSwgZGVsdGEpIHtcbiAgICBpZiAodGhpcy5waWNrZWQpIHtcbiAgICAgIHBhcmVudC5waHlzaWNzLmJvZHkuYXdha2UgPSBmYWxzZTtcbiAgICAgIHBhcmVudC5wb3NpdGlvbi54ID0gdGhpcy5wbGF5ZXIucG9zaXRpb24ueDtcbiAgICAgIHBhcmVudC5wb3NpdGlvbi55ID0gdGhpcy5wbGF5ZXIucG9zaXRpb24ueSAtIDUwO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUdhbWVFdmVudChwYXJlbnQsIGV2dCkge1xuICAgIGlmIChldnQuZXZlbnRUeXBlID09PSAnaW50ZXJhY3RfcGxheWVyJykge1xuICAgICAgaWYgKHRoaXMucGlja2VkKSB7XG4gICAgICAgIGxldCBib2R5ID0gcGFyZW50LnBoeXNpY3MuYm9keTtcbiAgICAgICAgYm9keS5hd2FrZSA9IHRydWU7XG4gICAgICAgIGJvZHkucG9zLnggPSBwYXJlbnQucG9zaXRpb24ueDtcbiAgICAgICAgYm9keS5wb3MueSA9IHBhcmVudC5wb3NpdGlvbi55O1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZmFjaW5nUmlnaHQpIHtcbiAgICAgICAgICBib2R5LnZlbC54ID0gMC41O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvZHkudmVsLnggPSAtMC41O1xuICAgICAgICB9XG4gICAgICAgIHBhcmVudC5waHlzaWNzLmJvZHkudmVsLnkgPSAtMC41O1xuICAgICAgICB0aGlzLnBpY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBsYXllci5oYXNJdGVtID0gZmFsc2U7XG4gICAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ2l0ZW1fdGhyb3duJywgcGFyYW1ldGVyczoge2l0ZW06IHRoaXMucGFyZW50fX0pO1xuICAgICAgfSBlbHNlIGlmIChDb2xsaXNpb24uYWFiYlRlc3RGYXN0KHBhcmVudC5waHlzaWNzLmJvZHksIHRoaXMucGxheWVyLnBoeXNpY3MuYm9keSkpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmhhc0l0ZW0pIHtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucGlja2VkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnBsYXllci5oYXNJdGVtID0gdHJ1ZTtcbiAgICAgICAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdpdGVtX3BpY2tlZCcsIHBhcmFtZXRlcnM6IHtpdGVtOiB0aGlzLnBhcmVudH19KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge1Rvc3NhYmxlU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0lucHV0TWFuIGFzIElucHV0fSBmcm9tICdNYW5hZ2Vycy9JbnB1dE1hbmFnZXInO1xuaW1wb3J0IHtFdmVudE1hbn0gZnJvbSAnTWFuYWdlcnMvRXZlbnRNYW5hZ2VyJztcbmltcG9ydCB7cmVzb3VyY2VzfSBmcm9tICdNYW5hZ2Vycy9SZXNvdXJjZU1hbmFnZXInO1xuaW1wb3J0IHtyYW5kfSBmcm9tICdVdGlscy9OdW1VdGlsJztcblxuY2xhc3MgVmlsbGFnZXJBbmltYXRpb25TY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAnYW5pbWF0aW9uX3Rlc3QnXG4gICAgKTtcbiAgICBsZXQgYWxscGFydHMgPSB0aGlzLmdldFZpbGxhZ2VyUGFydHMoKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICBsZXQgcGFydG5hbWVzID0gT2JqZWN0LmtleXModGhpcy5wYXJ0cyk7XG4gICAgdGhpcy5wYXJ0cy5ib2R5ID0gYWxscGFydHMuYm9keVtyYW5kKGFsbHBhcnRzLmJvZHkubGVuZ3RoKV07XG4gICAgdGhpcy5wYXJ0cy5oZWFkID0gYWxscGFydHMuaGVhZFtyYW5kKGFsbHBhcnRzLmhlYWQubGVuZ3RoKV07XG4gICAgdGhpcy5wYXJ0cy5oYWlyID0gYWxscGFydHMuaGFpcltyYW5kKGFsbHBhcnRzLmhhaXIubGVuZ3RoKV07XG4gICAgdGhpcy5wYXJ0cy5saW1icyA9IGFsbHBhcnRzLmxpbWJzW3JhbmQoYWxscGFydHMubGltYnMubGVuZ3RoKV07XG4gICAgLy8gdGhpcy5wYXJ0cy5cbiAgICB0aGlzLnRpbWVBdEN1cnJlbnRGcmFtZSA9IC0xO1xuICAgIHRoaXMuZHVyYXRpb24gPSAyMDAwO1xuICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcbiAgfVxuXG4gIGluaXQocGFyZW50LCByb290RW50aXR5KSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5wYXJ0cyk7XG4gICAgbGV0IHNwcml0ZXMgPSB7fTtcbiAgICBzcHJpdGVzLmhlYWQgPSBuZXcgUElYSS5TcHJpdGUoKTtcbiAgICBzcHJpdGVzLmJvZHkgPSBuZXcgUElYSS5TcHJpdGUoKTtcbiAgICBzcHJpdGVzLmxpbWJzID0gbmV3IFBJWEkuU3ByaXRlKCk7XG4gICAgc3ByaXRlcy5oYWlyID0gbmV3IFBJWEkuU3ByaXRlKCk7XG4gICAgc3ByaXRlcy5oZWFkLnRleHR1cmUgPSByZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzWydzcHJpdGVfbnBjX2hlYWRfJyArIHRoaXMucGFydHMuaGVhZCArICdfMCddO1xuICAgIHNwcml0ZXMuYm9keS50ZXh0dXJlID0gcmVzb3VyY2VzLnNwcml0ZS50ZXh0dXJlc1snc3ByaXRlX25wY19ib2R5XycgKyB0aGlzLnBhcnRzLmJvZHkgKyAnXzAnXTtcbiAgICBzcHJpdGVzLmxpbWJzLnRleHR1cmUgPSByZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzWydzcHJpdGVfbnBjX2xpbWJzXycgKyB0aGlzLnBhcnRzLmxpbWJzICsgJ18wJ107XG4gICAgc3ByaXRlcy5oYWlyLnRleHR1cmUgPSByZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzWydzcHJpdGVfbnBjX2hhaXJfJyArIHRoaXMucGFydHMuaGFpciArICdfMCddO1xuICAgIHRoaXMuc3ByaXRlcyA9IHNwcml0ZXM7XG4gICAgT2JqZWN0LmtleXMoc3ByaXRlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgc3ByaXRlc1trZXldLmFuY2hvciA9IHtcbiAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgIHk6IDAuNVxuICAgICAgICAgIH07XG5cbiAgICB9KTtcbiAgICBwYXJlbnQuYWRkQ2hpbGQoc3ByaXRlcy5saW1icyk7XG4gICAgcGFyZW50LmFkZENoaWxkKHNwcml0ZXMuYm9keSk7XG4gICAgcGFyZW50LmFkZENoaWxkKHNwcml0ZXMuaGVhZCk7XG4gICAgcGFyZW50LmFkZENoaWxkKHNwcml0ZXMuaGFpcik7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGlmKHRoaXMudGltZUF0Q3VycmVudEZyYW1lID4gdGhpcy5kdXJhdGlvbiB8fCB0aGlzLnRpbWVBdEN1cnJlbnRGcmFtZSA9PT0gLTEpe1xuICAgICAgY29uc3QgbmV3RnJhbWUgPSAodGhpcy5jdXJyZW50RnJhbWUgKyAxKSAlIDI7XG4gICAgICB0aGlzLnNwcml0ZXMuaGVhZC50ZXh0dXJlID0gcmVzb3VyY2VzLnNwcml0ZS50ZXh0dXJlc1snc3ByaXRlX25wY19oZWFkXycgKyB0aGlzLnBhcnRzLmhlYWQgKyAnXycgKyBuZXdGcmFtZV07XG4gICAgICB0aGlzLnNwcml0ZXMuYm9keS50ZXh0dXJlID0gcmVzb3VyY2VzLnNwcml0ZS50ZXh0dXJlc1snc3ByaXRlX25wY19ib2R5XycgKyB0aGlzLnBhcnRzLmJvZHkgKyAnXycrIG5ld0ZyYW1lXTtcbiAgICAgIHRoaXMuc3ByaXRlcy5saW1icy50ZXh0dXJlID0gcmVzb3VyY2VzLnNwcml0ZS50ZXh0dXJlc1snc3ByaXRlX25wY19saW1ic18nICsgdGhpcy5wYXJ0cy5saW1icyArICdfJysgbmV3RnJhbWVdO1xuICAgICAgdGhpcy5zcHJpdGVzLmhhaXIudGV4dHVyZSA9IHJlc291cmNlcy5zcHJpdGUudGV4dHVyZXNbJ3Nwcml0ZV9ucGNfaGFpcl8nICsgdGhpcy5wYXJ0cy5oYWlyICsgJ18nKyBuZXdGcmFtZV07XG4gICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IG5ld0ZyYW1lO1xuICAgICAgdGhpcy50aW1lQXRDdXJyZW50RnJhbWUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVBdEN1cnJlbnRGcmFtZSArPSBkZWx0YTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVHYW1lRXZlbnQocGFyZW50LCBldnQpIHtcbiAgICAvLyBsb2cuZGVidWcoJ0FuaW0gc2NyaXB0OiAnICsgZXZ0LnBhcmFtZXRlcnMubWVzc2FnZSk7XG4gIH1cblxuICBnZXRWaWxsYWdlclBhcnRzKCl7XG4gICAgbGV0IHBhcnRzID0ge1xuICAgICAgaGVhZDogW10sXG4gICAgICBib2R5OiBbXSxcbiAgICAgIGhhaXI6IFtdLFxuICAgICAgbGltYnM6IFtdXG4gICAgfTtcbiAgICBPYmplY3Qua2V5cyhyZXNvdXJjZXMuc3ByaXRlLnRleHR1cmVzKS5mb3JFYWNoKCBrZXkgPT4ge1xuICAgICAgbGV0IHNwbGl0dGVkID0ga2V5LnNwbGl0KCdfJyk7XG4gICAgICBpZiAoc3BsaXR0ZWRbMF0gPT09ICdzcHJpdGUnICYmIHNwbGl0dGVkWzFdID09PSAnbnBjJykge1xuICAgICAgICBpZihwYXJ0c1tzcGxpdHRlZFsyXV0uaW5kZXhPZihzcGxpdHRlZFszXSkgPCAwKXtcbiAgICAgICAgICBwYXJ0c1tzcGxpdHRlZFsyXV0ucHVzaChzcGxpdHRlZFszXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcGFydHM7XG4gIH1cbn1cblxuXG5leHBvcnQge1ZpbGxhZ2VyQW5pbWF0aW9uU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtyZXNvdXJjZXN9IGZyb20gJ01hbmFnZXJzL1Jlc291cmNlTWFuYWdlcic7XG5pbXBvcnQge3JhbmR9IGZyb20gJ1V0aWxzL051bVV0aWwnO1xuaW1wb3J0IHtFbnRpdHl9IGZyb20gJ0VudGl0eSc7XG5cbmNsYXNzIFZpbGxhZ2VySWRlbnRpdHlTeXN0ZW1TY3JpcHQgZXh0ZW5kcyBTY3JpcHQge1xuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJzKSB7XG4gICAgc3VwZXIocGFyYW1ldGVycyk7XG4gICAgdGhpcy5ldmVudFR5cGVzLnB1c2goXG4gICAgICAndmlsbGFnZXJfcml0dWFsaXplZCdcbiAgICApO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgICB0aGlzLnZpbGxhZ2VycyA9IHJvb3RFbnRpdHkuZmluZEVudGl0aWVzV2l0aFRhZygndmlsbGFnZXInKTtcbiAgICB0aGlzLnZpbGxhZ2UgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCd2aWxsYWdlJyk7XG4gICAgdGhpcy52aWxsYWdlLmhvdXNlcyA9IHRoaXMudmlsbGFnZS5ob3VzZXMgfHwgcm9vdEVudGl0eS5maW5kRW50aXRpZXNXaXRoVGFnKCdsb2NhdGlvbl9ob3VzZScpO1xuICAgIHRoaXMudmlsbGFnZS5pdGVtcyA9IHRoaXMudmlsbGFnZS5pdGVtcyB8fCByb290RW50aXR5LmZpbmRFbnRpdGllc1dpdGhUYWcoJ2l0ZW0nKTtcbiAgICB0aGlzLnZpbGxhZ2UubnBjcyA9IHJvb3RFbnRpdHkuZmluZEVudGl0aWVzV2l0aFRhZygnbnBjJyk7XG4gICAgdGhpcy52aWxsYWdlLnBsYXllciA9IHJvb3RFbnRpdHkuZmluZEVudGl0eVdpdGhUYWcoJ3BsYXllcicpO1xuXG4gICAgbGV0IHNwYXduZXIgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCdzcGF3bl92aWxsYWdlcicpO1xuXG4gICAgLy8gcGFyZW50LnZpbGxhZ2VycyA9IHJvb3RFbnRpdHkuZmluZEVudGl0aWVzV2l0aFRhZygndmlsbGFnZXInKTtcbiAgICBwYXJlbnQudmlsbGFnZXJzID0gdGhpcy52aWxsYWdlcnM7XG4gICAgdGhpcy52aWxsYWdlLnZpbGxhZ2VzID0gdGhpcy52aWxsYWdlcnM7XG4gICAgLy8gbG9nLmRlYnVnKHBhcmVudCk7XG5cbiAgICB0aGlzLnJvbGVzID0gW107XG4gICAgdGhpcy5yZXNlcnZlZE5hbWVzID0gW107XG5cbiAgICBsZXQgZnJlZUhvdXNlcyA9IFtdO1xuXG4gICAgdGhpcy52aWxsYWdlLmhvdXNlcy5mb3JFYWNoKGggPT4ge1xuICAgICAgaWYgKGgubmFtZS5pbmRleE9mKCd0b3duX2hhbGwnKSA9PT0gLTEpIHtcbiAgICAgICAgZnJlZUhvdXNlcy5wdXNoKGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVzb3VyY2VzLmlkZW50aXRpZXMuZGF0YS5yb2xlcy5mb3JFYWNoKGUgPT4gdGhpcy5yb2xlcy5wdXNoKGUpKTtcblxuICAgIGxldCBmbmFtZXMgPSByZXNvdXJjZXMuaWRlbnRpdGllcy5kYXRhLmZuYW1lcztcbiAgICBsZXQgc25hbWVzID0gcmVzb3VyY2VzLmlkZW50aXRpZXMuZGF0YS5zbmFtZXM7XG4gICAgbGV0IGlkQ291bnRlciA9IDE7XG4gICAgdGhpcy52aWxsYWdlcnMuZm9yRWFjaCh2aWxsYWdlciA9PiB7XG4gICAgICBpZiAodmlsbGFnZXIudGFncy5pbmRleE9mKCdwbGF5ZXInKSA9PT0gLTEpIHtcbiAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBsZXQgZm5hbWUgPSBmbmFtZXNbcmFuZChmbmFtZXMubGVuZ3RoKV07XG4gICAgICAgICAgbGV0IHNuYW1lID0gc25hbWVzW3JhbmQoc25hbWVzLmxlbmd0aCldO1xuICAgICAgICAgIG5hbWUgPSBmbmFtZSArICcgJyArIHNuYW1lO1xuICAgICAgICB9IHdoaWxlICh0aGlzLnJlc2VydmVkTmFtZXMuaW5kZXhPZihuYW1lKSAhPT0gLTEpO1xuICAgICAgICB0aGlzLnJlc2VydmVkTmFtZXMucHVzaChuYW1lKTtcbiAgICAgICAgbGV0IHJvbGUgPSB0aGlzLnJvbGVzLnNwbGljZShyYW5kKHRoaXMucm9sZXMubGVuZ3RoKSwgMSlbMF07XG4gICAgICAgIGxldCBoYXRlID0gdGhpcy52aWxsYWdlLml0ZW1zW3JhbmQodGhpcy52aWxsYWdlLml0ZW1zLmxlbmd0aCldO1xuICAgICAgICBsZXQgbG92ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGxvdmUgPSB0aGlzLnZpbGxhZ2UuaXRlbXNbcmFuZCh0aGlzLnZpbGxhZ2UuaXRlbXMubGVuZ3RoKV07XG4gICAgICAgIH0gd2hpbGUgKGxvdmUgPT09IGhhdGUpO1xuICAgICAgICBsZXQgaGlkID0gcmFuZChmcmVlSG91c2VzLmxlbmd0aCk7XG4gICAgICAgIHZpbGxhZ2VyLmhvdXNlID0gZnJlZUhvdXNlc1toaWRdO1xuICAgICAgICB2aWxsYWdlci5ob3VzZS52aWxsYWdlciA9IHZpbGxhZ2VyO1xuICAgICAgICBmcmVlSG91c2VzLnNwbGljZShoaWQsIDEpO1xuXG4gICAgICAgIHZpbGxhZ2VyLm5hbWUgPSBuYW1lO1xuICAgICAgICB2aWxsYWdlci5yb2xlID0gcm9sZTtcbiAgICAgICAgdmlsbGFnZXIubG92ZSA9IGxvdmU7XG4gICAgICAgIHZpbGxhZ2VyLmhhdGUgPSBoYXRlO1xuICAgICAgICB2aWxsYWdlci5pZCA9ICd2aWxsYWdlcl8nICsgaWRDb3VudGVyKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWxsYWdlci5uYW1lID0gJ3NoZWVwJztcbiAgICAgICAgdmlsbGFnZXIucm9sZSA9ICdzaGVlcCc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGlmICghdGhpcy5maXJzdFVwZGF0ZSkge1xuICAgICAgRXZlbnRNYW4ucHVibGlzaCh7ZXZlbnRUeXBlOiAndmlsbGFnZXJzX3VwZGF0ZWQnLCBwYXJhbWV0ZXJzOiB7dXBkYXRlVHlwZTogJ2lkZW50aWZpZWQnfX0pO1xuICAgICAgdGhpcy5maXJzdFVwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICd2aWxsYWdlcl9yaXR1YWxpemVkJykge1xuICAgICAgbGV0IHJlbTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWxsYWdlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMudmlsbGFnZXJzW2ldLm5hbWUgPT09IGV2dC5wYXJhbWV0ZXJzLnZpbGxhZ2VyTmFtZSkge1xuICAgICAgICAgIHJlbSA9IGk7XG4gICAgICAgICAgdGhpcy52aWxsYWdlcnNbaV0uZGVhZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy52aWxsYWdlcnNbaV0ucGh5c2ljcy5ib2R5LnggPSAxNTAwMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlbSkge1xuICAgICAgICB0aGlzLnZpbGxhZ2Vycy5zcGxpY2UocmVtLCAxKTtcbiAgICAgIH1cbiAgICAgIEV2ZW50TWFuLnB1Ymxpc2goe2V2ZW50VHlwZTogJ3ZpbGxhZ2Vyc191cGRhdGVkJywgcGFyYW1ldGVyczoge3VwZGF0ZVR5cGU6ICdyaXR1YWxpemVkJ319KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtWaWxsYWdlcklkZW50aXR5U3lzdGVtU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IHtTY3JpcHR9IGZyb20gJ1NjcmlwdCc7XG5pbXBvcnQge0V2ZW50TWFufSBmcm9tICdNYW5hZ2Vycy9FdmVudE1hbmFnZXInO1xuaW1wb3J0IHtwb3B1bGF0ZVRlbXBsYXRlfSBmcm9tICdVdGlscy9TdHJpbmdVdGlsJztcblxuY2xhc3MgVmlsbGFnZXJSYW5raW5nU3lzdGVtU2NyaXB0IGV4dGVuZHMgU2NyaXB0IHtcbiAgY29uc3RydWN0b3IocGFyYW1ldGVycykge1xuICAgIHN1cGVyKHBhcmFtZXRlcnMpO1xuICAgIHRoaXMuZXZlbnRUeXBlcy5wdXNoKFxuICAgICAgJ3JhbmtfY2hhbmdlJyxcbiAgICAgICdyYW5rX2FwcGx5JyxcbiAgICAgICd2aWxsYWdlcnNfdXBkYXRlZCdcbiAgICApO1xuICAgIHRoaXMucmFua0NoYW5nZXMgPSBbXTtcbiAgICB0aGlzLnZpbGxhZ2VycyA9IFtdO1xuICB9XG5cbiAgaW5pdChwYXJlbnQsIHJvb3RFbnRpdHkpIHtcbiAgICB0aGlzLnZpbGxhZ2UgPSByb290RW50aXR5LmZpbmRFbnRpdHlXaXRoVGFnKCd2aWxsYWdlJyk7XG4gIH1cblxuICB1cGRhdGUocGFyZW50LCByb290RW50aXR5LCBkZWx0YSkge1xuXG4gIH1cblxuICBhcHBseVJhbmtDaGFuZ2VzKCkge1xuICAgIGxldCByYW5rcyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWxsYWdlLnZpbGxhZ2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgcmFua3NbdGhpcy52aWxsYWdlLnZpbGxhZ2Vyc1tpXS5uYW1lXSA9IGk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yYW5rQ2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHJhbmtDaGFuZ2UgPSB0aGlzLnJhbmtDaGFuZ2VzW2ldO1xuICAgICAgcmFua3NbcmFua0NoYW5nZS52aWxsYWdlck5hbWVdICs9IHJhbmtDaGFuZ2UucmFua0NoYW5nZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZpbGxhZ2UudmlsbGFnZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbmFtZSA9IHRoaXMudmlsbGFnZS52aWxsYWdlcnNbaV0ubmFtZTtcbiAgICAgIGxvZy5kZWJ1ZyhuYW1lICsgJyAnICsgcmFua3NbbmFtZV0pO1xuICAgIH1cbiAgICB0aGlzLnZpbGxhZ2Vycy5zb3J0KChsLCByKSA9PiB7XG4gICAgICAgIHJldHVybiByYW5rc1tsLm5hbWVdIC0gcmFua3Nbci5uYW1lXTtcbiAgICB9KTtcbiAgICBFdmVudE1hbi5wdWJsaXNoKHtldmVudFR5cGU6ICdyYW5rX2FwcGx5X2VuZCcsIHBhcmFtZXRlcnM6IHtyYW5rQ2hhbmdlczogdGhpcy5yYW5rQ2hhbmdlc319KTtcbiAgICB0aGlzLnJhbmtDaGFuZ2VzID0gW107XG4gIH1cblxuICBmaW5kVmlsbGFnZXIobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnZpbGxhZ2Vyc1tmaW5kVmlsbGFnZXJJbmRleChuYW1lKV07XG4gIH1cblxuICBmaW5kVmlsbGFnZXJJbmRleChuYW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZpbGxhZ2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHYgPSB0aGlzLnZpbGxhZ2Vyc1tpXTtcbiAgICAgIGlmICh2Lm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlR2FtZUV2ZW50KHBhcmVudCwgZXZ0KSB7XG4gICAgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdyYW5rX2NoYW5nZScpIHtcbiAgICAgIHRoaXMucmFua0NoYW5nZXMucHVzaCh7dmlsbGFnZXJOYW1lOiBldnQucGFyYW1ldGVycy52aWxsYWdlck5hbWUsIHJhbmtDaGFuZ2U6IGV2dC5wYXJhbWV0ZXJzLnJhbmtDaGFuZ2V9KTtcbiAgICB9IGVsc2UgaWYgKGV2dC5ldmVudFR5cGUgPT09ICdyYW5rX2FwcGx5X3N0YXJ0Jykge1xuICAgICAgdGhpcy5hcHBseVJhbmtDaGFuZ2VzKCk7XG4gICAgfSBlbHNlIGlmIChldnQuZXZlbnRUeXBlID09PSAndmlsbGFnZXJzX3VwZGF0ZWQnKSB7XG4gICAgICB0aGlzLnZpbGxhZ2VycyA9IHBhcmVudC52aWxsYWdlcnM7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7VmlsbGFnZXJSYW5raW5nU3lzdGVtU2NyaXB0fTtcbiIsImltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuXG5jbGFzcyBTeXN0ZW0ge1xuICBjb25zdHJ1Y3RvcigpIHt9XG5cbiAgdXBkYXRlRW50aXRpZXMoZW50aXR5LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGVudGl0eS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVFbnRpdGllcyhjaGlsZCwgcm9vdEVudGl0eSwgZGVsdGEpO1xuICAgIH0pO1xuICAgIHRoaXMuYXBwbHlTeXN0ZW0oZW50aXR5LCByb290RW50aXR5LCBkZWx0YSk7XG4gIH1cblxuICBhcHBseVN5c3RlbShlbnRpdHksIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgbG9nLndhcm4oJ1N5c3RlbSBhcHBseSBub3QgZGVmaW5lZCcpO1xuICB9XG5cbiAgdXBkYXRlU3lzdGVtKHJvb3RFbnRpdHksIGRlbHRhKSB7fVxuXG4gIHVwZGF0ZShyb290RW50aXR5LCBkZWx0YSkge1xuICAgIHRoaXMudXBkYXRlU3lzdGVtKHJvb3RFbnRpdHksIGRlbHRhKTtcbiAgICB0aGlzLnVwZGF0ZUVudGl0aWVzKHJvb3RFbnRpdHksIHJvb3RFbnRpdHksIGRlbHRhKTtcbiAgfVxuXG59XG5cblxuZXhwb3J0IHtTeXN0ZW19O1xuIiwiaW1wb3J0IHtTeXN0ZW19IGZyb20gJ1N5c3RlbSc7XG5pbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcblxuY2xhc3MgRXZlbnRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBhcHBseVN5c3RlbShlbnRpdHksIHJvb3RFbnRpdHksIGRlbHRhKSB7XG4gICAgaWYgKGVudGl0eS5oYW5kbGVFdmVudHMpIHtcbiAgICAgIGVudGl0eS5oYW5kbGVFdmVudHMoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtFdmVudFN5c3RlbX07XG4iLCJpbXBvcnQge1N5c3RlbX0gZnJvbSAnU3lzdGVtJztcbmltcG9ydCB7bG9nfSBmcm9tICdMb2cnO1xuaW1wb3J0IGNmZyBmcm9tICdjb25maWcuanNvbic7XG5pbXBvcnQge1BoeXNpY3N9IGZyb20gJ1BoeXNpY3MnO1xuXG5jbGFzcyBQaHlzaWNzU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgY29uc3RydWN0b3IodGltZVN0ZXAgPSAzLCBtYXhJUEYgPSAxNiwgaW50ZWdyYXRvciA9ICd2ZXJsZXQnKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLndvcmxkID0gbmV3IFBoeXNpY3MoKTtcbiAgICAvLyB0aGlzLnRpbWUgPSAwLjA7XG4gICAgLy8gdGhpcy53b3JsZCA9IFBoeXNpY3Moe1xuICAgIC8vICAgLy8gc2V0IHRoZSB0aW1lc3RlcFxuICAgIC8vICAgdGltZXN0ZXA6IHRpbWVTdGVwLFxuICAgIC8vICAgLy8gbWF4aW11bSBudW1iZXIgb2YgaXRlcmF0aW9ucyBwZXIgc3RlcFxuICAgIC8vICAgbWF4SVBGOiBtYXhJUEYsXG4gICAgLy8gICAvLyBzZXQgdGhlIGludGVncmF0b3IgKG1heSBhbHNvIGJlIHNldCB3aXRoIHdvcmxkLmFkZCgpKVxuICAgIC8vICAgaW50ZWdyYXRvcjogaW50ZWdyYXRvcixcbiAgICAvLyAgIC8vTm90aGluZyBzbGVlcHNcbiAgICAvLyAgIHNsZWVwRGlzYWJsZWQ6IHRydWVcbiAgICAvLyB9KTtcbiAgICBpZiAoY2ZnLmRlYnVnTW9kZSkgdGhpcy5kZWJ1ZygpO1xuICB9XG5cbiAgYWRkRW50aXR5KGVudGl0eSkge1xuICAgIGlmIChlbnRpdHkucGh5c2ljcyAmJiBlbnRpdHkucGh5c2ljcy5ib2R5KSB7XG4gICAgICBpZiAoZW50aXR5LnBoeXNpY3MuYm9keS5zdGF0aWMpIHtcbiAgICAgICAgdGhpcy53b3JsZC5zdGF0aWNCb2RpZXMucHVzaChlbnRpdHkucGh5c2ljcy5ib2R5KTtcbiAgICAgIH0gZWxzZSBpZiAoZW50aXR5LnBoeXNpY3MuYm9keS50cmlnZ2VyKSB7XG4gICAgICAgICB0aGlzLndvcmxkLnRyaWdnZXJzLnB1c2goZW50aXR5LnBoeXNpY3MuYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndvcmxkLmR5bmFtaWNCb2RpZXMucHVzaChlbnRpdHkucGh5c2ljcy5ib2R5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdDYW5ub3QgYWRkIHRvIHBoeXNpY3M6IGVudGl0eSBkb2VzIG5vdCBoYXZlIGEgYm9keSEnKTtcbiAgICB9XG4gIH1cblxuXG4gIGRlYnVnKCkge1xuICAgIHRoaXMud29ybGQuYWRkQmVoYXZpb3Ioe1xuICAgICAgdmVsOiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAuMDAxMlxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXBwbHlTeXN0ZW0oZW50aXR5LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGlmIChlbnRpdHkucGh5c2ljcykge1xuICAgICAgaWYgKCFlbnRpdHkucGh5c2ljcy5pbldvcmxkKSB7XG4gICAgICAgIC8vIGxvZy5kZWJ1ZygnQWRkaW5nIHRvIHdvcmxkJyk7XG4gICAgICAgIHRoaXMud29ybGQuYWRkRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGVudGl0eS5waHlzaWNzLmluV29ybGQgPSB0cnVlO1xuICAgICAgICAvLyBsb2cuZGVidWcoZW50aXR5LnBoeXNpY3MuYm9keS5zdGF0ZSk7XG4gICAgICB9XG4gICAgICAvLyBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbnRpdHkgdG8gdGhhdCBvZiB0aGVcbiAgICAgIC8vIGJvZHlcbiAgICAgIGVudGl0eS5wb3NpdGlvbiA9IHtcbiAgICAgICAgeDogZW50aXR5LnBoeXNpY3MuYm9keS5wb3MueCxcbiAgICAgICAgeTogZW50aXR5LnBoeXNpY3MuYm9keS5wb3MueVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVTeXN0ZW0ocm9vdEVudGl0eSwgZGVsdGEpIHtcbiAgICB0aGlzLndvcmxkLnN0ZXAoZGVsdGEpO1xuICAgIC8vIGxvZy5kZWJ1Zyh0aGlzLndvcmxkKTtcbiAgfVxufVxuXG5leHBvcnQge1BoeXNpY3NTeXN0ZW19O1xuIiwiaW1wb3J0IHtTeXN0ZW19IGZyb20gJ1N5c3RlbSc7XG5pbXBvcnQge2xvZ30gZnJvbSAnTG9nJztcblxuY2xhc3MgU2NyaXB0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgYXBwbHlTeXN0ZW0oZW50aXR5LCByb290RW50aXR5LCBkZWx0YSkge1xuICAgIGlmIChlbnRpdHkuc2NyaXB0cykge1xuICAgICAgZW50aXR5LnNjcmlwdHMuZm9yRWFjaCgoc2NyaXB0T2JqKSA9PiB7XG4gICAgICAgIHNjcmlwdE9iai51cGRhdGUoZW50aXR5LCByb290RW50aXR5LCBkZWx0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtTY3JpcHRTeXN0ZW19O1xuIiwiZnVuY3Rpb24gcmFuZCAocmFuZ2UpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiByYW5nZSkpO1xufVxuXG5leHBvcnQge3JhbmR9O1xuIiwid2luZG93LldlYkZvbnRDb25maWcgPSB7XG4gIGdvb2dsZToge1xuICAgICAgZmFtaWxpZXM6IFsnSW5kaWUgRmxvd2VyJywgJ0Fydm86NzAwaXRhbGljJywgJ1BvZGtvdmE6NzAwJ11cbiAgfSxcblxuICBhY3RpdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gZG8gc29tZXRoaW5nXG4gICAgICBpbml0KCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHBvcHVsYXRlVGVtcGxhdGUoc3RyaW5nLCBvYmplY3Qpe1xuICBsZXQgcGFydHMgPSBzdHJpbmcuc3BsaXQoJyAnKTtcbiAgbGV0IHBvcGwgPSBwYXJ0cy5tYXAod29yZCA9PiB7XG4gICAgaWYod29yZFswXSA9PT0gJyUnKXtcbiAgICAgIGxldCBsaSA9IHdvcmQubGFzdEluZGV4T2YoJyUnKTtcbiAgICAgIGxldCBzbGkgPSB3b3JkLnNsaWNlKDEsIGxpKTtcbiAgICAgIHJldHVybiB3b3JkLnJlcGxhY2UoLyUuKiUvLCBvYmplY3Rbc2xpXSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHBvcGwuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiB0ZXN0V2hpdGUoeCkge1xuICB2YXIgd2hpdGUgPSBuZXcgUmVnRXhwKC9eXFxzJC8pO1xuICByZXR1cm4gd2hpdGUudGVzdCh4LmNoYXJBdCgwKSk7XG59XG5cbmZ1bmN0aW9uIHdvcmRXcmFwKHN0ciwgbWF4V2lkdGgpIHtcbiAgbGV0IG5ld0xpbmVTdHIgPSAnXFxuJzsgbGV0IGRvbmUgPSBmYWxzZTsgbGV0IHJlcyA9ICcnO1xuICBkbyB7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgLy8gSW5zZXJ0cyBuZXcgbGluZSBhdCBmaXJzdCB3aGl0ZXNwYWNlIG9mIHRoZSBsaW5lXG4gICAgZm9yIChsZXQgaSA9IG1heFdpZHRoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmICh0ZXN0V2hpdGUoc3RyLmNoYXJBdChpKSkpIHtcbiAgICAgICAgcmVzID0gcmVzICsgW3N0ci5zbGljZSgwLCBpKSwgbmV3TGluZVN0cl0uam9pbignJyk7XG4gICAgICAgIHN0ciA9IHN0ci5zbGljZShpICsgMSk7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEluc2VydHMgbmV3IGxpbmUgYXQgbWF4V2lkdGggcG9zaXRpb24sIHRoZSB3b3JkIGlzIHRvbyBsb25nIHRvIHdyYXBcbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICByZXMgKz0gW3N0ci5zbGljZSgwLCBtYXhXaWR0aCksIG5ld0xpbmVTdHJdLmpvaW4oJycpO1xuICAgICAgc3RyID0gc3RyLnNsaWNlKG1heFdpZHRoKTtcbiAgICB9XG5cbiAgICBpZiAoc3RyLmxlbmd0aCA8IG1heFdpZHRoKVxuICAgICAgZG9uZSA9IHRydWU7XG4gIH0gd2hpbGUgKCFkb25lKTtcblxuICByZXR1cm4gcmVzICsgc3RyO1xufVxuXG5leHBvcnQge3BvcHVsYXRlVGVtcGxhdGUsIHdvcmRXcmFwfTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblxuICBcImxlZnRcIjogMzcsXG4gIFwidXBcIjogMzgsXG4gIFwicmlnaHRcIjogMzksXG4gIFwiZG93blwiOiA0MCxcbiAgXCJpbnRlcmFjdFwiOiAzMlxufVxuIl19
