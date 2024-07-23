import pyautogui
import websockets
import asyncio
import time
import base64
from PIL import Image
from io import BytesIO

# 画面周期
IDLE = 0.05
# 压缩后图像
img = None
# 编码后的图像
imbyt = None
IMQUALITY = 20
# 压缩后np图像
imgnp = None


async def send_screenshot(websocket):
    # 获取当前时间作为文件名
    # current_time = time.strftime("%Y%m%d%H%M%S", time.localtime())
    print("进入send_screenshot")
    # 设置截图保存路径python\snap
    save_path = r"E:\python\snap\temp_screenshot.jpg"
    # save_path = r"D:\snap\temp_screenshot.jpg"
    # print(save_path)
    # 获取屏幕尺寸
    screen_width, screen_height = pyautogui.size()
    # print(screen_width, screen_height)
    # 进行全屏截图
    screenshot = pyautogui.screenshot(region=(0, 0, screen_width, screen_height))
    # 保存截图
    screenshot.save(save_path)
    with Image.open(save_path) as image_file:
        img_data = BytesIO()
        # 将图片压缩并转换为BytesIO
        image_file.save(img_data, format='JPEG', quality=20)
        img_datas = img_data.getvalue()
        # 将BytesIO转换为base64编码的字符串
        img = base64.b64encode(img_datas).decode('utf-8')
    image_file.close()
    # fname2 = 'data:image/jpeg;base64,' + str(img)[2:-1]
    # print("压缩base64编码长度：%d" % len(fname2))
    await websocket.send('data:image/jpeg;base64,' + str(img))
    # await websocket.send_message(client,'data:image/jpeg;base64,'+str(img))
    while True:
        time.sleep(IDLE)
        heartbeat = await websocket.recv()
        print(heartbeat)
        # 进行全屏截图
        screenshot1 = pyautogui.screenshot(region=(0, 0, screen_width, screen_height))
        # 保存截图
        screenshot1.save(save_path)
        with Image.open(save_path) as image_file1:
            img_data1 = BytesIO()
            # 将图片压缩并转换为BytesIO
            image_file1.save(img_data1, format='JPEG', quality=20)
            img_datas1 = img_data1.getvalue()
            # 将BytesIO转换为base64编码的字符串
            img = base64.b64encode(img_datas1).decode('utf-8')
        image_file1.close()
        # fname3 = 'data:image/jpeg;base64,' + str(img)[2:-1]
        # print("压缩base64编码长度：%d" % len(fname3))
        # await websocket.send_message(client, 'data:image/jpeg;base64,' + str(img))
        await websocket.send('data:image/jpeg;base64,' + str(img))


print("Hello world!! start")
start_server1 = websockets.serve(send_screenshot, '0.0.0.0', 5001)
# start_server1 = websockets.serve(send_screenshot, 'localhost', 5003)

asyncio.get_event_loop().run_until_complete(start_server1)
asyncio.get_event_loop().run_forever()
print("Hello world!! end")
