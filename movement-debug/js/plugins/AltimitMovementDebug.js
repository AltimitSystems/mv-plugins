/*
 * MIT License
 *
 * Copyright (c) 2017 Altimit Community Contributors
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
// AltimitMovementDebug.js
//=============================================================================

/*:
 * @plugindesc Debug display layer for AltimitMovement
 * @author Altimit Community Contributors
 *
 * @param default_display
 * @text Default display
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @help
 * Plugin Command:
 *  AltimitMovement debug show
 *  AltimitMovement debug hide
 *
 * Usage:
 *  Requires Altimit Movement (https://github.com/AltimitSystems/mv-plugins/tree/master/movement).
 *  Plugin will automatically apply when ON.
 *
 * About:
 *  Version 0.01 Alpha
 *  Website https://github.com/AltimitSystems/mv-plugins/tree/master/movement-debug
 */
( function() {

  var default_display = PluginManager.parameters( 'AltimitMovementDebug' )['default_display'] !== 'false';

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
        if ( command === 'AltimitMovement' ) {
          switch ( args[0] ) {
          case 'debug':
            switch ( args[1] ) {
            case 'show':
              if ( !$gameTemp._vectorDebugVisible && SceneManager._scene instanceof Scene_Map ) {
                var sceneMap = SceneManager._scene;
                sceneMap._spriteset.addChild( sceneMap._spriteset._vectorDebugLayer );
                $gameTemp._vectorDebugVisible = true;
              }
              break;
            case 'hide':
              if ( !!$gameTemp._vectorDebugVisible && SceneManager._scene instanceof Scene_Map ) {
                var sceneMap = SceneManager._scene;
                sceneMap._spriteset.removeChild( sceneMap._spriteset._vectorDebugLayer );
                $gameTemp._vectorDebugVisible = false;
              }
              break;
            }
            break;
          }
        }
      };

    } )();

  } )();

  /**
   * Game_CharacterBase
   */
  ( function() {

    /**
     * Extensions
     */
    ( function() {

      Game_CharacterBase.prototype.screenOriginX = function() {
        var tw = $gameMap.tileWidth();
        return Math.round( this.scrolledX() * tw );
      };

      Game_CharacterBase.prototype.screenOriginY = function() {
        var th = $gameMap.tileHeight();
        return Math.round( this.scrolledY() * th );
      };

    } )();

  } )();

  /**
   * Spriteset_Map
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
      Spriteset_Map.prototype.createUpperLayer = function() {
        Spriteset_Map_createUpperLayer.call( this );
        this.createVectorDebugLayer();
      };

    } )();

    /**
     * Extension
     */
    ( function() {

      /**
       * Debug_Layer
       */
      function VectorDebugLayer() {
        this.initialize.apply( this, arguments );
      }
      ( function() {

        VectorDebugLayer.prototype = Object.create( Sprite.prototype );
        VectorDebugLayer.prototype.constructor = VectorDebugLayer

        VectorDebugLayer.prototype.initialize = function() {
          Sprite.prototype.initialize.call( this );
          this.bitmap = new Bitmap( Graphics.width, Graphics.height );
          this.opacity = 192;
        };

        VectorDebugLayer.prototype.update = function() {
          this.bitmap.clearRect( 0, 0, this.bitmap.width, this.bitmap.height );
          if ( !$gameMap.collisionMesh ) {
            return;
          }

          var tileWidth = $gameMap.tileWidth();
          var tileHeight = $gameMap.tileHeight();
          var bitmap = this.bitmap;

          var mapX = $gameMap.adjustX( 0 ) * tileWidth;
          var mapY = $gameMap.adjustY( 0 ) * tileHeight;
          mapX = Math.floor( mapX );
          mapY = Math.floor( mapY );
          bitmap.drawCollider( mapX + 0.5, mapY + 0.5, $gameMap.collisionMesh( $gamePlayer._collisionType ) );
          bitmap.drawCollider( mapX - ( $gameMap.width() * tileWidth ) + 0.5, mapY + 0.5, $gameMap.collisionMesh( $gamePlayer._collisionType ) );
          bitmap.drawCollider( mapX + 0.5, mapY - ( $gameMap.height() * tileHeight ) + 0.5, $gameMap.collisionMesh( $gamePlayer._collisionType ) );
          bitmap.drawCollider( mapX - ( $gameMap.width() * tileWidth ) + 0.5, mapY - ( $gameMap.height() * tileHeight ) + 0.5, $gameMap.collisionMesh( $gamePlayer._collisionType ) );

          $gameMap.characters().forEach( function( character ) {
            if ( !character || character._transparent || ( character.isVisible && !character.isVisible() ) ) {
              return;
            }
            bitmap.drawCollider( character.screenOriginX() + 0.5, character.screenOriginY() + 0.5, character.collider() );
          } );
        };

      } )();

      Spriteset_Map.prototype.createVectorDebugLayer = function() {
        this._vectorDebugLayer = new VectorDebugLayer();
        this._vectorDebugLayer.opacity = 128;
        if ( default_display && !$gameTemp._vectorDebugVisible ) {
          $gameTemp._vectorDebugVisible = true;
          default_display = false;
        }
        if ( $gameTemp._vectorDebugVisible ) {
          this.addChild( this._vectorDebugLayer );
        }
      };

    } )();

  } )();

  /**
   * Bitmap
   */
  ( function() {

    /**
     * Extension
     */
    ( function() {

      Bitmap.prototype.drawCollider = function( x, y, collider ) {
        var tw = $gameMap.tileWidth();
        var th = $gameMap.tileHeight();

        if ( x + collider.aabbox.right * tw < 0 ) {
          return;
        }
        if ( y + collider.aabbox.bottom * th < 0 ) {
          return;
        }
        if ( x + collider.aabbox.left * tw > Graphics.width ) {
          return;
        }
        if ( y + collider.aabbox.top * th > Graphics.height ) {
          return;
        }

        var context = this._context;

        if ( collider.type == 2 ) {
          context.save();
          context.lineWidth = 1;
          context.strokeStyle = 'yellow';
          context.strokeRect( x + collider.aabbox.left * tw, y + collider.aabbox.top * th, ( collider.aabbox.right - collider.aabbox.left ) * tw, ( collider.aabbox.bottom - collider.aabbox.top ) * th );
          context.restore();

          var bitmap = this;
          collider.colliders.forEach( function( collider ) {
            bitmap.drawCollider( x, y, collider );
          } );
          return;
        }

        context.save();
        context.lineWidth = 1;
        context.strokeStyle = 'green';
        context.strokeRect( x + collider.aabbox.left * tw, y + collider.aabbox.top * th, ( collider.aabbox.right - collider.aabbox.left ) * tw, ( collider.aabbox.bottom - collider.aabbox.top ) * th );
        context.restore();

        context.save();
        context.lineWidth = 1;
        context.strokeStyle = 'blue';
        context.beginPath();
        if ( collider.type == 0 ) {
          // Circle type
          context.arc( x + collider.x * tw, y + collider.y * th, collider.radius * ( tw + th ) / 2, 0, Math.PI * 2, false );
        } else if ( collider.type == 1 ) {
          context.moveTo( x + collider.vertices[0][0] * tw, y + collider.vertices[0][1] * th );
          for ( var ii = 1; ii < collider.vertices.length; ii++ ) {
            context.lineTo( x + collider.vertices[ii][0] * tw, y + collider.vertices[ii][1] * th );
          }
          context.lineTo( x + collider.vertices[0][0] * tw, y + collider.vertices[0][1] * th );
        }
        context.stroke();
        context.restore();

        if ( collider.type == 1 ) {
          var jj;
          for ( var ii = 0; ii < collider.vertices.length; ii++ ) {
            jj = ii + 1;
            if ( jj == collider.vertices.length ) {
              jj = 0;
            }

            var nx = collider.vertices[jj][1] - collider.vertices[ii][1]; // -DY
            var ny = collider.vertices[ii][0] - collider.vertices[jj][0]; // +DX
            var length = Math.sqrt( nx * nx + ny * ny );
            nx /= length;
            ny /= length;
            var ox = ( collider.vertices[jj][0] + collider.vertices[ii][0] ) / 2;
            var oy = ( collider.vertices[jj][1] + collider.vertices[ii][1] ) / 2;

            context.save();
            context.lineWidth = 1;
            context.strokeStyle = 'red';
            context.beginPath();
            context.moveTo( x + ox * tw, y + oy * th );
            ox += nx * 0.25;
            oy += ny * 0.25;
            context.lineTo( x + ox * tw, y + oy * th );
            context.stroke();
            context.restore();
          }
        }

        this._setDirty();
      };

    } )();

  } )();

} )();
