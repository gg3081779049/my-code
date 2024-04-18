import threading
import time
import pyautogui
import pyperclip

from pynput.mouse import Listener as mouseListener
from pynput.keyboard import Key, Listener as keyboardListener
from tkinter import END, LEFT, GROOVE, Tk, Button, Frame, Label, Entry, StringVar
from color import Color


def on_click(x, y, button, pressed):
    if pressed and (ctrl_press and button == button.left or button == button.middle):
        update(Color(rgb=pyautogui.pixel(x, y)))


def on_move(x, y):
    global last_trigger_time
    current_time = time.time()
    if debounce_lock.acquire(False):
        try:
            if current_time - last_trigger_time >= 0.3 and alt_press:
                last_trigger_time = current_time
                update(Color(rgb=pyautogui.pixel(x, y)))
        finally:
            debounce_lock.release()


def on_press(key):
    if key == Key.ctrl_l or key == Key.ctrl_r:
        global ctrl_press
        ctrl_press = True
    if key == Key.alt_l or key == Key.alt_r:
        global alt_press
        alt_press = True


def on_release(key):
    if key == Key.ctrl_l or key == Key.ctrl_r:
        global ctrl_press
        ctrl_press = False
    if key == Key.alt_l or key == Key.alt_r:
        global alt_press
        alt_press = False


def set_entry(values, entries):
    for value, entry in zip(values, entries):
        if value is not None:
            entry.delete(0, END)
            entry.insert(0, str(value))


def update(color):
    if color.rgb or color.hsl or color.hex:
        display_color.configure(bg=color.hex)
        set_entry(color.rgb + color.hsl + (color.hex,),
                  [entry_r, entry_g, entry_b, entry_h, entry_s, entry_l, entry_hex])


def get_rgb():
    r, g, b = entry_r.get(), entry_g.get(), entry_g.get()
    if r.isdigit() and g.isdigit() and b.isdigit():
        return min(int(r), 255), min(int(g), 255), min(int(b), 255)


def get_hsl():
    h, s, l = entry_h.get(), entry_s.get(), entry_l.get()
    if h.isdigit() and s.isdigit() and l.isdigit():
        return int(h) % 360, min(int(s), 100), min(int(l), 100)


def get_hex():
    hex = entry_hex.get()
    if len(hex) == 7 and hex[0] == '#' and all(c in '0123456789ABCDEFabcdef' for c in hex[1:]):
        return hex


def on_close():
    MListener.stop()
    KListener.stop()
    color_picker.destroy()


# 防抖锁
debounce_lock = threading.Lock()
# 上一次触发时间
last_trigger_time = 0
ctrl_press = False
alt_press = False
MListener = mouseListener(on_click=on_click, on_move=on_move)
KListener = keyboardListener(on_press=on_press, on_release=on_release)
MListener.start()
KListener.start()

color_picker = Tk()
color_picker.title("取色器")
color_picker.geometry("260x225+40+32")
color_picker.wm_resizable(False, False)
color_picker.configure(bg="#F9F3E1")
color_picker.configure(pady=12)
color_picker.attributes('-topmost', True)
color_picker.protocol("WM_DELETE_WINDOW", on_close)

display_color = Label(color_picker, width=6, height=3, bg="white", bd=2, font=('', 11), relief=GROOVE)

frame_rgb = Frame(color_picker, bg="#F9F3E1")
label_rgb = Label(frame_rgb, text="RGB", bg="#F9F3E1")
entry_r = Entry(frame_rgb, width=3, textvariable=StringVar(value='255'))
entry_r.bind("<Return>", lambda e: update(Color(rgb=get_rgb())))
entry_r.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
entry_g = Entry(frame_rgb, width=3, textvariable=StringVar(value='255'))
entry_g.bind("<Return>", lambda e: update(Color(rgb=get_rgb())))
entry_g.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
entry_b = Entry(frame_rgb, width=3, textvariable=StringVar(value='255'))
entry_b.bind("<Return>", lambda e: update(Color(rgb=get_rgb())))
entry_b.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
copy_rgb = Button(frame_rgb,
                  height=1,
                  text="copy",
                  font=('微软黑体', 8),
                  command=lambda:
                  pyperclip.copy('(' + entry_r.get() + ', ' + entry_g.get() + ', ' + entry_b.get() + ')'))

frame_hsl = Frame(color_picker, bg="#F9F3E1")
label_hsl = Label(frame_hsl, text="HSL", bg="#F9F3E1")
entry_h = Entry(frame_hsl, width=3, textvariable=StringVar(value='0'))
entry_h.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
entry_h.bind("<Return>", lambda e: update(Color(hsl=get_hsl())))
entry_s = Entry(frame_hsl, width=3, textvariable=StringVar(value='0'))
entry_s.bind("<Return>", lambda e: update(Color(hsl=get_hsl())))
entry_s.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
entry_l = Entry(frame_hsl, width=3, textvariable=StringVar(value='100'))
entry_l.bind("<Return>", lambda e: update(Color(hsl=get_hsl())))
entry_l.bind("<KeyPress>", lambda e: None if '0123456789\x08'.find(e.char) >= 0 else 'break')
copy_hsl = Button(frame_hsl,
                  height=1,
                  text="copy",
                  font=('微软黑体', 8),
                  command=lambda:
                  pyperclip.copy('(' + entry_h.get() + ', ' + entry_s.get() + ', ' + entry_l.get() + ')'))

frame_hex = Frame(color_picker, bg="#F9F3E1")
label_hex = Label(frame_hex, text="HEX", bg="#F9F3E1")
entry_hex = Entry(frame_hex, width=10, textvariable=StringVar(value="#FFFFFF"))
entry_hex.bind("<Return>", lambda e: update(Color(hex=get_hex())))
entry_hex.bind("<KeyPress>", lambda e: None if '0123456789ABCDEFabcdef'.find(e.char) >= 0 and len(entry_hex.get()) < 7 or e.char == '\x08' and len(entry_hex.get()) > 1 else 'break')
copy_hex = Button(frame_hex,
                  height=1,
                  text="copy",
                  font=('微软黑体', 8),
                  command=lambda:
                  pyperclip.copy(entry_hex.get()))

display_color.pack(pady=10)
# rgb
frame_rgb.pack(pady=4)
label_rgb.pack(side=LEFT, padx=2)
entry_r.pack(side=LEFT, padx=2)
entry_g.pack(side=LEFT, padx=2)
entry_b.pack(side=LEFT, padx=2)
copy_rgb.pack(side=LEFT, padx=4)
# hsl
frame_hsl.pack(pady=4)
label_hsl.pack(side=LEFT, padx=2)
entry_h.pack(side=LEFT, padx=2)
entry_s.pack(side=LEFT, padx=2)
entry_l.pack(side=LEFT, padx=2)
copy_hsl.pack(side=LEFT, padx=4)
# hex
frame_hex.pack(pady=4)
label_hex.pack(side=LEFT, padx=2)
entry_hex.pack(side=LEFT, padx=2)
copy_hex.pack(side=LEFT, padx=4)

color_picker.mainloop()
