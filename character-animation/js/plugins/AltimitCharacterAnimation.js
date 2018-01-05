/*
 * MIT License
 *
 * Copyright (c) 2018 Altimit Community Contributors
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
// AltimitCharacterAnimation.js
//=============================================================================

/*:
 * @plugindesc Extended character animations
 * @author Altimit Community Contributors
 *
 * @param definition_config
 * @text Definition config
 * @desc Configuration for definition file loading.
 *
 * @param definition_config_directory
 * @text Directory
 * @desc Folder where definitions are stored.
 * @parent definition_config
 * @type text
 * @default img/characters/
 *
 * @param definition_config_type_precedence
 * @text File type precedence
 * @desc File format search type priority.
 * @parent definition_config
 * @type select[]
 * @option XML
 * @value xml
 * @option JSON
 * @value json
 * @default ["xml","json"]
 *
 * @help
 * Plugin Command:
 *  TODO
 *
 * Usage:
 *  Plugin will automatically apply when ON.
 *
 * About:
 *  Version 0.01 Alpha
 *  Website https://github.com/AltimitSystems/mv-plugins/tree/master/character-animation
 */
( function() {

  var DOM_PARSER = new DOMParser();
  var PARAMETERS = PluginManager.parameters( 'AltimitCharacterAnimation' );

  /**
   * DEFINITION_CONFIG
   */
  var DEFINITION_CONFIG;
  ( function() {

    DEFINITION_CONFIG = {};

    var directory = PARAMETERS['definition_config_directory'];
    if ( directory ) {
      DEFINITION_CONFIG.DIRECTORY = directory + ( directory.endsWith( '/' ) ? '' : '/' );
    } else {
      DEFINITION_CONFIG.DIRECTORY = 'img/characters/';
    }

    var typePrecedence = PARAMETERS['definition_config_type_precedence'];
    if ( typePrecedence ) {
      DEFINITION_CONFIG.TYPE_PRECEDENCE = JSON.parse( typePrecedence );
    } else {
      DEFINITION_CONFIG.TYPE_PRECEDENCE = ['xml', 'json'];
    }

  } )();

  /**
   * Game_Character
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Game_Character_initMembers = Game_Character.prototype.initMembers;
      Game_Character.prototype.initMembers = function() {
        Game_Character_initMembers.call( this );
        this._extraState = {
          lastState: {},
          state: {
            bush: 0,
            dashing: 0,
            jumping: 0,
            ladder: 0,
            moving: 0,
            idle: 0,
          },
          override: -1,
          x: -1,
          y: -1,
        };
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Game_Character.prototype.extraStateHasMoved = function() {
        if ( this.wasMoving ) {
          return this.wasMoving();
        }
        return this._extraState.x !== this._realX || this._extraState.y !== this._realY;
      };

      Game_Character.prototype.extraStateGet = function() {
        var names = [];
        for ( var key in this._extraState.state ) {
          if ( this._extraState.state.hasOwnProperty( key ) ) {
            names.push( key );
          }
        }
        return names;
      };

      Game_Character.prototype.extraStateSet = function( names ) {
        if ( this._extraState.override > 0 ) {
          this.extraStateReset();
        }

        this._extraState.lastState = this._extraState.state;
        this._extraState.state = {};
        for ( var ii = 0; ii < names.length; ii++ ) {
          this._extraState.state[names[ii]] = 0;
        }
      };

      Game_Character.prototype.extraStateReset = function() {
        if ( this._extraState.override > 0 ) {
          this._extraState.state = this._extraState.lastState;
          this._extraState.lastState = {};
          this._extraState.override = 0;
        }
        for ( var key in this._extraState.state ) {
          if ( this._extraState.state.hasOwnProperty( key ) ) {
            this._extraState.state[key] = 0;
          }
        }
      };

      Game_Character.prototype.extraStateUpdate = function() {
        if ( this._extraState.override > 0 ) {
          if ( this._extraState.override !== Number.POSITIVE_INFINITY ) {
            this._extraState.override--;
            for ( var key in this._extraState.state ) {
              if ( this._extraState.state.hasOwnProperty( key ) ) {
                this._extraState.state[key]++;
              }
            }
            if ( this._extraState.override == 0 ) {
              // Reset state override
              this._extraState.state = this._extraState.lastState;
              this._extraState.lastState = {};
            }
          }
        } else {
          // Update state
          var idling = true;
          if ( this.isOnBush() ) {
            this._extraState.state.bush++;
            idling = false;
          } else {
            this._extraState.state.bush = 0;
          }
          if ( this.isDashing() && this.extraStateHasMoved() ) {
            this._extraState.state.dashing++;
            idling = false;
          } else {
            this._extraState.state.dashing = 0;
          }
          if ( this.isJumping() ) {
            this._extraState.state.jumping++;
            idling = false;
          } else {
            this._extraState.state.jumping = 0;
          }
          if ( this.isOnLadder() ) {
            this._extraState.state.ladder++;
            idling = false;
          } else {
            this._extraState.state.ladder = 0;
          }
          if ( this.isMoving() || this.extraStateHasMoved() ) {
            this._extraState.state.moving++;
            idling = false;
          } else {
            this._extraState.state.moving = 0;
          }
          if ( idling ) {
            this._extraState.state.idle++;
          } else {
            this._extraState.state.idle = 0;
          }
        }
      };

      Game_Character.prototype.extraStateParams = function() {
        var dx = ( this._extraState.x - this._realX ) * $gameMap.tileWidth();
        var dy = ( this._extraState.y - this._realY ) * $gameMap.tileHeight();
        return {
          direction: this.direction(),
          direction4: this.direction(),
          direction8: this.direction8 ? this.direction8() : this.direction(),

          state: this._extraState.state,
          lastState: this._extraState.lastState,
          override: this._extraState.override > 0,

          tilesetId: $gameMap.tilesetId(),
          tileId: this.tileId(),
          characterName: this.characterName(),
          characterIndex: this.characterIndex(),

          character: this,

          isDebugThrough: this.isDebugThrough ? this.isDebugThrough() : false,
          isDashButtonPressed: this.isDashButtonPressed ? this.isDashButtonPressed() : false,
          isOnDamageFloor: this.isOnDamageFloor ? this.isOnDamageFloor() : false,
          areFollowersGathering: this.areFollowersGathering ? this.areFollowersGathering() : false,
          areFollowersGathered: this.areFollowersGathered ? this.areFollowersGathered() : false,

          travelled: Math.sqrt( dx * dx + dy * dy ),
        };
      };

    } )();

  } )();

  /**
   * Sprite_Character
   */
  ( function() {

    /**
     * Overrides
     */
    ( function() {

      var Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
      Sprite_Character.prototype.initMembers = function() {
        Sprite_Character_initMembers.call( this );
        this._typeIndex = 0;
        this._definition = null;
        this._extraAnimation = null;
        this._extraBitmap = null;
        this._extraFrame = 0;
        this._extraMeta = {
          oneShot: false,
          sx: 1,
          sy: 1,
          speed: 1,
        };
      };

      var Sprite_Character_update = Sprite_Character.prototype.update;
      Sprite_Character.prototype.update = function() {
        this.updateDefinition();
        Sprite_Character_update.call( this );
      };

      var Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
      Sprite_Character.prototype.updateBitmap = function() {
        Sprite_Character_updateBitmap.call( this );
        if ( this._extraAnimation ) {
          this.bitmap = this._extraBitmap;
          this.scale.x = this._definition.animations.sx * this._extraAnimation.sx * this._extraMeta.sx;
          this.scale.y = this._definition.animations.sy * this._extraAnimation.sy * this._extraMeta.sy;
        }
      };

      var Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
      Sprite_Character.prototype.updateFrame = function() {
        Sprite_Character_updateFrame.call( this );
        if ( this._extraAnimation ) {
          var frameRate = this._extraAnimation.rate * this._extraMeta.speed;
          this._extraFrame = this._extraFrame + frameRate / 60;
          if ( this._extraFrame >= this._extraAnimation.frames.length ) {
            if ( this._extraMeta.oneShot ) {
              this._extraFrame = this._extraAnimation.frames.length - 1;
            } else {
              this._extraFrame = this._extraFrame % this._extraAnimation.frames.length;
            }
          }
          var frame = this._extraAnimation.frames[this._extraFrame | 0];
          this.setFrame( frame.x, frame.y, frame.width, frame.height );
        }
      };

    } )();

    /**
     * Extensions
     */
    ( function() {

      Sprite_Character.prototype.updateDefinition = function() {
        if ( this._typeIndex < DEFINITION_CONFIG.TYPE_PRECEDENCE.length ) {
          if ( !this._definition ) {
            var type = DEFINITION_CONFIG.TYPE_PRECEDENCE[this._typeIndex];
            this._typeIndex++;
            this._definition = DefinitionManager.loadDefinition( DEFINITION_CONFIG.DIRECTORY, this._character.characterName(), type );
          }

          if ( this._definition.isError() ) {
            this._definition = null;
          }
        }

        if ( this._definition && this._definition.isReady() ) {
          if ( !this._extraBitmap ) {
            this._extraBitmap = ImageManager.loadCharacter( this._definition.animations.sheet );
          }

          if ( !this._character._hasCustomCollider && this._character.setCollider && this._definition.collider ) {
            // Set extension file collider
            this._character.setCollider( this._definition.collider );
          }

          this._character.extraStateUpdate();

          var params = this._character.extraStateParams();
          this._character._extraState.x = this._character._realX;
          this._character._extraState.y = this._character._realY;

          try {
            var result = this._definition.script( params );
            if ( result ) {
              this._extraAnimation = this._definition.animations.animations[result.animation];
              this._extraMeta = {
                oneShot: !!result.oneShot,
                sx: ( result.scaleX !== undefined ? result.scaleX : 1 ),
                sy: ( result.scaleY !== undefined ? result.scaleY : 1 ),
                speed: ( result.speed !== undefined ? result.speed : 1 ),
              };
            } else {
              this._extraAnimation = null;
            }
          } catch ( e ) {
            throw e;
          }
        }
      };

    } )();

  } )();

  /**
   * DefinitionManager
   */
  function DefinitionManager() {
    throw new Error( 'This is a static class' );
  }
  ( function() {

    /**
     * DefinitionCache
     */
    function DefinitionCache() {
      this.initialize.apply( this, arguments );
    }
    ( function() {

      DefinitionCache.limit = 10 * 1000 * 1000;

      DefinitionCache.prototype = Object.create( ImageCache.prototype );
      DefinitionCache.prototype.constructor = DefinitionCache;

      DefinitionCache.prototype.initialize = function() {
        ImageCache.prototype.initialize.call( this );
      };

      DefinitionCache.prototype.add = function( key, value ) {
        this._items[key] = {
          def: value,
          touch: Date.now(),
          key: key
        };
        this._truncateCache();
      };

      DefinitionCache.prototype.get = function( key ) {
        if ( this._items[key] ) {
          var item = this._items[key];
          item.touch = Date.now();
          return item.def;
        }
        return null;
      };

      DefinitionCache.prototype.reserve = function( key, value, reservationId ) {
          if ( !this._items[key] ) {
            this._items[key] = {
              def: value,
              touch: Date.now(),
              key: key
            };
          }
          this._items[key].reservationId = reservationId;
      };

      DefinitionCache.prototype.releaseReservation = function( reservationId ) {
        var items = this._items;
        Object.keys( items )
          .map( function( key ) {
            return items[key];
          } )
          .forEach( function( item ) {
            if ( item.reservationId === reservationId ) {
              delete item.reservationId;
            }
          } );
      };

      DefinitionCache.prototype._truncateCache = function(){
        var items = this._items;
        var sizeLeft = DefinitionCache.limit;

        Object.keys( items ).map( function( key ) {
          return items[key];
        } ).sort( function( a, b ) {
            return b.touch - a.touch;
        } ).forEach( function( item ) {
          if ( sizeLeft > 0 || this._mustBeHeld( item ) ){
            var def = item.def;
            sizeLeft -= def._size();
          } else {
            delete items[item.key];
          }
        }.bind( this ) );
      };

      DefinitionCache.prototype._mustBeHeld = function( item ) {
        if ( item.def.isRequestOnly() ) {
          return false;
        }
        if ( item.reservationId ) {
          return true;
        }
        if ( !item.def.isReady() ) {
          return true;
        }
        return false;
      };

      DefinitionCache.prototype.isReady = function(){
        var items = this._items;
        return !Object.keys( items ).some( function( key ) {
          return !items[key].def.isRequestOnly() && !items[key].def.isReady();
        } );
      };

      DefinitionCache.prototype.getErrorDefinition = function() {
        var items = this._items;
        var def = null;
        var iterate = function( key ) {
          if ( items[key].def.isError() ){
            def = items[key].def;
            return true;
          }
          return false;
        };
        if ( Object.keys( items ).some( iterate ) ) {
          return def;
        }
        return null;
      };

    } )();

    /**
     * Definition
     */
    function Definition() {
      this.initialize.apply( this, arguments );
    }
    ( function() {

      Definition.load = function( url ) {
        var def = Object.create( Definition.prototype );
        def.initialize();
        def._decodeAfterRequest = true;
        def._requestDef( url );
        return def;
      };

    } )();
    ( function() {

      Object.defineProperties( Definition.prototype, {
        script: { get: function() { return this._definition.script; }, configurable: true },
        animations: { get: function() { return this._definition.animationList; }, configurable: true },
        collider: { get: function() { return this._definition.collider; }, configurable: true },
      } );

      Definition.prototype.initialize = function() {
        this._xhr = null;
        this._url = '';
        this._loadListeners = [];
        this._loadingState = 'none';
        this._decodeAfterRequest = false;
      };

      Definition.prototype.decode = function() {
        switch ( this._loadingState ){
        case 'requestCompleted':
          this._loadingState = 'loaded';
          this._decodeDefText();
          this._callLoadListeners();
          break;
        case 'requesting':
          this._decodeAfterRequest = true;
          if ( !this._loader ) {
            this._loader = ResourceHandler.createLoader( this._url, this._requestDef.bind( this, this._url ), this._onError.bind( this ) );
            this._xhr.removeEventListener( 'error', this._errorListener );
            this._xhr.addEventListener( 'error', this._errorListener = this._loader );
          }
          break;
        case 'pending':
        case 'purged':
        case 'error':
          this._decodeAfterRequest = true;
          this._requestDef( this._url );
          break;
        }
      };

      Definition.prototype.isReady = function() {
        return this._loadingState === 'loaded';
      };

      Definition.prototype.isError = function() {
        return this._loadingState === 'error';
      };

      Definition.prototype.isRequestOnly = function(){
        return !( this._decodeAfterRequest || this.isReady() );
      };

      Definition.prototype._decodeDefText = function() {
        var fileType = this._url.substr( this._url.lastIndexOf( '.' ) + 1 ).toLowerCase();
        switch ( fileType ) {
        case "xml":
          this._decodeDefXML();
          break;
        case "json":
          this._decodeDefJSON();
          break;
        default:
          throw new Error( 'Unknown definition format: ' + this._url );
          break;
        }
        try {
          this._compileScript();
        } catch ( e ) {
          throw e;
        }
      };

      Definition.prototype._compileScript = function() {
        this._definition.script = eval( "( function( $params ) {\n\t" + this._definition.script + "\n} )" );
      };

      Definition.prototype._requestDef = function( url ) {
        this._url = url;
        this._loadingState = 'requesting';

        var xhr = new XMLHttpRequest();
        xhr.open( "GET", url );
        xhr.addEventListener( 'load', this._loadListener = Definition.prototype._onLoad.bind( this ) );
        xhr.addEventListener( 'error', this._errorListener = this._loader || Definition.prototype._onError.bind( this ) );
        xhr.send();
        this._xhr = xhr;
      };

      Definition.prototype._callLoadListeners = function() {
        while ( this._loadListeners.length > 0 ) {
          var listener = this._loadListeners.shift();
          listener( this );
        }
      };

      Definition.prototype._onError = function() {
        this._xhr.removeEventListener( 'load', this._loadListener );
        this._xhr.removeEventListener( 'error', this._errorListener );
        this._loadingState = 'error';
      };

      Definition.prototype._onLoad = function() {
        this._xhr.removeEventListener( 'load', this._loadListener );
        this._xhr.removeEventListener( 'error', this._errorListener );

        switch ( this._loadingState ) {
        case 'requesting':
          this._loadingState = 'requestCompleted';
          if ( this._decodeAfterRequest ) {
            this.decode();
          } else {
            this._loadingState = 'purged';
            this._clearDefInstance();
          }
          break;
        }
      };

      Definition.prototype._clearDefInstance = function() {
        this._xhr = null;
        this._errorListener = null;
        this._loadListener = null;
      };

      Definition.prototype._size = function() {
        return this._xhr ? ( this._xhr.responseText ? this._xhr.responseText.length : 0 ) : 0;
      };

      Definition.prototype._decodeDefXML = function() {
        var object = {};
        var xml = DOM_PARSER.parseFromString( '<doc>' + this._xhr.responseText + '</doc>', 'text/xml' ).childNodes[0];
        for ( var ii = 0; ii < xml.childNodes.length; ii++ ) {
          var childI = xml.childNodes[ii];
          switch ( childI.nodeName ) {
          case 'script':
            object.script = childI.innerHTML.trim()
              .replace( /&apos;/g, "'" )
              .replace( /&quot;/g, '"' )
              .replace( /&gt;/g, '>' )
              .replace( /&lt;/g, '<' )
              .replace( /&amp;/g, '&' );
            break;
          case 'collider':
            if ( $gameSystem.createColliderFromXML ) {
              object.collider = $gameSystem.createColliderFromXML( childI );
            }
            break;
          case 'animation-list':
            object.animationList = {
              animations: {},
              sheet: childI.getAttribute( "sheet" ),
              sx: parseFloat( childI.getAttribute( "sx" ) || "1" ),
              sy: parseFloat( childI.getAttribute( "sy" ) || "1" ),
            };
            for ( var jj = 0; jj < childI.childNodes.length; jj++ ) {
              var childJ = childI.childNodes[jj];
              switch ( childJ.nodeName ) {
              case 'animation':
                var id = childJ.getAttribute( "id" );
                if ( id ) {
                  var entry = {
                    frames: [],
                    rate: parseInt( childJ.getAttribute( "rate" ) || "0" ),
                    sx: parseFloat( childJ.getAttribute( "sx" ) || "1" ),
                    sy: parseFloat( childJ.getAttribute( "sy" ) || "1" ),
                  };
                  for ( var kk = 0; kk < childJ.childNodes.length; kk++ ) {
                    var childK = childJ.childNodes[kk];
                    switch ( childK.nodeName ) {
                    case 'frame':
                      entry.frames.push( {
                        x: childK.getAttribute( "x" ),
                        y: childK.getAttribute( "y" ),
                        width: childK.getAttribute( "width" ),
                        height: childK.getAttribute( "height" ),
                      } );
                      break;
                    }
                  }
                  object.animationList.animations[id] = entry;
                }
                break;
              }
            }
            break;
          }
        }

        this._definition = object;
      };

      Definition.prototype._decodeDefJSON = function() {
        var object = JSON.parse( this._xhr.responseText );

        this._definition = object;
      };

    } )();

    DefinitionManager._cache = new DefinitionCache();
    DefinitionManager._systemReservationId = Utils.generateRuntimeId();

    DefinitionManager._generateCacheKey = function( path ) {
      return path;
    };

    DefinitionManager.loadDefinition = function( folder, filename, extension ) {
      if ( folder && filename && extension ) {
        var path = folder + encodeURIComponent( filename ) + "." + extension;
        return this.loadNormalDefinition( path );
      } else {
        return this.loadEmptyDefinition();
      }
    };

    DefinitionManager.loadEmptyDefinition = function() {
      var empty = this._cache.get( 'empty' );
      if ( !empty ) {
        empty = new Definition();
        this._cache.add( 'empty', empty );
        this._cache.reserve( 'empty', empty, this._systemReservationId );
      }
      return empty;
    };

    DefinitionManager.loadNormalDefinition = function( url ) {
      var key = this._generateCacheKey( url );
      var def = this._cache.get( key );
      if ( !def ) {
        if ( Utils.isNwjs() ) {
          var fs = require( 'fs' );
          var path = require( 'path' );
          var base = path.dirname( process.mainModule.filename );
          if ( fs.existsSync( path.join( base, url ) ) ) {
            def = Definition.load( url );
          } else {
            def = this.loadEmptyDefinition();
          }
        } else {
          def = Definition.load( url );
        }
        this._cache.add( key, def );
      } else if ( !def.isReady() ){
        def.decode();
      }
      return def;
    };

    DefinitionManager.clear = function() {
      this._cache = new DefinitionCache();
    };

    DefinitionManager.isReady = function() {
      return this._cache.isReady();
    };

  } )();

} )();
