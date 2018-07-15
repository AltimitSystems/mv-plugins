/*
 * MIT License
 *
 * Copyright (c) 2017-2018 Altimit Community Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//=============================================================================
// AltimitMovement.js
//=============================================================================

/*:
 * @plugindesc Vector-based character movement and collision
 * @author Altimit Community Contributors
 *
 * @param player
 * @text Player
 * @desc Parameters related to player character.
 *
 * @param player_collider_list
 * @text Collider
 * @desc Default collider list for player character.
 * @parent player
 * @type note
 * @default "<circle cx='0.5' cy='0.7' r='0.25' />"
 *
 * @param player_circular_movement
 * @text Normalize the movement?
 * @desc Should the diagonal movement be the same distance as the straight movement?
 * @parent player
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param
 *
 * @param followers
 * @text Followers
 * @desc Parameters related to party followers.
 *
 * @param followers_distance
 * @text Follow distance
 * @desc Distance of 1 results in a tight chain. Distance of 2 will double the spacing.
 * @parent followers
 * @type number
 * @min 0
 * @decimals 2
 * @default 1.50
 *
 * @param followers_collider_list
 * @text Collider
 * @desc Default collider list for followers.
 * @parent followers
 * @type note
 * @default "<circle cx='0.5' cy='0.7' r='0.25' />"
 *
 * @param followers_circular_movement
 * @text Normalize the movement?
 * @desc Should the diagonal movement be the same distance as the straight movement?
 * @parent followers
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param
 *
 * @param vehicles
 * @text Vehicles
 * @desc Parameters related to the vehicles.
 *
 * @param vehicles_boat_collider_list
 * @text Boat collider
 * @desc Default collider list for the boat.
 * @parent vehicles
 * @type note
 * @default "<circle cx='0.5' cy='0.5' r='0.333' />"
 *
 * @param vehicles_ship_collider_list
 * @text Ship collider
 * @desc Default collider list for the ship.
 * @parent vehicles
 * @type note
 * @default "<circle cx='0.5' cy='0.5' r='0.5' />"
 *
 * @param vehicles_airship_collider_list
 * @text Airship collider
 * @desc Default collider list for the airship.
 * @parent vehicles
 * @type note
 * @default "<circle cx='0.5' cy='0.5' r='0.25' />"
 *
 * @param
 *
 * @param event
 * @text Events
 * @desc Parameters related to events.
 *
 * @param event_character_collider_list
 * @text Character collider
 * @desc Default collider list for character events.
 * @parent event
 * @type note
 * @default "<circle cx='0.5' cy='0.7' r='0.25' />"
 *
 * @param event_tile_collider_list
 * @text Tile collider
 * @desc Default collider list for tile events.
 * @parent event
 * @type note
 * @default "<rect x='0' y='0' width='1' height='1' />"
 *
 * @param
 *
 * @param presets
 * @text Collider presets
 * @desc Preset colliders to be referenced by events.
 * @type note[]
 * @default []
 *
 * @param
 *
 * @param move_route
 * @text Move route behaviour
 * @desc Parameters related to character move routes.
 *
 * @param move_route_align_grid
 * @text Align move-routes to grid?
 * @desc If character is offset on a tile align them to the tile grid when moving.
 * @parent move_route
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param
 *
 * @param input_config
 * @text Input config
 * @desc Configuration for input method.
 *
 * @param input_config_enable_touch_mouse
 * @text Use touch/mouse?
 * @desc Enables pointer-based input.
 * @parent input_config
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param input_config_gamepad_mode
 * @text Gamepad mode
 * @desc Gamepad analogue stick input control.
 * @parent input_config
 * @type select
 * @option Movement + Facing
 * @value 3
 * @option Movement only
 * @value 2
 * @option Facing only
 * @value 1
 * @option Disabled
 * @value 0
 * @default 3
 *
 * @param
 *
 * @param play_test
 * @text Play-testing
 * @desc Parameters when running in Play-test mode.
 *
 * @param play_test_collision_mesh_caching
 * @text Use cached collision?
 * @desc Disabled caching will re-compile the collision mesh for maps that are in-development.
 * @parent play_test
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @help
 *
 * Plugin Command:
 *   AltMovement collider set "foo bar" 5             # Event name "foo bar" collider to preset 5
 *   AltMovement collider set 2 "shape A"             # Event ID 2 collider to preset "shape A"
 *   AltMovement collider set this 1                  # Current event collider to preset 1
 *   AltMovement collider set player 3                # Player collider to preset 3
 *   AltMovement collider set boat "boat"             # Boat collider to preset "boat"
 *   AltMovement collider set ship "big boat"         # Ship collider to preset "big boat"
 *   AltMovement collider set airship "fly boat"      # Airship collider to preset "fly boat"
 *   AltMovement collider set follower0 2             # Follower 0 collider to preset 2
 *   AltMovement collider set follower1 2             # Follower 1 collider to preset 2
 *   AltMovement collider set follower2 "baz"         # Follower 2 collider to preset "baz"
 *
 *   AltMovement followers set distance 0.5           # Sets follower distance to 0.5 units
 *   AltMovement followers set 0 following false      # Stops follower 0 from following
 *   AltMovement followers set 1 following            # Enables follower 1 following
 *
 *   AltMovement move_align set false                 # Sets move route grid alignment to false
 *
 *   AltMovement move "foo bar" up 0.1                # Moves event named "foo bar" up 0.1 units
 *   AltMovement move 2 east 1 wait skip              # Moves event ID 2 east 1 unit, wait and skip
 *   AltMovement move this 9 0.5                      # Moves current event upper-right 0.5 units
 *   AltMovement move player top_left edge            # Moves player upper-left to tile edge
 *   AltMovement move follower0 away boat 2           # Moves follower 0 2 units away from boat
 *   AltMovement move follower2 toward follower0 0.5  # Moves follower 2 0.5 units towards follower 0
 *   AltMovement move airship random 6.5              # Moves airship in random direction 6.5 units
 *   AltMovement move this forward 1 skip             # Moves current event forward 1 unit
 *
 *   AltMovement input touch disable                  # Disables touch/mouse input
 *   AltMovement input mouse enable                   # Enables touch/mouse input
 *
 * Usage:
 *  Plugin will automatically apply when ON.
 *
 * About:
 *  Version 0.50 Beta
 *  Website https://github.com/AltimitSystems/mv-plugins/tree/master/movement
 */
( function() {

  var DOM_PARSER = new DOMParser();
  var PARAMETERS = PluginManager.parameters( 'AltimitMovement' );

  var GAME_PAD_THRESHOLD = 1 / 5;
  var GAME_PAD_LIMIT = 1 - GAME_PAD_THRESHOLD;

  /**
   * PLAYER
   */
  var PLAYER;
  ( function() {

    PLAYER = {
      CIRCULAR_MOVEMENT: ( PARAMETERS['player_circular_movement'] != 'false' ),
    };

    var colliderList = PARAMETERS['player_collider_list'];
    if ( colliderList ) {
      PLAYER.COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      PLAYER.COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.7' r='0.25' /></collider>";
    }

  } )();

  /**
   * FOLLOWERS
   */
  var FOLLOWERS;
  ( function() {

    FOLLOWERS = {
      DISTANCE: Number( PARAMETERS['followers_distance'] ),
      CIRCULAR_MOVEMENT: ( PARAMETERS['followers_circular_movement'] != 'false' ),
    };

    var colliderList = PARAMETERS['followers_collider_list'];
    if ( colliderList ) {
      FOLLOWERS.COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      FOLLOWERS.COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.7' r='0.25' /></collider>";
    }

  } )();

  /**
   * VEHICLES
   */
  var VEHICLES;
  ( function() {

    VEHICLES = {};

    var colliderList = PARAMETERS['vehicles_boat_collider_list'];
    if ( colliderList ) {
      VEHICLES.BOAT_COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      VEHICLES.BOAT_COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.5' r='0.333' /></collider>";
    }

    var colliderList = PARAMETERS['vehicles_ship_collider_list'];
    if ( colliderList ) {
      VEHICLES.SHIP_COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      VEHICLES.SHIP_COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.5' r='0.5' /></collider>";
    }

    var colliderList = PARAMETERS['vehicles_airship_collider_list'];
    if ( colliderList ) {
      VEHICLES.AIRSHIP_COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      VEHICLES.AIRSHIP_COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.5' r='0.25' /></collider>";
    }

  } )();

  /**
   * EVENT
   */
  var EVENT;
  ( function() {

    EVENT = {};

    var colliderList = PARAMETERS['event_character_collider_list'];
    if ( colliderList ) {
      EVENT.CHARACTER_COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      EVENT.CHARACTER_COLLIDER_LIST = "<collider><circle cx='0.5' cy='0.7' r='0.25' /></collider>";
    }

    var colliderList = PARAMETERS['event_tile_collider_list'];
    if ( colliderList ) {
      EVENT.TILE_COLLIDER_LIST = '<collider>' + JSON.parse( colliderList ) + '</collider>';
    } else {
      EVENT.TILE_COLLIDER_LIST = "<collider><rect x='0' y='0' width='1' height='1' /></collider>";
    }

  } )();

  /**
   * PRESETS
   */
  var PRESETS;
  ( function() {

    var presets = PARAMETERS['presets'];
    if ( presets ) {
      PRESETS = JSON.parse( presets );
    } else {
      PRESETS = [];
    }

  } )();

  var MOVE_ROUTE = {
    ALIGN_GRID: ( PARAMETERS['move_route_align_grid'] != 'false' ),
  };

  var INPUT_CONFIG = {
    ENABLE_TOUCH_MOUSE: ( PARAMETERS['input_config_enable_touch_mouse'] != 'false' ),
    GAMEPAD_MODE: parseInt( PARAMETERS['input_config_gamepad_mode'] ),
  };

  var PLAY_TEST = {
    COLLISION_MESH_CACHING: ( PARAMETERS['play_test_collision_mesh_caching'] != 'false' ),
  };

  /**
   * Game_System
   */
  ( function() {

    /**
     * Overrides
     */
   ( function() {

     var Game_System_initialize = Game_System.prototype.initialize;
     Game_System.prototype.initialize = function() {
        Game_System_initialize.call( this );
        this._eventColliders = [];

        this._staticMoveAlignGrid = MOVE_ROUTE.ALIGN_GRID;
        this._moveAlignGrid = MOVE_ROUTE.ALIGN_GRID;

        this._staticFollowerDistance = FOLLOWERS.DISTANCE;
        this._followerDistance = FOLLOWERS.DISTANCE;

        this._staticEnableTouchMouse = INPUT_CONFIG.ENABLE_TOUCH_MOUSE;
        this._enableTouchMouse = INPUT_CONFIG.ENABLE_TOUCH_MOUSE;
     };

     Game_System.prototype.createColliderFromXML = function( xml ) {
       return Collider.createFromXML( xml );
     };

   } )();

  } )();

  /**
   * Game_Interpreter
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
      Game_Interpreter.prototype.pluginCommand = function( command, args ) {
        Game_Interpreter_pluginCommand.call( this, command, args );
        if ( command === 'AltMovement' ) {
          switch ( args[0] ) {
          case 'collider':
            this.altMovementCollider( args );
            break;
          case 'followers':
            switch ( args[1] ) {
            case 'set':
              switch ( args[2] ) {
              case 'distance':
                $gameSystem._followerDistance = Number( args[3] );
                break;
              default:
                var index = parseInt( args[2] );
                switch ( args[3] ) {
                case 'following':
                  if ( args[4] ) {
                    switch ( args[4].toLowerCase() ) {
                    case 'disable':
                    case 'off':
                    case 'false':
                    case 'no':
                      $gamePlayer.followers().follower( index ).setFrozen( true );
                      break;
                    case 'enable':
                    case 'on':
                    case 'true':
                    case 'yes':
                      $gamePlayer.followers().follower( index ).setFrozen( false );
                      break;
                    }
                  } else {
                    $gamePlayer.followers().follower( index ).setFrozen( false );
                  }
                  break;
                }
                break;
              }
              break;
            }
            break;
          case 'move':
            this.altMovementMoveCharacter( args );
            break;
          case 'move_align':
            switch ( args[1] ) {
            case 'set':
              switch ( args[2].toLowerCase() ) {
              case 'disable':
              case 'off':
              case 'false':
              case 'no':
                $gameSystem._moveAlignGrid = false;
                break;
              case 'enable':
              case 'on':
              case 'true':
              case 'yes':
                $gameSystem._moveAlignGrid = true;
                break;
              }
              break;
            }
            break;
          case 'input':
            switch ( args[1] ) {
              case 'touch':
              case 'mouse':
                switch ( args[2].toLowerCase() ) {
                case 'disable':
                case 'off':
                case 'false':
                case 'no':
                  $gameSystem._enableTouchMouse = false;
                  break;
                case 'enable':
                case 'on':
                case 'true':
                case 'yes':
                  $gameSystem._enableTouchMouse = true;
                  break;
                }
                break;
            }
            break;
          }
        }
      };

      var Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
      Game_Interpreter.prototype.updateWaitMode = function() {
        if ( 'target' == this._waitMode ) {
          return this._character._moveTarget;
        }
        return Game_Interpreter_updateWaitMode.call( this );
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Interpreter.prototype.altMovementStringArgs = function( args ) {
        var str = args.join( ' ' );
        var args = [];
        var readingPart = false;
        var part = '';
        for ( var ii = 0; ii < str.length; ii++ ) {
          if ( str.charAt( ii ) === ' ' && !readingPart ) {
            args.push( part );
            part = '';
          } else {
            if ( str.charAt( ii ) === '\"' ) {
              readingPart = !readingPart;
            }
            part += str.charAt( ii );
          }
        }
        args.push( part );
        return args;
      };

      Game_Interpreter.prototype.altMovementCommandToDirection = function( command ) {
        var gc = Game_Character;
        switch ( command ) {
        case gc.ROUTE_MOVE_DOWN:
          return 2;
        case gc.ROUTE_MOVE_LEFT:
          return 4;
        case gc.ROUTE_MOVE_RIGHT:
          return 6;
        case gc.ROUTE_MOVE_UP:
          return 8;
        case gc.ROUTE_MOVE_LOWER_L:
          return 1;
        case gc.ROUTE_MOVE_LOWER_R:
          return 3;
        case gc.ROUTE_MOVE_UPPER_L:
          return 7;
        case gc.ROUTE_MOVE_UPPER_R:
          return 9;
        case gc.ROUTE_MOVE_RANDOM:
          return 1 + Math.randomInt( 8 );
        case gc.ROUTE_MOVE_FORWARD:
          return subject._direction;
        case gc.ROUTE_MOVE_BACKWARD:
          return subject.reverseDir( subject._direction );
        default:
          return 5;
        }
      };

      Game_Interpreter.prototype.altMovementCharacterEdgeDxDy = function( subject, dx, dy ) {
        var stepDistance;
        var box = subject.collider().aabbox;
        if ( dx && dy ) {
          var xd;
          if ( dx < 0 ) {
            var px = subject.x + box.left;
            xd = Math.floor( px ) - px;
          } else {
            var px = subject.x + box.right;
            xd = Math.ceil( px ) - px;
          }
          var yd;
          if ( dy < 0 ) {
            var py = subject.y + box.top;
            yd = Math.floor( py ) - py;
          } else {
            var py = subject.y + box.bottom;
            yd = Math.ceil( py ) - py;
          }

          stepDistance = xd < yd ? xd : yd;
        } else if ( dx ) {
          if ( dx < 0 ) {
            var px = subject.x + box.left;
            stepDistance = Math.floor( px ) - px;
          } else {
            var px = subject.x + box.right;
            stepDistance = Math.ceil( px ) - px;
          }
        } else {
          if ( dy < 0 ) {
            var py = subject.y + box.top;
            stepDistance = Math.floor( py ) - py;
          } else {
            var py = subject.y + box.bottom;
            stepDistance = Math.ceil( py ) - py;
          }
        }
        return stepDistance;
      };

      Game_Interpreter.prototype.altMovementProcessMoveCommand = function( subject, command, distance, options, object ) {
        $gameMap.refreshIfNeeded();
        this._character = subject;
        if ( options.wait ) {
          this.setWaitMode( 'target' );
        }
        subject._moveTargetSkippable = options.skip;
        subject._moveTarget = true;

        if ( object ) {
          var dx = object.x - subject.x;
          var dy = object.y - subject.y;
          var length = Math.sqrt( dx * dx + dy * dy );
          dx /= length;
          dy /= length;

          var stepDistance;
          if ( 'edge' == distance ) {
            stepDistance = this.altMovementCharacterEdgeDxDy( subject, dx, dy );
          } else {
            stepDistance = Number( distance );
          }

          if ( command == Game_Character.ROUTE_MOVE_AWAY ) {
            stepDistance *= -1;
          }

          subject._moveTargetX = subject.x + dx * stepDistance;
          subject._moveTargetY = subject.y + dy * stepDistance;
        } else {
          var direction = this.altMovementCommandToDirection( command );
          var dx = Direction.isLeft( direction ) ? -1 : ( Direction.isRight( direction ) ? 1 : 0 );
          var dy = Direction.isUp( direction ) ? -1 : ( Direction.isDown( direction ) ? 1 : 0 );

          var stepDistance;
          if ( 'edge' == distance ) {
            stepDistance = this.altMovementCharacterEdgeDxDy( subject, dx, dy );
          } else {
            stepDistance = Number( distance );
          }

          subject._moveTargetX = subject.x + dx * stepDistance;
          subject._moveTargetY = subject.y + dy * stepDistance;
        }
      };

      Game_Interpreter.prototype.altMovementMoveCharacter = function( args ) {
        args = this.altMovementStringArgs( args );

        var subject = this.altMovementGetTargetCharacter( args[1] );
        var command = this.altMovementGetMoveCommand( args[2] );
        switch ( command ) {
        case Game_Character.ROUTE_MOVE_AWAY:
        case Game_Character.ROUTE_MOVE_TOWARD:
          var object = this.altMovementGetTargetCharacter( args[3] );
          var options = {
            wait: args[5] == 'wait' || args[6] == 'wait',
            skip: args[5] == 'skip' || args[6] == 'skip' || args[5] == 'skippable' || args[6] == 'skippable',
          };
          this.altMovementProcessMoveCommand( subject, command, args[4], options, object );
          break;
        default:
          var options = {
            wait: args[4] == 'wait' || args[5] == 'wait',
            skip: args[4] == 'skip' || args[5] == 'skip' || args[4] == 'skippable' || args[5] == 'skippable',
          };
          this.altMovementProcessMoveCommand( subject, command, args[3], options );
          break;
        }
      };

      Game_Interpreter.prototype.altMovementCollider = function( args ) {
        args = this.altMovementStringArgs( args );

        switch ( args[1] ) {
        case 'set':
          this.altMovementColliderSet( args );
          break;
        }
      };

      Game_Interpreter.prototype.altMovementColliderSet = function( args ) {
        var target = this.altMovementGetTargetCharacter( args[2] );
        if ( !target ) {
          return;
        }

        var presetIndex = Number( args[3] );
        if ( isNaN( presetIndex ) ) {
          target.setCollider( Collider.getPreset( args[3].substring( 1, args[3].length - 1 ) ) );
          target._hasCustomCollider = true;
        } else {
          target.setCollider( Collider.getPreset( presetIndex ) );
          target._hasCustomCollider = true;
        }
      };

      Game_Interpreter.prototype.altMovementGetMoveCommand = function( cmdStr ) {
        switch ( cmdStr ) {
        case 'down_left': case 'bottom_left': case 'lower_left': case 'lower_l':
        case 'left_down': case 'left_bottom': case 'left_lower': case 'l_lower':
        case 'south_west': case 'west_south': case '1':
          return Game_Character.ROUTE_MOVE_LOWER_L;
        case 'down': case 'bottom': case 'lower': case 'south': case '2':
          return Game_Character.ROUTE_MOVE_DOWN;
        case 'down_right': case 'bottom_right': case 'lower_right': case 'lower_r':
        case 'right_down': case 'right_bottom': case 'right_lower': case 'r_lower':
        case 'south_east': case 'east_south': case '3':
          return Game_Character.ROUTE_MOVE_LOWER_R;
        case 'left': case 'west': case '4':
          return Game_Character.ROUTE_MOVE_LEFT;
        case 'right': case 'east': case '6':
          return Game_Character.ROUTE_MOVE_RIGHT;
        case 'up_left': case 'top_left': case 'upper_left': case 'upper_l':
        case 'left_up': case 'left_top': case 'left_upper': case 'l_upper':
        case 'north_west': case 'west_north': case '7':
          return Game_Character.ROUTE_MOVE_UPPER_L;
        case 'up': case 'top': case 'upper': case 'north': case '8':
          return Game_Character.ROUTE_MOVE_UP;
        case 'up_right': case 'top_right': case 'upper_right': case 'upper_r':
        case 'right_up': case 'right_top': case 'right_upper': case 'r_upper':
        case 'north_east': case 'east_north': case '9':
          return Game_Character.ROUTE_MOVE_UPPER_R;
        case 'away': case 'away_from':
          return Game_Character.ROUTE_MOVE_AWAY;
        case 'toward': case 'towards': case 'toward_to':
          return Game_Character.ROUTE_MOVE_TOWARD;
        case 'forward': case 'forwards':
          return Game_Character.ROUTE_MOVE_FORWARD;
        case 'backward': case 'backwards': case 'back':
          return Game_Character.ROUTE_MOVE_BACKWARD;
        case 'random': case 'randomly':
          return Game_Character.ROUTE_MOVE_RANDOM;
        default:
          return null;
        }
      };

      Game_Interpreter.prototype.altMovementGetTargetCharacter = function( target ) {
        if ( target.startsWith( '\"' ) && target.endsWith( '\"' ) ) {
          // Event name
          var eventName = target.substring( 1, target.length - 1 );
          for ( var ii = 0; ii < $dataMap.events.length; ii++ ) {
            if ( $dataMap.events[ii] && $dataMap.events[ii].name === eventName ) {
              return $gameMap.event( $dataMap.events[ii].id );
            }
          }
        } else {
          // System name
          switch ( target ) {
          case 'this':
            var eventId = this._eventId;
            // This Event ID #
            return $gameMap.event( eventId );
          case 'player':
            return $gamePlayer;
          case 'boat':
            return $gameMap.boat();
          case 'ship':
            return $gameMap.ship();
          case 'airship':
            return $gameMap.airship();
          default:
            if ( target.startsWith( 'follower') ) {
              var index = Number( target.substring( 8 ) );
              // Follower index
              return $gamePlayer.followers().follower( index );
            } else {
              var eventId = Number( target );
              // Event ID #
              return $gameMap.event( eventId );
            }
          }
        }
        return null;
      };

    } )();

  } )();

  /**
   * Game_CharacterBase
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_CharacterBase_update = Game_CharacterBase.prototype.update;
      Game_CharacterBase.prototype.update = function() {
        if ( this._moveTarget ) {
          var dx = $gameMap.directionX( this._x, this._moveTargetX );
          var dy = $gameMap.directionY( this._y, this._moveTargetY );
          var length = Math.sqrt( dx * dx + dy * dy );
          if ( length <= this.stepDistance ) {
            this._moveTarget = false;
            this._moveTargetSkippable = false;
            this.setDirectionFix( this._wasDirectionFixed );
            this._x = $gameMap.roundX( this._moveTargetX );
            this._y = $gameMap.roundY( this._moveTargetY );
          } else {
            dx /= length;
            dy /= length;
            this.moveVector( dx * this.stepDistance, dy * this.stepDistance );
            if ( !this.isMovementSucceeded() ) {
              if ( this._moveTargetSkippable || ( !!this._moveRoute && this._moveRoute.skippable ) ) {
                this._moveTarget = false;
                this._moveTargetSkippable = false;
                this.setDirectionFix( this._wasDirectionFixed );
              }
            }
          }
        }

        Game_CharacterBase_update.call( this );
      };

      Game_CharacterBase.prototype.isOnLadder = function() {
        var aabbox = this.collider().aabbox;
        if ( aabbox.left >= 0 && aabbox.right <= 1 ) {
          // To use ladder the bounding box must fit on a tile
          return false;
        }
        // If middle is on ladder
        if ( $gameMap.isLadder( $gameMap.roundX( this._x + ( aabbox.left + aabbox.right ) / 2 ), $gameMap.roundY( this._y + ( aabbox.top + aabbox.bottom ) / 2 ) ) ) {
          // If bottom middle is on ladder
          if ( $gameMap.isLadder( $gameMap.roundX( this._x + ( aabbox.left + aabbox.right ) / 2 ), $gameMap.roundY( this._y + aabbox.bottom ) ) ) {
            return true;
          }
        }
        return false;
      };

      Game_CharacterBase.prototype.moveStraight = function( d ) {
        var vy = Direction.isUp( d ) ? -1 : ( Direction.isDown( d ) ? 1 : 0 );
        var vx = Direction.isLeft( d ) ? -1 : ( Direction.isRight( d ) ? 1 : 0 );
        if ( this._circularMovement ) {
          var length = Math.sqrt( vx * vx + vy * vy );
          vx /= length;
          vy /= length;
        }
        this.moveVector( vx * this.stepDistance, vy * this.stepDistance );
      };

      Game_CharacterBase.prototype.moveDiagonally = function( horz, vert ) {
        var vy = Direction.isUp( vert ) ? -1 : ( Direction.isDown( vert ) ? 1 : 0 );
        var vx = Direction.isLeft( horz ) ? -1 : ( Direction.isRight( horz ) ? 1 : 0 );
        if ( this._circularMovement ) {
          var length = Math.sqrt( vx * vx + vy * vy );
          vx /= length;
          vy /= length;
        }
        this.moveVector( vx * this.stepDistance, vy * this.stepDistance );
      };

      var Game_CharacterBase_isMoving = Game_CharacterBase.prototype.isMoving;
      Game_CharacterBase.prototype.isMoving = function() {
        return Game_CharacterBase_isMoving.call( this ) || this._isMoving;
      };

      var Game_CharacterBase_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
      Game_CharacterBase.prototype.updateAnimation = function() {
        Game_CharacterBase_updateAnimation.call( this );
        this._wasMoving = this._isMoving;
        this._isMoving = this._x !== this._realX || this._y !== this._realY;
        if ( !this._isMoving ) {
          this.refreshBushDepth();
        }
      };

      Game_CharacterBase.prototype.isOnBush = function() {
        var aabbox = this.collider().aabbox;
        // If middle is in bush
        if ( $gameMap.isBush( $gameMap.roundX( this._x + ( aabbox.left + aabbox.right ) / 2 ), $gameMap.roundY( this._y + ( aabbox.top + aabbox.bottom ) / 2 ) ) ) {
          // If bottom middle is in bush
          if ( $gameMap.isBush( $gameMap.roundX( this._x + ( aabbox.left + aabbox.right ) / 2 ), $gameMap.roundY( this._y + aabbox.bottom ) ) ) {
            return true;
          }
        }
        return false;
      };

      Game_CharacterBase.prototype.canPass = function( x, y, d ) {
        if ( this.isThrough() || this.isDebugThrough() ) {
            return true;
        }

        var x2 = $gameMap.roundXWithDirection( x, d );
        var y2 = $gameMap.roundYWithDirection( y, d );
        if ( !$gameMap.canWalk( this, x2, y2 ) ) {
          return false;
        }

        return true;
      };

      Game_CharacterBase.prototype.canPassDiagonally = function( x, y, horz, vert ) {
        if ( this.isThrough() || this.isDebugThrough() ) {
            return true;
        }

        var x2 = $gameMap.roundXWithDirection( x, horz );
        var y2 = $gameMap.roundYWithDirection( y, vert );
        if ( !$gameMap.canWalk( this, x2, y2 ) ) {
          return false;
        }

        return true;
      };

      var Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
      Game_CharacterBase.prototype.setDirection = function( d ) {
        Game_CharacterBase_setDirection.call( this, d );
        this._direction8 = this._direction;
      };

      var Game_CharacterBase_screenX = Game_CharacterBase.prototype.screenX;
      Game_CharacterBase.prototype.screenX = function() {
        var round = Math.round;
        Math.round = Math.floor;
        var val = Game_CharacterBase_screenX.call( this );
        Math.round = round;
        return val;
      };

      var Game_CharacterBase_screenY = Game_CharacterBase.prototype.screenY;
      Game_CharacterBase.prototype.screenY = function() {
        var round = Math.round;
        Math.round = Math.floor;
        var val = Game_CharacterBase_screenY.call( this );
        Math.round = round;
        return val;
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Object.defineProperties( Game_CharacterBase.prototype, {
        stepDistance: { get: function() { return this.distancePerFrame(); }, configurable: true },
      } );

      Game_CharacterBase.prototype.collidableWith = function( character ) {
        return !!character
          && character !== this
          && character.isNormalPriority()
          && this.isNormalPriority()
          && !this.isThrough()
          && ( !character.isVisible ? true : character.isVisible() )
          && ( !this.vehicle ? true : this.vehicle() !== character )
          && ( !this.followers ? true : !this.followers().contains( character ) )
          && ( character instanceof Game_Follower ? true : !character.isThrough() )
          && !( this instanceof Game_Follower ? character instanceof Game_Follower : false )
          && !( this instanceof Game_Follower ? character instanceof Game_Player : false )
          && !( this instanceof Game_Vehicle ? character instanceof Game_Player : false )
          && !( this instanceof Game_Vehicle ? character instanceof Game_Follower : false )
          && ( character instanceof Game_Vehicle ? character._mapId === $gameMap.mapId() : true );
      }

      Game_CharacterBase.prototype.moveVectorCharacters = function( owner, collider, characters, loopMap, move ) {
        characters.forEach( function( character ) {
          var characterX = character._x;
          var characterY = character._y;

          if ( loopMap[character] == 1 ) { characterX += $gameMap.width(); }
          else if ( loopMap[character] == 2 ) { characterX -= $gameMap.width(); }
          else if ( loopMap[character] == 3 ) { characterY += $gameMap.height(); }
          else if ( loopMap[character] == 4 ) { characterY -= $gameMap.height(); }
          else if ( loopMap[character] == 5 ) { characterX += $gameMap.width(); characterY += $gameMap.height(); }
          else if ( loopMap[character] == 6 ) { characterX -= $gameMap.width(); characterY += $gameMap.height(); }
          else if ( loopMap[character] == 7 ) { characterX += $gameMap.width(); characterY -= $gameMap.height(); }
          else if ( loopMap[character] == 8 ) { characterX -= $gameMap.width(); characterY -= $gameMap.height(); }

          move = Collider.move( owner._x, owner._y, collider, characterX, characterY, character.collider(), move );
          if ( move.x === 0 && move.y === 0 ) {
            return;
          }
        } );
      };

      Game_CharacterBase.prototype.moveVectorMap = function( owner, collider, bboxTests, move, vx, vy ) {
        for ( var ii = 0; ii < bboxTests.length; ii++ ) {
          var offsetX = 0;
          var offsetY = 0;
          if ( bboxTests[ii].type == 1 ) { offsetX += $gameMap.width(); }
          else if ( bboxTests[ii].type == 2 ) { offsetX -= $gameMap.width(); }
          else if ( bboxTests[ii].type == 3 ) { offsetY += $gameMap.height(); }
          else if ( bboxTests[ii].type == 4 ) { offsetY -= $gameMap.height(); }
          else if ( bboxTests[ii].type == 5 ) { offsetX += $gameMap.width(); offsetY += $gameMap.height(); }
          else if ( bboxTests[ii].type == 6 ) { offsetX -= $gameMap.width(); offsetY += $gameMap.height(); }
          else if ( bboxTests[ii].type == 7 ) { offsetX += $gameMap.width(); offsetY -= $gameMap.height(); }
          else if ( bboxTests[ii].type == 8 ) { offsetX -= $gameMap.width(); offsetY -= $gameMap.height(); }

          var mapColliders = Collider.polygonsWithinColliderList( bboxTests[ii].x + vx, bboxTests[ii].y + vy, bboxTests[ii].aabbox, 0, 0, $gameMap.collisionMesh( this._collisionType ) );
          if ( mapColliders.length > 0 ) {
              if ( move.x !== 0 ) {
                var sigMove = { x: move.x, y: 0 };
                mapColliders.forEach( function( mapCollider ) {
                  sigMove = Collider.move( owner._x, owner._y, collider, offsetX, offsetY, mapCollider, sigMove );
                } );
                move.x = sigMove.x;
              }
              mapColliders.forEach( function( mapCollider ) {
                move = Collider.move( owner._x, owner._y, collider, offsetX, offsetY, mapCollider, move );
              } );
          }
        }
      };

      Game_CharacterBase.prototype.moveVector = function( vx, vy ) {
        var move;
        var characterCollided = false;
        if ( this.isThrough() || this.isDebugThrough() ) {
          var aabbox = this.collider().aabbox;
          move = { x: 0, y: 0 };

          if ( !$gameMap.isLoopHorizontal() && this._x + vx + aabbox.left < 0 ) {
            move.x = 0 - ( this._x + aabbox.left );
          } else if ( !$gameMap.isLoopHorizontal() && this._x + vx + aabbox.right > $gameMap.width() ) {
            move.x = $gameMap.width() - ( this._x + aabbox.right );
          } else {
            move.x = vx;
          }

          if ( !$gameMap.isLoopVertical() && this._y + vy + aabbox.top < 0 ) {
            move.y = 0 - ( this._y + aabbox.top );
          } else if ( !$gameMap.isLoopVertical() && this._y + vy + aabbox.bottom > $gameMap.height() ) {
            move.y = $gameMap.height() - ( this._y + aabbox.bottom );
          } else {
            move.y = vy;
          }
        } else {
          var owner = this;
          var collider = owner.collider();
          var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );

          // Gather any solid characters within the movement bounding box
          var loopMap = {};
          var characters = $gameMap.characters().filter( function( character ) {
            if ( owner === $gamePlayer && owner.followers().contains( character ) ) {
              return false;
            }
            if ( owner.collidableWith( character ) ) {
              for ( var ii = 0; ii < bboxTests.length; ii++ ) {
                if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, character._x, character._y, character.collider().aabbox, vx, vy ) ) {
                  loopMap[character] = bboxTests[ii].type;
                  return true;
                }
              }
            }
            return false;
          } );

          move = { x: vx, y: vy };

          // Test collision with characters
          this.moveVectorCharacters( owner, collider, characters, loopMap, move );

          if ( move.x !== vx || move.y !== vy ) {
            // Collided with character, disable direction change
            characterCollided = true;
          }

          // Test collision with map
          this.moveVectorMap( owner, collider, bboxTests, move, vx, vy );
        }

        // Resolve too much precision
        move.x = Math.floor( move.x * Collider.PRECISION ) / Collider.PRECISION;
        move.y = Math.floor( move.y * Collider.PRECISION ) / Collider.PRECISION;

        // Special ladder behaviour
        if ( this.isOnLadder() && ( this.isInAirship ? !this.isInAirship() : true ) ) {
          var tileX = Math.round( this._x );
          if ( !$gameMap.isPassable( tileX, this._y + move.y, Direction.LEFT ) ) {
            if ( !$gameMap.isPassable( tileX, this._y + move.y, Direction.RIGHT ) ) {
              move.x = tileX - this._x;
            }
          }
        }

        var length = Math.sqrt( move.x * move.x + move.y * move.y );
        if ( length > Collider.I_PRECISION ) {
          this._x = $gameMap.roundX( this._x + move.x );
          this._y = $gameMap.roundY( this._y + move.y );

          this._realX = this._x - move.x;
          this._realY = this._y - move.y;
          this.setMovementSuccess( true );
          if ( characterCollided ) {
            this.setDirectionVector( vx, vy );
          } else {
            this.setDirectionVector( move.x, move.y );
          }
          this.increaseSteps();
          this._isMoving = true;

          this.checkEventTriggerTouchFrontVector( move.x, move.y );
        } else {
          this.setMovementSuccess( false );
          this.setDirectionVector( vx, vy );
          this._isMoving = false;

          this.checkEventTriggerTouchFrontVector( vx, vy );
        }
      };

      Game_CharacterBase.prototype.setDirectionVector = function( vx, vy ) {
        if ( this.isDirectionFixed() ) {
          return;
        }
        var direction = Math.atan2( vy, vx ) / Math.PI;

        var direct = false;
        if ( direction >= -0.2 && direction < 0.2 ) {
          // East
          this.setDirection( Direction.RIGHT );
          direct = true;
        } else if ( direction >= 0.3 && direction < 0.7 ) {
          // South
          this.setDirection( Direction.DOWN );
          direct = true;
        } else if ( direction >= -0.7 && direction < -0.3 ) {
          // North
          this.setDirection( Direction.UP );
          direct = true;
        } else if ( direction >= -1.2 && direction < -0.8 ) {
          // West
          this.setDirection( Direction.LEFT );
          direct = true;
        } else if ( direction >= 0.8 && direction < 1.2 ) {
          // West
          this.setDirection( Direction.LEFT );
          direct = true;
        }

        if ( !direct ) {
          var dx = vx > 0 ? Direction.RIGHT : ( vx ? Direction.LEFT : 0 );
          var dy = vy > 0 ? Direction.DOWN : ( vy ? Direction.UP : 0 );
          if ( dx && dy ) {
            if ( this._direction === this.reverseDir( dx ) ) {
              this.setDirection( dx );
            } else if ( this._direction === this.reverseDir( dy ) ) {
              this.setDirection( dy );
            } else {
              this.resetStopCount();
            }
          } else {
            this.setDirection( dx || dy );
          }
        }

        var direction8 = Math.round( ( direction + 1 ) * 4 ) % 8; // 8 directions
        switch ( direction8 ) {
        case 0:
          this._direction8 = Direction.LEFT;
          break;
        case 1:
          this._direction8 = Direction.UP_LEFT;
          break;
        case 2:
          this._direction8 = Direction.UP;
          break;
        case 3:
          this._direction8 = Direction.UP_RIGHT;
          break;
        case 4:
          this._direction8 = Direction.RIGHT;
          break;
        case 5:
          this._direction8 = Direction.DOWN_RIGHT;
          break;
        case 6:
          this._direction8 = Direction.DOWN;
          break;
        case 7:
          this._direction8 = Direction.DOWN_LEFT;
          break;
        }

      };

      Game_CharacterBase.prototype.checkEventTriggerTouchFrontVector = function( vx, vy ) {
        this.checkEventTriggerTouch( this._x + vx, this._y + vy );
      };

      Game_CharacterBase.prototype.align = function() {
        this._x = this._x | 0;
        this._y = this._y | 0;
      };

      Game_CharacterBase.prototype.collider = function() {
        return this._collider || Collider.sharedTile();
      };

      Game_CharacterBase.prototype.setCollider = function( collider ) {
        this._collider = collider;
      };

      Game_CharacterBase.prototype.direction8 = function() {
        return this._direction8;
      };

    } )();

  } )();

  /**
   * Game_Character
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      Game_Character.prototype.updateRoutineMove = function() {
        if ( this._moveTarget ) {
          var moveRoute = this._moveRoute;
          if ( !moveRoute.skippable || this._wasMoving ) {
            return;
          }
        }
        if ( this._waitCount > 0 ) {
          this._waitCount--;
        } else {
          this.setMovementSuccess( true );
          var command = this._moveRoute.list[this._moveRouteIndex];
          if ( command ) {
            this.processMoveCommand( command );
            this.advanceMoveRouteIndex();
          }
        }
      };

      Game_Character.prototype.moveRandom = function() {
        if ( this._moveTarget ) {
          return;
        }

        var d = 1 + Math.randomInt( 8 );
        var vx = Direction.isLeft( d ) ? -1 : ( Direction.isRight( d ) ? 1 : 0 );
        var vy = Direction.isUp( d ) ? -1 : ( Direction.isDown( d ) ? 1 : 0 );

        this.setDirectionVector( vx, vy );
        this._moveTarget = true;
        this._moveTargetSkippable = true;
        this._moveTargetX = Math.round( this.x + vx );
        this._moveTargetY = Math.round( this.y + vy );
      };

      Game_Character.prototype.moveTowardCharacter = function( character ) {
        var vx = character.x - this.x;
        var vy = character.y - this.y;
        var length = Math.sqrt( vx * vx + vy * vy );
        if ( length > this.stepDistance ) {
          this.setDirectionVector( vx, vy );
          vx /= length;
          vy /= length;
          this._moveTarget = true;
          this._moveTargetSkippable = true;
          this._moveTargetX = Math.round( this.x + vx );
          this._moveTargetY = Math.round( this.y + vy );
        }
      };

      Game_Character.prototype.moveAwayFromCharacter = function( character ) {
        var vx = character.x - this.x;
        var vy = character.y - this.y;
        var length = Math.sqrt( vx * vx + vy * vy );
        this.setDirectionVector( -vx, -vy );
        vx /= length;
        vy /= length;
        this._moveTarget = true;
        this._moveTargetSkippable = true;
        this._moveTargetX = Math.round( this.x - vx );
        this._moveTargetY = Math.round( this.y - vy );
      };

      var Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
      Game_Character.prototype.processMoveCommand = function( command ) {
        var gc = Game_Character;
        var params = command.parameters;
        switch ( command.code ) {
        case gc.ROUTE_MOVE_DOWN:
          this._moveTarget = true;
          this._moveTargetX = ( this._x );
          this._moveTargetY = ( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_LEFT:
          this._moveTarget = true;
          this._moveTargetX = ( this._x - 1 );
          this._moveTargetY = ( this._y );
          break;
        case gc.ROUTE_MOVE_RIGHT:
          this._moveTarget = true;
          this._moveTargetX = ( this._x + 1 );
          this._moveTargetY = ( this._y );
          break;
        case gc.ROUTE_MOVE_UP:
          this._moveTarget = true;
          this._moveTargetX = ( this._x );
          this._moveTargetY = ( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_LOWER_L:
          this._moveTarget = true;
          this._moveTargetX = ( this._x - 1 );
          this._moveTargetY = ( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_LOWER_R:
          this._moveTarget = true;
          this._moveTargetX = ( this._x + 1 );
          this._moveTargetY = ( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_UPPER_L:
          this._moveTarget = true;
          this._moveTargetX = ( this._x - 1 );
          this._moveTargetY = ( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_UPPER_R:
          this._moveTarget = true;
          this._moveTargetX = ( this._x + 1 );
          this._moveTargetY = ( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_FORWARD:
          this._wasDirectionFixed = this.isDirectionFixed();
          this.setDirectionFix( true );
          var vx = Direction.isLeft( this._direction ) ? -1 : ( Direction.isRight( this._direction ) ? 1 : 0 );
          var vy = Direction.isUp( this._direction ) ? -1 : ( Direction.isDown( this._direction ) ? 1 : 0 );
          this._moveTarget = true;
          this._moveTargetX = ( this._x + vx );
          this._moveTargetY = ( this._y + vy );
          break;
        case gc.ROUTE_MOVE_BACKWARD:
          this._wasDirectionFixed = this.isDirectionFixed();
          this.setDirectionFix( true );
          var vx = Direction.isLeft( this._direction ) ? -1 : ( Direction.isRight( this._direction ) ? 1 : 0 );
          var vy = Direction.isUp( this._direction ) ? -1 : ( Direction.isDown( this._direction ) ? 1 : 0 );
          this._moveTarget = true;
          this._moveTargetX = ( this._x - vx );
          this._moveTargetY = ( this._y - vy );
          break;
        default:
          Game_Character_processMoveCommand.call( this, command );
          break;
        }

        if ( $gameSystem._staticMoveAlignGrid !== MOVE_ROUTE.ALIGN_GRID ) {
          $gameSystem._staticMoveAlignGrid = MOVE_ROUTE.ALIGN_GRID;
          $gameSystem._moveAlignGrid = MOVE_ROUTE.ALIGN_GRID;
        }

        if ( this._moveTarget && $gameSystem._moveAlignGrid ) {
          this._moveTargetX = Math.round( this._moveTargetX );
          this._moveTargetY = Math.round( this._moveTargetY );
        }
      };

    } )();

  } )();

  /**
   * Game_Player
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Player_initMembers = Game_Player.prototype.initMembers;
      Game_Player.prototype.initMembers = function() {
        Game_Player_initMembers.call(this);
        this._collider = Collider.createFromXML( PLAYER.COLLIDER_LIST );
        this._circularMovement = PLAYER.CIRCULAR_MOVEMENT;
      };

      Game_Player.prototype.checkEventTriggerTouch = Game_CharacterBase.prototype.checkEventTriggerTouch;

      var Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
      Game_Player.prototype.encounterProgressValue = function() {
        return this.stepDistance * Game_Player_encounterProgressValue.call( this );
      };

      var Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
      Game_Player.prototype.clearTransferInfo = function() {
        Game_Player_clearTransferInfo.call( this );
        this._moveTarget = false;
        this._moveTargetSkippable = false;
      };

      Game_Player.prototype.update = function( sceneActive ) {
        var lastScrolledX = this.scrolledX();
        var lastScrolledY = this.scrolledY();
        var wasMoving = this._wasMoving;
        this.updateDashing();
        if ( sceneActive ) {
          this.moveByInput();
        }
        Game_Character.prototype.update.call( this );
        this.updateScroll( lastScrolledX, lastScrolledY );
        this.updateVehicle();
        if ( !this._isMoving ) {
          this.updateNonmoving( wasMoving );
        }
        this._followers.update();
      };

      Game_Player.prototype.getInputDirection = function() {
        return Input.dir8;
      };

      Game_Player.prototype.moveByInput = function() {
        if ( $gameSystem._staticEnableTouchMouse != INPUT_CONFIG.ENABLE_TOUCH_MOUSE ) {
          $gameSystem._staticEnableTouchMouse = INPUT_CONFIG.ENABLE_TOUCH_MOUSE;
          $gameSystem._enableTouchMouse = INPUT_CONFIG.ENABLE_TOUCH_MOUSE;
        }

        if ( this._moveTarget ) {
          this._touchTarget = null;
        }

        if ( !this.isMoving() && this.canMove() ) {
          if ( navigator.getGamepads ) {
            // Gamepad movement
            var gamepads = navigator.getGamepads();
            var didMove = false;
            var didTurn = false;
            if ( gamepads ) {
              for ( var ii = 0; ii < gamepads.length; ii++ ) {
                var gamepad = gamepads[ii];
                if ( gamepad && gamepad.connected ) {
                  if ( !didMove ) {
                    if ( INPUT_CONFIG.GAMEPAD_MODE & 0x2 ) {
                      var vy = gamepad.axes[1];
                      var vx = gamepad.axes[0];
                      var length = Math.sqrt( vy * vy + vx * vx );
                      if ( length > GAME_PAD_THRESHOLD ) {
                        if ( length - GAME_PAD_THRESHOLD > GAME_PAD_LIMIT ) {
                          vx /= length;
                          vy /= length;
                        }
                        if ( this._circularMovement ) {
                          this.moveVector( vx * this.stepDistance, vy * this.stepDistance );
                        } else {
                          var vector = Direction.normalizeSquare( vx, vy );
                          this.moveVector( vector.x * this.stepDistance, vector.y * this.stepDistance );
                        }
                        didMove = true;
                      }
                    } else {
                      didMove = true;
                    }
                  }
                  if ( !didTurn && ( INPUT_CONFIG.GAMEPAD_MODE & 0x1 ) ) {
                    var vy = gamepad.axes[3];
                    var vx = gamepad.axes[2];
                    var length = Math.sqrt( vy * vy + vx * vx );
                    if ( length > GAME_PAD_THRESHOLD ) {
                      this.setDirectionVector( vx, vy );
                      didTurn = true;
                    }
                  }
                }
              }
            }
            if ( didMove ) {
              this._touchTarget = null;
              return;
            }
          }

          var direction = this.getInputDirection();
          if ( direction > 0 ) {
            // Regular movement
            this.executeMove( direction );
            this._touchTarget = null;
          } else if ( $gameSystem._enableTouchMouse && $gameTemp.isDestinationValid() ) {
            // Touch movement
            var characterTarget = null;
            var touchedCharacters = $gameMap.getCharactersUnderPoint( $gameTemp.destinationX(), $gameTemp.destinationY() ).filter( function( character ) {
              // Filter out events that player cannot reach
              return !( character._eventId && !character.isNormalPriority() );
            } );
            if ( this.isInVehicle() ) {
              // In vehicle
              if ( touchedCharacters.contains( $gamePlayer.vehicle() ) ) {
                // Get off vehicle
                this.getOffVehicle();
              }
            } else {
              // Check if we're touching an interactable
              if ( touchedCharacters.contains( $gameMap.airship() ) && $gameMap.airship()._mapId === $gameMap.mapId() ) {
                characterTarget = $gameMap.airship();
              } else if ( touchedCharacters.contains( $gameMap.ship() ) && $gameMap.ship()._mapId === $gameMap.mapId() ) {
                characterTarget = $gameMap.ship();
              } else if ( touchedCharacters.contains( $gameMap.boat() ) && $gameMap.boat()._mapId === $gameMap.mapId() ) {
                characterTarget = $gameMap.boat();
              } else if ( touchedCharacters.length === 1 && touchedCharacters[0] === $gamePlayer ) {
                // Only touched player, action time
                if ( !this.getOnVehicle() ) {
                  this.checkEventTriggerHere( [0] );
                }
                characterTarget = $gamePlayer;
              } else if ( this.canStartLocalEvents() ) {
                // Only care about events now
                touchedCharacters = touchedCharacters.filter( function( character ) {
                  return !!character._eventId && character._trigger === 0;
                } );

                if ( touchedCharacters.length ) {
                  // Move toward character
                  characterTarget = touchedCharacters[0];
                }
              }
            }

            // Move toward destination
            if ( !characterTarget ) {
              this._touchTarget = new Point( $gameTemp.destinationX() - 0.5, $gameTemp.destinationY() - 0.5 );
            } else {
              this._touchTarget = characterTarget;
            }
            $gameTemp.clearDestination();
          }

          if ( this._touchTarget ) {
            var dx = $gameMap.directionX( this._x, this._touchTarget.x );
            var dy = $gameMap.directionY( this._y, this._touchTarget.y );
            var length = Math.sqrt( dx * dx + dy * dy );
            if ( length <= this.stepDistance ) {
              this._touchTarget = null;
            } else {
              dx /= length;
              dy /= length;
              if ( this._circularMovement ) {
                this.moveVector( dx * this.stepDistance, dy * this.stepDistance );
              } else {
                var vector = Direction.normalizeSquare( dx, dy );
                this.moveVector( vector.x * this.stepDistance, vector.y * this.stepDistance );
              }
              if ( Math.abs( dx ) > Math.abs( dy ) ) {
                this.setDirectionVector( dx, 0 );
              } else {
                this.setDirectionVector( 0, dy );
              }
              if ( this.isOnLadder() ) {
                this.setDirection( 8 );
              }

              // Can't move any more, so stop walking
              if ( !this.isMovementSucceeded() ) {
                var collider = this._touchTarget.collider ? this._touchTarget.collider() : null;
                if ( collider ) {
                  // Touching a character, check if we've reached it
                  var rx = dx * this.stepDistance;
                  var ry = dy * this.stepDistance;
                  if ( Collider.intersect( this._touchTarget.x, this._touchTarget.y, collider, this._x + rx, this._y + ry, this.collider() ) ) {
                    var vehicle;
                    if ( !!this._touchTarget._eventId ) {
                      this._touchTarget.start();
                    } else if ( this._touchTarget === $gameMap.airship() ) {
                      vehicle = $gameMap.airship();
                      this._vehicleType = 'airship';
                      this._collisionType = CollisionMesh.AIRSHIP;
                    } else if ( this._touchTarget === $gameMap.ship() ) {
                      vehicle = $gameMap.ship();
                      this._vehicleType = 'ship';
                      this._collisionType = CollisionMesh.SHIP;
                    } else if ( this._touchTarget === $gameMap.boat() ) {
                      vehicle = $gameMap.boat();
                      this._vehicleType = 'boat';
                      this._collisionType = CollisionMesh.BOAT;
                    }

                    if ( vehicle ) {
                      this._vehicleGettingOn = true;
                      vehicle._passengerCollider = this.collider();
                      this._collider = vehicle.collider();

                      var dx = $gameMap.directionX( this._x, vehicle._x );
                      var dy = $gameMap.directionY( this._y, vehicle._y );

                      var wasThrough = this.isThrough();
                      this.setThrough( true );
                      this.moveVector( dx, dy );
                      this.setThrough( wasThrough );
                      this.gatherFollowers();
                    }
                  } else if ( !!this._touchTarget ) {
                    // Check if our target can only be reached by action
                    if ( !this.getOnVehicle() ) {
                      this.checkEventTriggerThere( [0] );
                    }
                  }
                }
                this._touchTarget = null;
              }
            }
          }
        }
      };

      Game_Player.prototype.checkEventTriggerHere = function( triggers ) {
        if ( this.canStartLocalEvents() ) {
          var collider = this.collider();
          var bboxTests = $gameMap.getAABBoxTests( this );
          var player = this;

          var vx = Direction.isLeft( this._direction ) ? -this.stepDistance : ( Direction.isRight( this._direction ) ? this.stepDistance : 0 );
          var vy = Direction.isUp( this._direction ) ? -this.stepDistance : ( Direction.isDown( this._direction ) ? this.stepDistance : 0 );

          // Gather any solid characters within the "here" bounding box
          var loopMap = {};
          var events = $gameMap.events().filter( function( event ) {
            for ( var ii = 0; ii < bboxTests.length; ii++ ) {
              if ( event.isTriggerIn( triggers ) ) {
                if ( event.isNormalPriority() ) {
                  if ( Collider.aabboxCheck( bboxTests[ii].x + vx, bboxTests[ii].y + vy, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
                    loopMap[event] = bboxTests[ii].type;
                    return true;
                  }
                } else {
                  if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
                    loopMap[event] = bboxTests[ii].type;
                    return true;
                  }
                }
              }
            }
            return false;
          } );

          // Test collision with characters
          for ( var ii = 0; ii < events.length; ii++ ) {
            var entryX = events[ii]._x;
            var entryY = events[ii]._y;

            if ( loopMap[events[ii]] == 1 ) { entryX += $gameMap.width(); }
            else if ( loopMap[events[ii]] == 2 ) { entryX -= $gameMap.width(); }
            else if ( loopMap[events[ii]] == 3 ) { entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 4 ) { entryY -= $gameMap.height(); }
            else if ( loopMap[events[ii]] == 5 ) { entryX += $gameMap.width(); entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 6 ) { entryX -= $gameMap.width(); entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 7 ) { entryX += $gameMap.width(); entryY -= $gameMap.height(); }
            else if ( loopMap[events[ii]] == 8 ) { entryX -= $gameMap.width(); entryY -= $gameMap.height(); }

            if ( events[ii].isNormalPriority() && Collider.intersect( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) ) {
              // Normal priority player-touch/event-touch
              events[ii].start();
            } else if ( events[ii]._trigger === 2 ) {
              // Event touch is encasing
              if ( Collider.encase( entryX, entryY, events[ii].collider(), this._x, this._y, collider ) || Collider.encase( this._x, this._y, collider, entryX, entryY, events[ii].collider() ) ) {
                events[ii].start();
              }
            } else if ( Collider.intersect( this._x, this._y, collider, entryX, entryY, events[ii].collider() ) ) {
              events[ii].start();
            }
          }
        }
      };

      Game_Player.prototype.checkEventTriggerThere = function( triggers ) {
        if ( this.canStartLocalEvents() ) {
          var vx = Direction.isLeft( this._direction ) ? -this.actionWidth() : ( Direction.isRight( this._direction ) ? this.actionWidth() : 0 );
          var vy = Direction.isUp( this._direction ) ? -this.actionHeight() : ( Direction.isDown( this._direction ) ? this.actionHeight() : 0 );

          var collider = this.collider();
          var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );
          var player = this;

          // Gather any solid characters within the "there" bounding box
          var loopMap = {};
          var events = $gameMap.events().filter( function( event ) {
            for ( var ii = 0; ii < bboxTests.length; ii++ ) {
              if ( event.isTriggerIn( triggers ) && event.isNormalPriority() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, event._x, event._y, event.collider().aabbox ) ) {
                loopMap[event] = bboxTests[ii].type;
                return true;
              }
            }
            return false;
          } );

          // Test collision with characters
          for ( var ii = 0; ii < events.length; ii++ ) {
            var entryX = events[ii]._x;
            var entryY = events[ii]._y;

            if ( loopMap[events[ii]] == 1 ) { entryX += $gameMap.width(); }
            else if ( loopMap[events[ii]] == 2 ) { entryX -= $gameMap.width(); }
            else if ( loopMap[events[ii]] == 3 ) { entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 4 ) { entryY -= $gameMap.height(); }
            else if ( loopMap[events[ii]] == 5 ) { entryX += $gameMap.width(); entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 6 ) { entryX -= $gameMap.width(); entryY += $gameMap.height(); }
            else if ( loopMap[events[ii]] == 7 ) { entryX += $gameMap.width(); entryY -= $gameMap.height(); }
            else if ( loopMap[events[ii]] == 8 ) { entryX -= $gameMap.width(); entryY -= $gameMap.height(); }

            if ( events[ii]._trigger === 2 ) {
              // Event touch is encasing
              if ( Collider.encase( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) || Collider.encase( entryX, entryY, events[ii].collider(), this._x + vx, this._y + vy, collider ) ) {
                events[ii].start();
              }
            } else if ( Collider.intersect( this._x + vx, this._y + vy, collider, entryX, entryY, events[ii].collider() ) ) {
              events[ii].start();
            }
          }

          if ( !$gameMap.isAnyEventStarting() ) {
            // Check for counters
            var events = [];
            var tiles = $gameMap.getTilesUnder( this, vx, vy );
            for ( var ii = 0; ii < tiles.length; ii++ ) {
              if ( $gameMap.isCounter( tiles[ii][0], tiles[ii][1] ) ) {
                var x3 = $gameMap.roundXWithDirection( tiles[ii][0], this._direction );
                var y3 = $gameMap.roundYWithDirection( tiles[ii][1], this._direction );

                // Gather any solid characters within the "over counter" bounding box
                events = events.concat( $gameMap.events().filter( function( event ) {
                  if ( event.isTriggerIn( triggers ) && event.isNormalPriority() && Collider.aabboxCheck( x3, y3, Collider.sharedTile().aabbox, event._x, event._y, event.collider().aabbox ) ) {
                    return true;
                  }
                  return false;
                } ) );
              }
            }

            if ( events.length === 0 ) {
              return;
            }

            var closest;
            var dist = Number.POSITIVE_INFINITY;
            for ( var ii = 0; ii < events.length; ii++ ) {
              var entryX = events[ii]._x;
              var entryY = events[ii]._y;

              var dx = this._x - entryX;
              var dy = this._y - entryY;
              var td = ( dx * dx + dy * dy );
              if ( td < dist ) {
                dist = td;
                closest = events[ii];
              }
            }

            closest.start();
          }
        }
      };

      Game_Player.prototype.startMapEvent = function( x, y, triggers, normal ) {
        if ( !$gameMap.isEventRunning() ) {
          $gameMap.eventsXy( x, y ).forEach( function( event ) {
            if ( event.isTriggerIn( triggers ) && event.isNormalPriority() === normal ) {
              event.start();
            }
          } );
        }
      };

      Game_Player.prototype.moveStraight = function( d ) {
        Game_Character.prototype.moveStraight.call( this, d );
      };

      Game_Player.prototype.moveDiagonally = function( horz, vert ) {
        Game_Character.prototype.moveDiagonally.call( this, horz, vert );
      };

      Game_Player.prototype.getOnVehicle = function() {
        var vx = Direction.isLeft( this._direction ) ? -0.5 : ( Direction.isRight( this._direction ) ? 0.5 : 0 );
        var vy = Direction.isUp( this._direction ) ? -0.5 : ( Direction.isDown( this._direction ) ? 0.5 : 0 );
        var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );

        var vehicle;
        var airship = $gameMap.airship();
        var ship = $gameMap.ship();
        var boat = $gameMap.boat();

        for ( var ii = 0; ii < bboxTests.length; ii++ ) {
          if ( !!airship && airship._mapId === $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, airship._x, airship._y, airship.collider().aabbox ) ) {
            this._vehicleType = 'airship';
            this._collisionType = CollisionMesh.AIRSHIP;
            vehicle = airship;
            break;
          }
          if ( !!ship && ship._mapId === $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, ship._x, ship._y, ship.collider().aabbox ) ) {
            this._vehicleType = 'ship';
            this._collisionType = CollisionMesh.SHIP;
            vehicle = ship;
            break;
          }
          if ( !!boat && boat._mapId === $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, boat._x, boat._y, boat.collider().aabbox ) ) {
            this._vehicleType = 'boat';
            this._collisionType = CollisionMesh.BOAT;
            vehicle = boat;
            break;
          }
        }

        if ( this.isInVehicle() ) {
          this._vehicleGettingOn = true;
          vehicle._passengerCollider = this.collider();
          this._collider = vehicle.collider();

          var dx = $gameMap.directionX( this._x, vehicle._x );
          var dy = $gameMap.directionY( this._y, vehicle._y );

          var wasThrough = this.isThrough();
          this.setThrough( true );
          this.moveVector( dx, dy );
          this.setThrough( wasThrough );
          this.gatherFollowers();
        }

        return this._vehicleGettingOn;
      };

      Game_Player.prototype.getOffVehicle = function() {
        if ( this.vehicle().isLandOk( this.x, this.y, this.direction() ) ) {
          if ( this.isInAirship() ) {
            this.setDirection( 2 );
          }

          var vhx = this.vehicle().x;
          var vhy = this.vehicle().y;
          var vhd = this.vehicle().direction();
          this._followers.forEach( function(follower) {
              follower._x = vhx;
              follower._y = vhy;
              follower._realX = vhx;
              follower._realY = vhy;
              follower.setDirection( vhd );
          } );

          // this._followers.synchronize( this.vehicle().x, this.vehicle().y, this.vehicle().direction() );
          this.vehicle().getOff();

          if ( !this.isInAirship() ) {
            var vehicleBox = this.vehicle().collider().aabbox;
            var passengerBox = this.vehicle()._passengerCollider.aabbox;
            var d = this.direction();

            // Get disembark direction
            var vx;
            if ( Direction.isLeft( d ) ) {
              vx = Math.floor( ( -passengerBox.right + vehicleBox.left ) * 64 ) / 64;
            } else if ( Direction.isRight( d ) ) {
              vx = Math.ceil( ( vehicleBox.right - passengerBox.left ) * 64 ) / 64;
            } else {
              vx = 0;
            }
            var vy;
            if ( Direction.isUp( d ) ) {
              vy = Math.floor( ( -passengerBox.bottom + vehicleBox.top ) * 64 ) / 64;
            } else if ( Direction.isDown( d ) ) {
              vy = Math.ceil( ( vehicleBox.bottom - passengerBox.top ) * 64 ) / 64;
            } else {
              vy = 0;
            }

            this.setThrough( true );
            this.moveVector( vx, vy );
            this.setThrough( false );

            this.setTransparent( false );
          }

          this._vehicleGettingOff = true;
          this.setMoveSpeed( 4 );
          this.setThrough( false );
          this.makeEncounterCount();
          this.gatherFollowers();
        }
        return this._vehicleGettingOff;
      };

      Game_Player.prototype.updateVehicleGetOff = function() {
        if ( !this.areFollowersGathering() && this.vehicle().isLowest() && this._collisionType !== CollisionMesh.WALK ) {
          this._collider = this.vehicle()._passengerCollider;
          this.vehicle()._passengerCollider = undefined;
          this._collisionType = CollisionMesh.WALK;
          this._vehicleGettingOff = false;
          this._vehicleType = 'walk';
          this.setTransparent( false );
        }
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Player.prototype.actionWidth = function() {
        var bbox = this.collider().aabbox;
        var width = bbox.right - bbox.left;
        return width < 1 ? width : 1;
      };

      Game_Player.prototype.actionHeight = function() {
        var bbox = this.collider().aabbox;
        var height = bbox.bottom - bbox.top;
        return height < 1 ? height : 1;
      };

    } )();

  } )();

  /**
   * Game_Follower
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      Game_Follower.prototype.initMembers = function() {
        Game_Character.prototype.initMembers.call( this );
        this._collider = Collider.createFromXML( FOLLOWERS.COLLIDER_LIST );
        this._isFrozen = false;
        this._circularMovement = FOLLOWERS.CIRCULAR_MOVEMENT;
      };

      Game_Follower.prototype.chaseCharacter = function( character ) {
        if ( this._moveTarget || this._isFrozen ) {
          return;
        }

        var displayWidth = Graphics.width / $gameMap.tileWidth();
        var displayHeight = Graphics.height / $gameMap.tileHeight();

        var aabbox = this.collider().aabbox;
        var width = aabbox.right - aabbox.left;
        var height = aabbox.bottom - aabbox.top;

        var ax = this._x + ( aabbox.left + aabbox.right ) / 2;
        var ay = this._y + ( aabbox.top + aabbox.bottom ) / 2;

        // Teleportation
        var midX = $gameMap.canvasToMapX( Graphics.width / 2 );
        var dmX = $gameMap.directionX( ax, midX );
        if ( dmX > displayWidth + width ) {
          // Off left edge
          var tx = $gameMap.canvasToMapX( 0 ) - width;
          if ( $gameMap.canWalk( this, tx, this._y ) ) {
            this.setPosition( tx, this._y );
          }
        } else if ( dmX < -displayWidth - width ) {
          // Off right edge
          var tx = $gameMap.canvasToMapX( Graphics.width ) + width;
          if ( $gameMap.canWalk( this, tx, this._y ) ) {
            this.setPosition( tx, this._y );
          }
        }
        var midY = $gameMap.canvasToMapY( Graphics.height / 2 );
        var dmY = $gameMap.directionY( ay, midY );
        if ( dmY > displayHeight + height ) {
          // Off top edge
          var ty = $gameMap.canvasToMapY( 0 ) - height;
          if ( $gameMap.canWalk( this, this._x, ty ) ) {
            this.setPosition( this._x, ty );
          }
        } else if ( dmY < -displayHeight - height ) {
          // Off bottom edge
          var ty = $gameMap.canvasToMapY( Graphics.height ) + height;
          if ( $gameMap.canWalk( this, this._x, ty ) ) {
            this.setPosition( this._x, ty );
          }
        }

        var characterBox = character.collider().aabbox;
        var cWidth = characterBox.right - characterBox.left;
        var cHeight = characterBox.bottom - characterBox.top;

        var bx = character._x + ( characterBox.left + characterBox.right ) / 2;
        var by = character._y + ( characterBox.top + characterBox.bottom ) / 2;

        var dx = $gameMap.directionX( ax, bx );
        var dy = $gameMap.directionY( ay, by );

        var distance = Math.sqrt( dx * dx + dy * dy );
        var radius = ( this.collider().type === Collider.CIRCLE ? this.collider().radius : ( width > height ? width : height ) / 2 );
        var characterRadius = ( character.collider().type === Collider.CIRCLE ? character.collider().radius : ( cWidth > cHeight ? cWidth : cHeight ) / 2 );

        if ( distance > ( radius + characterRadius ) * $gameSystem._followerDistance ) {
          // Chase if far away
          this.setMoveSpeed( character.realMoveSpeed() );
          this.setThrough( $gamePlayer.isThrough() || $gamePlayer.isDebugThrough() );

          if ( distance > 2 ) {
            dx /= distance;
            dy /= distance;
          }

          if ( this._circularMovement ) {
            this.moveVector( dx * this.stepDistance, dy * this.stepDistance );
          } else {
            var vector = Direction.normalizeSquare( dx, dy );
            this.moveVector( vector.x * this.stepDistance, vector.y * this.stepDistance );
          }

          this.setThrough( true );
        }

        if ( this.isOnLadder() ) {
          this.setDirection( 8 );
        } else if ( !this._wasMoving ) {
          var adx = Math.abs( dx );
          var ady = Math.abs( dy );
          if ( adx > ady ) {
            this.setDirectionVector( dx, 0 );
          } else if ( ady > adx ) {
            this.setDirectionVector( 0, dy );
          }
        }
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Follower.prototype.setFrozen = function( frozen ) {
        this._isFrozen = frozen;
      };

    } )();

  } )();

  /**
   * Game_Followers
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      Game_Followers.prototype.update = function() {
          if ( this.areGathering() ) {
            var direction = $gamePlayer.direction();
            var visibleFollowers = this.visibleFollowers();
            for ( var ii = 0; ii < visibleFollowers.length; ii++ ) {
              var follower = visibleFollowers[ii];

              var dx = $gameMap.directionX( follower._x, this._targetX );
              var dy = $gameMap.directionY( follower._y, this._targetY );

              var distance = Math.sqrt( dx * dx + dy * dy );
              dx /= distance;
              dy /= distance;

              follower.setThrough( true );
              follower.moveVector( dx * follower.stepDistance, dy * follower.stepDistance );
              follower.setThrough( false );
              follower.setDirection( direction );
            }

            if ( this.areGathered() ) {
              this._gathering = false;
            }
          } else {
            this.updateMove();
          }
          this.visibleFollowers().forEach( function( follower ) {
            follower.update();
          }, this );

          if ( $gameSystem._staticFollowerDistance != FOLLOWERS.DISTANCE ) {
            $gameSystem._staticFollowerDistance = FOLLOWERS.DISTANCE;
            $gameSystem._followerDistance = FOLLOWERS.DISTANCE;
          }
      };

      Game_Followers.prototype.gather = function() {
        this._gathering = true;
        this._targetX = $gamePlayer._x;
        this._targetY = $gamePlayer._y;
      };

      Game_Followers.prototype.areGathered = function() {
        var screenRadius = Math.sqrt( Graphics.width * Graphics.width + Graphics.height * Graphics.height ) / 2;
        screenRadius /= Math.sqrt( $gameMap.tileWidth() * $gameMap.tileWidth() + $gameMap.tileHeight() * $gameMap.tileHeight() ) / 2;

        var visibleFollowers = this.visibleFollowers();
        for ( var ii = 0; ii < visibleFollowers.length; ii++ ) {
          var follower = visibleFollowers[ii];

          var dx = $gameMap.directionX( follower._realX, this._targetX );
          var dy = $gameMap.directionY( follower._realY, this._targetY );

          var distance = Math.sqrt( dx * dx + dy * dy );
          if ( distance > screenRadius ) {
            // Don't count if off screen
            continue;
          } else if ( distance > follower.stepDistance ) {
            return false;
          } else {
            follower._x = this._targetX;
            follower._y = this._targetY;
            follower._realX = this._targetX;
            follower._realY = this._targetY;
          }
        }
        return true;
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Followers.prototype.contains = function( item ) {
        return this._data.indexOf( item ) >= 0;
      };

    } )();

  } )();

  /**
   * Game_Vehicle
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Vehicle_initialize = Game_Vehicle.prototype.initialize;
      Game_Vehicle.prototype.initialize = function( type ) {
        Game_Vehicle_initialize.call( this, type );

        if ( this.isAirship() ) {
          this._collider = Collider.createFromXML( VEHICLES.AIRSHIP_COLLIDER_LIST );
        } else if ( this.isShip() ) {
          this._collider = Collider.createFromXML( VEHICLES.SHIP_COLLIDER_LIST );
        } else if ( this.isBoat() ) {
          this._collider = Collider.createFromXML( VEHICLES.BOAT_COLLIDER_LIST );
        } else {
          this._collider = Collider.sharedCharacter();
        }
      };

      Game_Vehicle.prototype.isLandOk = function( x, y, d ) {
        if ( this.isAirship() ) {
          $gamePlayer._collider = this._passengerCollider; // Reset colliders temporarily
          // Check rough tiles under colliders
          var tiles = $gameMap.getTilesUnder( this ).concat( $gameMap.getTilesUnder( $gamePlayer ) );
          var canWalk = true;
          for ( var ii = 0; ii < tiles.length; ii++ ) {
            if ( !$gameMap.isAirshipLandOk( tiles[ii][0], tiles[ii][1] ) ) {
                canWalk = false;
                break;
            }
          }
          if ( canWalk && ( $gameMap.touchesCharacters( this, x, y ) || $gameMap.touchesCharacters( $gamePlayer, x, y ) ) ) {
            canWalk = false;
          }
          $gamePlayer._collider = this.collider(); // Undo player collider reset
          return canWalk;
        } else {
          var vehicleBox = this.collider().aabbox;
          var passengerBox = this._passengerCollider.aabbox;

          // Get disembark direction
          var tw = $gameMap.tileWidth();
          var th = $gameMap.tileHeight();
          var vx;
          if ( Direction.isLeft( d ) ) {
            vx = Math.floor( ( -passengerBox.right + vehicleBox.left ) * 64 ) / 64;
          } else if ( Direction.isRight( d ) ) {
            vx = Math.ceil( ( vehicleBox.right - passengerBox.left ) * 64 ) / 64;
          } else {
            vx = 0;
          }
          var vy;
          if ( Direction.isUp( d ) ) {
            vy = Math.floor( ( -passengerBox.bottom + vehicleBox.top ) * 64 ) / 64;
          } else if ( Direction.isDown( d ) ) {
            vy = Math.ceil( ( vehicleBox.bottom - passengerBox.top ) * 64 ) / 64;
          } else {
            vy = 0;
          }

          var reverseDirection = this.reverseDir( d );
          $gamePlayer._collider = this._passengerCollider; // Reset colliders temporarily

          // Check rough tiles under player
          var tiles = $gameMap.getTilesUnder( $gamePlayer, vx, vy );
          var canWalk = true;
          for ( var ii = 0; ii < tiles.length; ii++ ) {
            if ( !$gameMap.isAABBoxValid( tiles[ii][0], tiles[ii][1], vehicleBox ) || !$gameMap.isAABBoxValid( tiles[ii][0], tiles[ii][1], passengerBox ) ) {
              canWalk = false;
              break;
            } else if ( !$gameMap.isPassable( tiles[ii][0], tiles[ii][1], reverseDirection ) ) {
              canWalk = false;
              break;
            }
          }

          if ( canWalk && $gameMap.touchesCharacters( $gamePlayer, x + vx, y + vy ) ) {
            canWalk = false;
          }
          $gamePlayer._collider = this.collider(); // Undo player collider reset
          return canWalk;
        }
      };

    } )();

  } )();

  /**
   * Game_Event
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
      Game_Event.prototype.setupPageSettings = function() {
        Game_Event_setupPageSettings.call( this );
        this.collider();
      };

      var Game_Event_start = Game_Event.prototype.start;
      Game_Event.prototype.start = function() {
        if ( this._lastFrame === Graphics.frameCount ) {
          return;
        }
        Game_Event_start.call( this );
        this._lastFrame = Graphics.frameCount + 1;
      };

      Game_Event.prototype.collider = function() {
        var page = this.page();
        if ( !!page ) {
          if ( !page._collider ) {
            var mapId = $gameMap.mapId();
            var storedCollider = $gameSystem._eventColliders[mapId] ? $gameSystem._eventColliders[mapId][this.eventId()] : undefined;
            if ( !!storedCollider ) {
              page._collider = storedCollider;
            }
          }

          if ( !page._collider ) {
            var comments = [];
            for ( var ii = 0; ii < page.list.length; ii++ ) {
              if ( page.list[ii].code === 108 || page.list[ii].code === 408 ) {
                comments.push( page.list[ii].parameters[0] );
              }
            }
            if ( comments.length > 0 ) {
              var xmlDoc = DOM_PARSER.parseFromString( '<doc>' + comments.join( '\n' ) + '</doc>', 'text/xml' );
              var childNodes = xmlDoc.childNodes[0].childNodes;
              for ( var ii = 0; ii < childNodes.length; ii++ ) {
                if ( childNodes[ii].nodeName === 'collider' ) {
                  var collider = Collider.createFromXML( xmlDoc.childNodes[0] );
                  if ( collider === Collider.null() ) {
                    var childChilds = childNodes[ii].childNodes;
                    for ( var jj = 0; jj < childChilds.length; jj++ ) {
                      if ( childChilds[jj].nodeName === 'preset' ) {
                        page._collider = Collider.getPreset( childChilds[jj].innerHTML.trim() );
                        break;
                      }
                    }
                  } else {
                    page._collider = collider;
                  }
                  break;
                }
              }
            }
          }

          if ( !page._collider ) {
            var dataEvent = $dataMap.events[this.eventId()];
            var presetId = dataEvent ? dataEvent.meta.collider : null;
            if ( presetId ) {
              var asNum = +presetId;
              if ( isNaN( asNum ) ) {
                page._collider = Collider.getPreset( presetId.trim() );
              } else {
                page._collider = Collider.getPreset( asNum );
              }
            }
          }

          this._hasCustomCollider = !!page._collider;

          if ( !page._collider ) {
            if ( this.isTile() || !this.characterName() || this.isObjectCharacter() ) {
              page._collider = Collider.createFromXML( EVENT.TILE_COLLIDER_LIST );
            } else {
              page._collider = Collider.createFromXML( EVENT.CHARACTER_COLLIDER_LIST );
            }
          }
          return page._collider;
        }
        return Collider.null();
      };

      Game_Event.prototype.setCollider = function( collider ) {
        var pages = this.event().pages;
        for ( var ii = 0; ii < pages.length; ii++ ) {
          pages[ii]._collider = collider;
        }
        $gameSystem._eventColliders[$gameMap.mapId()][this.eventId()] = collider;
      };

      Game_Event.prototype.checkEventTriggerTouch = function( x, y ) {
        if ( this._trigger === 2 && !$gameMap.isEventRunning() && !this.isJumping() && this.isNormalPriority() ) {
          var bboxTests = $gameMap.getAABBoxTests( this, x - this._x, y - this._y );
          var loopMap = -1;
          for ( var ii = 0; ii < bboxTests.length; ii++ ) {
            if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, $gamePlayer._x, $gamePlayer._y, $gamePlayer.collider().aabbox ) ) {
              loopMap = bboxTests[ii].type;
              break;
            }
          }

          if ( loopMap < 0 ) {
            return;
          }

          var playerX = $gamePlayer._x;
          var playerY = $gamePlayer._y;

          if ( loopMap == 1 ) { playerX += $gameMap.width(); }
          else if ( loopMap == 2 ) { playerX -= $gameMap.width(); }
          else if ( loopMap == 3 ) { playerY += $gameMap.height(); }
          else if ( loopMap == 4 ) { playerY -= $gameMap.height(); }
          else if ( loopMap == 5 ) { playerX += $gameMap.width(); playerY += $gameMap.height(); }
          else if ( loopMap == 6 ) { playerX -= $gameMap.width(); playerY += $gameMap.height(); }
          else if ( loopMap == 7 ) { playerX += $gameMap.width(); playerY -= $gameMap.height(); }
          else if ( loopMap == 8 ) { playerX -= $gameMap.width(); playerY -= $gameMap.height(); }

          if ( Collider.intersect( x, y, this.collider(), playerX, playerY, $gamePlayer.collider() ) ) {
            this.start();
          }
        }
      };

    } )();

  } )();

  /**
   * Game_Interpreter
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Interpreter_command101 = Game_Interpreter.prototype.command101;
      Game_Interpreter.prototype.command101 = function() {
        Game_Interpreter_command101.call( this );
        $gamePlayer._touchTarget = null;
      };

    } )();

  } )();

  /**
   * Game_Map
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Map_setup = Game_Map.prototype.setup;
      Game_Map.prototype.setup = function( mapId ) {
        Game_Map_setup.call( this, mapId );
        if ( !$gameSystem._eventColliders[mapId] ) {
          $gameSystem._eventColliders[mapId] = [];
        }
      };

      Game_Map.prototype.tileId = function( x, y, z ) {
        x = x | 0;
        y = y | 0;
        var width = $dataMap.width;
        var height = $dataMap.height;
        return $dataMap.data[( z * height + y ) * width + x] || 0;
      };

      Game_Map.prototype.canvasToMapX = function( x ) {
        var tileWidth = this.tileWidth();
        var originX = this._displayX * tileWidth;
        var mapX = ( originX + x ) / tileWidth;
        return this.roundX( mapX );
      };

      Game_Map.prototype.canvasToMapY = function( y ) {
        var tileHeight = this.tileHeight();
        var originY = this._displayY * tileHeight;
        var mapY = ( originY + y ) / tileHeight;
        return this.roundY( mapY );
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Map.prototype.directionX = function( ax, bx ) {
        if ( this.isLoopHorizontal() ) {
          var dxA = bx - ax;
          var dxB = ( bx - this.width() ) - ax;
          var dxC = ( bx + this.width() ) - ax;
          dx = Math.abs( dxA ) < Math.abs( dxB ) ? dxA : dxB;
          return Math.abs( dx ) < Math.abs( dxC ) ? dx : dxC;
        } else {
          return bx - ax;
        }
      };

      Game_Map.prototype.directionY = function( ay, by ) {
        if ( this.isLoopVertical() ) {
          var dyA = by - ay;
          var dyB = ( by - this.height() ) - ay;
          var dyC = ( by + this.height() ) - ay;
          dy = Math.abs( dyA ) < Math.abs( dyB ) ? dyA : dyB;
          return Math.abs( dy ) < Math.abs( dyC ) ? dy : dyC;
        } else {
          return by - ay;
        }
      };

      Game_Map.prototype.collisionMesh = function( collisionType ) {
        collisionType = collisionType || CollisionMesh.WALK;
        return CollisionMesh.getMesh( this.mapId(), collisionType );
      }

      Game_Map.prototype.getCharactersUnderPoint = function( x, y ) {
        return this.characters().filter( function( entry ) {
          if ( !entry ) {
            return false;
          }
          var aabbox = entry.collider().aabbox;
          if ( x < entry._x + aabbox.left ) {
            return false;
          } else if ( x > entry._x + aabbox.right ) {
            return false;
          } else if ( y < entry._y + aabbox.top ) {
            return false;
          } else if ( y > entry._y + aabbox.bottom ) {
            return false;
          }
          return true;
        } );
      };

      Game_Map.prototype.getCharactersUnder = function( character, x, y ) {
        var vx = x - character.x;
        var vy = y - character.y;

        var collider = character.collider();
        var bboxTests = this.getAABBoxTests( character, vx, vy );

        // Gather any solid characters within the movement bounding box
        var loopMap = {};
        var characters = this.characters().filter( function( entry ) {
          if ( !entry ) {
            return false;
          }
          for ( var ii = 0; ii < bboxTests.length; ii++ ) {
            if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, entry._x, entry._y, entry.collider().aabbox ) ) {
              loopMap[entry] = bboxTests[ii].type;
              return true;
            }
          }
          return false;
        } );

        characters = characters.filter( function( character ) {
          var entryX = character._x;
          var entryY = character._y;

          if ( loopMap[character] == 1 ) { entryX += $gameMap.width(); }
          else if ( loopMap[character] == 2 ) { entryX -= $gameMap.width(); }
          else if ( loopMap[character] == 3 ) { entryY += $gameMap.height(); }
          else if ( loopMap[character] == 4 ) { entryY -= $gameMap.height(); }
          else if ( loopMap[character] == 5 ) { entryX += $gameMap.width(); entryY += $gameMap.height(); }
          else if ( loopMap[character] == 6 ) { entryX -= $gameMap.width(); entryY += $gameMap.height(); }
          else if ( loopMap[character] == 7 ) { entryX += $gameMap.width(); entryY -= $gameMap.height(); }
          else if ( loopMap[character] == 8 ) { entryX -= $gameMap.width(); entryY -= $gameMap.height(); }

          return Collider.intersect( x, y, collider, entryX, entryY, character.collider() );
        } );

        return characters;
      };

      Game_Map.prototype.getTilesUnder = function( character, vx, vy ) {
        vx = vx || 0;
        vy = vy || 0;

        var collider = character.collider();
        var bboxTests = this.getAABBoxTests( character, vx, vy );
        var tiles = [];

        // Test collision with map
        var left = Math.floor( character._x + vx + collider.aabbox.left );
        var top = Math.floor( character._y + vy + collider.aabbox.top );
        var right = Math.ceil( character._x + vx + collider.aabbox.right - Number.EPSILON );
        var bottom = Math.ceil( character._y + vy + collider.aabbox.bottom - Number.EPSILON );

        var tileCollider = Collider.sharedTile();
        for ( var yy = top; yy < bottom; yy++ ) {
          for ( var xx = left; xx < right; xx++ ) {
            if ( Collider.intersect( character._x + vx, character._y + vy, collider, xx, yy, tileCollider ) ) {
              tiles.push( [xx, yy] );
            }
          }
        }

        return tiles;
      };

      Game_Map.prototype.touchesCharacters = function( character, x, y ) {
        var vx = x - character.x;
        var vy = y - character.y;

        var collider = character.collider();
        var bboxTests = this.getAABBoxTests( character, vx, vy );

        // Gather any solid characters within the movement bounding box
        var loopMap = {};
        var characters = $gameMap.characters().filter( function( entry ) {
          if ( character.collidableWith( entry ) ) {
            for ( var ii = 0; ii < bboxTests.length; ii++ ) {
              if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, entry._x, entry._y, entry.collider().aabbox ) ) {
                loopMap[entry] = bboxTests[ii].type;
                return true;
              }
            }
          }
          return false;
        } );

        // Test collision with characters
        for ( var ii = 0; ii < characters.length; ii++ ) {
          var entryX = characters[ii]._x;
          var entryY = characters[ii]._y;

          if ( loopMap[characters[ii]] == 1 ) { entryX += this.width(); }
          else if ( loopMap[characters[ii]] == 2 ) { entryX -= this.width(); }
          else if ( loopMap[characters[ii]] == 3 ) { entryY += this.height(); }
          else if ( loopMap[characters[ii]] == 4 ) { entryY -= this.height(); }
          else if ( loopMap[characters[ii]] == 5 ) { entryX += this.width(); entryY += this.height(); }
          else if ( loopMap[characters[ii]] == 6 ) { entryX -= this.width(); entryY += this.height(); }
          else if ( loopMap[characters[ii]] == 7 ) { entryX += this.width(); entryY -= this.height(); }
          else if ( loopMap[characters[ii]] == 8 ) { entryX -= this.width(); entryY -= this.height(); }

          if ( Collider.intersect( x, y, collider, entryX, entryY, characters[ii].collider() ) ) {
            return true;
          }
        }

        return false;
      };

      Game_Map.prototype.canMoveOn = function( character, x, y, collisionMesh ) {
        var collider = character.collider();
        var xd = x - character._x;
        var yd = y - character._y;
        var bboxTests = this.getAABBoxTests( character, xd, yd );

        // Gather any solid characters within the movement bounding box
        var loopMap = {};
        var characters = $gameMap.characters().filter( function( entry ) {
          if ( character.collidableWith( entry ) ) {
            for ( var ii = 0; ii < bboxTests.length; ii++ ) {
              if ( Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, entry._x, entry._y, entry.collider().aabbox ) ) {
                loopMap[entry] = bboxTests[ii].type;
                return true;
              }
            }
          }
          return false;
        } );

        // Test collision with characters
        for ( var ii = 0; ii < characters.length; ii++ ) {
          var entry = characters[ii];
          var entryX = entry._x;
          var entryY = entry._y;

          if ( loopMap[entry] == 1 ) { entryX += this.width(); }
          else if ( loopMap[entry] == 2 ) { entryX -= this.width(); }
          else if ( loopMap[entry] == 3 ) { entryY += this.height(); }
          else if ( loopMap[entry] == 4 ) { entryY -= this.height(); }
          else if ( loopMap[entry] == 5 ) { entryX += this.width(); entryY += this.height(); }
          else if ( loopMap[entry] == 6 ) { entryX -= this.width(); entryY += this.height(); }
          else if ( loopMap[entry] == 7 ) { entryX += this.width(); entryY -= this.height(); }
          else if ( loopMap[entry] == 8 ) { entryX -= this.width(); entryY -= this.height(); }

          if ( Collider.intersect( character._x, character._y, collider, entryX, entryY, entry.collider() ) ) {
            return false;
          }
        }

        // Test collision with map
        for ( var ii = 0; ii < bboxTests.length; ii++ ) {
          var offsetX = 0;
          var offsetY = 0;
          if ( bboxTests[ii].type == 1 ) { offsetX += this.width(); }
          else if ( bboxTests[ii].type == 2 ) { offsetX -= this.width(); }
          else if ( bboxTests[ii].type == 3 ) { offsetY += this.height(); }
          else if ( bboxTests[ii].type == 4 ) { offsetY -= this.height(); }
          else if ( bboxTests[ii].type == 5 ) { offsetX += this.width(); offsetY += this.height(); }
          else if ( bboxTests[ii].type == 6 ) { offsetX -= this.width(); offsetY += this.height(); }
          else if ( bboxTests[ii].type == 7 ) { offsetX += this.width(); offsetY -= this.height(); }
          else if ( bboxTests[ii].type == 8 ) { offsetX -= this.width(); offsetY -= this.height(); }

          var mapColliders = Collider.polygonsWithinColliderList( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, 0, 0, collisionMesh );
          if ( mapColliders.length > 0 ) {
            for ( var jj = 0; jj < mapColliders.length; jj++ ) {
              if ( Collider.intersect( x, y, collider, offsetX, offsetY, mapColliders[jj] ) ) {
                return false;
              }
            }
          }
        }

        return true;
      };

      Game_Map.prototype.isAABBoxValid = function( x, y, aabbox ) {
        return aabbox.left + x >= 0 && aabbox.right + x <= this.width() && aabbox.top + y >= 0 && aabbox.bottom + y <= this.height();
      };

      Game_Map.prototype.canWalk = function( character, x, y ) {
        // Passability test
        if ( !this.checkPassage( x, y, 0x0f ) ) {
          return false;
        }
        return this.canMoveOn( character, x, y, CollisionMesh.getMesh( this.mapId(), CollisionMesh.WALK ) );
      };

      Game_Map.prototype.getAABBoxTests = function( character, vx, vy ) {
        var aabbox = character.collider().aabbox;
        if ( vx || vy ) {
          // Extend aabbox for vectors
          aabbox = {
            left: aabbox.left + ( vx < 0 ? vx : 0 ),
            top: aabbox.top + ( vy < 0 ? vy : 0 ),
            right: aabbox.right + ( vx > 0 ? vx : 0 ),
            bottom: aabbox.bottom + ( vy > 0 ? vy : 0 )
          };
        }

        // Construct aabbox tests for map edges
        var bboxTests = [ { x: character._x, y: character._y, aabbox: aabbox, type: 0 } ];
        if ( this.isLoopHorizontal() ) {
          bboxTests.push( { x: character._x - this.width(), y: character._y, aabbox: aabbox, type: 1 } );
          bboxTests.push( { x: character._x + this.width(), y: character._y, aabbox: aabbox, type: 2 } );
        }
        if ( this.isLoopVertical() ) {
          bboxTests.push( { x: character._x, y: character._y - this.height(), aabbox: aabbox, type: 3 } );
          bboxTests.push( { x: character._x, y: character._y + this.height(), aabbox: aabbox, type: 4 } );
        }
        if ( this.isLoopHorizontal() && this.isLoopVertical() ) {
          bboxTests.push( { x: character._x - this.width(), y: character._y - this.height(), aabbox: aabbox, type: 5 } );
          bboxTests.push( { x: character._x + this.width(), y: character._y - this.height(), aabbox: aabbox, type: 6 } );
          bboxTests.push( { x: character._x - this.width(), y: character._y + this.height(), aabbox: aabbox, type: 7 } );
          bboxTests.push( { x: character._x + this.width(), y: character._y + this.height(), aabbox: aabbox, type: 8 } );
        }
        return bboxTests;
      };

      Game_Map.prototype.characters = function() {
        return this._events.concat( $gamePlayer, this._vehicles, $gamePlayer._followers._data );
      };

    } )();

  } )();

  /**
   * Sprite_Destination
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      Sprite_Destination.prototype.createBitmap = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap( tileWidth, tileHeight );
        this.bitmap.drawCircle( tileWidth / 2, tileHeight / 2, ( tileWidth < tileHeight ? tileWidth : tileHeight ) / 2, 'white' );
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = Graphics.BLEND_ADD;
      };

      Sprite_Destination.prototype.update = function() {
        Sprite.prototype.update.call( this );
        if ( $gamePlayer._touchTarget ){
          this.updatePosition();
          this.updateAnimation();
          this.visible = true;
        } else {
          this._frameCount = 0;
          this.visible = false;
        }
      };

      Sprite_Destination.prototype.updatePosition = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        var x = $gamePlayer._touchTarget.x;
        var y = $gamePlayer._touchTarget.y;
        this.x = ( $gameMap.adjustX( x ) + 0.5 ) * tileWidth;
        this.y = ( $gameMap.adjustY( y ) + 0.5 ) * tileHeight;
      };

    } )();

  } )();

  /**
   * CollisionMesh
   */
  function CollisionMesh() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    CollisionMesh.WALK = 0;
    CollisionMesh.BOAT = 1;
    CollisionMesh.SHIP = 2;
    CollisionMesh.AIRSHIP = 3;

    CollisionMesh.meshInMemory = { mapId: null, mesh: [] };

    CollisionMesh.getMesh = function( mapId, type ) {
      type = type || CollisionMesh.WALK;

      if ( CollisionMesh.meshInMemory.mapId === mapId ) {
        return CollisionMesh.meshInMemory.mesh[type];
      }

      var cacheName = 'cache_mesh%1'.format( mapId.padZero( 3 ) );
      if ( ( PLAY_TEST.COLLISION_MESH_CACHING && $gameTemp.isPlaytest() ) && StorageManager.exists( cacheName ) ) {
        CollisionMesh.meshInMemory.mapId = mapId;
        CollisionMesh.meshInMemory.mesh = JsonEx.parse( StorageManager.load( cacheName ) );
      } else {
        var gameMap;
        if ( $gameMap.mapId() === mapId ) {
          gameMap = $gameMap;
        } else {
          gameMap = new Game_Map();
          gameMap.setup( mapId );
        }

        CollisionMesh.meshInMemory.mapId = mapId;
        CollisionMesh.meshInMemory.mesh[CollisionMesh.WALK] = CollisionMesh.makeCollisionMesh( gameMap, gameMap.isPassable );
        if ( !gameMap.boat().isTransparent() ) {
          CollisionMesh.meshInMemory.mesh[CollisionMesh.BOAT] = CollisionMesh.makeCollisionMesh( gameMap, gameMap.isBoatPassable );
        }
        if ( !gameMap.ship().isTransparent() ) {
          CollisionMesh.meshInMemory.mesh[CollisionMesh.SHIP] = CollisionMesh.makeCollisionMesh( gameMap, gameMap.isShipPassable );
        }
        if ( !gameMap.airship().isTransparent() ) {
          CollisionMesh.meshInMemory.mesh[CollisionMesh.AIRSHIP] = CollisionMesh.makeCollisionMesh( gameMap );
        }
        StorageManager.save( cacheName, JSON.prune( CollisionMesh.meshInMemory.mesh ) );
      }

      return CollisionMesh.meshInMemory.mesh[type];
    };

    CollisionMesh.addTileDCollisionObject = function( x, y, object, scale, tileWidth, tileHeight, colliders ) {
      x += object.x / tileWidth;
      y += object.y / tileHeight;
      if ( object.polygon ) {
        // Polygon
        var polygon = [];
        for ( var ii = 0; ii < object.polygon.length; ii++ ) {
          polygon[ii] = [
            x + ( object.polygon[ii].x / tileWidth ),
            y + ( object.polygon[ii].y / tileHeight )
          ];
        }
        colliders.push( Collider.createPolygon( polygon ) );
      } else if ( object.polyline ) {
        // Polyline
        var polylines;
        if ( object.polyline.length == 2 ) {
          polylines = Collider.createPolygon( [
            [x + ( object.polyline[0].x / tileWidth ), y + ( object.polyline[0].y / tileWidth )],
            [x + ( object.polyline[1].x / tileHeight ), y + ( object.polyline[1].y / tileHeight )]
          ] );
        } else {
          polylines = Collider.createList();
          for ( var ii = 0; ii < ( object.polyline.length - 1 ); ii++ ) {
            Collider.addToList( polylines, Collider.createPolygon( [
              [x + ( object.polyline[ii].x / tileWidth ), y + ( object.polyline[ii].y / tileWidth )],
              [x + ( object.polyline[ii + 1].x / tileHeight ), y + ( object.polyline[ii + 1].y / tileHeight )]
            ] ) );
          }
        }
        colliders.push( polylines );
      } else if ( object.ellipse ) {
        // Ellipse
        if ( object.width == object.height ) {
          // Circle
          var rad = ( object.width / tileWidth ) / 2;
          colliders.push( Collider.createCircle( x + rad, y + rad, rad ) );
        } else {
          // Regular polygon
          var rx = ( object.width / tileWidth ) / 2;
          var ry = ( object.height / tileHeight ) / 2;
          var points = ( object.properties && object.properties.points ) ? object.properties.points : 8;
          colliders.push( Collider.createRegularPolygon( x + rx, y + ry, rx, ry, points ) );
        }
      } else {
        // Rect
        var w = object.width / tileWidth;
        var h = object.height / tileHeight;
        colliders.push( Collider.createRect( x, y, w, h ) );
      }
    };

    CollisionMesh.makeCollisionMesh = function( gameMap, passFunc ) {
      // Make collision mask
      var collisionGrid = [];
      if ( !passFunc ) {
        passFunc = function( x, y, d ) { return true; };
      }
      for ( var xx = 0; xx < gameMap.width(); xx++ ) {
        collisionGrid[xx] = [];
        for ( var yy = 0; yy < gameMap.height(); yy++ ) {
          collisionGrid[xx][yy] = 0;
          if ( !passFunc.call( gameMap, xx, yy, Direction.UP ) ) {
            collisionGrid[xx][yy] |= ( 0x1 << 0 );
          }
          if ( !passFunc.call( gameMap, xx, yy, Direction.LEFT ) ) {
            collisionGrid[xx][yy] |= ( 0x1 << 1 );
          }
          if ( !passFunc.call( gameMap, xx, yy, Direction.DOWN ) ) {
            collisionGrid[xx][yy] |= ( 0x1 << 2 );
          }
          if ( !passFunc.call( gameMap, xx, yy, Direction.RIGHT ) ) {
            collisionGrid[xx][yy] |= ( 0x1 << 3 );
          }
        }
      }

      var colliders = [];
      var d = 2;

      // Non-looping sides
      if ( !gameMap.isLoopHorizontal() ) {
        var q = gameMap.isLoopVertical() ? 0 : d;
        colliders.push( Collider.createPolygon(
          [ [ 0, 0 ], [ 0, gameMap.height() ], [ -d, gameMap.height() + q ] , [ -d, -q ]  ]
        ) );
        colliders.push( Collider.createPolygon(
          [ [ gameMap.width(), gameMap.height() ], [ gameMap.width(), 0 ], [ gameMap.width() + d, -q ], [ gameMap.width() + d, gameMap.height() + q ] ]
        ) );
      }
      if ( !gameMap.isLoopVertical() ) {
        var q = gameMap.isLoopHorizontal() ? 0 : d;
        colliders.push( Collider.createPolygon(
          [ [ gameMap.width(), 0 ], [ 0, 0 ], [ -q, -d ], [ gameMap.width() + q, -d ] ]
        ) );
        colliders.push( Collider.createPolygon(
          [ [ 0, gameMap.height() ], [ gameMap.width(), gameMap.height() ], [ gameMap.width() + q, gameMap.height() + d ], [ -q, gameMap.height() + d ] ]
        ) );
      }

      // Build tiles (Fixes some cases for humpy corner collision)
      for ( var yy = 0; yy < gameMap.height(); yy++ ) {
        var top = gameMap.roundY( yy - 1 );
        var bottom = gameMap.roundY( yy + 1 );
        for ( var xx = 0; xx < gameMap.width(); xx++ ) {
          if ( collisionGrid[xx][yy] !== 0xf ) {
            continue;
          }

          var left = gameMap.roundX( xx - 1 );
          var right = gameMap.roundX( xx + 1 );

          var open = 0;
          if ( left < 0 || collisionGrid[left][yy] == 0 ) {
            open++;
          }
          if ( top < 0 || collisionGrid[xx][top] == 0 ) {
            open++;
          }
          if ( right >= gameMap.width() || collisionGrid[right][yy] == 0 ) {
            open++;
          }
          if ( bottom >= gameMap.height() || collisionGrid[xx][bottom] == 0 ) {
            open++;
          }

          if ( open === 4 ) {
            collisionGrid[xx][yy] = 0;
            colliders.push( Collider.createPolygon( [
              [ xx, yy ],
              [ xx + 1, yy ],
              [ xx + 1, yy + 1 ],
              [ xx, yy + 1 ],
            ] ) );
          }
        }
      }

      // Build horizontal lines
      var horizontalLine = null;
      var hColliders = [];
      for ( var yy = 0; yy < gameMap.height(); yy++ ) {
        for ( var xx = 0; xx < gameMap.width(); xx++ ) {
          var y2 = gameMap.roundY( yy - 1 );
          if ( ( collisionGrid[xx][yy] & ( 0x1 << 0 ) || ( y2 >= 0 && collisionGrid[xx][y2] & ( 0x1 << 2 ) ) ) ) {
            // Can't move up or down
            // Is a horizontal line
            if ( !horizontalLine ) {
              horizontalLine = [[xx, yy]];
            }
            horizontalLine[1] = [xx + 1, yy];
          } else if ( !!horizontalLine ) {
            hColliders.push( Collider.createPolygon( horizontalLine ) );
            // hColliders.push( Collider.createPolygon( [[horizontalLine[1][0], horizontalLine[1][1]], [horizontalLine[0][0], horizontalLine[0][1]]] ) );
            horizontalLine = null;
          }
        }
        if ( !!horizontalLine ) {
          hColliders.push( Collider.createPolygon( horizontalLine ) );
          // hColliders.push( Collider.createPolygon( [[horizontalLine[1][0], horizontalLine[1][1]], [horizontalLine[0][0], horizontalLine[0][1]]] ) );
          horizontalLine = null;
        }
      }

      // Build vertical lines
      var verticalLine = null;
      var vColliders = [];
      for ( var xx = 0; xx < gameMap.width(); xx++ ) {
        for ( var yy = 0; yy < gameMap.height(); yy++ ) {
          var x2 = gameMap.roundX( xx - 1 );
          if ( ( collisionGrid[xx][yy] & ( 0x1 << 1 ) || ( x2 >= 0 && collisionGrid[x2][yy] & ( 0x1 << 3 ) ) ) ) {
            // Can't move left or right
            // Is a vertical line
            if ( !verticalLine ) {
              verticalLine = [[xx, yy]];
            }
            verticalLine[1] = [xx, yy + 1];
          } else if ( !!verticalLine ) {
            vColliders.push( Collider.createPolygon( verticalLine ) );
            // vColliders.push( Collider.createPolygon( [[verticalLine[1][0], verticalLine[1][1]], [verticalLine[0][0], verticalLine[0][1]]] ) );
            verticalLine = null;
          }
        }
        if ( !!verticalLine ) {
          vColliders.push( Collider.createPolygon( verticalLine ) );
          // vColliders.push( Collider.createPolygon( [[verticalLine[1][0], verticalLine[1][1]], [verticalLine[0][0], verticalLine[0][1]]] ) );
          verticalLine = null;
        }
      }

      // TileD colliders
      if ( gameMap.tiledData ) {
        var tileWidth = gameMap.tileWidth();
        var tileHeight = gameMap.tileHeight();
        var scale = ( gameMap.isHalfTile && gameMap.isHalfTile() ) ? 2 : 1;
        var tilesetColliders = [];

        // Build tile colliders
        var tilesets = gameMap.tiledData.tilesets;
        for ( var ii = 0; ii < tilesets.length; ii++ ) {
          tilesetColliders[ii] = {};

          var tiles = tilesets[ii].tiles;
          for ( var key in tiles ) {
            if ( tiles[key].objectgroup ) {
              tilesetColliders[ii][key] = tiles[key].objectgroup.objects;
            }
          }
        }

        // Place tile colliders
        for ( var ii = 0; ii < gameMap.tiledData.layers.length; ii++ ) {
          var layer = gameMap.tiledData.layers[ii];
          for ( var yy = 0; yy < layer.height; yy++ ) {
            var row = yy * layer.width;
            for ( var xx = 0; xx < layer.width; xx++ ) {
              var tileId = layer.data[row + xx];
              if ( tileId === 0 ) {
                continue;
              }
              tileId++;

              // Find tileset belonging to tileId
              var tilesetId = -1;
              var firstId = 0;
              for ( var jj = 0; jj < gameMap.tiledData.tilesets.length; jj++ ) {
                firstId = gameMap.tiledData.tilesets[jj].firstgid;
                var lastId = firstId + gameMap.tiledData.tilesets[jj].tilecount;
                if ( tileId >= firstId && tileId <= lastId ) {
                  tilesetId = jj;
                  break;
                }
              }
              if ( tilesetId < 0 ) {
                continue;
              }

              // Get objectGroup for this tileId
              var tileSet = tilesetColliders[tilesetId];
              var objectGroup = tileSet['' + ( tileId - firstId - 1 )];
              if ( objectGroup ) {
                for ( var jj = 0; jj < objectGroup.length; jj++ ) {
                  var object = objectGroup[jj];
                  var x = xx * scale;
                  var y = yy * scale;
                  CollisionMesh.addTileDCollisionObject( x, y, object, scale, tileWidth, tileHeight, colliders );
                }
              }
            }
          }
        }

        // Find collision mesh layers
        for ( var ii = 0; ii < gameMap.tiledData.layers.length; ii++ ) {
          var layer = gameMap.tiledData.layers[ii];
          if ( layer.type == "objectgroup" && layer.properties && layer.properties.collision == "mesh" ) {
            for ( var jj = 0; jj < layer.objects.length; jj++ ) {
              CollisionMesh.addTileDCollisionObject( 0, 0, layer.objects[jj], scale, tileWidth, tileHeight, colliders );
            }
          }
        }
      }

      // We sort the horizontal and vertical lines separately as we check
      // map collision in two stages: horizontal then vertical
      var collisionMesh = Collider.createList();
      if ( colliders.length > 0 ) {
        Collider.addToList( collisionMesh, Collider.treeFromArray( colliders ) );
      }
      if ( hColliders.length > 0 ) {
        Collider.addToList( collisionMesh, Collider.treeFromArray( hColliders ) );
      }
      if ( vColliders.length > 0 ) {
        Collider.addToList( collisionMesh, Collider.treeFromArray( vColliders ) );
      }
      return collisionMesh;
    };


  } )();

  /**
   * Collider
   * Utility for managing colliders
   */
  function Collider() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    Collider.CIRCLE = 0;
    Collider.POLYGON = 1;
    Collider.LIST = 2;
    Collider.PRECISION = Math.pow( 2, 7 );
    Collider.I_PRECISION = 1 / Collider.PRECISION;
    Collider.PRESETS = [];

    Collider.createList = function() {
      return { type: Collider.LIST, colliders: [], aabbox: { left: Number.POSITIVE_INFINITY, top: Number.POSITIVE_INFINITY, right: Number.NEGATIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY } };
    };

    Collider.addToList = function( list, collider ) {
      list.colliders.push( collider );
      list.aabbox.left = collider.aabbox.left < list.aabbox.left ? collider.aabbox.left : list.aabbox.left;
      list.aabbox.top = collider.aabbox.top < list.aabbox.top ? collider.aabbox.top : list.aabbox.top;
      list.aabbox.right = collider.aabbox.right > list.aabbox.right ? collider.aabbox.right : list.aabbox.right;
      list.aabbox.bottom = collider.aabbox.bottom > list.aabbox.bottom ? collider.aabbox.bottom : list.aabbox.bottom;
    };

    Collider.getPreset = function( id ) {
      if ( Collider.PRESETS.length === 0 ) {
        // Index starts at 1 (first item is null collider)
        Collider.PRESETS[0] = Collider.null();
        for ( var ii = 0; ii < PRESETS.length; ii++ ) {
          var xmlDoc = DOM_PARSER.parseFromString( '<collider>' + JSON.parse( PRESETS[ii] ) + '</collider>', 'text/xml' );
          Collider.PRESETS[ii + 1] = Collider.createFromXML( xmlDoc );

          var childNodes = xmlDoc.childNodes[0].childNodes;
          for ( var jj = 0; jj < childNodes.length; jj++ ) {
            if ( childNodes[jj].nodeName === 'name' ) {
              Collider.PRESETS[childNodes[jj].innerHTML.trim()] = Collider.PRESETS[ii + 1];
              break;
            }
          }
        }
      }
      return Collider.PRESETS[id] || null;
    };

    Collider.createFromXML = function( xml ) {
      var xmlDoc = ( typeof xml === 'string' ? DOM_PARSER.parseFromString( xml, 'text/xml' ) : xml );
      var childNodes = xmlDoc.childNodes;
      for ( var ii = 0; ii < xmlDoc.childNodes.length; ii++ ) {
        if ( xmlDoc.childNodes[ii].nodeName === 'collider' ) {
          childNodes = xmlDoc.childNodes[ii].childNodes;
          break;
        }
      }
      var filterNodes = [];
      for ( var ii = 0; ii < childNodes.length; ii++ ) {
        switch ( childNodes[ii].nodeName ) {
        case 'rect':
        case 'circle':
        case 'line':
        case 'polygon':
        case 'regular':
          filterNodes.push( childNodes[ii] );
          break;
        }
      }
      childNodes = filterNodes;
      if ( childNodes.length === 0 ) {
        return Collider.null();
      } else if ( childNodes.length === 1 ) {
        switch ( childNodes[0].nodeName ) {
        case 'rect':
          var x = Number( childNodes[0].getAttribute( 'x' ) );
          var y = Number( childNodes[0].getAttribute( 'y' ) );
          var width = Number( childNodes[0].getAttribute( 'width' ) );
          var height = Number( childNodes[0].getAttribute( 'height' ) );
          return Collider.createRect( x, y, width, height );
        case 'circle':
          var cx = Number( childNodes[0].getAttribute( 'cx' ) );
          var cy = Number( childNodes[0].getAttribute( 'cy' ) );
          var r = Number( childNodes[0].getAttribute( 'r' ) );
          return Collider.createCircle( cx, cy, r );
        case 'line':
          var x1 = Number( childNodes[0].getAttribute( 'x1' ) );
          var y1 = Number( childNodes[0].getAttribute( 'y1' ) );
          var x2 = Number( childNodes[0].getAttribute( 'x2' ) );
          var y2 = Number( childNodes[0].getAttribute( 'y2' ) );
          return Collider.createLine( x1, y1, x2, y2 );
        case 'polygon':
          var points = childNodes[0].getAttribute( 'points' ).split( ' ' );
          for ( var jj = 0; jj < points.length; jj++ ) {
            points[jj] = points[jj].split( ',' );
            for ( var kk = 0; kk < points[jj].length; kk++ ) {
              points[jj][kk] = Number( points[jj][kk] );
            }
          }
          return Collider.createPolygon( points );
        case 'regular':
          var cx = Number( childNodes[0].getAttribute( 'cx' ) );
          var cy = Number( childNodes[0].getAttribute( 'cy' ) );
          var rx = Number( childNodes[0].getAttribute( 'rx' ) );
          var ry = Number( childNodes[0].getAttribute( 'ry' ) );
          var p = Number( childNodes[0].getAttribute( 'p' ) );
          return Collider.createRegularPolygon( cx, cy, rx, ry, p );
        }
      } else {
        var colliderList = Collider.createList();
        for ( var ii = 0; ii < childNodes.length; ii++ ) {
          switch ( childNodes[ii].nodeName ) {
          case 'rect':
            var x = Number( childNodes[ii].getAttribute( 'x' ) );
            var y = Number( childNodes[ii].getAttribute( 'y' ) );
            var width = Number( childNodes[ii].getAttribute( 'width' ) );
            var height = Number( childNodes[ii].getAttribute( 'height' ) );
            Collider.addToList( colliderList, Collider.createRect( x, y, width, height ) );
            break;
          case 'circle':
            var cx = Number( childNodes[ii].getAttribute( 'cx' ) );
            var cy = Number( childNodes[ii].getAttribute( 'cy' ) );
            var r = Number( childNodes[ii].getAttribute( 'r' ) );
            Collider.addToList( colliderList, Collider.createCircle( cx, cy, r ) );
            break;
          case 'line':
            var x1 = Number( childNodes[ii].getAttribute( 'x1' ) );
            var y1 = Number( childNodes[ii].getAttribute( 'y1' ) );
            var x2 = Number( childNodes[ii].getAttribute( 'x2' ) );
            var y2 = Number( childNodes[ii].getAttribute( 'y2' ) );
            Collider.addToList( colliderList, Collider.createLine( x1, y1, x2, y2 ) );
            break;
          case 'polygon':
            var points = childNodes[ii].getAttribute( 'points' ).split( ' ' );
            for ( var jj = 0; jj < points.length; jj++ ) {
              points[jj] = points[jj].split( ',' );
              for ( var kk = 0; kk < points[jj].length; kk++ ) {
                points[jj][kk] = Number( points[jj][kk] );
              }
            }
            Collider.addToList( colliderList, Collider.createPolygon( points ) );
            break;
          case 'regular':
            var cx = Number( childNodes[ii].getAttribute( 'cx' ) );
            var cy = Number( childNodes[ii].getAttribute( 'cy' ) );
            var rx = Number( childNodes[ii].getAttribute( 'rx' ) );
            var ry = Number( childNodes[ii].getAttribute( 'ry' ) );
            var p = Number( childNodes[ii].getAttribute( 'p' ) );
            Collider.addToList( colliderList, Collider.createRegularPolygon( cx, cy, rx, ry, p ) );
            break;
          }
        }
        return colliderList;
      }
    };

    Collider.createRect = function( x, y, width, height ) {
      return Collider.createPolygon( [
        [ x, y ],
        [ x + width, y ],
        [ x + width, y + height ],
        [ x, y + height ]
      ] );
    };

    Collider.createLine = function( x1, y1, x2, y2 ) {
      return Collider.createPolygon( [
        [ x1, y1 ],
        [ x2, y2 ],
      ] );
    };

    Collider.createCircle = function( x, y, radius ) {
      return { type: Collider.CIRCLE, x: x, y: y, radius: radius, aabbox: { left: x - radius, top: y - radius, right: x + radius, bottom: y + radius } };
    };

    Collider.createPolygon = function( vertices ) {
      var aabbox = {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      };
      vertices.forEach( function( vertex ) {
        if ( vertex[0] < aabbox.left ) { aabbox.left = vertex[0]; }
        if ( vertex[1] < aabbox.top ) { aabbox.top = vertex[1]; }
        if ( vertex[0] > aabbox.right ) { aabbox.right = vertex[0]; }
        if ( vertex[1] > aabbox.bottom ) { aabbox.bottom = vertex[1]; }
      } );
      return { type: Collider.POLYGON, vertices: vertices, aabbox: aabbox };
    };

    Collider.createRegularPolygon = function( x, y, sx, sy, points ) {
      if ( !points || points < 3 ) {
        return Collider.createCircle( x, y, Math.sqrt( sx * sx +  sy * sy ) );
      }
      var vertices = [];
      var divisor = points / ( Math.PI * 2 );
      var pi2 = Math.PI / 2;
      for ( var ii = 0; ii < points; ii++ ) {
        vertices.push( [ x + Math.cos( ii / divisor - pi2 ) * sx, y + Math.sin( ii / divisor - pi2 ) * sy ] );
      }
      return Collider.createPolygon( vertices );
    };

    Collider.null = function() {
      if ( !Collider._null ) {
        Collider._null = Collider.createPolygon( [] );
      }
      return Collider._null;
    };

    Collider.sharedTile = function() {
      if ( !Collider._sharedTile ) {
        Collider._sharedTile = Collider.createPolygon( [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ] );
      }
      return Collider._sharedTile;
    };

    Collider.sharedCircle = function() {
      if ( !Collider._sharedCircle ) {
        Collider._sharedCircle = Collider.createCircle( 0.5, 0.5, 0.5 );
      }
      return Collider._sharedCircle;
    };

    Collider.sharedCharacter = function() {
      if ( !Collider._sharedCharacter ) {
        Collider._sharedCharacter = Collider.createCircle( 0.5, 0.7, 0.25 );
      }
      return Collider._sharedCharacter;
    };

    Collider.sharedAirship = function() {
      if ( !Collider._sharedAirship ) {
        Collider._sharedAirship = Collider.createCircle( 0.5, 0.5, 0.25 );
      }
      return Collider._sharedAirship;
    };

    Collider.sharedShip = function() {
      if ( !Collider._sharedShip ) {
        Collider._sharedShip = Collider.createCircle( 0.5, 0.5, 0.5 );
      }
      return Collider._sharedShip;
    };

    Collider.sharedBoat = function() {
      if ( !Collider._sharedBoat ) {
        Collider._sharedBoat = Collider.createCircle( 0.5, 0.5, 1 / 3 );
      }
      return Collider._sharedBoat;
    };

    Collider.polygonsWithinColliderList = function( ax, ay, aabbox, bx, by, bc ) {
      var polygons = [];
      for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
        if ( Collider.aabboxCheck( ax, ay, aabbox, bx, by, bc.colliders[ii].aabbox ) ) {
          if ( bc.colliders[ii].type === Collider.LIST ) {
            polygons = polygons.concat( Collider.polygonsWithinColliderList( ax, ay, aabbox, bx, by, bc.colliders[ii] ) );
          } else {
            polygons.push( bc.colliders[ii] );
          }
        }
      }
      return polygons;
    };

    Collider.encaseCircleCircle = function( ax, ay, ac, bx, by, bc ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax - bx;
      var dy = ay - by;
      var dd = dx * dx + dy * dy;
      dd -= ( bc.radius * bc.radius );
      if ( dd < ac.radius * ac.radius ) {
        return true;
      }

      return false;
    };

    Collider.intersectCircleCircle = function( ax, ay, ac, bx, by, bc ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax - bx;
      var dy = ay - by;
      var dd = dx * dx + dy * dy;
      var rr = bc.radius + ac.radius;
      if ( dd < rr * rr ) {
        return true;
      }

      return false;
    };

    Collider.moveCircleCircle = function( ax, ay, ac, bx, by, bc, vector ) {
      ax = ax + ac.x;
      ay = ay + ac.y;
      bx = bx + bc.x;
      by = by + bc.y;

      var dx = ax + vector.x - bx;
      var dy = ay + vector.y - by;
      var dd = dx * dx + dy * dy;
      var rr = bc.radius + ac.radius;
      if ( dd < rr * rr ) {
        dd = rr - Math.sqrt( dd );
        var dl = Math.sqrt( dx * dx + dy * dy );
        vector.x += ( dx / dl ) * dd;
        vector.y += ( dy / dl ) * dd;
      }

      return vector;
    };

    Collider.encaseCirclePolygon = function( ax, ay, ac, bx, by, bc ) {
      var aradius = ac.radius + Collider.I_PRECISION;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minB < minA || maxB > maxA ) {
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minB < minA || maxB > maxA ) {
          return false;
        }
      }

      return true;
    };

    Collider.intersectCirclePolygon = function( ax, ay, ac, bx, by, bc ) {
      var aradius = ac.radius;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA >= maxB || maxA <= minB ) {
        // No collision
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA > maxB || maxA < minB ) {
          // No collision
          return false;
        }
      }

      return true;
    };

    Collider.moveCirclePolygon = function( ax, ay, ac, bx, by, bc, vector ) {
      var aradius = ac.radius;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax + vector.x ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay + vector.y ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var correctionDistance;
      var correctionX;
      var correctionY;
      var absDistance;

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA > maxB || maxA < minB ) {
        // No collision
        return vector;
      }

      correctionDistance = maxB - minA;
      correctionX = planeX;
      correctionY = planeY;
      absDistance = Math.abs( correctionDistance );

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA > maxB || maxA < minB ) {
          // No collision
          return vector;
        }

        var distance = maxB - minA;
        var gap = Math.abs( distance );
        if ( gap < absDistance ) {
          correctionDistance = distance;
          correctionX = planeX;
          correctionY = planeY;
          absDistance = gap;
        }
      }

      vector.x += correctionX * correctionDistance;
      vector.y += correctionY * correctionDistance;

      return vector;
    };

    Collider.encasePolygonCircle = function( bx, by, bc, ax, ay, ac ) {
      var aradius = ac.radius - Collider.I_PRECISION;
      ax = ax + ac.x;
      ay = ay + ac.y;

      var closestPoint = {
        distance: Number.POSITIVE_INFINITY,
      };
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        var dx = ( ax ) - ( bx + bc.vertices[ii][0] );
        var dy = ( ay ) - ( by + bc.vertices[ii][1] );
        var d = dx * dx + dy * dy;
        if ( d < closestPoint.distance ) {
          closestPoint.dx = dx;
          closestPoint.dy = dy;
          closestPoint.distance = d;
          closestPoint.index = ii;
        }
      }

      var planeX = closestPoint.dx;
      var planeY = closestPoint.dy;
      var length = Math.sqrt( planeX * planeX + planeY * planeY );
      planeX /= length;
      planeY /= length;

      // Project circle
      var point = planeX * ( ax ) + planeY * ( ay );
      var maxA = point + aradius;
      var minA = point - aradius;

      // Project polygon
      var minB = Number.POSITIVE_INFINITY;
      var maxB = Number.NEGATIVE_INFINITY;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
          var projection = planeX * ( bx + bc.vertices[ii][0] ) + planeY * ( by + bc.vertices[ii][1] );
          if ( projection < minB ) minB = projection;
          if ( projection > maxB ) maxB = projection;
      }

      if ( minA < minB || maxA > maxB ) {
        return false;
      }

      var jj;
      for ( var ii = 0; ii < bc.vertices.length; ii++ ) {
        jj = ii + 1;
        if ( jj == bc.vertices.length ) {
          jj = 0;
        }

        var planeX = bc.vertices[jj][1] - bc.vertices[ii][1];
        var planeY = bc.vertices[ii][0] - bc.vertices[jj][0];
        var length = Math.sqrt( planeX * planeX + planeY * planeY );
        planeX /= length;
        planeY /= length;

        // Project circle
        var point = planeX * ( ax ) + planeY * ( ay );
        var maxA = point + aradius;
        var minA = point - aradius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA < minB || maxA > maxB ) {
          return false;
        }
      }

      return true;
    };

    Collider.intersectPolygonCircle = function( ax, ay, ac, bx, by, bc ) {
      return Collider.intersectCirclePolygon( bx, by, bc, ax, ay, ac );
    };

    Collider.movePolygonCircle = function( ax, ay, ac, bx, by, bc, vector ) {
      var ivector = {
        x: -vector.x,
        y: -vector.y,
      };
      ivector = Collider.moveCirclePolygon( bx, by, bc, ax, ay, ac, ivector );
      vector.x = -ivector.x;
      vector.y = -ivector.y;
      return vector;
    };

    Collider.encasePolygonPolygon = function( ax, ay, ac, bx, by, bc ) {
      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + ac.vertices[kk][0] ) + planeY * ( ay + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }

          if ( minB < minA || maxB > maxA ) {
            return false;
          }
        }
      }

      return true;
    };

    Collider.intersectPolygonPolygon = function( ax, ay, ac, bx, by, bc ) {
      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + ac.vertices[kk][0] ) + planeY * ( ay + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }

          if ( minA > maxB || maxA < minB ) {
            // No collision
            return false;
          }
        }
      }

      return true;
    };

    Collider.movePolygonPolygon = function( ax, ay, ac, bx, by, bc, vector ) {
      var correctionDistance;
      var correctionX;
      var correctionY;
      var absDistance = Number.POSITIVE_INFINITY;

      var jj;
      var colliders = [ bc, ac ];
      for ( var cc = 0; cc < 2; cc++ ) {
        for ( var ii = 0; ii < colliders[cc].vertices.length; ii++ ) {
          jj = ii + 1;
          if ( jj == colliders[cc].vertices.length ) {
            jj = 0;
          }

          var planeX = colliders[cc].vertices[jj][1] - colliders[cc].vertices[ii][1];
          var planeY = colliders[cc].vertices[ii][0] - colliders[cc].vertices[jj][0];
          var length = Math.sqrt( planeX * planeX + planeY * planeY );
          planeX /= length;
          planeY /= length;

          // Project polygon A
          var minA = Number.POSITIVE_INFINITY;
          var maxA = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < ac.vertices.length; kk++ ) {
              var projection = planeX * ( ax + vector.x + ac.vertices[kk][0] ) + planeY * ( ay + vector.y + ac.vertices[kk][1] );
              if ( projection < minA ) minA = projection;
              if ( projection > maxA ) maxA = projection;
          }

          // Project polygon B
          var minB = Number.POSITIVE_INFINITY;
          var maxB = Number.NEGATIVE_INFINITY;
          for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
              var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
              if ( projection < minB ) minB = projection;
              if ( projection > maxB ) maxB = projection;
          }

          if ( minA > maxB || maxA < minB ) {
            // No collision
            return vector;
          }

          var distance = maxB - minA;
          var gap = Math.abs( distance );
          if ( gap < absDistance ) {
            correctionDistance = distance;
            correctionX = planeX;
            correctionY = planeY;
            absDistance = gap;
          }
        }
      }

      vector.x += correctionX * correctionDistance;
      vector.y += correctionY * correctionDistance;

      return vector;
    };

    /**
     * Does collider A encase B
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @return {Boolean} true if A encases B
     */
    Collider.encase = function( ax, ay, ac, bx, by, bc ) {
      if ( ac.type == Collider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          if ( Collider.encase( ax, ay, ac.colliders[ii], bx, by, bc ) ) {
            return true;
          }
        }
        return false;
      }

      if ( bc.type == Collider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          if ( Collider.encase( ax, ay, ac, bx, by, bc.colliders[ii] ) ) {
            return true;
          }
        }
        return false;
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.CIRCLE ) {
        // Circle circle test
        return Collider.encaseCircleCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.POLYGON ) {
        // Circle polygon test
        return Collider.encaseCirclePolygon( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.CIRCLE ) {
        // Polygon circle test
        return Collider.encasePolygonCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.POLYGON ) {
        // Polygon polygon test
        return Collider.encasePolygonPolygon( ax, ay, ac, bx, by, bc );
      }

      return false;
    };

    /**
     * Do colliders A & B touch
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @return {Boolean} true if touching, false otherwise
     */
    Collider.intersect = function( ax, ay, ac, bx, by, bc ) {
      if ( ac.type == Collider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          if ( Collider.intersect( ax, ay, ac.colliders[ii], bx, by, bc ) ) {
            return true;
          }
        }
        return false;
      }

      if ( bc.type == Collider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          if ( Collider.intersect( ax, ay, ac, bx, by, bc.colliders[ii] ) ) {
            return true;
          }
        }
        return false;
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.CIRCLE ) {
        // Circle circle test
        return Collider.intersectCircleCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.POLYGON ) {
        // Circle polygon test
        return Collider.intersectCirclePolygon( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.CIRCLE ) {
        // Polygon circle test
        return Collider.intersectPolygonCircle( ax, ay, ac, bx, by, bc );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.POLYGON ) {
        // Polygon polygon test
        return Collider.intersectPolygonPolygon( ax, ay, ac, bx, by, bc );
      }

      return false;
    };

    /**
     * Move and collide A towards B
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {Collider} ac Collider A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {Collider} bc Collider B
     * @param  {Vector}   vector Input movement vector A to B
     * @return {Vector} New movement vector
     */
    Collider.move = function( ax, ay, ac, bx, by, bc, vector ) {
      if ( ac.type == Collider.LIST ) {
        for ( var ii = 0; ii < ac.colliders.length; ii++ ) {
          vector = Collider.move( ax, ay, ac.colliders[ii], bx, by, bc, vector );
          if ( vector.x === 0 && vector.y === 0 ) {
            break;
          }
        }
        return vector;
      }

      if ( bc.type == Collider.LIST ) {
        for ( var ii = 0; ii < bc.colliders.length; ii++ ) {
          vector = Collider.move( ax, ay, ac, bx, by, bc.colliders[ii], vector );
          if ( vector.x === 0 && vector.y === 0 ) {
            break;
          }
        }
        return vector;
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.CIRCLE ) {
        // Circle circle test
        return Collider.moveCircleCircle( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == Collider.CIRCLE && bc.type == Collider.POLYGON ) {
        // Circle polygon test
        return Collider.moveCirclePolygon( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.CIRCLE ) {
        // Polygon circle test
        return Collider.movePolygonCircle( ax, ay, ac, bx, by, bc, vector );
      }

      if ( ac.type == Collider.POLYGON && bc.type == Collider.POLYGON ) {
        // Polygon polygon test
        return Collider.movePolygonPolygon( ax, ay, ac, bx, by, bc, vector );
      }

      return vector;
    };

    Collider.treeFromArray = function( colliders ) {
      while ( colliders.length > 1 ) {
        var shortestDist = Number.POSITIVE_INFINITY;
        var closestNode = -1;
        for ( var ii = 1; ii < colliders.length; ii++ ) {
          var leftDistance = Math.abs( colliders[ii].aabbox.right - colliders[0].aabbox.left );
          if ( leftDistance < shortestDist ) {
            shortestDist = leftDistance;
            closestNode = ii;
            continue;
          }

          var rightDistance = Math.abs( colliders[ii].aabbox.left - colliders[0].aabbox.right );
          if ( rightDistance < shortestDist ) {
            shortestDist = rightDistance;
            closestNode = ii;
            continue;
          }

          var topDistance = Math.abs( colliders[ii].aabbox.bottom - colliders[0].aabbox.top );
          if ( topDistance < shortestDist ) {
            shortestDist = topDistance;
            closestNode = ii;
            continue;
          }

          var bottomDistance = Math.abs( colliders[ii].aabbox.top - colliders[0].aabbox.bottom );
          if ( bottomDistance < shortestDist ) {
            shortestDist = bottomDistance;
            closestNode = ii;
            continue;
          }
        }

        // Create pairing
        var pair = Collider.createList();
        Collider.addToList( pair, colliders[0] );
        Collider.addToList( pair, colliders[closestNode] );
        colliders.splice( closestNode, 1 );
        colliders[0] = pair;
      }

      return colliders[0];
    };

    /**
     * Check if A and B roughly intersect with AABBoxes
     * @param  {Number}   ax X-position collider A
     * @param  {Number}   ay Y-position collider A
     * @param  {AABBox}   ac AABBox A
     * @param  {Number}   bx X-position collider B
     * @param  {Number}   by Y-position collider B
     * @param  {AABBox}   bc AABBox B
     * @param  {Number}   vx Adjustment vector of A toB
     * @param  {Number}   vy Adjustment vector of A to B
     * @return {Boolean}  True is AABBoxes intersect
     */
    Collider.aabboxCheck = function( ax, ay, ac, bx, by, bc, vx, vy ) {
      vx = vx || 0;
      vy = vy || 0;
      var left = ax + ac.left + ( vx < 0 ? vx : 0 );
      if ( left > bx + bc.right ) {
        return false;
      }

      var top = ay + ac.top + ( vy < 0 ? vy : 0 );
      if ( top > by + bc.bottom ) {
        return false;
      }

      var right = ax + ac.right + ( vx > 0 ? vx : 0 );
      if ( right < bx + bc.left ) {
        return false;
      }

      var bottom = ay + ac.bottom + ( vy > 0 ? vy : 0 );
      if ( bottom < by + bc.top ) {
        return false;
      }

      return true;
    };

  } )();

  /**
   * Direction
   * Utility for managing MV's directions
   */
  function Direction() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    Direction.DOWN_LEFT = 1;
    Direction.DOWN = 2;
    Direction.DOWN_RIGHT = 3;
    Direction.LEFT = 4;
    Direction.RIGHT = 6;
    Direction.UP_LEFT = 7;
    Direction.UP = 8;
    Direction.UP_RIGHT = 9;

    Direction.isUp = function( d ) {
      return d >= 7;
    };

    Direction.isRight = function( d ) {
      return d % 3 == 0;
    };

    Direction.isDown = function( d ) {
      return d <= 3;
    };

    Direction.isLeft = function( d ) {
      return ( d + 2 ) % 3 == 0;
    };

    Direction.fromVector = function( vx, vy ) {
      if ( vx && vy ) {
        if ( vy < 0 ) {
          if ( vx < 0 ) {
            return Direction.UP_LEFT;
          } else {
            return Direction.UP_RIGHT;
          }
        } else {
          if ( vx < 0 ) {
            return Direction.DOWN_LEFT;
          } else {
            return Direction.DOWN_RIGHT;
          }
        }
      } else if ( vx < 0 ) {
        return Direction.LEFT;
      } else if ( vx > 0 ) {
        return Direction.RIGHT;
      } else if ( vy < 0 ) {
        return Direction.UP;
      }
      return Direction.DOWN;
    };

    Direction.normalize = function( vx, vy, length ) {
      length = length || Math.sqrt( vx * vx + vy * vy );
      return { x: vx / length, y: vy / length, l: length };
    };

    Direction.normalizeSquare = function( vx, vy, length ) {
      var angle = Math.atan2( vy, vx );
      var cos = Math.cos( angle );
      var sin = Math.sin( angle );
      if ( !length ) {
        var absCos = Math.abs( cos );
        var absSin = Math.abs( sin );
        if ( absSin <= absCos ) {
          length = 1 / absCos;
        } else {
          length = 1 / absSin;
        }
      }
      return { x: vx * length, y: vy * length, l: length };
    };

  } )();

  /**
   * Library extensions
   * Additions to Javascript, if they are not available for some reason
   */
  ( function() {

    /*
     * EPSILON
     * Smallest floating point number greater than 0
     */
    if ( Number.EPSILON === undefined ) {
      Number.EPSILON = Math.pow( 2, -52 );
    }

    // JSON.prune : a function to stringify any object without overflow
    // two additional optional parameters :
    //   - the maximal depth (default : 6)
    //   - the maximal length of arrays (default : 50)
    // You can also pass an "options" object.
    // examples :
    //   var json = JSON.prune(window)
    //   var arr = Array.apply(0,Array(1000)); var json = JSON.prune(arr, 4, 20)
    //   var json = JSON.prune(window.location, {inheritedProperties:true})
    // Web site : http://dystroy.org/JSON.prune/
    // JSON.prune on github : https://github.com/Canop/JSON.prune
    // This was discussed here : http://stackoverflow.com/q/13861254/263525
    // The code is based on Douglas Crockford's code : https://github.com/douglascrockford/JSON-js/blob/master/json2.js
    // No effort was done to support old browsers. JSON.prune will fail on IE8.
    (function () {
    	'use strict';

    	var DEFAULT_MAX_DEPTH = 6;
    	var DEFAULT_ARRAY_MAX_LENGTH = 50;
    	var DEFAULT_PRUNED_VALUE = '"-pruned-"';
    	var seen; // Same variable used for all stringifications
    	var iterator; // either forEachEnumerableOwnProperty, forEachEnumerableProperty or forEachProperty

    	// iterates on enumerable own properties (default behavior)
    	var forEachEnumerableOwnProperty = function(obj, callback) {
    		for (var k in obj) {
    			if (Object.prototype.hasOwnProperty.call(obj, k)) callback(k);
    		}
    	};
    	// iterates on enumerable properties
    	var forEachEnumerableProperty = function(obj, callback) {
    		for (var k in obj) callback(k);
    	};
    	// iterates on properties, even non enumerable and inherited ones
    	// This is dangerous
    	var forEachProperty = function(obj, callback, excluded) {
    		if (obj==null) return;
    		excluded = excluded || {};
    		Object.getOwnPropertyNames(obj).forEach(function(k){
    			if (!excluded[k]) {
    				callback(k);
    				excluded[k] = true;
    			}
    		});
    		forEachProperty(Object.getPrototypeOf(obj), callback, excluded);
    	};

    	Object.defineProperty(Date.prototype, "toPrunedJSON", {value:Date.prototype.toJSON});

    	var	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    		meta = {	// table of character substitutions
    			'\b': '\\b',
    			'\t': '\\t',
    			'\n': '\\n',
    			'\f': '\\f',
    			'\r': '\\r',
    			'"' : '\\"',
    			'\\': '\\\\'
    		};

    	function quote(string) {
    		escapable.lastIndex = 0;
    		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
    			var c = meta[a];
    			return typeof c === 'string'
    				? c
    				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    		}) + '"' : '"' + string + '"';
    	}


    	var prune = function (value, depthDecr, arrayMaxLength) {
    		var prunedString = DEFAULT_PRUNED_VALUE;
    		var replacer;
    		if (typeof depthDecr == "object") {
    			var options = depthDecr;
    			depthDecr = options.depthDecr;
    			arrayMaxLength = options.arrayMaxLength;
    			iterator = options.iterator || forEachEnumerableOwnProperty;
    			if (options.allProperties) iterator = forEachProperty;
    			else if (options.inheritedProperties) iterator = forEachEnumerableProperty
    			if ("prunedString" in options) {
    				prunedString = options.prunedString;
    			}
    			if (options.replacer) {
    				replacer = options.replacer;
    			}
    		} else {
    			iterator = forEachEnumerableOwnProperty;
    		}
    		seen = [];
    		depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
    		arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
    		function str(key, holder, depthDecr) {
    			var i, k, v, length, partial, value = holder[key];

    			if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
    				value = value.toPrunedJSON(key);
    			}
    			if (value && typeof value.toJSON === 'function') {
    				value = value.toJSON();
    			}

    			switch (typeof value) {
    			case 'string':
    				return quote(value);
    			case 'number':
    				return isFinite(value) ? String(value) : 'null';
    			case 'boolean':
    			case 'null':
    				return String(value);
    			case 'object':
    				if (!value) {
    					return 'null';
    				}
    				if (depthDecr<=0 || seen.indexOf(value)!==-1) {
    					if (replacer) {
    						var replacement = replacer(value, prunedString, true);
    						return replacement===undefined ? undefined : ''+replacement;
    					}
    					return prunedString;
    				}
    				seen.push(value);
    				partial = [];
    				if (Object.prototype.toString.apply(value) === '[object Array]') {
    					length = Math.min(value.length, arrayMaxLength);
    					for (i = 0; i < length; i += 1) {
    						partial[i] = str(i, value, depthDecr-1) || 'null';
    					}
    					v = '[' + partial.join(',') + ']';
    					if (replacer && value.length>arrayMaxLength) return replacer(value, v, false);
    					return v;
    				}
    				iterator(value, function(k) {
    					try {
    						v = str(k, value, depthDecr-1);
    						if (v) partial.push(quote(k) + ':' + v);
    					} catch (e) {
    						// this try/catch due to forbidden accessors on some objects
    					}
    				});
    				return '{' + partial.join(',') + '}';
    			case 'function':
    			case 'undefined':
    				return replacer ? replacer(value, undefined, false) : undefined;
    			}
    		}
    		return str('', {'': value}, depthDecr);
    	};

    	prune.log = function() {
    		console.log.apply(console, Array.prototype.map.call(arguments, function(v) {
    			return JSON.parse(JSON.prune(v));
    		}));
    	};
    	prune.forEachProperty = forEachProperty; // you might want to also assign it to Object.forEachProperty

    	if (typeof module !== "undefined") module.exports = prune;
    	else JSON.prune = prune;
    }());

  } )();

} )();
