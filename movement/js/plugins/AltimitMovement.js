/*
 * MIT License
 *
 * Copyright (c) 2017 Altimit Systems LTD
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
 * @author Altimit Systems LTD
 *
 * @param play_test
 * @text Play-test
 * @desc Parameters when running in Play-test mode
 *
 * @param collision_mesh_caching
 * @text Collision mesh caching
 * @parent play_test
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @help
 * This plugin does not provide plugin commands.
 *
 * Usage:
 *  Plugin will automatically apply when ON.
 *
 * About:
 *  Version 0.01 Alpha
 *  Website https://github.com/AltimitSystems/mv-plugins/tree/master/movement
 */
( function() {

  var COLLISION_MESH_CACHING = PluginManager.parameters( 'AltimitMovement' )['collision_mesh_caching'] !== 'false';

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
     };

   } )();

    /**
     * Extensions
     */
    ( function() {

      Game_System.prototype.colliderCreateList = function() {
        return Collider.createList();
      };

      Game_System.prototype.colliderAddToList = function( list, collider ) {
        return Collider.addToList( list, collider );
      };

      Game_System.prototype.colliderCreateCircle = function( x, y, radius ) {
        return Collider.createCircle( x, y, radius );
      };

      Game_System.prototype.colliderCreatePolygon = function( vertices ) {
        return Collider.createPolygon( vertices );
      };

      Game_System.prototype.colliderCreateRegularPolygon = function( x, y, sx, sy, points ) {
        return Collider.createRegularPolygon( x, y, sx, sy, points );
      };

      Game_System.prototype.colliderSharedTile = function() {
        return Collider.sharedTile();
      };

      Game_System.prototype.colliderSharedCircle = function() {
        return Collider.sharedCircle();
      };

      Game_System.prototype.colliderSharedCharacter = function() {
        return Collider.sharedCharacter();
      };

      Game_System.prototype.colliderSharedAirship = function() {
        return Collider.sharedAirship();
      };

      Game_System.prototype.colliderSharedShip = function() {
        return Collider.sharedShip();
      };

      Game_System.prototype.colliderSharedBoat = function() {
        return Collider.sharedBoat();
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

      var Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
      Game_CharacterBase.prototype.initMembers = function() {
        Game_CharacterBase_initMembers.call( this );
      };

      var Game_CharacterBase_update = Game_CharacterBase.prototype.update;
      Game_CharacterBase.prototype.update = function() {
        if ( this._moveTarget ) {
          var dx = this._moveTargetX - this._x;
          var dy = this._moveTargetY - this._y;
          var length = Math.sqrt( dx * dx + dy * dy );
          if ( length <= this.stepDistance ) {
            this._moveTarget = false;
            this._x = this._moveTargetX;
            this._y = this._moveTargetY;
          } else {
            dx /= length;
            dy /= length;
            this.moveVector( dx * this.stepDistance, dy * this.stepDistance );
            if ( !this.isMovementSucceeded() && this._moveRoute.skippable ) {
              this._moveTarget = false;
              this.setDirectionFix( this._willUnfixDirection );
            }
          }
        }

        Game_CharacterBase_update.call( this );
      };

      Game_CharacterBase.prototype.moveStraight = function( d ) {
        var vy = Direction.isUp( d ) ? -this.stepDistance : ( Direction.isDown( d ) ? this.stepDistance : 0 );
        var vx = Direction.isLeft( d ) ? -this.stepDistance : ( Direction.isRight( d ) ? this.stepDistance : 0 );
        this.moveVector( vx, vy );
      };

      Game_CharacterBase.prototype.moveDiagonally = function( horz, vert ) {
        var vy = Direction.isUp( vert ) ? -this.stepDistance : ( Direction.isDown( vert ) ? this.stepDistance : 0 );
        var vx = Direction.isLeft( horz ) ? -this.stepDistance : ( Direction.isRight( horz ) ? this.stepDistance : 0 );
        this.moveVector( vx, vy );
      };

      Game_CharacterBase.prototype.isMoving = function() {
        return this._isMoving;
      };

      var Game_CharacterBase_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
      Game_CharacterBase.prototype.updateAnimation = function() {
        Game_CharacterBase_updateAnimation.call( this );
        this._wasMoving = this._isMoving;
        this._isMoving = this._x !== this._realX || this._y !== this._realY;
        if ( !this.isMoving() ) {
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
          && !character.isThrough()
          && !this.isThrough()
          && ( !character.isVisible ? true : character.isVisible() )
          && ( !this.vehicle ? true : this.vehicle() !== character )
          && ( !this.followers ? true : !this.followers().contains( character ) )
          && !( this instanceof Game_Follower ? character instanceof Game_Follower : false )
          && !( this instanceof Game_Follower ? character instanceof Game_Player : false )
          && !( this instanceof Game_Vehicle ? character instanceof Game_Player : false )
          && !( this instanceof Game_Vehicle ? character instanceof Game_Follower : false )
          && ( character instanceof Game_Vehicle ? character._mapId === $gameMap.mapId() : true );
      }

      Game_CharacterBase.prototype.moveVector = function( vx, vy ) {
        var move;
        if ( this.isThrough() || this.isDebugThrough() ) {
          var aabbox = this.collider().aabbox;
          move = { x: 0, y: 0 };

          var rx = $gameMap.roundX( this._x + vx  );
          if ( $gameMap.isValid( $gameMap.roundX( rx + ( vx < 0 ? aabbox.left : aabbox.right ) ), this._y ) ) {
            move.x = vx;
          }
          var ry = $gameMap.roundY( this._y + vy );
          if ( $gameMap.isValid( this._x, $gameMap.roundY( ry + ( vy < 0 ? aabbox.top : aabbox.bottom ) ) ) ) {
            move.y = vy;
          }

          move.x += this._x;
          move.y += this._y;
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

          // Test collision with map
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

            var mapColliders = Collider.polygonsWithinColliderList( bboxTests[ii].x + vx, bboxTests[ii].y + vy, bboxTests[ii].aabbox, 0, 0, $gameMap.collisionMesh() );
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

          move.x += this._x;
          move.y += this._y;
          // Resolve too much precision
          move.x = Math.floor( move.x * Collider.PRECISION ) / Collider.PRECISION;
          move.y = Math.floor( move.y * Collider.PRECISION ) / Collider.PRECISION;
        }

        var dx = move.x - this._x;
        var dy = move.y - this._y;
        if ( dx || dy ) {
          this._x = $gameMap.roundX( move.x );
          this._y = $gameMap.roundY( move.y );
          this._realX = this._x - dx;
          this._realY = this._y - dy;
          this.setMovementSuccess( true );
          this.setDirectionVector( dx, dy );
          this.increaseSteps();
          this._isMoving = true;
        } else {
          this.setMovementSuccess( false );
          this.setDirectionVector( vx, vy );
          this._isMoving = false;
        }

        this.checkEventTriggerTouchFrontVector( dx, dy );
      };

      Game_CharacterBase.prototype.setDirectionVector = function( vx, vy ) {
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
        var d = 1 + Math.randomInt( 8 );
        var vx = Direction.isLeft( d ) ? -1 : ( Direction.isRight( d ) ? 1 : 0 );
        var vy = Direction.isUp( d ) ? -1 : ( Direction.isDown( d ) ? 1 : 0 );
        if ( $gameMap.canWalk( this, this.x + vx, this.y + vy ) ) {
          this.setDirectionVector( vx, vy );
          this._moveTarget = true;
          this._moveTargetX = Math.round( this.x + vx );
          this._moveTargetY = Math.round( this.y + vy );
        }
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
          this._moveTargetX = Math.round( this._x );
          this._moveTargetY = Math.round( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_LEFT:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x - 1 );
          this._moveTargetY = Math.round( this._y );
          break;
        case gc.ROUTE_MOVE_RIGHT:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x + 1 );
          this._moveTargetY = Math.round( this._y );
          break;
        case gc.ROUTE_MOVE_UP:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x );
          this._moveTargetY = Math.round( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_LOWER_L:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x - 1 );
          this._moveTargetY = Math.round( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_LOWER_R:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x + 1 );
          this._moveTargetY = Math.round( this._y + 1 );
          break;
        case gc.ROUTE_MOVE_UPPER_L:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x - 1 );
          this._moveTargetY = Math.round( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_UPPER_R:
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x + 1 );
          this._moveTargetY = Math.round( this._y - 1 );
          break;
        case gc.ROUTE_MOVE_FORWARD:
          this._willUnfixDirection = this.isDirectionFixed();
          this.setDirectionFix( true );
          var vx = Direction.isLeft( this._direction ) ? -1 : ( Direction.isRight( this._direction ) ? 1 : 0 );
          var vy = Direction.isUp( this._direction ) ? -1 : ( Direction.isDown( this._direction ) ? 1 : 0 );
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x + vx );
          this._moveTargetY = Math.round( this._y + vy );
          break;
        case gc.ROUTE_MOVE_BACKWARD:
          this._willUnfixDirection = this.isDirectionFixed();
          this.setDirectionFix( true );
          var vx = Direction.isLeft( this._direction ) ? -1 : ( Direction.isRight( this._direction ) ? 1 : 0 );
          var vy = Direction.isUp( this._direction ) ? -1 : ( Direction.isDown( this._direction ) ? 1 : 0 );
          this._moveTarget = true;
          this._moveTargetX = Math.round( this._x - vx );
          this._moveTargetY = Math.round( this._y - vy );
          break;
        default:
          Game_Character_processMoveCommand.call( this, command );
          break;
        }
      };

      Game_Character.prototype.findDirectionTo = function( goalX, goalY ) {
        // TODO : Replace this
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
        this._collider = Collider.sharedCharacter();
      };

      Game_Player.prototype.checkEventTriggerTouch = Game_CharacterBase.prototype.checkEventTriggerTouch;

      var Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
      Game_Player.prototype.encounterProgressValue = function() {
        return Game_Player_encounterProgressValue.call( this ) * this.stepDistance;
      };

      var Game_Player_clearTransferInfo = Game_Player.prototype.clearTransferInfo;
      Game_Player.prototype.clearTransferInfo = function() {
        Game_Player_clearTransferInfo.call( this );
        this._moveTarget = false;
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
        if ( !this.isMoving() ) {
          this.updateNonmoving( wasMoving );
        }
        this._followers.update();
      };

      Game_Player.prototype.getInputDirection = function() {
        return Input.dir8;
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
              if ( Collider.encase( this._x, this._y, collider, entryX, entryY, events[ii].collider() ) || Collider.encase( entryX, entryY, events[ii].collider(), this._x, this._y, collider ) ) {
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

      Game_Player.prototype.moveStraight = Game_Character.prototype.moveStraight;
      Game_Player.prototype.moveDiagonally = Game_Character.prototype.moveDiagonally;

      Game_Player.prototype.getOnVehicle = function() {
        var vx = Direction.isLeft( this._direction ) ? -0.5 : ( Direction.isRight( this._direction ) ? 0.5 : 0 );
        var vy = Direction.isUp( this._direction ) ? -0.5 : ( Direction.isDown( this._direction ) ? 0.5 : 0 );
        var bboxTests = $gameMap.getAABBoxTests( this, vx, vy );

        var vehicle;
        var airship = $gameMap.airship();
        var ship = $gameMap.ship();
        var boat = $gameMap.boat();

        for ( var ii = 0; ii < bboxTests.length; ii++ ) {
          if ( !!airship && airship._mapId === $gameMap.mapId() == $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, airship._x, airship._y, airship.collider().aabbox ) ) {
            this._vehicleType = 'airship';
            $gameMap.collisionType = CollisionMesh.AIRSHIP;
            vehicle = airship;
            break;
          }
          if ( !!ship && ship._mapId === $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, ship._x, ship._y, ship.collider().aabbox ) ) {
            this._vehicleType = 'ship';
            $gameMap.collisionType = CollisionMesh.SHIP;
            vehicle = ship;
            break;
          }
          if ( !!boat && boat._mapId === $gameMap.mapId() && Collider.aabboxCheck( bboxTests[ii].x, bboxTests[ii].y, bboxTests[ii].aabbox, boat._x, boat._y, boat.collider().aabbox ) ) {
            this._vehicleType = 'boat';
            $gameMap.collisionType = CollisionMesh.BOAT;
            vehicle = boat;
            break;
          }
        }

        if ( this.isInVehicle() ) {
          this._vehicleGettingOn = true;
          vehicle._passengerCollider = this.collider();
          this._collider = vehicle.collider();

          var vx = vehicle._x - this._x;
          var vy = vehicle._y - this._y;
          this.moveVector( vx, vy );
          this.gatherFollowers();
        }

        return this._vehicleGettingOn;
      };

      Game_Player.prototype.getOffVehicle = function() {
        if ( this.vehicle().isLandOk( this.x, this.y, this.direction() ) ) {
          if ( this.isInAirship() ) {
            this.setDirection( 2 );
          }
          this._followers.synchronize( this.x, this.y, this.direction() );
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
        if ( !this.areFollowersGathering() && this.vehicle().isLowest() ) {
          this._collider = this.vehicle()._passengerCollider;
          this.vehicle()._passengerCollider = undefined;
          $gameMap.collisionType = CollisionMesh.WALK;
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

      var Game_Follower_initMembers = Game_Follower.prototype.initMembers;
      Game_Follower.prototype.initMembers = function() {
        Game_Follower_initMembers.call( this );
        this._collider = Collider.sharedCharacter();
      };

      Game_Follower.prototype.chaseCharacter = function( character ) {
        var screenRadius = Math.sqrt( Graphics.width * Graphics.width + Graphics.height * Graphics.height ) / 2;
        screenRadius /= Math.sqrt( $gameMap.tileWidth() * $gameMap.tileWidth() + $gameMap.tileHeight() * $gameMap.tileHeight() ) / 2;
        var myBox = this.collider().aabbox;

        // Move towards character to close up gap
        var myWidth = myBox.right - myBox.left;
        var myHeight = myBox.bottom - myBox.top;
        var myRadius = Math.sqrt( myWidth * myWidth + myHeight * myHeight ) / 2;

        var characterBox = character.collider().aabbox;
        var characterWidth = characterBox.right - characterBox.left;
        var characterHeight = characterBox.bottom - characterBox.top;
        var characterRadius = Math.sqrt( characterWidth * characterWidth + characterHeight * characterHeight ) / 2;

        var myCenterX = this.x + myBox.left + myWidth / 2;
        var myCenterY = this.y + myBox.top + myHeight / 2;

        var characterCenterX = character.x + characterBox.left + characterWidth / 2;
        var characterCenterY = character.y + characterBox.top + characterHeight / 2;

        var dx = characterCenterX - myCenterX;
        var dy = characterCenterY - myCenterY;
        var distance = Math.sqrt( dx * dx + dy * dy );
        if ( distance > screenRadius ) {
          dx /= distance;
          dy /= distance;
          dx *= screenRadius;
          dy *= screenRadius;
          var tx = Math.floor( character.x - dx ) + 0.5;
          var ty = Math.floor( character.y - dy ) + 0.5;

          if ( $gameMap.canWalk( this, tx, ty ) ) {
            this.setPosition( tx, ty );
          }
        } else if ( distance > myRadius + characterRadius ) {
          this.setMoveSpeed( character.realMoveSpeed() );

          // Prevent snapping through thin walls
          if ( distance - ( myRadius + characterRadius ) > 1 ) {
            dx /= distance;
            dy /= distance;
          }

          this.setThrough( false );
          this.moveVector( dx * this.stepDistance, dy * this.stepDistance );
          this.setThrough( true );
        }

        var adx = Math.abs( dx );
        var ady = Math.abs( dy );
        if ( adx > ady ) {
          this.setDirectionVector( dx, 0 );
        } else if ( ady > adx ) {
          this.setDirectionVector( 0, dy );
        }
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
              var dx = this._targetX - follower._x;
              var dy = this._targetY - follower._y;
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
          var dx = this._targetX - follower._realX;
          var dy = this._targetY - follower._realY;
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
          this._collider = Collider.sharedAirship();
        } else if ( this.isShip() ) {
          this._collider = Collider.sharedShip();
        } else if ( this.isBoat() ) {
          this._collider = Collider.sharedBoat();
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
            if ( !$gameMap.isValid( tiles[ii][0], tiles[ii][1] ) ) {
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
            } else if ( this.isTile() || !this.characterName() || this.isObjectCharacter() ) {
              page._collider = Collider.sharedTile();
            } else {
              page._collider = Collider.sharedCharacter();
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

  // /**
  //  * Game_Interpreter
  //  */
  // ( function() {
  //
  //   /**
  //    * Overrides
  //    */
  //   ( function() {
  //
  //     // Set Movement Route
  //     Game_Interpreter.prototype.command205 = function() {
  //       $gameMap.refreshIfNeeded();
  //       this._character = this.character( this._params[0] );
  //       if ( this._character ) {
  //         this._character.forceMoveRoute( this._params[1] );
  //         if ( this._params[1].wait ) {
  //           this.setWaitMode( 'route' );
  //         }
  //       }
  //       return true;
  //     };
  //
  //   } )();
  //
  // } )();

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
        this.setupCollisionMesh();
      };

      Game_Map.prototype.tileId = function( x, y, z ) {
        x = x | 0;
        y = y | 0;
        var width = $dataMap.width;
        var height = $dataMap.height;
        return $dataMap.data[( z * height + y ) * width + x] || 0;
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Object.defineProperties( Game_Map.prototype, {
          collisionType: {
            get: function() { return this._collisionType; },
            set: function( value ) { this._collisionType = value; },
            configurable: true
          }
      } );

      Game_Map.prototype.collisionMesh = function() {
        return CollisionMesh.getMesh( this.mapId(), this.collisionType );
      }

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

      Game_Map.prototype.setupCollisionMesh = function() {
        this.collisionType = CollisionMesh.WALK;
      };

      Game_Map.prototype.characters = function() {
        return this._events.concat( $gamePlayer, this._vehicles, $gamePlayer._followers._data );
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
      if ( ( !COLLISION_MESH_CACHING && $gameTemp.isPlaytest() ) && StorageManager.exists( cacheName ) ) {
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
        StorageManager.save( cacheName, JSON.stringify( CollisionMesh.meshInMemory.mesh ) );
      }

      return CollisionMesh.meshInMemory.mesh[type];
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

      // Non-looping sides
      if ( !gameMap.isLoopHorizontal() ) {
        colliders.push( Collider.createPolygon(
          [ [ 0, gameMap.height() ], [ 0, 0 ] ]
        ) );
        colliders.push( Collider.createPolygon(
          [ [ gameMap.width(), 0 ], [ gameMap.width(), gameMap.height() ] ]
        ) );
      }
      if ( !gameMap.isLoopVertical() ) {
        colliders.push( Collider.createPolygon(
          [ [ gameMap.width(), 0 ], [ 0, 0 ] ]
        ) );
        colliders.push( Collider.createPolygon(
          [ [ 0, gameMap.height() ], [ gameMap.width(), gameMap.height() ] ]
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
            // Is a horizontal line
            if ( !horizontalLine ) {
              horizontalLine = [[xx, yy]];
            }
            horizontalLine[1] = [xx + 1, yy];
          } else if ( !!horizontalLine ) {
            hColliders.push( Collider.createPolygon( horizontalLine ) );
            horizontalLine = null;
          }
        }
        if ( !!horizontalLine ) {
          hColliders.push( Collider.createPolygon( horizontalLine ) );
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
            // Is a vertical line
            if ( !verticalLine ) {
              verticalLine = [[xx, yy]];
            }
            verticalLine[1] = [xx, yy + 1];
          } else if ( !!verticalLine ) {
            vColliders.push( Collider.createPolygon( verticalLine ) );
            verticalLine = null;
          }
        }
        if ( !!verticalLine ) {
          vColliders.push( Collider.createPolygon( verticalLine ) );
          verticalLine = null;
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
    Collider.PRECISION = 1024;

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
        // Collider._sharedCharacter = Collider.createPolygon( [
        //   [ 0.25, 0.5 ],
        //   [ 0.75, 0.5 ],
        //   [ 0.75, 0.9 ],
        //   [ 0.25, 0.9 ],
        // ] );
        // Collider._sharedCharacter = Collider.sharedTile();
        // Collider._sharedCharacter = Collider.sharedCircle();
        // Collider._sharedCharacter = Collider.createRegularPolygon( 0.5, 0.5, 0.5, 0.5, 8 );
        // Collider._sharedCharacter = Collider.createRegularPolygon( 0.5, 0.7, 0.25, 0.25, 4 );
        Collider._sharedCharacter = Collider.createCircle( 0.5, 0.7, 0.25 );
        // Collider._sharedCharacter = Collider.createCircle( 0.5, 0.5, 1.0 );
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
      var minA = planeX * ( ax ) + planeY * ( ay );
      var maxA = minA + ac.radius;
      minA -= ac.radius;

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
        var minA = planeX * ( ax ) + planeY * ( ay );
        var maxA = minA + ac.radius;
        minA -= ac.radius;

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
      var minA = planeX * ( ax ) + planeY * ( ay );
      var maxA = minA + ac.radius;
      minA -= ac.radius;

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
        var minA = planeX * ( ax ) + planeY * ( ay );
        var maxA = minA + ac.radius;
        minA -= ac.radius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA >= maxB || maxA <= minB ) {
          // No collision
          return false;
        }
      }

      return true;
    };

    Collider.moveCirclePolygon = function( ax, ay, ac, bx, by, bc, vector ) {
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
      var minA = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
      var maxA = minA + ac.radius;
      minA -= ac.radius;

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
        var minA = planeX * ( ax + vector.x ) + planeY * ( ay + vector.y );
        var maxA = minA + ac.radius;
        minA -= ac.radius;

        // Project polygon
        var minB = Number.POSITIVE_INFINITY;
        var maxB = Number.NEGATIVE_INFINITY;
        for ( var kk = 0; kk < bc.vertices.length; kk++ ) {
            var projection = planeX * ( bx + bc.vertices[kk][0] ) + planeY * ( by + bc.vertices[kk][1] );
            if ( projection < minB ) minB = projection;
            if ( projection > maxB ) maxB = projection;
        }

        if ( minA >= maxB || maxA <= minB ) {
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
      var minA = planeX * ( ax ) + planeY * ( ay );
      var maxA = minA + ac.radius;
      minA -= ac.radius;

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
        var minA = planeX * ( ax ) + planeY * ( ay );
        var maxA = minA + ac.radius;
        minA -= ac.radius;

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

          if ( minA >= maxB || maxA <= minB ) {
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

          if ( minA >= maxB || maxA <= minB ) {
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
     * Do colliders A & B touch
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

  } )();

} )();
