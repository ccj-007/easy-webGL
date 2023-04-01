const Chokidar = require('Chokidar')
const path = require('path')
const fs = require('fs')

const fragmentPath = path.resolve(__dirname, './tran/index.frag')
const vertexPath = path.resolve(__dirname, './tran/index.vert')

const sourceFragmentPath = path.resolve(__dirname, './tran/dist/fragment.js')
const sourceVertexPath = path.resolve(__dirname, './tran/dist/vertex.js')

function replaceShader (target, filePath, sourcePath) {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) console.error("err1", err)
    const fragment_source = data

    let replaceData = `const ${target} = ` + '`' + `${fragment_source}` + '`'
    fs.writeFile(sourcePath, replaceData, 'utf-8', (err) => {
      if (err) console.error("err3", err)
    })
  })
}

Chokidar.watch(vertexPath).on('change', function () {
  replaceShader('vertexShader', vertexPath, sourceVertexPath)
})

Chokidar.watch(fragmentPath).on('change', function () {
  replaceShader('fragmentShader', fragmentPath, sourceFragmentPath)
})

