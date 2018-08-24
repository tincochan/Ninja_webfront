var music = (function () {
  'use strict';

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var _stripToNumbers = function _stripToNumbers(string) {
    var numericString = string.replace(/[^0-9]/g, '');
    return numericString;
  };

  var _toInferredProperties = function _toInferredProperties(properties, value) {
    var _value$split = value.split('@'),
        _value$split2 = slicedToArray(_value$split, 2),
        fullname = _value$split2[0],
        rhythm = _value$split2[1];

    var octave = _stripToNumbers(fullname);
    return {
      rhythm: rhythm || properties.rhythm,
      octave: octave || properties.octave
    };
  };

  var _toNotes = function _toNotes(note, index, notes) {
    var precedingNotes = notes.slice(0, index);
    var inferred = precedingNotes.reduce(_toInferredProperties, {});

    var _note$split = note.split('@'),
        _note$split2 = slicedToArray(_note$split, 2),
        fullname = _note$split2[0],
        rhythm = _note$split2[1];

    var name = fullname.match(/[a-zA-z]/g).join('');
    var octave = _stripToNumbers(fullname);

    return {
      name: name,
      rhythm: rhythm || inferred.rhythm,
      octave: Number(octave || inferred.octave)
    };
  };

  var parseShorthand = (function (shorthand) {
    return shorthand.split(',').map(_toNotes);
  });

  var notes = {
    C: 16.351,
    Cs: 17.324,
    Db: 17.324,
    D: 18.354,
    Ds: 19.445,
    Eb: 19.445,
    E: 20.601,
    F: 21.827,
    Fs: 23.124,
    Gb: 23.124,
    G: 24.499,
    Gs: 25.956,
    Ab: 25.956,
    A: 27.50,
    Bb: 29.135,
    B: 30.868
  };

  var noteToPitch = (function (name, octave) {
    return notes[name] ? notes[name] * Math.pow(2, octave) : 0;
  });

  var withPitch = (function (tone) {
    return _extends({}, tone, { pitch: noteToPitch(tone.name, tone.octave) });
  });

  var mapToLengthWithTempo = (function (bpm) {
    var beatDefinition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    return function (tone) {
      return _extends({}, tone, {
        length: 60 / bpm * 1000 * beatDefinition / tone.rhythm
      });
    };
  });

  var _toTotalTime = function _toTotalTime(totalTime, tone) {
    return totalTime + tone.length;
  };

  var withStart = (function (tone, index, array) {
    var precedingArray = array.slice(0, index);
    var start = precedingArray.reduce(_toTotalTime, 0);

    return _extends({}, tone, {
      start: start
    });
  });

  var withResonance = (function (resonance) {
    return function (tone) {
      return _extends({}, tone, { resonance: resonance });
    };
  });

  var tone = function tone(
  /*
   * @param {int}     pitch: frequency in hz
   * @param {string}  type : oscillator type
   * @param {int}     next : time until returned Promise resolved
   */
  _ref, context) {
    var _ref$pitch = _ref.pitch,
        pitch = _ref$pitch === undefined ? 440 : _ref$pitch,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'sine' : _ref$type,
        _ref$length = _ref.length,
        length = _ref$length === undefined ? 2000 : _ref$length,
        _ref$next = _ref.next,
        _ref$volume = _ref.volume,
        _ref$resonance = _ref.resonance,
        resonance = _ref$resonance === undefined ? 4 : _ref$resonance,
        _ref$start = _ref.start,
        _ref$callback = _ref.callback,
        callback = _ref$callback === undefined ? function () {} : _ref$callback;

    return {
      play: function play() {
        var oscillator = context.createOscillator();
        var gain = context.createGain();
        var now = context.currentTime;
        var cutoff = now + resonance * length / 1000;
        var endTime = now + resonance * length / 1000 + .01;

        // wiring

        oscillator.connect(gain);
        gain.connect(context.destination);

        // setting values
        gain.gain.value = .5;
        gain.gain.exponentialRampToValueAtTime(.001, cutoff);
        oscillator.type = type;
        oscillator.frequency.value = pitch;

        // kick if off
        oscillator.start();
        callback();

        // finish it off
        oscillator.stop(endTime);
      }
    };
  };

  var toTone = (function (context) {
    return function (config) {
      return tone(config, context).play;
    };
  }); // should eventually go to 'play' function

  var playWithContext = function playWithContext(context) {
    return function play(notes) {
      var resolution = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
      var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var playing = notes.filter(function (note) {
        return note.start <= time;
      });
      var upcoming = notes.filter(function (note) {
        return !(note.start <= time);
      });

      playing.map(toTone(context)).forEach(function (tone) {
        tone();
      });

      var continueMusic = function continueMusic() {
        return play(upcoming, resolution, resolution + time);
      };

      if (notes.length) {
        setTimeout(continueMusic, resolution);
      } else {
        console.log('done');
      }
    };
  };

  var withLength = mapToLengthWithTempo(90);
  var context = new window.AudioContext();
  var play = playWithContext(context);

  var shorthand = ['C4@16,E,G,C5,E,G4,C5,E', 'C4,E,G,C5,E,G4,C5,E', 'C4,D,A,D5,F,A4,D5,F', 'C4,D,A,D5,F,A4,D5,F', 'B3,D4,G,D5,F,G4,D5,F', 'B3,D4,G,D5,F,G4,D5,F', 'C4,E,G,C5,E,G4,C5,E', 'C4,E,G,C5,E,G4,C5,E', 'C4,E,A,E5,A,A4,E5,A', 'C4,E,A,E5,A,A4,E5,A', 'C4,D,Fs,A,D5,Fs4,A,D5', 'C4,D,Fs,A,D5,Fs4,A,D5', 'B3,D4,G,D5,G,G4,D5,G', 'B3,D4,G,D5,G,G4,D5,G', 'B3,C4,E,G,C5,E4,G,C5', 'B3,C4,E,G,C5,E4,G,C5', 'A3,C4,E,G,C5,E4,G,C5', 'A3,C4,E,G,C5,E4,G,C5', 'D3,A,D4,Fs,C5,D4,Fs,C5', 'D3,A,D4,Fs,C5,D4,Fs,C5', 'G3,B,D4,G,B,D,G,B', 'G3,B,D4,G,B,D,G,B', 'G3,Bb,E4,G,Cs5,E4,G,Cs5', 'G3,Bb,E4,G,Cs5,E4,G,Cs5', 'F3,A,D4,A,D5,D4,A,D5', 'F3,A,D4,A,D5,D4,A,D5', 'F3,Ab,D4,F,B,D,F,B', 'F3,Ab,D4,F,B,D,F,B', 'E3,G,C4,G,C5,C4,G,C5', 'E3,G,C4,G,C5,C4,G,C5', 'E3,F,A,C4,F,A3,C4,F', 'E3,F,A,C4,F,A3,C4,F', 'D3,F,A,C4,F,A3,C4,F', 'D3,F,A,C4,F,A3,C4,F', 'G2,D3,G,B,F4,G3,B,F4', 'G2,D3,G,B,F4,G3,B,F4', 'C3,E,G,C4,E,G3,C4,E', 'C3,E,G,C4,E,G3,C4,E', 'C3,G,Bb,C4,E,Bb3,C4,E', 'C3,G,Bb,C4,E,Bb3,C4,E', 'F2,F3,A,C4,E,A3,C4,E', 'F2,F3,A,C4,E,A3,C4,E', 'Fs2,C3,A,C4,Eb,A3,C4,Eb', 'Fs2,C3,A,C4,Eb,A3,C4,Eb', 'Ab2,F3,B,C4,D,B3,C4,D', 'Ab2,F3,B,C4,D,B3,C4,D', 'G2,F3,G,B,D4,G3,B,D4', 'G2,F3,G,B,D4,G3,B,D4', 'G2,E3,G,C4,E,G3,C4,E', 'G2,E3,G,C4,E,G3,C4,E', 'G2,D3,G,C4,F,G3,C4,F', 'G2,D3,G,C4,F,G3,C4,F', 'G2,D3,G,B,F4,G3,B,F4', 'G2,D3,G,B,F4,G3,B,F4', 'G2,Eb3,A,C4,Fs,A3,C4,Fs', 'G2,Eb3,A,C4,Fs,A3,C4,Fs', 'G2,E3,G,C4,G,G3,C4,G', 'G2,E3,G,C4,G,G3,C4,G', 'G2,D3,G,C4,F,G3,C4,F', 'G2,D3,G,C4,F,G3,C4,F', 'G2,D3,G,B,F4,G3,B,F4', 'G2,D3,G,B,F4,G3,B,F4', 'C2,C3,G,Bb,E4,G3,Bb,E4', 'C2,C3,G,Bb,E4,G3,Bb,E4', 'C2,C3,F,A,C4,F,C,A3,C4,A3,F,A,F,D,F,D', 'C2,B,G4,B,D5,F,D,B4,D5,B4,G,B,D,F,E,D', 'C5@4'].join(',');

  var addClass = function addClass(_ref) {
    var name = _ref.name,
        octave = _ref.octave;

    document.querySelectorAll('.tone').forEach(function(e) {e.classList.remove('active')});
    var parent = document.querySelector('.name--'+name+'.octave--'+octave).classList.add('active');
  };

  var music = parseShorthand(shorthand).map(withPitch).map(withLength).map(withStart).map(withResonance(7)).map(function (note) {
    return _extends({}, note, {
      callback: function() {addClass(note)}
    });
  });

  var index = (function () {
    return play(music, 5);
  });

  return index;

}());

var button = document.getElementById('start');

button.addEventListener('click', function() { 
  music();
  this.remove();
});