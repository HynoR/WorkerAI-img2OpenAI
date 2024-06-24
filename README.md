# WorkerAI-img2OpenAI
**Cloudflare Worker.js 模拟OpenAI接口调用Cloudflare提供的AI文字生图模型**
**摸鱼时写的粗劣脚本，欢迎贡献和完善代码！**
**致敬赛博佛祖Cloudflare**

## 使用方法
- 创建Cloudflare Worker R2存储桶 AI权限

- 进入worker项目，设置>变量
![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/a6d6ae28-0330-438b-96ae-db9d04ac2fba)


- AI 绑定：名称 `AI` 绑定AI目录
![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/45820e7d-99ae-4705-a1c0-acdc9e97e445)

- R2 存储桶绑定：名称 `R2` 绑定存储桶
![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/c8eb8a91-b678-4b36-9726-d93e5e5dcbe4)

- 打开worker项目代码编辑，把worker.js代码粘贴进去。更改第一行为你的worker外网地址
![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/d7b2154a-9abc-4857-ade4-78a1dff47f18)

- 点击部署，添加到OneApi，搭配[chatgpt-web-midjourney-proxy](https://github.com/Dooy/chatgpt-web-midjourney-proxy),Enjoy!
![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/373bc5d7-502e-4cd6-bd27-577c82af472e)



注：由于one-api有尺寸过滤设置，模型名称重写会报错。本代码默认将dall-e-3 dall-e-2自动重定向到目前效果最好的@cf/stabilityai/stable-diffusion-xl-base-1.0，但是按照OpenAI格式调用是没有问题的

![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/d4b21913-4c37-480f-ad39-5aa7cf6435e1)

## 附录
oneapi参考填写

![image](https://github.com/HynoR/WorkerAI-img2OpenAI/assets/20227709/661f2d92-1424-4f65-8a33-3e4a6ba48318)


