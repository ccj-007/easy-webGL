# 着色器获取数据的4个方法

1. 属性 attribute 缓冲
2. 全局变量  uniform 在着色器运行后无法改变，用于定义材质、光照等
3. 纹理 Textures
4. 可变量 Varyings  顶点着色器给片元着色器传值的方式

# 缓冲的过程

let bufferOrigin = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, bufferOrigin)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

## 缓存数组的传递

gl.enableVertexAttribArray(positionAttributeLocation);  // 告诉缓冲区怎么加载
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

# 获取数据

gl.getAttribLocation(program, 'a_position')
gl.getUniformLocation(...)

# 设置数据

gl.uniform2f(...)
gl.vertexAttrib2f(...)

# 读取数据

gl.enableVertexAttribArray(...)

> 缓冲区

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

gl.vertexAttribPointer(positionAttributeLocation, size, gl.Float, normalize, stride, offset)  

# 运行程序

gl.drawArrays(gl.TRIANGLES, offset, count)

# 裁剪空间转换到屏幕空间

gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);



