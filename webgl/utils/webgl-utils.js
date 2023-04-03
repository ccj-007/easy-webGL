// 定义着色器类型
const defaultShaderType = [
  'VERTEX_SHADER',
  'FRAGMENT_SHADER',
];

// 执行着色器
function loadShader (gl, shaderSource, shaderType, opt_errorCallback) {
  const errFn = opt_errorCallback;
  const shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    const lastError = gl.getShaderInfoLog(shader);
    errFn('*** Error compiling shader \'' + shader + '\':' + lastError + `\n` + shaderSource.split('\n').map((l, i) => `${i + 1}: ${l}`).join('\n'));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

// 加载脚本
function createShaderFromScript (
  gl, scriptId, opt_shaderType, opt_errorCallback) {
  let shaderSource = '';
  let shaderType;
  const shaderScript = document.getElementById(scriptId);
  if (!shaderScript) {
    throw ('*** Error: unknown script element' + scriptId);
  }
  shaderSource = shaderScript.text;

  if (!opt_shaderType) {
    if (shaderScript.type === 'x-shader/x-vertex') {
      shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type === 'x-shader/x-fragment') {
      shaderType = gl.FRAGMENT_SHADER;
    } else if (shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
      throw ('*** Error: unknown shader type');
    }
  }

  return loadShader(
    gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
    opt_errorCallback);
}

// 程序对象的入口，通过shaderScriptIds匹配script的id
function createProgramFromScripts (gl, shaderScriptIds, opt_attribs, opt_locations, opt_errorCallback) {
  const shaders = [];
  for (let ii = 0; ii < shaderScriptIds.length; ++ii) {
    shaders.push(createShaderFromScript(
      gl, shaderScriptIds[ii], gl[defaultShaderType[ii]], opt_errorCallback));
  }
  return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
}

function createProgram (
  gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
  const errFn = opt_errorCallback;
  const program = gl.createProgram();
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });
  if (opt_attribs) {
    opt_attribs.forEach(function (attrib, ndx) {
      gl.bindAttribLocation(
        program,
        opt_locations ? opt_locations[ndx] : ndx,
        attrib);
    });
  }
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

  //是否已连接，否则删除
  if (!linked) {
    const lastError = gl.getProgramInfoLog(program);
    errFn('Error in program linking:' + lastError);

    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// 坐标缩放
function resizeCanvasToDisplaySize (canvas, multiplier) {
  multiplier = multiplier || 1;
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

var webglUtils = {
  createProgramFromScripts,
  resizeCanvasToDisplaySize
}

/** ui */
const gopt = getQueryParams();
var webglLessonsUI = { setupSlider }
function getQueryParams () {
  var params = {};
  if (window.hackedParams) {
    Object.keys(window.hackedParams).forEach(function (key) {
      params[key] = window.hackedParams[key];
    });
  }
  if (window.location.search) {
    window.location.search.substring(1).split("&").forEach(function (pair) {
      var keyValue = pair.split("=").map(function (kv) {
        return decodeURIComponent(kv);
      });
      params[keyValue[0]] = keyValue[1];
    });
  }
  return params;
}

function setupSlider (selector, options) {
  var parent = document.querySelector(selector);
  if (!parent) return;
  if (!options.name) {
    options.name = selector.substring(1);
  }
  return createSlider(parent, options); // eslint-disable-line
}

function createSlider (parent, options) {
  var precision = options.precision || 0;
  var min = options.min || 0;
  var step = options.step || 1;
  var value = options.value || 0;
  var max = options.max || 1;
  var fn = options.slide;
  var name = gopt["ui-" + options.name] || options.name;
  var uiPrecision = options.uiPrecision === undefined ? precision : options.uiPrecision;
  var uiMult = options.uiMult || 1;

  min /= step;
  max /= step;
  value /= step;

  parent.innerHTML = `
      <div class="gman-widget-outer">
        <div class="gman-widget-label">${name}</div>
        <div class="gman-widget-value"></div>
        <input class="gman-widget-slider" type="range" min="${min}" max="${max}" value="${value}" />
      </div>
    `;
  var valueElem = parent.querySelector(".gman-widget-value");
  var sliderElem = parent.querySelector(".gman-widget-slider");

  function updateValue (value) {
    valueElem.textContent = (value * step * uiMult).toFixed(uiPrecision);
  }

  updateValue(value);

  function handleChange (event) {
    var value = parseInt(event.target.value);
    updateValue(value);
    fn(event, { value: value * step });
  }

  sliderElem.addEventListener('input', handleChange);
  sliderElem.addEventListener('change', handleChange);

  return {
    elem: parent,
    updateValue: (v) => {
      v /= step;
      sliderElem.value = v;
      updateValue(v);
    },
  };
}