# webpack-temp-v2
简单的webpack 配置

1.
npm install -d
cnpm install -d  国内镜像。
如果没有安装 cnpm :
npm install -g cnpm --registry=https://registry.npm.taobao.org

2.
命令行进入项目文件夹。

3. 
src/imgs/static 放静态资源，文件夹下的东西会被copy 到 打包文件 assets/imgs/static 下。
<picture>
      <source srcset="assets/imgs/top.jpg" media="(min-width: 750px)"></source>
      <img class="main_bg" src="src/imgs/top.jpg" srcset="assets/imgs/static/mobi/top.jpg" alt="" />
</picture>

4.
src/media  放置视频音频文件，文件夹下的东西会被copy 到 打包文件 assets/media 下。
视频文件，尽量使用JS 的方式写进去，不要在页面中直接写 video 标签。

5. 
src/js/lib 下的JS 文件是可以不经过打包处理，直接在页面中引用的。
<script type="text/javascript" src="assets/js/TweenMax.min.js"></script>

5. 
把资源都放进去之后，先执行 npm run build 把静态资源生成到打包文件夹。

6.
npm run start 打开热更新服务器。CTRL + C 退出热更新。

