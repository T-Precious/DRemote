import pyautogui
import websockets
import asyncio
import json
import mouse
import time

IDLE = 1


async def handle_events(websocket):
    while True:
        datastr = await websocket.recv()
        data = json.loads(datastr)
        typestr = data['type']
        # if typestr == 'heartbeat':
        #     time.sleep(IDLE)
        #     print("心跳：" + typestr)
        #     await websocket.send(typestr)
        # else:
        event = data['event']
        if typestr == 'mouse':
            # 处理鼠标移动事件
            x = data['x']
            y = data['y']
            # print("事件名称：" + event)
            if event == 'mousemove':
                # print(f'Mouse moved to ({x},{y})')
                # 鼠标移动
                mouse.move(x, y)
            elif event == 'mousedown':
                which = data['which']
                if which == 1:
                    # 左键按下
                    pyautogui.mouseDown(x=x, y=y, button=pyautogui.LEFT)
                elif which == 3:
                    # 右键按下
                    pyautogui.mouseDown(x=x, y=y, button=pyautogui.RIGHT)
            elif event == 'mouseup':
                which = data['which']
                if which == 1:
                    # 左键按下
                    pyautogui.mouseUp(x=x, y=y, button=pyautogui.LEFT)
                elif which == 3:
                    # 右键按下
                    pyautogui.mouseUp(x=x, y=y, button=pyautogui.RIGHT)
            elif event == 'mousewheel':
                wheelDeltastr = data['wheelDelta']
                pyautogui.scroll(wheelDeltastr, x=x, y=y)
            elif event == 'mouseClick':
                # 处理鼠标点击事件
                pyautogui.click(x=x, y=y)
            elif event == 'mouseLeftClick':
                # 处理鼠标点击左键事件
                pyautogui.leftClick(x=x, y=y)
            elif event == 'mouseMiddleClick':
                # 处理鼠标点击中间事件
                pyautogui.middleClick(x=x, y=y)
            elif event == 'mouseRightClick':
                # 处理鼠标点击右键事件
                pyautogui.rightClick(x=x, y=y)
            elif event == 'mousedblclick':
                # 处理鼠标双击事件
                pyautogui.doubleClick(x=x, y=y)
            else:
                print('Unknown mouseEvent')
        elif typestr == 'keyboard':
            key = data['key']
            if event == 'keydown':
                pyautogui.keyDown(key)
            elif event == 'keyup':
                pyautogui.keyUp(key)
            elif event == 'qrouopKey':
                pyautogui.hotkey('control', key)
            elif event == 'keypress':
                pyautogui.press(key)
            elif event == 'windowsD':
                pyautogui.hotkey('win', 'd')
            elif event == 'altf4':
                pyautogui.hotkey('alt', 'f4')
            else:
                print('Unknown keyboardEvent')
        elif typestr == 'keysArray':
            for keydownup in event:
                if keydownup['event']=='keydown':
                    pyautogui.keyDown(keydownup['key'])
                elif keydownup['event']=='keyup':
                    pyautogui.keyUp(keydownup['key'])
        else:
            print('Unknown event')


print("Hello world start")
start_server = websockets.serve(handle_events, '0.0.0.0', 5002)
# start_server = websockets.serve(handle_events, 'localhost', 5004)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
print("Hello world end")

# elif event == 'closeAllTitles':
#     titles = pyautogui.getAllTitles()
#     for title in titles:
#         print(title)
#         pyautogui.hotkey('alt', 'f4')
# elif event == 'closeAllWindows':
#     windows = pyautogui.getAllWindows()
#     for window in windows:
#         print(window)
#         window.close()
# elif event == 'closeAllWT':
#     titles = pyautogui.getAllTitles()
#     for title in titles:
#         print(title)
#         window = pyautogui.getWindowsWithTitle(title)
#         window.close()
